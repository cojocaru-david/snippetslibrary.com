import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { snippets, snippetViews } from "@/db/schema";
import { eq, and, sql, gte } from "drizzle-orm";
import { hashIP, getClientIP, isValidShareId } from "@/lib/security";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  try {
    const { shareId } = await params;

    if (!isValidShareId(shareId)) {
      return NextResponse.json(
        { error: "Invalid share ID format" },
        { status: 400 },
      );
    }

    const clientIP = getClientIP(request);

    const snippet = await db
      .select({ id: snippets.id, userId: snippets.userId })
      .from(snippets)
      .where(and(eq(snippets.shareId, shareId), eq(snippets.isPublic, true)))
      .limit(1);

    if (snippet.length === 0) {
      return NextResponse.json(
        { error: "Snippet not found or not public" },
        { status: 404 },
      );
    }

    const foundSnippet = snippet[0];
    const session = await auth();
    const clientIpHash = hashIP(clientIP);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    if (session?.user?.id === foundSnippet.userId) {
      return NextResponse.json({ tracked: false, reason: "owner" });
    }

    let shouldTrack = true;

    if (session?.user?.id) {
      const recentUserView = await db
        .select({ id: snippetViews.id })
        .from(snippetViews)
        .where(
          and(
            eq(snippetViews.snippetId, foundSnippet.id),
            eq(snippetViews.userId, session.user.id),
            gte(snippetViews.createdAt, oneHourAgo),
          ),
        )
        .limit(1);

      shouldTrack = recentUserView.length === 0;
    } else {
      const recentIpView = await db
        .select({ id: snippetViews.id })
        .from(snippetViews)
        .where(
          and(
            eq(snippetViews.snippetId, foundSnippet.id),
            eq(snippetViews.viewerIpHash, clientIpHash),
            gte(snippetViews.createdAt, fifteenMinutesAgo),
          ),
        )
        .limit(1);

      shouldTrack = recentIpView.length === 0;
    }

    if (!shouldTrack) {
      return NextResponse.json({ tracked: false, reason: "duplicate" });
    }

    await db.insert(snippetViews).values({
      snippetId: foundSnippet.id,
      viewerIpHash: clientIpHash,
      userId: session?.user?.id || null,
    });

    await db
      .update(snippets)
      .set({
        viewCount: sql`${snippets.viewCount} + 1`,
      })
      .where(eq(snippets.id, foundSnippet.id));

    return NextResponse.json({ tracked: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 },
    );
  }
}
