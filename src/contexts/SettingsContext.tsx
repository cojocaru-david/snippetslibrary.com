"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import { UserSettings } from "@/db/schema";
import type { SettingsContextType, SettingsProviderProps } from "@/types";

const getDefaultSettings = (): UserSettings => ({
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
    likes: true,
  },
});

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const cacheRef = useRef<{
    settings: UserSettings | null;
    timestamp: number;
    userId: string | null;
  }>({
    settings: null,
    timestamp: 0,
    userId: null,
  });

  const fetchSettings = useCallback(async () => {
    const CACHE_DURATION = 5 * 60 * 1000;
    if (
      status !== "authenticated" ||
      !session?.user?.id ||
      isFetchingRef.current
    ) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    const cache = cacheRef.current;
    if (
      cache.settings &&
      cache.userId === session.user.id &&
      now - cache.timestamp < CACHE_DURATION
    ) {
      setSettings(cache.settings);
      setLoading(false);
      return;
    }

    isFetchingRef.current = true;
    try {
      setError(null);
      const response = await fetch("/api/settings");

      if (!response.ok) {
        if (response.status === 404) {
          const defaultSettings = getDefaultSettings();
          setSettings(defaultSettings);
          cacheRef.current = {
            settings: defaultSettings,
            timestamp: now,
            userId: session.user.id,
          };
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettings(data);

      cacheRef.current = {
        settings: data,
        timestamp: now,
        userId: session.user.id,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      const defaultSettings = getDefaultSettings();
      setSettings(defaultSettings);
      cacheRef.current = {
        settings: defaultSettings,
        timestamp: now,
        userId: session.user.id,
      };
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [session?.user?.id, status]);

  const updateSettings = useCallback(
    async (newSettings: Partial<UserSettings>): Promise<boolean> => {
      if (status !== "authenticated" || !session?.user?.id) {
        return false;
      }

      try {
        setError(null);
        const response = await fetch("/api/settings", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSettings),
        });

        if (!response.ok) {
          throw new Error("Failed to update settings");
        }

        const updatedSettings = await response.json();
        setSettings(updatedSettings);

        cacheRef.current = {
          settings: updatedSettings,
          timestamp: Date.now(),
          userId: session.user.id,
        };

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      }
    },
    [session?.user?.id, status],
  );

  const updateCodeBlockSettings = useCallback(
    (codeBlockSettings: Partial<UserSettings["codeBlockSettings"]>) => {
      if (!settings) return Promise.resolve(false);
      return updateSettings({
        codeBlockSettings: {
          ...settings.codeBlockSettings,
          ...codeBlockSettings,
        },
      });
    },
    [updateSettings, settings],
  );

  const updateLayoutSettings = useCallback(
    (layoutSettings: Partial<UserSettings["layoutSettings"]>) => {
      if (!settings) return Promise.resolve(false);
      return updateSettings({
        layoutSettings: { ...settings.layoutSettings, ...layoutSettings },
      });
    },
    [updateSettings, settings],
  );

  const updateSeoSettings = useCallback(
    (seoSettings: Partial<UserSettings["seoSettings"]>) => {
      if (!settings) return Promise.resolve(false);
      return updateSettings({
        seoSettings: { ...settings.seoSettings, ...seoSettings },
      });
    },
    [updateSettings, settings],
  );

  const updateUserPreferences = useCallback(
    (userPreferences: Partial<UserSettings["userPreferences"]>) => {
      if (!settings) return Promise.resolve(false);
      return updateSettings({
        userPreferences: { ...settings.userPreferences, ...userPreferences },
      });
    },
    [updateSettings, settings],
  );

  const refreshSettings = useCallback(async () => {
    cacheRef.current = {
      settings: null,
      timestamp: 0,
      userId: null,
    };
    setLoading(true);
    await fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (session?.user?.id !== cacheRef.current.userId) {
      cacheRef.current = {
        settings: null,
        timestamp: 0,
        userId: null,
      };
    }

    if (status === "authenticated" && session?.user?.id && !settings) {
      fetchSettings();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setSettings(null);
      cacheRef.current = {
        settings: null,
        timestamp: 0,
        userId: null,
      };
    }
  }, [status, session?.user?.id, settings, fetchSettings]);

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings,
    updateCodeBlockSettings,
    updateLayoutSettings,
    updateSeoSettings,
    updateUserPreferences,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
