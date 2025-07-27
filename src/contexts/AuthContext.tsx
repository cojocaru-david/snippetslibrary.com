"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import type { AuthContextType, AuthProviderProps } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
