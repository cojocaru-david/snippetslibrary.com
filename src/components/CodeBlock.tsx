"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/hooks/useSettings";
import { shikiService } from "@/lib/shiki";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Copy,
  Download,
  Expand,
  Minus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const LANGUAGE_MAPPING: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  rb: "ruby",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  dockerfile: "docker",
  vue: "html",
  svelte: "html",
};

const FILE_EXTENSION_MAPPING: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  jsx: "jsx",
  tsx: "tsx",
  python: "py",
  ruby: "rb",
  bash: "sh",
  shell: "sh",
  yaml: "yml",
  yml: "yml",
  markdown: "md",
  docker: "dockerfile",
  dockerfile: "dockerfile",
  html: "html",
  css: "css",
  scss: "scss",
  sass: "sass",
  less: "less",
  json: "json",
  xml: "xml",
  sql: "sql",
  php: "php",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "cs",
  go: "go",
  rust: "rs",
  swift: "swift",
  kotlin: "kt",
  dart: "dart",
  r: "r",
  matlab: "m",
  perl: "pl",
  lua: "lua",
  haskell: "hs",
  scala: "scala",
  clojure: "clj",
  elixir: "ex",
  erlang: "erl",
  text: "txt",
  plain: "txt",
};

function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text;
}

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  code: string;
  language: string;
  highlightTheme?: string;
  title?: string;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  showExpandButton?: boolean;
  rounded?: boolean;
  maxHeight?: string;
  hideScroll?: boolean;
  filename?: string;
}

export const CodeBlock = memo<CodeBlockProps>(
  function CodeBlock({
    children,
    className = "",
    code,
    language,
    highlightTheme,
    title,
    showCopyButton = true,
    showDownloadButton = false,
    showExpandButton = true,
    maxHeight = "400px",
    hideScroll = false,
    filename,
  }) {
    const { resolvedTheme } = useTheme();
    const { settings, loading: settingsLoading } = useSettings();

    const [highlightedCode, setHighlightedCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [themeColors, setThemeColors] = useState<{ bg: string; fg: string }>({
      bg: "#ffffff",
      fg: "#24292f",
    });
    const [isInView, setIsInView] = useState(false);

    const mountedRef = useRef(true);
    const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current || typeof window === "undefined") return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        },
      );

      observerRef.current.observe(containerRef.current);

      return () => {
        observerRef.current?.disconnect();
      };
    }, []);

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }
        observerRef.current?.disconnect();
      };
    }, []);

    const sanitizedCode = useMemo(() => {
      if (!code) return "";
      return sanitizeText(code);
    }, [code]);

    const normalizedLanguage = useMemo(() => {
      if (!language) return "text";
      const lang = language.toLowerCase().trim();
      return LANGUAGE_MAPPING[lang] || lang;
    }, [language]);

    const effectiveHighlightTheme = useMemo(() => {
      if (highlightTheme) {
        return highlightTheme;
      }

      if (!settingsLoading && settings?.codeBlockSettings?.theme) {
        return settings.codeBlockSettings.theme;
      }

      return resolvedTheme === "dark" ? "github-dark" : "github-light";
    }, [
      highlightTheme,
      settings?.codeBlockSettings?.theme,
      resolvedTheme,
      settingsLoading,
    ]);

    const getDefaultColors = useCallback(
      (themeName: string) => {
        const isDark =
          themeName.includes("dark") ||
          themeName.includes("night") ||
          themeName.includes("monokai") ||
          resolvedTheme === "dark";

        return isDark
          ? { bg: "#0d1117", fg: "#c9d1d9" }
          : { bg: "#ffffff", fg: "#24292f" };
      },
      [resolvedTheme],
    );

    const highlightCode = useCallback(async () => {
      if (!mountedRef.current || !isInView) return;

      if (!sanitizedCode.trim()) {
        setHighlightedCode("");
        setIsLoading(false);
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }

        if (!mountedRef.current) return;

        const highlighted = await shikiService.highlight(
          sanitizedCode,
          normalizedLanguage,
          effectiveHighlightTheme,
        );

        if (!mountedRef.current) return;

        if (
          highlighted &&
          highlighted.includes("<pre") &&
          highlighted.includes("</pre>")
        ) {
          setHighlightedCode(highlighted);
        } else {
          throw new Error("Invalid highlighted code format");
        }

        try {
          const colors = await shikiService.getThemeColors(
            effectiveHighlightTheme,
          );
          if (mountedRef.current) {
            setThemeColors(colors);
          }
        } catch (colorError) {
          console.warn(
            "Failed to get theme colors, using defaults:",
            colorError,
          );
          if (mountedRef.current) {
            setThemeColors(getDefaultColors(effectiveHighlightTheme));
          }
        }
      } catch (err) {
        if (mountedRef.current) {
          console.error("Code highlighting failed:", err);
          setError(
            err instanceof Error ? err : new Error("Highlighting failed"),
          );
          setHighlightedCode("");
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    }, [
      sanitizedCode,
      normalizedLanguage,
      effectiveHighlightTheme,
      getDefaultColors,
      isInView,
    ]);

    useEffect(() => {
      if (!isInView) return;

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = setTimeout(() => {
        highlightCode();
      }, 50);

      return () => {
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current);
        }
      };
    }, [highlightCode, isInView]);

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(sanitizedCode);
        toast.success("Code copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy code");
      }
    }, [sanitizedCode]);

    const handleDownload = useCallback(() => {
      try {
        const extension = FILE_EXTENSION_MAPPING[normalizedLanguage] || "txt";
        const filenameWithExt = filename || `code.${extension}`;
        const blob = new Blob([sanitizedCode], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filenameWithExt;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Code downloaded!");
      } catch (err) {
        console.error("Failed to download:", err);
        toast.error("Failed to download code");
      }
    }, [sanitizedCode, filename, normalizedLanguage]);

    const handleToggleExpand = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    const containerStyle = useMemo(
      () => ({
        backgroundColor: themeColors.bg,
        color: themeColors.fg,
        maxHeight: !isExpanded && !hideScroll ? maxHeight : "none",
        overflow: !isExpanded && !hideScroll ? "auto" : "visible",
      }),
      [themeColors, isExpanded, hideScroll, maxHeight],
    );

    const hasHeader = Boolean(
      title || showCopyButton || showDownloadButton || showExpandButton,
    );

    return (
      <Card
        ref={containerRef}
        className={`group transition-all duration-200 hover:shadow-lg border-1 border-border py-0 gap-0 ${className}`}
        style={{ backgroundColor: "transparent" }}
      >
        {hasHeader && (
          <CardHeader className="pb-3 bg-muted/80 py-2 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {title && (
                  <h3 className="font-semibold text-lg text-foreground">
                    {title}
                  </h3>
                )}
                <Badge variant="secondary" className="font-mono text-xs">
                  {normalizedLanguage}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                {showCopyButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}

                {showDownloadButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}

                {showExpandButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleExpand}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {isExpanded ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Expand className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        )}

        <div
          className={`border border-border font-mono text-sm transition-all duration-200 relative border-none rounded-b-lg`}
          style={containerStyle}
        >
          {isLoading && !highlightedCode ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Highlighting code...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8 text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Failed to highlight code</span>
              </div>
            </div>
          ) : highlightedCode ? (
            <div
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
              className="shiki-code-block [&>pre]:!m-0 [&>pre]:!p-4 [&>pre]:!bg-transparent [&>pre]:!overflow-auto [&>pre]:!font-mono [&>pre]:!text-sm [&>pre]:!leading-relaxed [&>pre]:!max-w-full"
            />
          ) : (
            <pre className="whitespace-pre-wrap p-4 m-0 overflow-auto font-mono text-sm leading-relaxed max-w-full">
              <code>{children || sanitizedCode}</code>
            </pre>
          )}
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.code === nextProps.code &&
      prevProps.language === nextProps.language &&
      prevProps.highlightTheme === nextProps.highlightTheme &&
      prevProps.title === nextProps.title &&
      prevProps.showCopyButton === nextProps.showCopyButton &&
      prevProps.showDownloadButton === nextProps.showDownloadButton &&
      prevProps.showExpandButton === nextProps.showExpandButton &&
      prevProps.maxHeight === nextProps.maxHeight &&
      prevProps.hideScroll === nextProps.hideScroll &&
      prevProps.filename === nextProps.filename &&
      prevProps.className === nextProps.className
    );
  },
);
