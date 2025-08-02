import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { snippets, users, snippetLikes } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { generateOGImageUrl } from "@/lib/utils";
import { isValidShareId } from "@/lib/security";
import type { SharedSnippet, SEOSettings, PageProps } from "@/types";
import ShareSnippetClient from "@/components/ShareSnippetClient";

async function getSnippetData(shareId: string): Promise<{
  snippet: SharedSnippet | null;
  seoSettings: SEOSettings | null;
  ownerHighlightTheme?: string;
}> {
  try {
    if (!isValidShareId(shareId)) {
      return { snippet: null, seoSettings: null };
    }

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

    const likesEnabled = result.user?.settings?.userPreferences?.likes ?? true;
    let likesCount = 0;
    let isLiked = false;

    if (likesEnabled) {
      const [likesResult] = await db
        .select({ count: count() })
        .from(snippetLikes)
        .where(eq(snippetLikes.snippetId, result.snippet.id));

      likesCount = likesResult.count;

      const session = await auth();
      const userId = session?.user?.id;

      if (userId) {
        const userLike = await db
          .select()
          .from(snippetLikes)
          .where(
            and(
              eq(snippetLikes.snippetId, result.snippet.id),
              eq(snippetLikes.userId, userId),
            ),
          )
          .limit(1);
        isLiked = userLike.length > 0;
      }
    }

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
      likesCount,
      isLiked,
      likesEnabled,
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
      title: "Snippet Not Found",
      description:
        "The requested code snippet was not found or is no longer public.",
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }

  const snippetDescription =
    snippet.description && snippet.description.trim()
      ? snippet.description.trim()
      : `${snippet.language} code snippet: ${snippet.title}`;

  const seoDescription =
    seoSettings?.description && seoSettings.description.trim()
      ? seoSettings.description.trim()
      : "";

  const description = seoDescription
    ? `${snippetDescription}. ${seoDescription}`
    : snippetDescription;

  const snippetTitle =
    snippet.title && snippet.title.trim()
      ? snippet.title.trim()
      : `${snippet.language} Code Snippet`;

  const seoTitle =
    seoSettings?.title && seoSettings.title.trim()
      ? seoSettings.title.trim()
      : "";

  const title = seoTitle ? `${snippetTitle} - ${seoTitle}` : snippetTitle;

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
      ...userKeywords,
      ...snippetKeywords,
      ...titleKeywords,
      snippet.language.toLowerCase(),
      "code",
      "snippet",
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

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    authors: snippet.userName ? [{ name: snippet.userName }] : undefined,
    creator: snippet.userName || "Snippets Library",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
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
    openGraph: {
      title: title.length > 60 ? `${snippetTitle}` : title,
      description:
        description.length > 160
          ? description.substring(0, 157) + "..."
          : description,
      type: "article",
      url: shareUrl,
      siteName: "Snippets Library",
      locale: "en_US",
      publishedTime: snippet.createdAt,
      modifiedTime: snippet.updatedAt,
      authors: snippet.userName ? [snippet.userName] : undefined,
      tags: keywords.slice(0, 8),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${snippet.title} - ${snippet.language} code snippet${snippet.userName ? ` by ${snippet.userName}` : ""}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title.length > 60 ? `${snippetTitle}` : title,
      description:
        description.length > 160
          ? description.substring(0, 157) + "..."
          : description,
      creator: snippet.userName
        ? `@${snippet.userName.replace(/\s+/g, "")}`
        : undefined,
      site: "@SnippetsLibrary",
      images: [
        {
          url: ogImageUrl,
          alt: `${snippet.title} - ${snippet.language} code snippet`,
        },
      ],
    },
    alternates: {
      canonical: shareUrl,
      languages: {
        "en-US": shareUrl,
      },
    },
    other: {
      "theme-color": "#e17009",
      "color-scheme": "light dark",
      ...(snippet.userName && { "article:author": snippet.userName }),
      "article:published_time": snippet.createdAt,
      "article:modified_time": snippet.updatedAt,
      "article:section": "Programming",
      ...(snippet.tags.length > 0 && {
        "article:tag": snippet.tags.join(", "),
      }),
      "programming-language": snippet.language,
      "code-lines": snippet.code.split("\n").length.toString(),
    },
  };
}

export default async function ShareSnippetPage({ params }: PageProps) {
  const { shareId } = await params;
  const { snippet, ownerHighlightTheme } = await getSnippetData(shareId);

  if (!snippet) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";
  const shareUrl = `${baseUrl}/share/${shareId}`;

  const snippetDescription =
    snippet.description && snippet.description.trim()
      ? snippet.description.trim()
      : `${snippet.language} code snippet: ${snippet.title}`;

  const structuredData = {
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
    url: shareUrl,
    codeSampleType: "full",
    keywords: [...snippet.tags, snippet.language, "code", "snippet"]
      .filter(Boolean)
      .join(", "),
    dateCreated: snippet.createdAt,
    dateModified: snippet.updatedAt,
    datePublished: snippet.createdAt,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ViewAction",
      userInteractionCount: snippet.viewCount,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl,
      name: snippet.title,
      description: snippetDescription,
      url: shareUrl,
      inLanguage: "en-US",
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": baseUrl,
      name: "Snippets Library",
      url: baseUrl,
    },
    ...(snippet.userName && {
      author: {
        "@type": "Person",
        name: snippet.userName,
      },
      creator: {
        "@type": "Person",
        name: snippet.userName,
      },
    }),
    ...(snippet.tags.length > 0 && {
      about: snippet.tags.map((tag) => ({
        "@type": "Thing",
        name: tag,
      })),
    }),
  };

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
