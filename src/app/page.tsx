import { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.snippetslibrary.com";

export const metadata: Metadata = {
  title: "Snippets Library - Store, Organize & Share Code Snippets",
  description:
    "The ultimate code snippet manager for developers. Store, organize, and share your code snippets with beautiful syntax highlighting, instant search, and seamless GitHub integration. Start building your personal code library today.",
  keywords: [
    "code snippets manager",
    "programming tools",
    "developer productivity",
    "syntax highlighting",
    "code sharing platform",
    "snippet library",
    "development workflow",
    "code organization",
    "programmer tools",
    "coding resources",
    "github integration",
    "developer portfolio",
    "code collection",
    "snippet storage",
    "programming efficiency",
  ],
  openGraph: {
    title: "Snippets Library - Store, Organize & Share Code Snippets",
    description:
      "The ultimate code snippet manager for developers. Store, organize, and share your code snippets with beautiful syntax highlighting and instant search.",
    url: baseUrl,
    siteName: "Snippets Library",
    images: [
      {
        url: `${baseUrl}/thub.png`,
        width: 1200,
        height: 630,
        alt: "Snippets Library - Code Snippet Manager Landing Page",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snippets Library - Store, Organize & Share Code Snippets",
    description:
      "The ultimate code snippet manager for developers. Beautiful syntax highlighting, instant search, and seamless GitHub integration.",
    images: [`${baseUrl}/thub.png`],
  },
  alternates: {
    canonical: baseUrl,
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

export default function LandingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Snippets Library",
    description:
      "Store, organize, and share code snippets with beautiful syntax highlighting",
    url: baseUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Snippets Library",
      url: baseUrl,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Organize code snippets with tags and folders",
      "Syntax highlighting for 100+ programming languages",
      "Public and private snippet sharing",
      "Instant search across your code library",
      "GitHub OAuth authentication",
      "Dark and light theme support",
      "Export snippets in various formats",
      "Real-time collaboration features",
    ],
    screenshot: [
      `${baseUrl}/api/og?title=Dashboard&description=Snippet%20Management`,
      `${baseUrl}/api/og?title=Editor&description=Code%20Highlighting`,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPageClient />
    </>
  );
}
