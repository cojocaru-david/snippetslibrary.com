import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { updateSnippetSchema } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snippet = await db
      .select()
      .from(snippets)
      .where(and(eq(snippets.id, id), eq(snippets.userId, session.user.id)))
      .limit(1);

    if (snippet.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    return NextResponse.json(snippet[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateSnippetSchema.parse(body);

    // Check if snippet exists and belongs to user
    const existingSnippet = await db
      .select()
      .from(snippets)
      .where(and(eq(snippets.id, id), eq(snippets.userId, session.user.id)))
      .limit(1);

    if (existingSnippet.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    let shareId = existingSnippet[0].shareId;
    if (validatedData.isPublic !== undefined) {
      if (validatedData.isPublic && !shareId) {
        shareId = uuidv4();
      } else if (!validatedData.isPublic) {
        shareId = null;
      }
    }

    const updatedSnippet = await db
      .update(snippets)
      .set({
        ...validatedData,
        shareId,
        updatedAt: new Date(),
      })
      .where(eq(snippets.id, id))
      .returning();

    return NextResponse.json(updatedSnippet[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.format() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update snippet" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if snippet exists and belongs to user
    const existingSnippet = await db
      .select()
      .from(snippets)
      .where(and(eq(snippets.id, id), eq(snippets.userId, session.user.id)))
      .limit(1);

    if (existingSnippet.length === 0) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    await db.delete(snippets).where(eq(snippets.id, id));

    return NextResponse.json({ message: "Snippet deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete snippet" },
      { status: 500 },
    );
  }
}
