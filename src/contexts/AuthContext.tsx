"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session } from "next-auth";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

interface AuthContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  user: Session["user"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: typeof signIn;
  signOut: (options?: { callbackUrl?: string }) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status]);

  const refreshSession = async () => {
    await getSession();
  };

  const handleSignOut = async (options?: { callbackUrl?: string }) => {
    await signOut({
      callbackUrl: options?.callbackUrl || "/",
      redirect: true,
    });
  };

  const value: AuthContextType = {
    session,
    status,
    user: session?.user || null,
    isLoading,
    isAuthenticated: status === "authenticated",
    signIn,
    signOut: handleSignOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const callbackUrl = redirectTo || currentPath || "/dashboard";

      if (currentPath.startsWith("/dashboard") || redirectTo) {
        signIn(undefined, { callbackUrl });
      }
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
}
