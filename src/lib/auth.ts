import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { eq } from "drizzle-orm"

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("Missing GitHub OAuth credentials in environment variables.")
}
if (!process.env.AUTH_SECRET) {
  throw new Error("Missing AUTH_SECRET")
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
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        if (url === "/") return `${baseUrl}/dashboard`
        return `${baseUrl}${url}`
      } else if (new URL(url).origin === baseUrl) {
        const urlObj = new URL(url)
        if (urlObj.pathname === "/") return `${baseUrl}/dashboard`
        return url
      }
      return `${baseUrl}/dashboard`
    },

    async jwt({ token, user, account, trigger, session }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }

      if (user) {
        token.id = user.id
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
        session.provider = token.provider as string

        try {
          const userData = await db
            .select()
            .from(users)
            .where(eq(users.id, token.id as string))
            .limit(1)
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
              },
            }
          }
        } catch (err) {
          console.error("Failed to enrich session user:", err)
        }
      }

      return session
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
                },
              },
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))
        } catch (err) {
          console.error("Error setting up new user:", err)
        }
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
