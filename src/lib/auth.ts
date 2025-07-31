import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth credentials in environment variables.");
}
if (!process.env.AUTH_SECRET) {
  throw new Error("Missing AUTH_SECRET");
}

export const config = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],

  session: {
    strategy: "database",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        if (url === "/") return `${baseUrl}/dashboard`;
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        const urlObj = new URL(url);
        if (urlObj.pathname === "/") return `${baseUrl}/dashboard`;
        return url;
      }
      return `${baseUrl}/dashboard`;
    },

    async session({ session, user }) {
      if (user && session.user) {
        session.user.id = user.id;

        try {
          const userData = await db
            .select()
            .from(users)
            .where(eq(users.id, user.id))
            .limit(1);

          if (userData[0]) {
            session.user.settings = userData[0].settings ?? {
              codeBlockSettings: { theme: "auto" },
              seoSettings: {
                title: "",
                description: "",
              },
              layoutSettings: {
                theme: "auto",
              },
              userPreferences: {
                notifications: true,
                analytics: true,
                likes: true,
              },
            };
          }
        } catch (err) {
          console.error("[SESSION_ENRICHMENT] Error:", {
            timestamp: new Date().toISOString(),
            message: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }

      return session;
    },
  },

  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        try {
          await db
            .update(users)
            .set({
              settings: {
                codeBlockSettings: { theme: "auto" },
                seoSettings: {
                  title: "",
                  description: "",
                },
                layoutSettings: {
                  theme: "auto",
                },
                userPreferences: {
                  notifications: true,
                  analytics: true,
                  likes: true,
                },
              },
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));
        } catch (err) {
          console.error("[NEW_USER_SETUP] Error:", {
            timestamp: new Date().toISOString(),
            message: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
