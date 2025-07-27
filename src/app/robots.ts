import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

  return {
    rules: [
      // Main rules for all search engines
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
          "/dashboard", // Dashboard root
          "/admin/*", // Admin areas if any
        ],
      },
      // Specific rules for Google
      {
        userAgent: "Googlebot",
        allow: ["/share/*", "/", "/terms"],
        disallow: ["/dashboard", "/api/*", "/auth/*", "/_next/*"],
        crawlDelay: 1,
      },
      // Rules for Bing
      {
        userAgent: "Bingbot",
        allow: ["/share/*", "/", "/terms"],
        disallow: ["/dashboard/*", "/api/*", "/auth/*", "/_next/*"],
        crawlDelay: 2,
      },
      // Rules for other search engines
      {
        userAgent: [
          "Slurp",
          "DuckDuckBot",
          "facebookexternalhit",
          "Baiduspider",
          "YandexBot",
        ],
        allow: ["/share/*", "/"],
        disallow: ["/dashboard/*", "/api/*", "/auth/*", "/_next/*"],
        crawlDelay: 3,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
