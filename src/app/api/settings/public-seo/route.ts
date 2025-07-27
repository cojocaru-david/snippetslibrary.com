import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get default SEO settings from the first user with settings or use fallback
    const defaultSettings = await db
      .select({
        title: sql<string>`${users.settings}->>'seoSettings'->>'title'`,
        description: sql<string>`${users.settings}->>'seoSettings'->>'description'`,
        keywords: sql<string[]>`${users.settings}->>'seoSettings'->>'keywords'`,
      })
      .from(users)
      .where(sql`${users.settings}->>'seoSettings'->>'title' IS NOT NULL`)
      .limit(1);

    if (defaultSettings.length > 0) {
      const settings = defaultSettings[0];
      return NextResponse.json({
        title: settings.title || "Amazing Code Snippets",
        description:
          settings.description ||
          "Discover and share amazing code snippets with the community",
        keywords: settings.keywords || [
          "programming",
          "code",
          "snippets",
          "development",
        ],
      });
    }

    // Fallback settings if no user has configured SEO settings
    return NextResponse.json({
      title: "Amazing Code Snippets",
      description:
        "Discover and share amazing code snippets with the community",
      keywords: [
        "programming",
        "code",
        "snippets",
        "development",
        "javascript",
        "python",
        "react",
      ],
    });
  } catch (error) {
    console.error("Error fetching public SEO settings:", error);

    return NextResponse.json({
      title: "Amazing Code Snippets",
      description:
        "Discover and share amazing code snippets with the community",
      keywords: ["programming", "code", "snippets", "development"],
    });
  }
}
