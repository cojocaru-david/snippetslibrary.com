import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserSettings, updateUserSettings } from "@/lib/settings";
import { UserSettings } from "@/db/schema";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getUserSettings(session.user.id);

    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const validSettings: Partial<UserSettings> = {};

    if (body.codeBlockSettings) {
      validSettings.codeBlockSettings = {
        theme: body.codeBlockSettings.theme || "github-dark",
      };
    }

    if (body.layoutSettings) {
      const theme = body.layoutSettings.theme;
      if (theme === "light" || theme === "dark" || theme === "auto") {
        validSettings.layoutSettings = { theme };
      }
    }

    if (body.seoSettings) {
      validSettings.seoSettings = {
        title: body.seoSettings.title || "",
        description: body.seoSettings.description || "",
        keywords: Array.isArray(body.seoSettings.keywords)
          ? body.seoSettings.keywords
          : [],
      };
    }

    if (body.userPreferences) {
      validSettings.userPreferences = {
        notifications:
          typeof body.userPreferences.notifications === "boolean"
            ? body.userPreferences.notifications
            : true,
        analytics:
          typeof body.userPreferences.analytics === "boolean"
            ? body.userPreferences.analytics
            : true,
      };
    }

    const success = await updateUserSettings(session.user.id, validSettings);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 },
      );
    }

    const updatedSettings = await getUserSettings(session.user.id);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
