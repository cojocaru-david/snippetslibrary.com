"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Palette,
  Search,
  Bell,
  Monitor,
  Sun,
  Moon,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  LazyCodeBlock,
  LazyCombobox,
} from "@/components/dashboard/LazyComponents";
import ThemeButton from "@/components/dashboard/settings/ThemeButton";
import PreferenceToggle from "@/components/dashboard/settings/PreferenceToggle";

export default function SettingsPage() {
  const { status } = useSession();
  const {
    settings,
    loading,
    error,
    updateCodeBlockSettings,
    updateLayoutSettings,
    updateSeoSettings,
    updateUserPreferences,
  } = useSettings();

  const [formData, setFormData] = useState({
    theme: "auto",
    codeTheme: "github-dark",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    notifications: true,
    analytics: true,
    likes: true,
  });

  const [saveStates, setSaveStates] = useState({
    theme: false,
    seo: false,
    preferences: false,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState({
    theme: false,
    seo: false,
    preferences: false,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.layoutSettings?.theme || "auto",
        codeTheme: settings.codeBlockSettings?.theme || "github-dark",
        seoTitle: settings.seoSettings?.title || "",
        seoDescription: settings.seoSettings?.description || "",
        seoKeywords: settings.seoSettings?.keywords?.join(", ") || "",
        notifications: settings.userPreferences?.notifications ?? true,
        analytics: settings.userPreferences?.analytics ?? true,
        likes: settings.userPreferences?.likes ?? true,
      });
    }
  }, [settings]);

  const unsavedChanges = useMemo(() => {
    if (!settings) return { theme: false, seo: false, preferences: false };

    return {
      theme:
        formData.theme !== (settings.layoutSettings?.theme || "auto") ||
        formData.codeTheme !==
          (settings.codeBlockSettings?.theme || "github-dark"),
      seo:
        formData.seoTitle !== (settings.seoSettings?.title || "") ||
        formData.seoDescription !== (settings.seoSettings?.description || "") ||
        formData.seoKeywords !==
          (settings.seoSettings?.keywords?.join(", ") || ""),
      preferences:
        formData.notifications !==
          (settings.userPreferences?.notifications ?? true) ||
        formData.analytics !== (settings.userPreferences?.analytics ?? true) ||
        formData.likes !== (settings.userPreferences?.likes ?? true),
    };
  }, [formData, settings]);

  useEffect(() => {
    setHasUnsavedChanges(unsavedChanges);
  }, [unsavedChanges]);

  const handleThemeChange = useCallback((theme: "light" | "dark" | "auto") => {
    setFormData((prev) => ({ ...prev, theme }));
  }, []);

  const handleCodeThemeChange = useCallback((codeTheme: string) => {
    setFormData((prev) => ({ ...prev, codeTheme }));
  }, []);

  const handleSeoChange = useCallback(
    (field: "seoTitle" | "seoDescription" | "seoKeywords", value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handlePreferenceChange = useCallback(
    (field: "notifications" | "analytics" | "likes", value: boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const saveThemeSettings = useCallback(async () => {
    setSaveStates((prev) => ({ ...prev, theme: true }));
    try {
      await updateLayoutSettings({
        theme: formData.theme as "auto" | "light" | "dark",
      });

      await updateCodeBlockSettings({ theme: formData.codeTheme });

      toast.success("Theme settings saved successfully!");
    } catch {
      toast.error("Failed to save theme settings");
    } finally {
      setSaveStates((prev) => ({ ...prev, theme: false }));
    }
  }, [
    formData.theme,
    formData.codeTheme,
    updateLayoutSettings,
    updateCodeBlockSettings,
  ]);

  const saveSeoSettings = useCallback(async () => {
    setSaveStates((prev) => ({ ...prev, seo: true }));
    try {
      const keywords = formData.seoKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      await updateSeoSettings({
        title: formData.seoTitle,
        description: formData.seoDescription,
        keywords,
      });
      toast.success("SEO settings saved successfully!");
    } catch {
      toast.error("Failed to save SEO settings");
    } finally {
      setSaveStates((prev) => ({ ...prev, seo: false }));
    }
  }, [
    formData.seoTitle,
    formData.seoDescription,
    formData.seoKeywords,
    updateSeoSettings,
  ]);

  const savePreferences = useCallback(async () => {
    setSaveStates((prev) => ({ ...prev, preferences: true }));
    try {
      await updateUserPreferences({
        notifications: formData.notifications,
        analytics: formData.analytics,
        likes: formData.likes,
      });
      toast.success("Preferences saved successfully!");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSaveStates((prev) => ({ ...prev, preferences: false }));
    }
  }, [
    formData.notifications,
    formData.analytics,
    formData.likes,
    updateUserPreferences,
  ]);

  const themeOptions = useMemo(
    () => [
      { value: "light" as const, label: "Light", icon: Sun },
      { value: "dark" as const, label: "Dark", icon: Moon },
      { value: "auto" as const, label: "System", icon: Monitor },
    ],
    [],
  );

  const [themeList, setThemeList] = useState<
    Array<{ value: string; label: string; category: string }>
  >([]);

  useEffect(() => {
    import("@/lib/shiki")
      .then(({ getAllThemes }) => {
        setThemeList(getAllThemes());
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.error("Failed to load themes");
      });
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded-lg w-64 animate-pulse" />
            <div className="h-5 bg-muted rounded w-96 animate-pulse" />
          </div>

          <div className="space-y-6">
            <div className="h-96 bg-muted rounded-xl animate-pulse" />
            <div className="h-64 bg-muted rounded-xl animate-pulse" />
            <div className="h-48 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground max-w-md">
            Please sign in to access your settings.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-destructive">
            Settings Error
          </h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience and preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle>Theme & Appearance</CardTitle>
                <CardDescription>
                  Choose your preferred theme and code highlighting
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Application Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map(({ value, label, icon }) => (
                  <ThemeButton
                    key={value}
                    value={value}
                    label={label}
                    icon={icon}
                    selected={formData.theme === value}
                    onClick={() => handleThemeChange(value)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Code Highlighting Theme
              </Label>
              <LazyCombobox
                options={themeList}
                value={formData.codeTheme}
                onValueChange={handleCodeThemeChange}
                placeholder="Select code theme"
                searchPlaceholder="Search themes..."
                emptyText="No theme found."
                groupByCategory={true}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-3 py-2 border-b flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {formData.codeTheme}
                  </Badge>
                </div>
                <LazyCodeBlock
                  code={`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}
                  language="javascript"
                  title=""
                  highlightTheme={formData.codeTheme}
                  showCopyButton={false}
                  showDownloadButton={false}
                  showExpandButton={false}
                  maxHeight="150px"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {hasUnsavedChanges.theme && (
                  <span className="text-amber-600">Unsaved changes</span>
                )}
              </div>
              <Button
                onClick={saveThemeSettings}
                disabled={!hasUnsavedChanges.theme || saveStates.theme}
                size="sm"
              >
                {saveStates.theme ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Theme
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Search className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <CardTitle>SEO & Metadata</CardTitle>
                <CardDescription>
                  Configure default metadata for your public snippets
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="seo-title" className="text-sm font-medium">
                Default SEO Title
              </Label>
              <Input
                id="seo-title"
                value={formData.seoTitle}
                onChange={(e) => handleSeoChange("seoTitle", e.target.value)}
                placeholder="My Code Snippets"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="seo-description" className="text-sm font-medium">
                Default SEO Description
              </Label>
              <Textarea
                id="seo-description"
                value={formData.seoDescription}
                onChange={(e) =>
                  handleSeoChange("seoDescription", e.target.value)
                }
                placeholder="Collection of useful code snippets"
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="seo-keywords" className="text-sm font-medium">
                SEO Keywords
              </Label>
              <Input
                id="seo-keywords"
                value={formData.seoKeywords}
                onChange={(e) => handleSeoChange("seoKeywords", e.target.value)}
                placeholder="code, programming, snippets"
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {hasUnsavedChanges.seo && (
                  <span className="text-amber-600">Unsaved changes</span>
                )}
              </div>
              <Button
                onClick={saveSeoSettings}
                disabled={!hasUnsavedChanges.seo || saveStates.seo}
                size="sm"
              >
                {saveStates.seo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save SEO
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Manage your notification and privacy settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <PreferenceToggle
              title="Email Notifications"
              description="Receive updates about your account and snippets"
              checked={formData.notifications}
              onChange={(checked) =>
                handlePreferenceChange("notifications", checked)
              }
            />

            <PreferenceToggle
              title="Usage Analytics"
              description="Help improve the service with anonymous usage data"
              checked={formData.analytics}
              onChange={(checked) =>
                handlePreferenceChange("analytics", checked)
              }
            />

            <PreferenceToggle
              title="Likes Feature"
              description="Enable like functionality on shared snippets"
              checked={formData.likes}
              onChange={(checked) => handlePreferenceChange("likes", checked)}
            />

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {hasUnsavedChanges.preferences && (
                  <span className="text-amber-600">Unsaved changes</span>
                )}
              </div>
              <Button
                onClick={savePreferences}
                disabled={
                  !hasUnsavedChanges.preferences || saveStates.preferences
                }
                size="sm"
              >
                {saveStates.preferences ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
