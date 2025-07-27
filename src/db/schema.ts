import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  boolean,
  index,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export type UserSettings = {
  codeBlockSettings: {
    theme: string;
  };
  layoutSettings: {
    theme: "light" | "dark" | "auto";
  };
  seoSettings: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  userPreferences: {
    notifications: boolean;
    analytics: boolean;
  };
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified"),
    image: text("image"),
    settings: jsonb("settings")
      .$type<UserSettings>()
      .default({
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
      }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  }),
);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
    userIdIdx: index("accounts_user_id_idx").on(table.userId),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").notNull().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  }),
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
  }),
);

export const snippets = pgTable(
  "snippets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    code: text("code").notNull(),
    language: text("language").notNull(),
    tags: jsonb("tags").$type<string[]>().default([]),
    isPublic: boolean("is_public").default(false),
    shareId: uuid("share_id").unique(),
    viewCount: integer("view_count").default(0),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("snippets_user_id_idx").on(table.userId),
    languageIdx: index("snippets_language_idx").on(table.language),
    isPublicIdx: index("snippets_is_public_idx").on(table.isPublic),
    createdAtIdx: index("snippets_created_at_idx").on(table.createdAt),
    shareIdIdx: index("snippets_share_id_idx").on(table.shareId),
  }),
);

export const snippetViews = pgTable(
  "snippet_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    snippetId: uuid("snippet_id")
      .references(() => snippets.id, { onDelete: "cascade" })
      .notNull(),
    viewerIp: text("viewer_ip"),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    snippetIdIdx: index("snippet_views_snippet_id_idx").on(table.snippetId),
    createdAtIdx: index("snippet_views_created_at_idx").on(table.createdAt),
    userIdIdx: index("snippet_views_user_id_idx").on(table.userId),
  }),
);
