import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { snippets, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> },
) {
  try {
    const { shareId } = await params;
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

    return NextResponse.json(foundSnippet);
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
