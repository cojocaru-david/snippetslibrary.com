"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Code,
  Copy,
  Download,
  Eye,
  BookmarkPlus,
  ExternalLink,
  Globe,
  Heart,
  Share2,
  ChevronRight,
  FileText,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/CodeBlock";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import type { ShareSnippetClientProps } from "@/types";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ActionButton = ({
  onClick,
  disabled,
  loading,
  variant = "outline",
  size = "sm",
  icon,
  children,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => (
  <Button
    onClick={onClick}
    disabled={disabled || loading}
    variant={variant}
    size={size}
    className={cn(
      "h-9 px-4 gap-2 font-medium transition-all duration-200 hover:scale-105 active:scale-95",
      loading && "animate-pulse",
      className,
    )}
  >
    {loading ? (
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : (
      icon
    )}
    {children}
  </Button>
);

const StatsCard = ({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="group"
  >
    <Card className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <div className="text-2xl font-bold tabular-nums">
              {typeof value === "number" ? (
                <NumberTicker value={value} />
              ) : (
                value
              )}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TagBadge = ({ tag, delay = 0 }: { tag: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
  >
    <Badge
      variant="secondary"
      className="bg-muted/50 hover:bg-muted border-0 text-xs px-3 py-1 font-medium transition-colors duration-200 cursor-default"
    >
      {tag}
    </Badge>
  </motion.div>
);

export default function ShareSnippetClient({
  snippet,
  ownerHighlightTheme,
}: ShareSnippetClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [copying, setCopying] = useState(false);
  const [viewTracked, setViewTracked] = useState(false);
  const [likesCount, setLikesCount] = useState(snippet.likesCount || 0);
  const [isLiked, setIsLiked] = useState(snippet.isLiked || false);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [likesEnabled, setLikesEnabled] = useState(
    snippet.likesEnabled ?? true,
  );
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

        if (response.ok) {
          setViewTracked(true);
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error("Failed to track view");
      }
    };

    const timer = setTimeout(trackView, 500);
    return () => clearTimeout(timer);
  }, [snippet.shareId, viewTracked, setTheme, snippet]);

  useEffect(() => {
    const fetchLikesData = async () => {
      try {
        const response = await fetch(
          `/api/snippets/share/${snippet.shareId}/like`,
          {
            method: "GET",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setLikesCount(data.likesCount || 0);
          setIsLiked(data.isLiked || false);
          setLikesEnabled(data.likesEnabled ?? true);
        } else if (response.status === 403) {
          setLikesEnabled(false);
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch likes data");
      }
    };

    if (!user || snippet.likesEnabled === undefined) {
      fetchLikesData();
    }
  }, [snippet.shareId, user, snippet.likesEnabled]);

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
    } catch {
      toast.error("Failed to copy snippet");
    } finally {
      setCopying(false);
    }
  };

  const handleToggleLike = async () => {
    if (likingInProgress) return;

    setLikingInProgress(true);
    try {
      const method = isLiked ? "DELETE" : "POST";
      const response = await fetch(
        `/api/snippets/share/${snippet.shareId}/like`,
        {
          method,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle like");
      }

      const data = await response.json();
      setIsLiked(data.liked);
      setLikesCount(data.likesCount);

      toast.success(data.liked ? "❤️ Liked!" : "💔 Like removed");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to toggle like";
      toast.error(message);
    } finally {
      setLikingInProgress(false);
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
    } catch {
      toast.error("Failed to download code");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: snippet.title,
          text:
            snippet.description ||
            `Check out this ${snippet.language} code snippet. Created by ${snippet.userName || "an anonymous user"}.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!", { icon: "🔗" });
      }
    } catch {
      toast.error("Failed to share");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <nav
            className="flex items-center gap-2 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Globe className="h-4 w-4" />
            <span>Public Snippet</span>
            <ChevronRight className="h-3 w-3" />
            <span className="max-w-32 truncate font-medium text-foreground sm:max-w-none">
              {snippet.title}
            </span>
          </nav>

          <header className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {snippet.title}
              </h1>
              {snippet.description && (
                <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">
                  {snippet.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {snippet.userName && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      By {snippet.userName}
                    </span>
                    <span
                      className="text-xs text-muted-foreground"
                      suppressHydrationWarning
                    >
                      {formatRelativeTime(snippet.updatedAt)} (
                      {formatDate(snippet.createdAt)})
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <ActionButton
                  onClick={handleCopyCode}
                  icon={<Copy className="h-4 w-4" />}
                  variant="outline"
                  size="sm"
                >
                  Copy
                </ActionButton>

                <ActionButton
                  onClick={handleDownloadCode}
                  icon={<Download className="h-4 w-4" />}
                  variant="outline"
                  size="sm"
                >
                  Download
                </ActionButton>

                <ActionButton
                  onClick={handleShare}
                  icon={<Share2 className="h-4 w-4" />}
                  variant="outline"
                  size="sm"
                >
                  Share
                </ActionButton>

                {user ? (
                  <ActionButton
                    onClick={handleCopyToDashboard}
                    loading={copying}
                    icon={<BookmarkPlus className="h-4 w-4" />}
                    variant="default"
                    size="sm"
                  >
                    {copying ? "Saving..." : "Add to your dashboard"}
                  </ActionButton>
                ) : (
                  <Link href="/auth/signin">
                    <ActionButton
                      onClick={() => {}}
                      icon={<ExternalLink className="h-4 w-4" />}
                      variant="default"
                      size="sm"
                    >
                      Sign in to save
                    </ActionButton>
                  </Link>
                )}

                {likesEnabled && (
                  <ActionButton
                    onClick={handleToggleLike}
                    loading={likingInProgress}
                    icon={
                      <Heart
                        className={cn("h-4 w-4", isLiked && "fill-current")}
                      />
                    }
                    variant={isLiked ? "default" : "outline"}
                    className={cn(
                      "rounded-full",
                      isLiked ? "bg-red-500 hover:bg-red-600 text-white" : "",
                    )}
                    size="sm"
                  >
                    {likesCount}
                  </ActionButton>
                )}
              </div>
            </div>

            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag, index) => (
                  <TagBadge key={index} tag={tag} delay={index * 0.05} />
                ))}
              </div>
            )}
          </header>

          <section className="space-y-6" aria-label="Code snippet">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
                <CodeBlock
                  code={snippet.code}
                  language={snippet.language}
                  highlightTheme={ownerHighlightTheme}
                  title={snippet.title}
                  showCopyButton={true}
                  showDownloadButton={true}
                  showExpandButton={true}
                  filename={`${snippet.title.replace(/[^a-z0-9]/gi, "_")}.${snippet.language}`}
                />
              </Card>
            </motion.div>

            <div
              className={cn(
                "grid gap-4",
                likesEnabled
                  ? "grid-cols-2 sm:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3",
              )}
            >
              <StatsCard
                icon={<Eye className="h-5 w-5 text-blue-500" />}
                label="Views"
                value={snippet.viewCount}
                delay={0.3}
              />
              <StatsCard
                icon={<FileText className="h-5 w-5 text-green-500" />}
                label="Lines"
                value={snippet.code.split("\n").length}
                delay={0.35}
              />
              <StatsCard
                icon={<Zap className="h-5 w-5 text-yellow-500" />}
                label="Characters"
                value={snippet.code.length}
                delay={0.4}
              />
              {likesEnabled && (
                <StatsCard
                  icon={<Heart className="h-5 w-5 text-red-500" />}
                  label="Likes"
                  value={likesCount}
                  delay={0.45}
                />
              )}
            </div>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            aria-label="Snippet details"
          >
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Details</h2>
                </div>

                <dl className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Language
                      </dt>
                      <dd>
                        <Badge variant="secondary" className="font-mono">
                          {snippet.language.charAt(0).toUpperCase() +
                            snippet.language.slice(1)}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Created
                      </dt>
                      <dd className="text-sm" suppressHydrationWarning>
                        {formatDate(snippet.createdAt)}
                      </dd>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Updated
                      </dt>
                      <dd className="text-sm" suppressHydrationWarning>
                        {formatRelativeTime(snippet.updatedAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Size
                      </dt>
                      <dd className="text-sm tabular-nums">
                        {(snippet.code.length / 1024).toFixed(1)} KB
                      </dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </motion.section>

          {!user && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center"
              aria-label="Call to action"
            >
              <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
                <CardContent className="p-8 lg:p-12">
                  <div className="mx-auto max-w-2xl space-y-6">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold lg:text-3xl">
                        Build your snippet library
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Join thousands of developers organizing and sharing code
                        snippets.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                      <Link href="/auth/signin" className="sm:w-auto">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto shadow-lg"
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Get Started Free
                        </Button>
                      </Link>
                      <Link href="/explore" className="sm:w-auto">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          <Code className="mr-2 h-5 w-5" />
                          Explore More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </motion.div>
      </div>
    </div>
  );
}
