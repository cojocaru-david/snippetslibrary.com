"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Code,
  Copy,
  Download,
  Eye,
  User,
  Calendar,
  Tag,
  BookmarkPlus,
  ExternalLink,
  Clock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatNumber, formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import type { ShareSnippetClientProps } from "@/types";

export default function ShareSnippetClient({
  snippet,
  ownerHighlightTheme,
}: ShareSnippetClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [copying, setCopying] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (viewTracked) return;

    if (snippet && snippet.displayTheme) {
      document.documentElement.setAttribute("data-theme", snippet.displayTheme);
      const theme =
        snippet.displayTheme === "auto"
          ? "system"
          : (snippet.displayTheme as "light" | "dark" | "system");
      setTheme(theme);
    }

    const trackView = async () => {
      try {
        const response = await fetch(
          `/api/snippets/share/${snippet.shareId}/view`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const result = await response.json();

        if (response.ok) {
          setViewTracked(true);
          console.log("View tracked successfully:", result);
        } else {
          console.log("View not tracked:", result);
        }
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    const timer = setTimeout(trackView, 500);
    return () => clearTimeout(timer);
  }, [snippet.shareId, viewTracked, setTheme, snippet]);

  const handleCopyToDashboard = async () => {
    if (!user) {
      toast.error("Please sign in to copy snippets to your dashboard");
      return;
    }

    try {
      setCopying(true);
      const response = await fetch(`/api/snippets/share/${snippet.shareId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to copy snippet");
      }

      toast.success("Snippet copied to your dashboard!", {
        icon: "📋",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error copying snippet:", error);
      toast.error("Failed to copy snippet");
    } finally {
      setCopying(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      toast.success("Code copied to clipboard!", { icon: "📋" });
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleDownloadCode = () => {
    const getFileExtension = (lang: string): string => {
      const extensions: Record<string, string> = {
        javascript: "js",
        typescript: "ts",
        python: "py",
        java: "java",
        "c++": "cpp",
        "c#": "cs",
        html: "html",
        css: "css",
        json: "json",
        yaml: "yml",
        markdown: "md",
        shell: "sh",
        bash: "sh",
        sql: "sql",
        php: "php",
        ruby: "rb",
        go: "go",
        rust: "rs",
        kotlin: "kt",
        swift: "swift",
        dart: "dart",
      };
      return extensions[lang.toLowerCase()] || "txt";
    };

    try {
      const blob = new Blob([snippet.code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${snippet.title.replace(/[^a-z0-9]/gi, "_")}.${getFileExtension(snippet.language)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Code downloaded!", { icon: "⬇️" });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Globe className="w-4 h-4" />
              <span>Public Snippet</span>
              <Badge variant="outline" className="ml-2">
                <Eye className="w-3 h-3 mr-1" />
                {snippet.viewCount} views
              </Badge>
              <span className="text-muted-foreground/60">•</span>
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(snippet.updatedAt)}</span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-start md:justify-between">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                {snippet.title}
              </h1>
              <div className="flex flex-wrap gap-3 mb-8">
                <Button onClick={handleCopyCode} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>

                <Button
                  onClick={handleDownloadCode}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                {user && (
                  <Button
                    onClick={handleCopyToDashboard}
                    disabled={copying}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    {copying ? "Copying..." : "Copy to Dashboard"}
                  </Button>
                )}

                {!user && (
                  <Link href="/auth/signin">
                    <Button variant="default" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Sign in to Copy
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {snippet.description && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {snippet.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {snippet.userName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>By {snippet.userName}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(snippet.createdAt)}</span>
              </div>

              <Badge variant="secondary" className="font-mono">
                {snippet.language}
              </Badge>

              {snippet.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <div className="flex gap-1">
                    {snippet.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {snippet.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{snippet.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <CodeBlock
              code={snippet.code}
              language={snippet.language}
              highlightTheme={ownerHighlightTheme} // Pass owner's theme preference
              title={snippet.title}
              showCopyButton={true}
              showDownloadButton={true}
              showExpandButton={true}
              filename={`${snippet.title.replace(/[^a-z0-9]/gi, "_")}.${snippet.language}`}
            />
          </div>

          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Code className="w-5 h-5" />
                Snippet Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Language
                    </span>
                    <Badge variant="secondary" className="font-mono">
                      {snippet.language.charAt(0).toUpperCase() +
                        snippet.language.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Views
                    </span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>{formatNumber(snippet.viewCount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Lines of Code
                    </span>
                    <span>{snippet.code.split("\n").length}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Created
                    </span>
                    <span className="text-sm">
                      {formatDate(snippet.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </span>
                    <span className="text-sm">
                      {formatDate(snippet.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Character Count
                    </span>
                    <span>{formatNumber(snippet.code.length)}</span>
                  </div>
                </div>
              </div>

              {snippet.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {snippet.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="hover:bg-muted/50 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {!user && (
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">Love this snippet?</h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Create your own snippet library and organize your code
                  collection.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/auth/signin">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                    >
                      Get Started Free
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Explore More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
