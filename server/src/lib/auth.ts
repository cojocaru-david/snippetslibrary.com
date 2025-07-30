import { GitHub } from 'arctic';
import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import { db } from '../db';
import { sessions, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { User, AuthSession } from 'shared';

// Github_client_id - fail if not provided in production
if (!process.env.GITHUB_CLIENT_ID) {
  console.error('❌ GITHUB_CLIENT_ID is required but not set');
  process.exit(1);
}

// Github_client_secret - fail if not provided in production
if (!process.env.GITHUB_CLIENT_SECRET) {
  console.error('❌ GITHUB_CLIENT_SECRET is required but not set');
  process.exit(1);
}

// Github_redirect_uri - fail if not provided in production
if (!process.env.GITHUB_REDIRECT_URI) {
  console.error('❌ GITHUB_REDIRECT_URI is required but not set');
  process.exit(1);
}

// GitHub OAuth setup
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
  process.env.GITHUB_REDIRECT_URI!
);

// JWT secret - fail if not provided in production
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is required but not set');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'your-secret-key') {
  console.error('❌ Using default JWT_SECRET in production is not allowed');
  process.exit(1);
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Create session with shorter expiration and rotation
export async function createSession(userId: string, accessToken: string): Promise<string> {
  const sessionId = nanoid();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days instead of 30

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    accessToken,
  });

  return sessionId;
}

// Rotate session for security
export async function rotateSession(oldSessionId: string): Promise<string | null> {
  const oldSession = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, oldSessionId))
    .limit(1);

  if (!oldSession.length) return null;

  const session = oldSession[0]!;

  // Create new session
  const newSessionId = await createSession(session.userId, session.accessToken);

  // Delete old session
  await db.delete(sessions).where(eq(sessions.id, oldSessionId));

  return newSessionId;
}

// Invalidate all user sessions (for security events)
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

// Create JWT token with shorter expiration
export async function createJWT(sessionId: string): Promise<string> {
  return new SignJWT({ sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days instead of 30
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyJWT(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.sessionId as string;
  } catch {
    return null;
  }
}

// Get session by ID
export async function getSession(sessionId: string): Promise<AuthSession | null> {
  const result = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!result.length) return null;

  const row = result[0]!;
  const session = row.session;
  const user = row.user;

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return {
    user: {
      id: user.id,
      githubId: user.githubId,
      username: user.username,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      blog: user.blog,
      company: user.company,
      publicRepos: user.publicRepos || 0,
      followers: user.followers || 0,
      following: user.following || 0,

      // SEO and customization fields with defaults
      seoTitle: user.seoTitle || null,
      seoDescription: user.seoDescription || null,
      seoKeywords: user.seoKeywords || null,
      seoImageUrl: user.seoImageUrl || null,
      customHeaderTitle: user.customHeaderTitle || null,
      customHeaderDescription: user.customHeaderDescription || null,
      customBrandingColor: user.customBrandingColor || '#3b82f6',
      customBrandingLogo: user.customBrandingLogo || null,
      uiTheme: user.uiTheme || 'system',
      codeTheme: user.codeTheme || 'auto',
      profileBannerUrl: user.profileBannerUrl || null,
      socialLinks: user.socialLinks || {},
      customDomain: user.customDomain || null,
      isProfilePublic: user.isProfilePublic ?? true,
      showGithubStats: user.showGithubStats ?? true,
      showActivityFeed: user.showActivityFeed ?? true,
      emailNotifications: user.emailNotifications ?? true,
      enableAnalytics: user.enableAnalytics ?? false,
      twoFactorEnabled: user.twoFactorEnabled ?? false,
      twoFactorSecret: user.twoFactorSecret || null,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken: session.accessToken,
    expiresAt: session.expiresAt,
  };
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// Create or update user from GitHub data
export async function createOrUpdateUser(githubUser: any): Promise<User> {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.githubId, githubUser.id))
    .limit(1);

  const userData = {
    githubId: githubUser.id,
    username: githubUser.login,
    email: githubUser.email || '',
    name: githubUser.name,
    avatarUrl: githubUser.avatar_url,
    bio: githubUser.bio,
    location: githubUser.location,
    blog: githubUser.blog,
    company: githubUser.company,
    publicRepos: githubUser.public_repos || 0,
    followers: githubUser.followers || 0,
    following: githubUser.following || 0,
    updatedAt: new Date(),
  };

  if (existingUser.length > 0) {
    // Update existing user
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, existingUser[0]!.id))
      .returning();

    // Return with proper User type including all fields
    return {
      ...updatedUser!,
      customBrandingColor: updatedUser!.customBrandingColor || '#3b82f6',
      uiTheme: updatedUser!.uiTheme || 'system',
      codeTheme: updatedUser!.codeTheme || 'auto',
      socialLinks: updatedUser!.socialLinks || {},
      isProfilePublic: updatedUser!.isProfilePublic ?? true,
      showGithubStats: updatedUser!.showGithubStats ?? true,
      showActivityFeed: updatedUser!.showActivityFeed ?? true,
      emailNotifications: updatedUser!.emailNotifications ?? true,
      enableAnalytics: updatedUser!.enableAnalytics ?? false,
      twoFactorEnabled: updatedUser!.twoFactorEnabled ?? false,
    };
  } else {
    // Create new user with all default values
    const [newUser] = await db
      .insert(users)
      .values({
        ...userData,
        // SEO fields
        seoTitle: null,
        seoDescription: null,
        seoKeywords: null,
        seoImageUrl: null,
        // Customization fields
        customHeaderTitle: null,
        customHeaderDescription: null,
        customBrandingColor: '#3b82f6',
        customBrandingLogo: null,
        uiTheme: 'system',
        codeTheme: 'auto',
        profileBannerUrl: null,
        socialLinks: {},
        customDomain: null,
        // Privacy settings
        isProfilePublic: true,
        showGithubStats: true,
        showActivityFeed: true,
        emailNotifications: true,
        enableAnalytics: false,
        twoFactorEnabled: false,
        twoFactorSecret: null,
      })
      .returning();

    return newUser! as User;
  }
}

// Fetch GitHub user data
export async function fetchGitHubUser(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'Snippets Library'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub user');
  }

  return response.json();
}
