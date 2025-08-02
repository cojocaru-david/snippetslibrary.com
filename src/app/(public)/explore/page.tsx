import { Metadata } from "next";
import ExplorePageClient from "./ExplorePageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

let metadata: Metadata | undefined;

if (process.env.NEXT_PUBLIC_IS_PUBLIC_INSTANCE === "true") {
  metadata = {
    title: "Explore Code Snippets - Snippets Library",
    description:
      "Browse and discover ready-to-use code snippets for all major languages and frameworks. Find inspiration and reusable code from the Snippets Library community.",
    keywords: [
      "explore code snippets",
      "code examples",
      "developer resources",
      "snippet gallery",
      "programming examples",
      "open source snippets",
      "frontend code snippets",
      "backend snippets",
      "javascript examples",
      "react snippets",
      "code inspiration",
      "snippets library",
      "community code",
      "code search",
      "developer snippets",
    ],
    openGraph: {
      title: "Explore Code Snippets - Snippets Library",
      description:
        "Discover public code snippets from developers around the world. Instantly search, preview, and reuse high-quality code examples.",
      url: `${baseUrl}/explore`,
      siteName: "Snippets Library",
      images: [
        {
          url: `${baseUrl}/api/og?title=Explore%20Snippets&description=Discover%20and%20Reuse%20Code%20from%20Developers`,
          width: 1200,
          height: 630,
          alt: "Explore Code Snippets - Snippets Library",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Explore Code Snippets - Snippets Library",
      description:
        "Browse ready-to-use code snippets with syntax highlighting and search filters. Join the developer community.",
      images: [
        `${baseUrl}/api/og?title=Explore%20Snippets&description=Discover%20and%20Reuse%20Code%20from%20Developers`,
      ],
    },
    alternates: {
      canonical: `${baseUrl}/explore`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export { metadata };

export default function ExplorePage() {
  if (process.env.NEXT_PUBLIC_IS_PUBLIC_INSTANCE === "false") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-center">
          This page is not available on public instances.
        </h1>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Explore Code Snippets",
    description:
      "Browse and discover public code snippets shared by developers across the world. Filter by language, tags, and popularity.",
    url: `${baseUrl}/explore`,
    about: {
      "@type": "SoftwareApplication",
      name: "Snippets Library",
      url: baseUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ExplorePageClient />
    </>
  );
}
