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
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Bell,
  Monitor,
  Sun,
  Moon,
  Save,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  Shield,
  Zap,
  User,
  Globe,
  Code,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import {
  LazyCodeBlock,
  LazyCombobox,
} from "@/components/dashboard/LazyComponents";
import ThemeButton from "@/components/dashboard/settings/ThemeButton";
import PreferenceToggle from "@/components/dashboard/settings/PreferenceToggle";
interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  children: React.ReactNode;
  hasChanges?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
}

const SettingsSection = ({
  title,
  description,
  icon: Icon,
  iconColor,
  children,
  hasChanges,
  onSave,
  isSaving,
  saveLabel = "Save Changes",
}: SettingsSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="overflow-hidden border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                iconColor,
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            </div>
          </div>
          <AnimatePresence>
            {hasChanges && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Badge
                  variant="secondary"
                  className="text-xs bg-amber-100 text-amber-800 border-amber-200"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Unsaved
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        {onSave && (
          <>
            <Separator />
            <div className="flex items-center justify-end">
              <Button
                onClick={onSave}
                disabled={!hasChanges || isSaving}
                size="sm"
                className="min-w-[120px]"
              >
                <AnimatePresence mode="wait">
                  {isSaving ? (
                    <motion.div
                      key="saving"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="save"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saveLabel}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-10 bg-muted/50 rounded-xl w-64 animate-pulse" />
          <div className="h-6 bg-muted/30 rounded-lg w-96 animate-pulse" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 bg-muted/20 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 max-w-md"
    >
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-destructive">Settings Error</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{error}</p>
      </div>
    </motion.div>
  </div>
);

const UnauthenticatedState = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 max-w-md"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <User className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Authentication Required</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Please sign in to access your personalized settings and preferences.
        </p>
      </div>
    </motion.div>
  </div>
);

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
    theme: "auto" as "auto" | "light" | "dark",
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

  const [themeList, setThemeList] = useState<
    Array<{ value: string; label: string; category: string }>
  >([]);

  useEffect(() => {
    if (settings) {
      setFormData({
        theme:
          (settings.layoutSettings?.theme as "auto" | "light" | "dark") ||
          "auto",
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

  // Load theme list
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

  // Handlers
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

  // Save functions
  const saveThemeSettings = useCallback(async () => {
    setSaveStates((prev) => ({ ...prev, theme: true }));
    try {
      await updateLayoutSettings({ theme: formData.theme });
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

  // Render states
  if (status === "loading" || loading) return <LoadingSkeleton />;
  if (status === "unauthenticated") return <UnauthenticatedState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="space-y-8">
        <SettingsSection
          title="Theme & Appearance"
          description="Choose your preferred theme and code highlighting"
          icon={Palette}
          iconColor="bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-600"
          hasChanges={unsavedChanges.theme}
          onSave={saveThemeSettings}
          isSaving={saveStates.theme}
          saveLabel="Save Theme"
        >
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Application Theme
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="space-y-4">
              <Label className="text-base font-semibold">
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Preview</Label>
                <Badge variant="outline" className="text-xs">
                  <Code className="w-3 h-3 mr-1" />
                  {formData.codeTheme}
                </Badge>
              </div>
              <motion.div
                layout
                className="border rounded-xl overflow-hidden shadow-sm"
              >
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
              </motion.div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="SEO & Metadata"
          description="Configure default metadata for your public snippets"
          icon={Globe}
          iconColor="bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-green-600"
          hasChanges={unsavedChanges.seo}
          onSave={saveSeoSettings}
          isSaving={saveStates.seo}
          saveLabel="Save SEO"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="seo-title" className="text-base font-semibold">
                Default SEO Title
              </Label>
              <Input
                id="seo-title"
                value={formData.seoTitle}
                onChange={(e) => handleSeoChange("seoTitle", e.target.value)}
                placeholder="My Code Snippets"
                className="h-12"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="seo-description"
                className="text-base font-semibold"
              >
                Default SEO Description
              </Label>
              <Textarea
                id="seo-description"
                value={formData.seoDescription}
                onChange={(e) =>
                  handleSeoChange("seoDescription", e.target.value)
                }
                placeholder="Collection of useful code snippets"
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="seo-keywords" className="text-base font-semibold">
                SEO Keywords
              </Label>
              <Input
                id="seo-keywords"
                value={formData.seoKeywords}
                onChange={(e) => handleSeoChange("seoKeywords", e.target.value)}
                placeholder="code, programming, snippets"
                className="h-12"
              />
              <p className="text-sm text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Preferences"
          description="Manage your notification and privacy settings"
          icon={Shield}
          iconColor="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600"
          hasChanges={unsavedChanges.preferences}
          onSave={savePreferences}
          isSaving={saveStates.preferences}
          saveLabel="Save Preferences"
        >
          <div className="space-y-4">
            <PreferenceToggle
              title="Email Notifications"
              description="Receive updates about your account and snippets"
              checked={formData.notifications}
              onChange={(checked) =>
                handlePreferenceChange("notifications", checked)
              }
              icon={Bell}
            />

            <PreferenceToggle
              title="Usage Analytics"
              description="Help improve the service with anonymous usage data"
              checked={formData.analytics}
              onChange={(checked) =>
                handlePreferenceChange("analytics", checked)
              }
              icon={Zap}
            />

            <PreferenceToggle
              title="Likes Feature"
              description="Enable like functionality on shared snippets"
              checked={formData.likes}
              onChange={(checked) => handlePreferenceChange("likes", checked)}
              icon={Eye}
            />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
