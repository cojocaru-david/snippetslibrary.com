import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/", // Landing page
          "/share/*", // Public snippets
          "/terms", // Legal pages
          "/auth/signin", // Auth flows
        ],
        disallow: [
          "/dashboard/*", // Private user areas
          "/api/*", // API endpoints
          "/auth/error", // Error pages
          "/_next/*", // Build assets
        ],
      },
      // Allow search engines to index public snippets more frequently
      {
        userAgent: "Googlebot",
        allow: "/share/*",
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
