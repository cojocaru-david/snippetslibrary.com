import { MetadataRoute } from "next";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { eq, isNotNull } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const publicSnippets = await db
      .select({
        shareId: snippets.shareId,
        updatedAt: snippets.updatedAt,
        createdAt: snippets.createdAt,
      })
      .from(snippets)
      .where((eq(snippets.isPublic, true), isNotNull(snippets.shareId)))
      .orderBy(snippets.updatedAt);

    const snippetRoutes: MetadataRoute.Sitemap = publicSnippets
      .filter((snippet) => snippet.shareId)
      .map((snippet) => ({
        url: `${baseUrl}/share/${snippet.shareId}`,
        lastModified: new Date(snippet.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    console.log(
      `Generated sitemap with ${staticRoutes.length} static routes and ${snippetRoutes.length} snippet routes`,
    );

    return [...staticRoutes, ...snippetRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    return staticRoutes;
  }
}
