import { ReactNode } from "react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { UserSettings } from "@/db/schema";

// Theme Context Types
export type UITheme = "dark" | "light" | "system";

export interface ThemeContextType {
  theme: UITheme;
  setTheme: (theme: UITheme) => void;
  resolvedTheme: "dark" | "light";
  isLoading: boolean;
}

// Auth Context Types
export interface AuthContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  user: Session["user"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: typeof signIn;
  signOut: (options?: { callbackUrl?: string }) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// Settings Context Types
export interface SettingsContextType {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  updateCodeBlockSettings: (
    settings: Partial<UserSettings["codeBlockSettings"]>,
  ) => Promise<boolean>;
  updateLayoutSettings: (
    settings: Partial<UserSettings["layoutSettings"]>,
  ) => Promise<boolean>;
  updateSeoSettings: (
    settings: Partial<UserSettings["seoSettings"]>,
  ) => Promise<boolean>;
  updateUserPreferences: (
    preferences: Partial<UserSettings["userPreferences"]>,
  ) => Promise<boolean>;
}

export interface SettingsProviderProps {
  children: ReactNode;
}
