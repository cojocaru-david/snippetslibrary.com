"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Copy,
  Check,
  ExternalLink,
  Save,
  AlertCircle,
  Code,
  Eye,
  FileText,
  Hash,
  Loader2,
  Wand2,
  Share2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/CodeBlock";
import { ShareDialog } from "@/components/ShareDialog";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { getAllLanguages } from "@/lib/shiki";
import toast from "react-hot-toast";
import type { SnippetFormData, SnippetModalProps } from "@/types";
import { snippetSchema } from "@/types";

const ALL_LANGUAGE_OPTIONS = getAllLanguages();
const ALL_LANGUAGES = ALL_LANGUAGE_OPTIONS.map((lang) => lang.value);

const detectLanguageAPI = async (
  code: string,
  filename?: string,
): Promise<string> => {
  try {
    const response = await fetch("/api/detect-language", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, filename }),
    });

    if (!response.ok) {
      throw new Error("Failed to detect language");
    }

    const result = await response.json();
    return result.language || "javascript";
  } catch (error) {
    console.warn("Language detection API failed:", error);
    return detectLanguageFallback(code);
  }
};

const detectLanguageFallback = (code: string): string => {
  if (!code || code.trim().length < 10) return "javascript";

  const sample = code.slice(0, 200).toLowerCase();

  if (sample.includes("<!doctype") || sample.includes("<html")) return "html";
  if (sample.includes("<?php")) return "php";
  if (sample.startsWith("#!/bin/bash")) return "bash";
  if (sample.includes("package main") && sample.includes("func main"))
    return "go";
  if (sample.includes("def ") && sample.includes("import ")) return "python";
  if (sample.includes("public class") || sample.includes("import java"))
    return "java";
  if (sample.includes("interface ") && sample.includes("type "))
    return "typescript";
  if (
    sample.includes("function ") ||
    sample.includes("const ") ||
    sample.includes("=>")
  )
    return "javascript";

  return "text";
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function SnippetModal({
  isOpen,
  onClose,
  onSuccess,
  snippet,
  mode = "create",
}: SnippetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [hasManuallySelectedLanguage, setHasManuallySelectedLanguage] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    mode: "onChange",
    defaultValues: {
      title: snippet?.title ?? "",
      description: snippet?.description ?? "",
      code: snippet?.code ?? "",
      language: snippet?.language || "javascript",
      tags: snippet?.tags?.join(", ") || "",
      isPublic: snippet?.isPublic || false,
    },
  });

  const watchedValues = watch();
  const debouncedCode = useDebounce(watchedValues.code, 2000);

  const codeLength = useMemo(
    () => watchedValues.code?.length || 0,
    [watchedValues.code],
  );
  const titleLength = useMemo(
    () => watchedValues.title?.length || 0,
    [watchedValues.title],
  );
  const isViewMode = useMemo(() => mode === "view", [mode]);

  useEffect(() => {
    if (snippet) {
      const values = {
        title: snippet.title,
        description: snippet.description || "",
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags?.join(", ") || "",
        isPublic: snippet.isPublic,
      };
      reset(values);
      setHasManuallySelectedLanguage(!!snippet.language);

      if (snippet.shareId && snippet.isPublic) {
        setShareUrl(`${window.location.origin}/share/${snippet.shareId}`);
      }
    }
  }, [snippet, reset]);

  useEffect(() => {
    if (watchedValues.isPublic && snippet?.shareId) {
      setShareUrl(`${window.location.origin}/share/${snippet.shareId}`);
    } else if (!watchedValues.isPublic) {
      setShareUrl("");
    }
  }, [watchedValues.isPublic, snippet?.shareId]);

  const handleManualDetection = useCallback(async () => {
    if (!watchedValues.code) return;

    setIsDetectingLanguage(true);

    try {
      const detected = await detectLanguageAPI(watchedValues.code);
      if (
        detected &&
        detected !== watchedValues.language &&
        ALL_LANGUAGES.includes(detected)
      ) {
        setValue("language", detected);
        setHasManuallySelectedLanguage(true);
        toast.success(`Language detected: ${detected}`, { duration: 2000 });
      }
    } catch (error) {
      console.warn("Manual language detection failed:", error);
      toast.error("Failed to detect language");
    } finally {
      setIsDetectingLanguage(false);
    }
  }, [watchedValues.code, watchedValues.language, setValue]);

  useEffect(() => {
    if (
      debouncedCode &&
      debouncedCode.length > 50 &&
      !hasManuallySelectedLanguage &&
      (!watchedValues.language || watchedValues.language === "javascript")
    ) {
      detectLanguageAPI(debouncedCode)
        .then((detected) => {
          if (
            detected !== watchedValues.language &&
            detected !== "text" &&
            ALL_LANGUAGES.includes(detected)
          ) {
            setValue("language", detected);
          }
        })
        .catch(console.warn);
    }
  }, [
    debouncedCode,
    setValue,
    watchedValues.language,
    hasManuallySelectedLanguage,
  ]);

  const handleClose = useCallback(() => {
    reset();
    setShareUrl("");
    setViewMode("edit");
    setHasManuallySelectedLanguage(false);
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(
    async (data: SnippetFormData) => {
      setIsSubmitting(true);

      try {
        const payload = {
          ...data,
          tags: data.tags
            ? data.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : [],
        };

        const url =
          mode === "edit" && snippet
            ? `/api/snippets/${snippet.id}`
            : "/api/snippets";

        const method = mode === "edit" ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to save snippet");
        }

        const savedSnippet = await response.json();

        if (savedSnippet.shareId && savedSnippet.isPublic) {
          setShareUrl(
            `${window.location.origin}/share/${savedSnippet.shareId}`,
          );
        }

        toast.success(
          mode === "edit"
            ? "Snippet updated successfully!"
            : "Snippet created successfully!",
        );
        onSuccess?.();
        handleClose();
      } catch (error) {
        console.error("Error saving snippet:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to save snippet",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [mode, snippet, handleClose, onSuccess],
  );

  const copyShareUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success("Share URL copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const openShareUrl = () => {
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleGenerateShareLink = async (
    snippetId: string,
  ): Promise<string> => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate share link");
      }

      const updatedSnippet = await response.json();
      const shareId = updatedSnippet.shareId;

      if (!shareId) {
        throw new Error("Failed to generate share ID");
      }

      setValue("isPublic", true);
      return shareId;
    } catch (error) {
      console.error("Error generating share link:", error);
      throw error;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        handleClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (isValid && !isSubmitting) {
          handleSubmit(onSubmit)();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setViewMode((prev) => (prev === "preview" ? "edit" : "preview"));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isValid, isSubmitting, handleSubmit, handleClose, onSubmit]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-5xl h-[90vh] flex flex-col p-0"
        aria-describedby={
          mode === "view"
            ? "view-snippet-description"
            : "edit-snippet-description"
        }
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {mode === "create" && (
                  <>
                    <Code className="h-5 w-5" />
                    Create New Snippet
                  </>
                )}
                {mode === "edit" && (
                  <>
                    <FileText className="h-5 w-5" />
                    Edit Snippet
                  </>
                )}
                {mode === "view" && (
                  <>
                    <Eye className="h-5 w-5" />
                    View Snippet
                  </>
                )}
              </DialogTitle>
              <DialogDescription
                id={
                  mode === "view"
                    ? "view-snippet-description"
                    : "edit-snippet-description"
                }
                className="text-sm"
              >
                {mode === "create" &&
                  "Create a new code snippet for your library"}
                {mode === "edit" && "Update your code snippet"}
                {mode === "view" && "View snippet details and copy code"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium flex items-center gap-2"
              >
                Title *
                <span className="text-xs text-muted-foreground">
                  ({titleLength}/200)
                </span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter a descriptive title for your snippet..."
                disabled={isViewMode}
                className={cn(
                  "transition-colors",
                  errors.title &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe what this snippet does..."
                disabled={isViewMode}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="text-sm font-medium">
                  Programming Language *
                </Label>
                {!isViewMode && watchedValues.code && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleManualDetection}
                    disabled={isDetectingLanguage}
                    className="h-7 px-2 text-xs"
                  >
                    {isDetectingLanguage ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Wand2 className="h-3 w-3 mr-1" />
                    )}
                    Auto-detect
                  </Button>
                )}
              </div>
              <Combobox
                options={ALL_LANGUAGE_OPTIONS}
                value={watchedValues.language}
                onValueChange={(value) => {
                  setValue("language", value);
                  setHasManuallySelectedLanguage(true);
                }}
                placeholder="Select programming language"
                searchPlaceholder="Search languages..."
                emptyText="No language found."
                disabled={isViewMode}
                groupByCategory={true}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label
                htmlFor="tags"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Hash className="h-4 w-4" />
                Tags
              </Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="react, hooks, utility, typescript..."
                disabled={isViewMode}
              />
            </div>

            {/* Code Editor/Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="code"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  Code *
                  <span className="text-xs text-muted-foreground">
                    ({codeLength.toLocaleString()}/50,000)
                  </span>
                </Label>
                {!isViewMode &&
                  watchedValues.code &&
                  watchedValues.language && (
                    <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                      <Button
                        type="button"
                        variant={viewMode === "edit" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("edit")}
                        className="h-7 px-2 text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant={viewMode === "preview" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("preview")}
                        className="h-7 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  )}
              </div>

              {viewMode === "preview" &&
              watchedValues.code &&
              watchedValues.language ? (
                <div className="border rounded-lg overflow-hidden">
                  <CodeBlock
                    code={watchedValues.code}
                    language={watchedValues.language}
                    title={watchedValues.title || "Preview"}
                    showCopyButton={true}
                    showDownloadButton={false}
                    showExpandButton={true}
                    maxHeight="400px"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    id="code"
                    {...register("code")}
                    placeholder="Paste your code here..."
                    disabled={isViewMode}
                    rows={8}
                    className={cn(
                      "font-mono text-sm leading-relaxed resize-none max-h-[300px] overflow-y-auto",
                      errors.code && "border-destructive",
                    )}
                  />
                  {errors.code && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.code.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Public/Private Toggle */}
            <div className="bg-muted/50 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isPublic" className="text-base font-medium">
                    Make Public
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Public snippets can be shared with others
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={watchedValues.isPublic}
                  onCheckedChange={(checked) => setValue("isPublic", checked)}
                  disabled={isViewMode}
                />
              </div>
            </div>

            {/* Share URL */}
            {watchedValues.isPublic && shareUrl && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                <Label className="text-sm font-medium text-primary">
                  Share URL
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="text-sm bg-background"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyShareUrl}
                    className="flex-shrink-0"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openShareUrl}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <Separator />
          <div className="px-6 py-4 bg-muted/30 shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {!isViewMode && (
                  <>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                      Ctrl+S
                    </kbd>{" "}
                    to save •
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs mx-1">
                      Esc
                    </kbd>{" "}
                    to close
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Share button for edit and view modes */}
                {(mode === "edit" || mode === "view") && snippet && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowShareDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={handleClose}>
                  {isViewMode ? "Close" : "Cancel"}
                </Button>
                {!isViewMode && (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {mode === "edit" ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {mode === "edit" ? "Update" : "Create"}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </DialogContent>

      {/* Share Dialog */}
      {snippet && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          snippet={{
            id: snippet.id,
            title: snippet.title,
            description: snippet.description,
            shareId: snippet.shareId,
            isPublic: snippet.isPublic,
          }}
          onGenerateShareLink={handleGenerateShareLink}
        />
      )}
    </Dialog>
  );
}
