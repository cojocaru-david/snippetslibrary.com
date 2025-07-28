import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { snippets, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateOGImageUrl } from "@/lib/utils";
import type { SharedSnippet, SEOSettings, PageProps } from "@/types";
import ShareSnippetClient from "@/components/ShareSnippetClient";

async function getSnippetData(shareId: string): Promise<{
  snippet: SharedSnippet | null;
  seoSettings: SEOSettings | null;
  ownerHighlightTheme?: string;
}> {
  try {
    const snippetResult = await db
      .select({
        snippet: {
          id: snippets.id,
          title: snippets.title,
          description: snippets.description,
          code: snippets.code,
          language: snippets.language,
          tags: snippets.tags,
          isPublic: snippets.isPublic,
          shareId: snippets.shareId,
          viewCount: snippets.viewCount,
          createdAt: snippets.createdAt,
          updatedAt: snippets.updatedAt,
          userId: snippets.userId,
        },
        user: {
          name: users.name,
          settings: users.settings,
        },
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.userId, users.id))
      .where(and(eq(snippets.shareId, shareId), eq(snippets.isPublic, true)))
      .limit(1);

    if (!snippetResult.length) {
      return { snippet: null, seoSettings: null };
    }

    const result = snippetResult[0];

    const snippet: SharedSnippet = {
      id: result.snippet.id,
      title: result.snippet.title,
      description: result.snippet.description || undefined,
      code: result.snippet.code,
      language: result.snippet.language,
      tags: (result.snippet.tags as string[]) || [],
      isPublic: result.snippet.isPublic || false,
      shareId: result.snippet.shareId!,
      viewCount: result.snippet.viewCount || 0,
      createdAt: result.snippet.createdAt.toISOString(),
      updatedAt: result.snippet.updatedAt.toISOString(),
      userName: result.user?.name || undefined,
      displayTheme: result.user?.settings?.layoutSettings?.theme || "system",
    };

    const userSettings = result.user?.settings as Record<
      string,
      unknown
    > | null;
    const seoSettings: SEOSettings = {
      title:
        ((userSettings?.seoSettings as Record<string, unknown>)
          ?.title as string) || "",
      description:
        ((userSettings?.seoSettings as Record<string, unknown>)
          ?.description as string) || "",
      keywords:
        ((userSettings?.seoSettings as Record<string, unknown>)
          ?.keywords as string[]) || [],
    };

    const ownerHighlightTheme =
      ((userSettings?.codeBlockSettings as Record<string, unknown>)
        ?.theme as string) || "github-dark";

    return { snippet, seoSettings, ownerHighlightTheme };
  } catch {
    return { snippet: null, seoSettings: null };
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { shareId } = await params;
  const { snippet, seoSettings, ownerHighlightTheme } =
    await getSnippetData(shareId);

  if (!snippet) {
    return {
      title: "Snippet Not Found - Snippets Library",
      description:
        "The requested code snippet was not found or is no longer public. Browse other amazing code snippets and programming resources on Snippets Library.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Ensure we always have a comprehensive description
  // const fallbackDescription = `Explore this ${snippet.language} code snippet: "${snippet.title}". Part of a curated collection of programming resources on Snippets Library - your go-to platform for discovering, sharing, and organizing code snippets.`;

  const snippetDescription =
    snippet.description && snippet.description.trim()
      ? snippet.description.trim()
      : `A useful ${snippet.language} code snippet demonstrating ${snippet.title.toLowerCase()}.`;

  const seoDescription =
    seoSettings?.description && seoSettings.description.trim()
      ? seoSettings.description.trim()
      : "Discover amazing code snippets and programming resources.";

  // Create a comprehensive description ensuring we always have meaningful content
  const description = `${snippetDescription} ${seoDescription} Powered by Snippets Library - the ultimate platform for developers to store, organize, and share code snippets.`;

  // Ensure title is comprehensive and SEO-friendly
  const snippetTitle =
    snippet.title && snippet.title.trim()
      ? snippet.title.trim()
      : `${snippet.language} Code Snippet`;

  const seoTitle =
    seoSettings?.title && seoSettings.title.trim()
      ? seoSettings.title.trim()
      : "Code Snippets & Programming Resources";

  const title = `${snippetTitle} - ${seoTitle} | Snippets Library`;

  // Comprehensive keywords combining all relevant terms
  const defaultKeywords = [
    "code snippet",
    "programming",
    "development",
    "software engineering",
    snippet.language.toLowerCase(),
    `${snippet.language.toLowerCase()} code`,
    `${snippet.language.toLowerCase()} snippet`,
    "developer tools",
    "coding resources",
    "snippets library",
    "code sharing",
    "programming examples",
  ];

  const userKeywords = seoSettings?.keywords || [];
  const snippetKeywords = [snippet.language, ...snippet.tags].map((k) =>
    k.toLowerCase(),
  );
  const titleKeywords = snippet.title
    .toLowerCase()
    .split(/[\s\-_]+/)
    .filter((word) => word.length > 2);

  const keywords = [
    ...new Set([
      ...defaultKeywords,
      ...userKeywords,
      ...snippetKeywords,
      ...titleKeywords,
    ]),
  ];

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";
  const shareUrl = `${baseUrl}/share/${shareId}`;

  const userLayoutTheme = snippet.displayTheme || "light";
  const isDarkTheme =
    userLayoutTheme === "dark" ||
    (userLayoutTheme === "system" && ownerHighlightTheme?.includes("dark")) ||
    ownerHighlightTheme?.includes("dark");

  const themePreference = isDarkTheme ? "dark" : "light";

  const ogImageUrl = generateOGImageUrl({
    title: snippet.title,
    description: snippetDescription,
    language: snippet.language,
    theme: themePreference,
    author: snippet.userName,
    lines: Math.min(snippet.code.split("\n").length, 16),
    baseUrl,
  });

  const authorName = snippet.userName || "Anonymous Developer";

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: authorName }],
    creator: snippet.userName || "Snippets Library",
    publisher: "Snippets Library",
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
    openGraph: {
      title,
      description,
      type: "article",
      url: shareUrl,
      siteName: "Snippets Library",
      publishedTime: snippet.createdAt,
      modifiedTime: snippet.updatedAt,
      authors: [authorName],
      tags: keywords.slice(0, 10),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${snippet.title} - ${snippet.language} code snippet by ${authorName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        title.length > 70
          ? `${snippetTitle} - ${snippet.language} Code`
          : title,
      description:
        description.length > 200
          ? description.substring(0, 197) + "..."
          : description,
      creator: snippet.userName ? `@${snippet.userName}` : "@SnippetsLibrary",
      site: "@SnippetsLibrary",
      images: [ogImageUrl],
    },
    alternates: {
      canonical: shareUrl,
    },
    other: {
      "article:author": authorName,
      "article:published_time": snippet.createdAt,
      "article:modified_time": snippet.updatedAt,
      "article:section": "Programming",
      "article:tag": snippet.tags.join(", "),
      "programming-language": snippet.language,
      "code-lines": snippet.code.split("\n").length.toString(),
      "snippet-tags": snippet.tags.join(", "),
    },
  };
}

function generateStructuredData(snippet: SharedSnippet) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

  const authorName = snippet.userName || "Anonymous Developer";
  const snippetDescription =
    snippet.description && snippet.description.trim()
      ? snippet.description.trim()
      : `A useful ${snippet.language} code snippet demonstrating ${snippet.title.toLowerCase()}.`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: snippet.title,
    description: snippetDescription,
    text: snippet.code,
    programmingLanguage: {
      "@type": "ComputerLanguage",
      name: snippet.language,
      alternateName: snippet.language.toLowerCase(),
    },
    codeRepository: `${baseUrl}/share/${snippet.shareId}`,
    url: `${baseUrl}/share/${snippet.shareId}`,
    author: {
      "@type": "Person",
      name: authorName,
      url: snippet.userName ? `${baseUrl}/user/${snippet.userName}` : undefined,
    },
    creator: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Snippets Library",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon-96x96.png`,
        width: 96,
        height: 96,
      },
    },
    codeSampleType: "full",
    runtimePlatform: snippet.language,
    runtime: snippet.language,
    keywords: [
      ...snippet.tags,
      snippet.language,
      "programming",
      "code snippet",
      "development",
      "software engineering",
    ].join(", "),
    dateCreated: snippet.createdAt,
    dateModified: snippet.updatedAt,
    datePublished: snippet.createdAt,
    license: "https://opensource.org/licenses/MIT",
    version: "1.0",
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ViewAction",
      userInteractionCount: snippet.viewCount,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/share/${snippet.shareId}`,
      name: `${snippet.title} - Code Snippet`,
      description: snippetDescription,
      url: `${baseUrl}/share/${snippet.shareId}`,
      inLanguage: "en-US",
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": baseUrl,
      name: "Snippets Library",
      url: baseUrl,
      description:
        "Modern code snippet manager and sharing platform for developers",
    },
    potentialAction: [
      {
        "@type": "ViewAction",
        target: `${baseUrl}/share/${snippet.shareId}`,
        name: "View Code Snippet",
      },
      {
        "@type": "ShareAction",
        target: `${baseUrl}/share/${snippet.shareId}`,
        name: "Share Code Snippet",
      },
    ],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Snippets Library",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Code Snippets",
          item: `${baseUrl}/snippets`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: snippet.language,
          item: `${baseUrl}/snippets?language=${encodeURIComponent(snippet.language)}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: snippet.title,
          item: `${baseUrl}/share/${snippet.shareId}`,
        },
      ],
    },
    ...(snippet.tags.length > 0 && {
      about: snippet.tags.map((tag) => ({
        "@type": "Thing",
        name: tag,
        description: `Programming concept: ${tag}`,
      })),
    }),
  };
}

export default async function ShareSnippetPage({ params }: PageProps) {
  const { shareId } = await params;
  const { snippet, ownerHighlightTheme } = await getSnippetData(shareId);

  if (!snippet) {
    notFound();
  }

  const structuredData = generateStructuredData(snippet);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <ShareSnippetClient
        snippet={snippet}
        seoSettings={null}
        ownerHighlightTheme={ownerHighlightTheme}
      />
    </>
  );
}
