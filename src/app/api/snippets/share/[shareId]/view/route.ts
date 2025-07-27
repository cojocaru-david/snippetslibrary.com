import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { snippets, snippetViews } from "@/db/schema";
import { eq, and, sql, gte } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  try {
    const { shareId } = await params;
    console.log("View tracking request for shareId:", shareId);
    // Find the snippet first
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
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Deduplication logic - don't count views from:
    // 1. The snippet owner (if authenticated)
    // 2. Same user within 1 hour (if authenticated)
    // 3. Same IP within 15 minutes (if not authenticated)

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // Check if this is the snippet owner
    if (session?.user?.id === foundSnippet.userId) {
      // Don't count views from the snippet owner
      console.log("View not tracked: snippet owner");
      return NextResponse.json({ tracked: false, reason: "owner" });
    }

    let shouldTrack = true;

    if (session?.user?.id) {
      // For authenticated users, check if they viewed within 1 hour
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
      // For anonymous users, check if same IP viewed within 15 minutes
      const recentIpView = await db
        .select({ id: snippetViews.id })
        .from(snippetViews)
        .where(
          and(
            eq(snippetViews.snippetId, foundSnippet.id),
            eq(snippetViews.viewerIp, clientIp),
            gte(snippetViews.createdAt, fifteenMinutesAgo),
          ),
        )
        .limit(1);

      shouldTrack = recentIpView.length === 0;
    }

    if (!shouldTrack) {
      console.log("View not tracked: duplicate view detected");
      return NextResponse.json({ tracked: false, reason: "duplicate" });
    }

    // Track the view
    await db.insert(snippetViews).values({
      snippetId: foundSnippet.id,
      viewerIp: clientIp,
      userId: session?.user?.id || null,
    });

    // Increment view count
    await db
      .update(snippets)
      .set({
        viewCount: sql`${snippets.viewCount} + 1`,
      })
      .where(eq(snippets.id, foundSnippet.id));

    console.log("View tracked successfully");
    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 },
    );
  }
}
