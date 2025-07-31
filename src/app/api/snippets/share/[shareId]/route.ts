import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { snippets, users, snippetLikes } from "@/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { isValidShareId } from "@/lib/security";

export async function GET(
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
    
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const snippet = await db
      .select({
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
        userName: users.name,
        userId: snippets.userId,
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.userId, users.id))
      .where(and(eq(snippets.shareId, shareId), eq(snippets.isPublic, true)))
      .limit(1);

    if (snippet.length === 0) {
      return NextResponse.json(
        { error: "Snippet not found or not public" },
        { status: 404 },
      );
    }

    const foundSnippet = snippet[0];

    const [likesResult] = await db
      .select({ count: count() })
      .from(snippetLikes)
      .where(eq(snippetLikes.snippetId, foundSnippet.id));

    let hasLiked = false;
    const session = await auth();
    const userId = session?.user?.id;

    const owner = await db
      .select({ settings: users.settings })
      .from(users)
      .where(eq(users.id, foundSnippet.userId))
      .limit(1);

    const likesEnabled = owner[0]?.settings?.userPreferences?.likes ?? true;

    if (likesEnabled) {
      if (userId) {
        const userLike = await db
          .select()
          .from(snippetLikes)
          .where(
            and(
              eq(snippetLikes.snippetId, foundSnippet.id),
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
              eq(snippetLikes.snippetId, foundSnippet.id),
              eq(snippetLikes.viewerIpHash, clientIp),
              sql`${snippetLikes.userId} IS NULL`,
            ),
          )
          .limit(1);
        hasLiked = ipLike.length > 0;
      }
    }

    const { ...snippetWithoutUserId } = foundSnippet;

    return NextResponse.json({
      ...snippetWithoutUserId,
      likesCount: likesResult.count,
      isLiked: hasLiked,
      likesEnabled,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 },
    );
  }
}

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
    
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sharedSnippet = await db
      .select()
      .from(snippets)
      .where(and(eq(snippets.shareId, shareId), eq(snippets.isPublic, true)))
      .limit(1);

    if (sharedSnippet.length === 0) {
      return NextResponse.json(
        { error: "Snippet not found or not public" },
        { status: 404 },
      );
    }

    const snippet = sharedSnippet[0];

    const newSnippet = await db
      .insert(snippets)
      .values({
        title: `${snippet.title} (Copy)`,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags,
        isPublic: false,
        shareId: null,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json(newSnippet[0], { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to copy snippet" },
      { status: 500 },
    );
  }
}
