import { Metadata } from "next";
import SignInPageClient from "./SignInPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

export const metadata: Metadata = {
  title: "Sign In - Snippets Library",
  description:
    "Sign in to your Snippets Library account with GitHub OAuth. Access your personal code snippet collection, organize your development workflow, and share snippets with the community.",
  keywords: [
    "sign in",
    "login",
    "github oauth",
    "developer authentication",
    "code snippets access",
    "user account",
    "snippets library login",
    "github integration",
    "developer tools login",
  ],
  openGraph: {
    title: "Sign In - Snippets Library",
    description:
      "Sign in to your Snippets Library account with GitHub OAuth. Access your personal code snippet collection and development tools.",
    url: `${baseUrl}/auth/signin`,
    siteName: "Snippets Library",
    type: "website",
    images: [
      {
        url: `${baseUrl}/api/og?title=Welcome%20Back&description=Sign%20In%20to%20Your%20Account`,
        width: 1200,
        height: 630,
        alt: "Snippets Library Sign In Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In - Snippets Library",
    description:
      "Sign in to your Snippets Library account with GitHub OAuth. Access your code snippet collection.",
    images: [
      `${baseUrl}/api/og?title=Welcome%20Back&description=Sign%20In%20to%20Your%20Account`,
    ],
  },
  alternates: {
    canonical: `${baseUrl}/auth/signin`,
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function SignInPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sign In - Snippets Library",
    description: "User authentication page for Snippets Library platform",
    url: `${baseUrl}/auth/signin`,
    publisher: {
      "@type": "Organization",
      name: "Snippets Library",
      url: baseUrl,
    },
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Snippets Library",
      url: baseUrl,
    },
    potentialAction: {
      "@type": "AuthenticateAction",
      target: `${baseUrl}/auth/signin`,
      name: "Sign In with GitHub",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Sign In",
          item: `${baseUrl}/auth/signin`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SignInPageClient />
    </>
  );
}
