import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { snippets, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateOGImageUrl } from "@/lib/utils";
import ShareSnippetClient from "./ShareSnippetClient";

interface SharedSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  isPublic: boolean;
  shareId: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  displayTheme?: string;
}

interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string[];
}

interface PageProps {
  params: Promise<{
    shareId: string;
  }>;
}

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
  } catch (error) {
    console.error("Error fetching snippet data:", error);
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
        "The requested code snippet was not found or is no longer public.",
    };
  }

  const titleParts = [
    snippet.title,
    seoSettings?.title,
    "Snippets Library",
  ].filter(Boolean);

  const descriptionParts = [
    snippet.description,
    seoSettings?.description,
    "Powered by SnippetsLibrary.com",
  ].filter(Boolean);

  const title = titleParts.join(" - ");
  const description = descriptionParts.join(" - ");

  const defaultKeywords = [
    "code",
    "snippet",
    "programming",
    "development",
    "snippets",
    "snippetslibrary",
    "snippets library",
    "snippets library.com",
  ];
  const userKeywords = seoSettings?.keywords || [];
  const snippetKeywords = [snippet.language, ...snippet.tags];

  const keywords = [
    ...new Set([...defaultKeywords, ...userKeywords, ...snippetKeywords]),
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
    description: snippet.description || description,
    language: snippet.language,
    theme: themePreference,
    author: snippet.userName,
    lines: Math.min(snippet.code.split("\n").length, 16),
    baseUrl,
  });

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: snippet.userName || "Anonymous Developer" }],
    creator: snippet.userName || "Snippets Library",
    publisher: "Snippets Library",
    robots: "index, follow",
    openGraph: {
      title,
      description,
      type: "article",
      url: shareUrl,
      siteName: "Snippets Library",
      publishedTime: snippet.createdAt,
      modifiedTime: snippet.updatedAt,
      authors: [snippet.userName || "Anonymous Developer"],
      tags: keywords,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${snippet.title} - ${snippet.language} code snippet`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: snippet.userName ? `@${snippet.userName}` : "@SnippetsLibrary",
      images: [ogImageUrl],
    },
    alternates: {
      canonical: shareUrl,
    },
    other: {
      "article:author": snippet.userName || "Anonymous",
      "article:published_time": snippet.createdAt,
      "article:modified_time": snippet.updatedAt,
      "article:section": "Programming",
      "article:tag": snippet.tags.join(", "),
    },
  };
}

function generateStructuredData(
  snippet: SharedSnippet,
  seoSettings: SEOSettings | null,
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: snippet.title + " - " + seoSettings?.title,
    description:
      snippet.description ||
      `${snippet.language} code snippet: ${snippet.title}`,
    programmingLanguage: snippet.language,
    codeRepository: `${baseUrl}/share/${snippet.shareId}`,
    author: {
      "@type": "Person",
      name: snippet.userName || "Anonymous Developer",
    },
    codeSampleType: "full",
    runtimePlatform: snippet.language,
    runtime: snippet.language,
    keywords: [
      ...snippet.tags,
      snippet.language,
      "programming",
      "code",
      "snippet",
    ].join(", "),
    dateCreated: snippet.createdAt,
    dateModified: snippet.updatedAt,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ViewAction",
      userInteractionCount: snippet.viewCount,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/share/${snippet.shareId}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Snippets Library",
      url: "https://snippetslibrary.com",
    },
  };
}

export default async function ShareSnippetPage({ params }: PageProps) {
  const { shareId } = await params;
  const { snippet, ownerHighlightTheme } = await getSnippetData(shareId);

  if (!snippet) {
    notFound();
  }

  const structuredData = generateStructuredData(snippet, null);

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
