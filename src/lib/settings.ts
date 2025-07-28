import { db } from "@/db";
import { users, UserSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get user settings by user ID
 */
export async function getUserSettings(
  userId: string,
): Promise<UserSettings | null> {
  try {
    const result = await db
      .select({ settings: users.settings })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0]?.settings || null;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>,
): Promise<boolean> {
  try {
    const currentSettings = await getUserSettings(userId);

    const mergedSettings: UserSettings = {
      codeBlockSettings: {
        theme: "github-dark",
        ...currentSettings?.codeBlockSettings,
        ...settings.codeBlockSettings,
      },
      layoutSettings: {
        theme: "auto",
        ...currentSettings?.layoutSettings,
        ...settings.layoutSettings,
      },
      seoSettings: {
        title: "",
        description: "",
        keywords: [],
        ...currentSettings?.seoSettings,
        ...settings.seoSettings,
      },
      userPreferences: {
        notifications: true,
        analytics: true,
        ...currentSettings?.userPreferences,
        ...settings.userPreferences,
      },
    };

    await db
      .update(users)
      .set({
        settings: mergedSettings,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return true;
  } catch {
    return false;
  }
}

/**
 * Initialize default settings for a new user
 */
export async function initializeUserSettings(userId: string): Promise<boolean> {
  const defaultSettings: UserSettings = {
    codeBlockSettings: {
      theme: "github-dark",
    },
    layoutSettings: {
      theme: "auto",
    },
    seoSettings: {
      title: "",
      description: "",
      keywords: [],
    },
    userPreferences: {
      notifications: true,
      analytics: true,
    },
  };

  return updateUserSettings(userId, defaultSettings);
}

/**
 * Update specific setting category
 */
export async function updateCodeBlockSettings(
  userId: string,
  settings: Partial<UserSettings["codeBlockSettings"]>,
): Promise<boolean> {
  if (!settings.theme) {
    throw new Error("Code block theme is required");
  }
  return updateUserSettings(userId, {
    codeBlockSettings: settings as UserSettings["codeBlockSettings"],
  });
}

export async function updateLayoutSettings(
  userId: string,
  settings: Partial<UserSettings["layoutSettings"]>,
): Promise<boolean> {
  if (!settings.theme) {
    throw new Error("Layout theme is required");
  }
  return updateUserSettings(userId, {
    layoutSettings: settings as UserSettings["layoutSettings"],
  });
}

export async function updateSeoSettings(
  userId: string,
  settings: Partial<UserSettings["seoSettings"]>,
): Promise<boolean> {
  return updateUserSettings(userId, { seoSettings: settings });
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserSettings["userPreferences"]>,
): Promise<boolean> {
  const currentSettings = await getUserSettings(userId);
  const currentPreferences = currentSettings?.userPreferences || {
    notifications: true,
    analytics: true,
  };

  const mergedPreferences: UserSettings["userPreferences"] = {
    ...currentPreferences,
    ...preferences,
  };

  return updateUserSettings(userId, { userPreferences: mergedPreferences });
}

/**
 * Get default settings
 */
export function getDefaultSettings(): UserSettings {
  return {
    codeBlockSettings: {
      theme: "github-dark",
    },
    layoutSettings: {
      theme: "auto",
    },
    seoSettings: {
      title: "",
      description: "",
      keywords: [],
    },
    userPreferences: {
      notifications: true,
      analytics: true,
    },
  };
}
