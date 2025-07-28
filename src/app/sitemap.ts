import { MetadataRoute } from "next";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { eq, isNotNull, desc, and } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: "2025-07-27",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  try {
    const publicSnippets = await db
      .select({
        shareId: snippets.shareId,
        updatedAt: snippets.updatedAt,
        createdAt: snippets.createdAt,
        title: snippets.title,
        language: snippets.language,
        viewCount: snippets.viewCount,
      })
      .from(snippets)
      .where(and(eq(snippets.isPublic, true), isNotNull(snippets.shareId)))
      .orderBy(desc(snippets.updatedAt))
      .limit(5000);

    const snippetRoutes: MetadataRoute.Sitemap = publicSnippets
      .filter(
        (snippet): snippet is typeof snippet & { shareId: string } =>
          !!snippet.shareId,
      )
      .map((snippet) => {
        const daysSinceUpdate = Math.floor(
          (Date.now() - new Date(snippet.updatedAt).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const viewCount = snippet.viewCount || 0;

        let priority = 0.8;
        if (daysSinceUpdate <= 7) priority = 0.9;
        else if (daysSinceUpdate <= 30) priority = 0.8;
        else if (daysSinceUpdate <= 90) priority = 0.7;
        else priority = 0.6;

        if (viewCount > 100) priority = Math.min(priority + 0.1, 1.0);
        if (viewCount > 500) priority = Math.min(priority + 0.1, 1.0);

        let changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] =
          "monthly";
        if (daysSinceUpdate <= 7) changeFrequency = "weekly";
        else if (daysSinceUpdate <= 30) changeFrequency = "monthly";
        else changeFrequency = "yearly";

        return {
          url: `${baseUrl}/share/${snippet.shareId}`,
          lastModified: new Date(snippet.updatedAt).toISOString().split("T")[0],
          changeFrequency,
          priority: Math.round(priority * 100) / 100,
        };
      });

    const allRoutes = [...staticRoutes, ...snippetRoutes].sort(
      (a, b) => (b.priority || 0) - (a.priority || 0),
    );

    return allRoutes;
  } catch {
    // eslint-disable-next-line no-console
    console.error("Error generating sitemap");

    return staticRoutes;
  }
}
