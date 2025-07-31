import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { snippets, snippetBookmarks } from "@/db/schema";
import { eq, desc, and, or, ilike, count, sql } from "drizzle-orm";
import { z } from "zod";
import { createSnippetSchema } from "@/types";
import { generateSecureShareId } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const language = searchParams.get("language") || "";
    const isPublic = searchParams.get("isPublic");
    const tagsParam = searchParams.get("tags") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const selectedTags = tagsParam
      ? tagsParam.split(",").filter((tag) => tag.trim())
      : [];
    const whereConditions = [eq(snippets.userId, session.user.id)];

    if (search) {
      whereConditions.push(
        or(
          ilike(snippets.title, `%${search}%`),
          ilike(snippets.description, `%${search}%`),
          ilike(snippets.code, `%${search}%`),
        )!,
      );
    }

    if (language) {
      whereConditions.push(eq(snippets.language, language));
    }

    if (isPublic !== null && isPublic !== undefined) {
      whereConditions.push(eq(snippets.isPublic, isPublic === "true"));
    }

    if (selectedTags.length > 0) {
      const tagConditions = selectedTags.map(
        (tag) => sql`${snippets.tags}::jsonb ? ${tag}`,
      );
      whereConditions.push(or(...tagConditions)!);
    }

    const userSnippets = await db
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
        userId: snippets.userId,
        createdAt: snippets.createdAt,
        updatedAt: snippets.updatedAt,
        isBookmarked: sql<boolean>`CASE WHEN ${snippetBookmarks.id} IS NOT NULL THEN true ELSE false END`,
      })
      .from(snippets)
      .leftJoin(
        snippetBookmarks,
        and(
          eq(snippets.id, snippetBookmarks.snippetId),
          eq(snippetBookmarks.userId, session.user.id),
        ),
      )
      .where(and(...whereConditions))
      .orderBy(
        desc(
          sql`CASE WHEN ${snippetBookmarks.id} IS NOT NULL THEN 1 ELSE 0 END`,
        ),
        desc(snippets.createdAt),
      )
      .limit(limit)
      .offset(offset);

    const totalCountResult = await db
      .select({ count: count() })
      .from(snippets)
      .where(and(...whereConditions));

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      snippets: userSnippets,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }



    const body = await request.json();
    const validatedData = createSnippetSchema.parse(body);

    const shareId = validatedData.isPublic ? generateSecureShareId() : null;

    const newSnippet = await db
      .insert(snippets)
      .values({
        ...validatedData,
        shareId,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json(newSnippet[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 },
    );
  }
}
