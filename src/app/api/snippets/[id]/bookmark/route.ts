import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { snippetBookmarks, snippets } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: snippetId } = await params;

    // check if snippet exists and belongs to the user
    const snippet = await db
      .select()
      .from(snippets)
      .where(
        and(eq(snippets.id, snippetId), eq(snippets.userId, session.user.id)),
      )
      .limit(1);

    if (snippet.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    const existingBookmark = await db
      .select()
      .from(snippetBookmarks)
      .where(
        and(
          eq(snippetBookmarks.snippetId, snippetId),
          eq(snippetBookmarks.userId, session.user.id),
        ),
      )
      .limit(1);

    if (existingBookmark.length > 0) {
      return NextResponse.json(
        { error: "Already bookmarked" },
        { status: 409 },
      );
    }

    await db.insert(snippetBookmarks).values({
      snippetId,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, bookmarked: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error bookmarking snippet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: snippetId } = await params;

    // remove bookmark
    await db
      .delete(snippetBookmarks)
      .where(
        and(
          eq(snippetBookmarks.snippetId, snippetId),
          eq(snippetBookmarks.userId, session.user.id),
        ),
      );

    return NextResponse.json({ success: true, bookmarked: false });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
