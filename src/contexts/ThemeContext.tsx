"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { UITheme, ThemeContextType } from "@/types";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const getInitialTheme = useCallback((): UITheme => {
    if (typeof window === "undefined") return "system";

    try {
      const savedTheme = localStorage.getItem("ui-theme") as UITheme;
      if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
        return savedTheme;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Failed to read UI theme from localStorage:", error);
    }

    return "system";
  }, []);

  const resolveTheme = useCallback((theme: UITheme): "dark" | "light" => {
    if (theme === "system") {
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, []);

  const [theme, setTheme] = useState<UITheme>(() => getInitialTheme());
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() =>
    resolveTheme(getInitialTheme()),
  );

  const applyTheme = useCallback((resolvedTheme: "dark" | "light") => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    root.classList.add(resolvedTheme);

    root.setAttribute("data-theme", resolvedTheme);
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [applyTheme, resolvedTheme]);

  const handleSetTheme = useCallback(
    (newTheme: UITheme) => {
      setTheme(newTheme);
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);

      try {
        localStorage.setItem("ui-theme", newTheme);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("Failed to save UI theme to localStorage:", error);
      }
    },
    [resolveTheme, applyTheme],
  );

  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  const value = {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme,
    isLoading: false,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
