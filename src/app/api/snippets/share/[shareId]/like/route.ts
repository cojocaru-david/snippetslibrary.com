import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { snippetLikes, snippets, users } from "@/db/schema";
import { and, eq, count, sql } from "drizzle-orm";
import { hashIP, getClientIP, isValidShareId } from "@/lib/security";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  try {
    const { shareId } = await params;
    const clientIP = getClientIP(request);
    const clientIpHash = hashIP(clientIP);

    if (!isValidShareId(shareId)) {
      return NextResponse.json(
        { error: "Invalid share ID format" },
        { status: 400 },
      );
    }

    const snippet = await db
      .select({
        id: snippets.id,
        userId: snippets.userId,
        isPublic: snippets.isPublic,
      })
      .from(snippets)
      .where(eq(snippets.shareId, shareId))
      .limit(1);

    if (snippet.length === 0 || !snippet[0].isPublic) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    const snippetData = snippet[0];

    const owner = await db
      .select({
        settings: users.settings,
      })
      .from(users)
      .where(eq(users.id, snippetData.userId))
      .limit(1);

    if (owner.length === 0 || !owner[0].settings?.userPreferences?.likes) {
      return NextResponse.json(
        { error: "Likes feature is disabled" },
        { status: 403 },
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    let existingLike;
    if (userId) {
      existingLike = await db
        .select()
        .from(snippetLikes)
        .where(
          and(
            eq(snippetLikes.snippetId, snippetData.id),
            eq(snippetLikes.userId, userId),
          ),
        )
        .limit(1);
    } else {
      existingLike = await db
        .select()
        .from(snippetLikes)
        .where(
          and(
            eq(snippetLikes.snippetId, snippetData.id),
            eq(snippetLikes.viewerIpHash, clientIpHash),
            sql`${snippetLikes.userId} IS NULL`,
          ),
        )
        .limit(1);
    }

    if (existingLike.length > 0) {
      return NextResponse.json({ error: "Already liked" }, { status: 409 });
    }

    await db.insert(snippetLikes).values({
      snippetId: snippetData.id,
      userId: userId || null,
      viewerIpHash: userId ? null : clientIpHash,
    });

    const [likesResult] = await db
      .select({ count: count() })
      .from(snippetLikes)
      .where(eq(snippetLikes.snippetId, snippetData.id));

    return NextResponse.json({
      success: true,
      liked: true,
      likesCount: likesResult.count,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[LIKE_SNIPPET] Error:", {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to like snippet" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  try {
    const { shareId } = await params;
    const clientIP = getClientIP(request);
    const clientIpHash = hashIP(clientIP);

    const snippet = await db
      .select({ id: snippets.id, isPublic: snippets.isPublic })
      .from(snippets)
      .where(eq(snippets.shareId, shareId))
      .limit(1);

    if (snippet.length === 0 || !snippet[0].isPublic) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    const snippetData = snippet[0];
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      await db
        .delete(snippetLikes)
        .where(
          and(
            eq(snippetLikes.snippetId, snippetData.id),
            eq(snippetLikes.userId, userId),
          ),
        );
    } else {
      await db
        .delete(snippetLikes)
        .where(
          and(
            eq(snippetLikes.snippetId, snippetData.id),
            eq(snippetLikes.viewerIpHash, clientIpHash),
            sql`${snippetLikes.userId} IS NULL`,
          ),
        );
    }

    const [likesResult] = await db
      .select({ count: count() })
      .from(snippetLikes)
      .where(eq(snippetLikes.snippetId, snippetData.id));

    return NextResponse.json({
      success: true,
      liked: false,
      likesCount: likesResult.count,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[UNLIKE_SNIPPET] Error:", {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to unlike snippet" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  try {
    const { shareId } = await params;
    const clientIP = getClientIP(request);
    const clientIpHash = hashIP(clientIP);

    const snippet = await db
      .select({
        id: snippets.id,
        isPublic: snippets.isPublic,
        userId: snippets.userId,
      })
      .from(snippets)
      .where(eq(snippets.shareId, shareId))
      .limit(1);

    if (snippet.length === 0 || !snippet[0].isPublic) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    const snippetData = snippet[0];

    const owner = await db
      .select({
        settings: users.settings,
      })
      .from(users)
      .where(eq(users.id, snippetData.userId))
      .limit(1);

    const likesEnabled = owner[0]?.settings?.userPreferences?.likes ?? true;

    if (!likesEnabled) {
      return NextResponse.json(
        {
          error: "Likes feature is disabled",
          likesEnabled: false,
        },
        { status: 403 },
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    const [likesResult] = await db
      .select({ count: count() })
      .from(snippetLikes)
      .where(eq(snippetLikes.snippetId, snippetData.id));

    let hasLiked = false;
    if (userId) {
      const userLike = await db
        .select()
        .from(snippetLikes)
        .where(
          and(
            eq(snippetLikes.snippetId, snippetData.id),
            eq(snippetLikes.userId, userId),
          ),
        )
        .limit(1);
      hasLiked = userLike.length > 0;
    } else {
      const ipLike = await db
        .select()
        .from(snippetLikes)
        .where(
          and(
            eq(snippetLikes.snippetId, snippetData.id),
            eq(snippetLikes.viewerIpHash, clientIpHash),
            sql`${snippetLikes.userId} IS NULL`,
          ),
        )
        .limit(1);
      hasLiked = ipLike.length > 0;
    }

    return NextResponse.json({
      likesCount: likesResult.count,
      isLiked: hasLiked,
      likesEnabled: true,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[GET_LIKE_STATUS] Error:", {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to get like status" },
      { status: 500 },
    );
  }
}
