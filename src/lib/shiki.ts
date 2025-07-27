import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
  type BundledTheme,
  bundledLanguages,
  bundledThemes,
} from "shiki";

const CORE_THEMES: BundledTheme[] = ["github-dark", "github-light"];

const CORE_LANGUAGES: BundledLanguage[] = [
  "javascript",
  "typescript",
  "html",
  "css",
  "json",
  "markdown",
];

const POPULAR_THEMES: BundledTheme[] = [
  "monokai",
  "one-dark-pro",
  "dracula",
  "nord",
  "material-theme-darker",
  "material-theme-lighter",
  "catppuccin-mocha",
  "catppuccin-latte",
  "tokyo-night",
  "vitesse-dark",
  "vitesse-light",
  "ayu-dark",
  "dark-plus",
  "light-plus",
];

const POPULAR_LANGUAGES: BundledLanguage[] = [
  "python",
  "bash",
  "java",
  "c",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "go",
  "rust",
  "sql",
  "yaml",
  "xml",
  "dockerfile",
  "shell",
];

const CACHE_MAX_SIZE = 200;
const CACHE_TTL = 1000 * 60 * 10;
const CACHE_CLEANUP_INTERVAL = 1000 * 60 * 5;

interface CacheEntry {
  content: string;
  timestamp: number;
  language: string;
  theme: string;
  hits: number;
}

class ShikiCache {
  private cache = new Map<string, CacheEntry>();
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    if (typeof window !== "undefined") {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, CACHE_CLEANUP_INTERVAL);
    }
  }

  get(key: string): string | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    entry.timestamp = Date.now();

    return entry.content;
  }

  set(key: string, content: string, language: string, theme: string): void {
    if (this.cache.size >= CACHE_MAX_SIZE) {
      this.evictLRU();
    }

    this.cache.set(key, {
      content,
      timestamp: Date.now(),
      language,
      theme,
      hits: 1,
    });
  }

  private evictLRU(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort(
      (a, b) => a[1].hits - b[1].hits || a[1].timestamp - b[1].timestamp,
    );

    const toRemove = Math.floor(CACHE_MAX_SIZE * 0.3);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        toDelete.push(key);
      }
    }

    toDelete.forEach((key) => this.cache.delete(key));
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; maxSize: number; hitRate?: number } {
    return {
      size: this.cache.size,
      maxSize: CACHE_MAX_SIZE,
    };
  }

  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

const LANGUAGE_FALLBACKS: Record<string, BundledLanguage> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  py: "python",
  rb: "ruby",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  json5: "json",
  jsonc: "json",
  vue: "html",
  svelte: "html",
  astro: "html",
  dockerfile: "docker",
  makefile: "make",
  toml: "ini",
  conf: "ini",
  config: "ini",
};

class ShikiService {
  private static instance: ShikiService;
  private highlighter: Highlighter | null = null;
  private initPromise: Promise<void> | null = null;
  private isInitializing = false;
  private cache = new ShikiCache();
  private loadedLanguages = new Set<string>();
  private loadedThemes = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();

  private constructor() {}

  static getInstance(): ShikiService {
    if (!ShikiService.instance) {
      ShikiService.instance = new ShikiService();
    }
    return ShikiService.instance;
  }

  async getHighlighter(): Promise<Highlighter> {
    if (this.highlighter) {
      return this.highlighter;
    }

    if (!this.initPromise && !this.isInitializing) {
      this.initPromise = this.initializeHighlighter();
    }

    await this.initPromise;

    if (!this.highlighter) {
      throw new Error("Failed to initialize Shiki highlighter");
    }

    return this.highlighter;
  }

  private async initializeHighlighter(): Promise<void> {
    this.isInitializing = true;
    try {
      this.highlighter = await createHighlighter({
        themes: CORE_THEMES,
        langs: CORE_LANGUAGES,
      });

      CORE_THEMES.forEach((theme) => this.loadedThemes.add(theme));
      CORE_LANGUAGES.forEach((lang) => this.loadedLanguages.add(lang));

      console.log(
        "Shiki highlighter initialized with core themes and languages",
      );
    } catch (error) {
      console.error("Failed to initialize Shiki highlighter:", error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  async highlight(
    code: string,
    language: string,
    theme: string,
  ): Promise<string> {
    if (!code || typeof code !== "string") {
      return "<pre><code></code></pre>";
    }

    if (code.length > 30000) {
      console.warn("Code is very long, using fallback highlighting");
      return this.createFallbackHighlight(code, language);
    }

    const cacheKey = this.createCacheKey(code, language, theme);

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const highlighter = await this.getHighlighter();

      const shikiLanguage = this.resolveLanguage(language);
      const validTheme = this.resolveTheme(theme);

      await Promise.all([
        this.ensureLanguageLoaded(highlighter, shikiLanguage),
        this.ensureThemeLoaded(highlighter, validTheme),
      ]);

      const finalLanguage = this.getFinalLanguage(highlighter, shikiLanguage);
      const finalTheme = this.getFinalTheme(highlighter, validTheme);

      const result = highlighter.codeToHtml(code, {
        lang: finalLanguage,
        theme: finalTheme,
        transformers: [
          {
            pre(node) {
              this.addClassToHast(node, "shiki-highlighted");
              return node;
            },
            code(node) {
              this.addClassToHast(node, "shiki-code");
              return node;
            },
          },
        ],
      });

      this.cache.set(cacheKey, result, finalLanguage, finalTheme);

      return result;
    } catch (error) {
      console.error("Failed to highlight code:", error);
      return this.createFallbackHighlight(code, language);
    }
  }

  async getThemeColors(theme: string): Promise<{ bg: string; fg: string }> {
    try {
      const highlighter = await this.getHighlighter();
      const validTheme = this.resolveTheme(theme);

      await this.ensureThemeLoaded(highlighter, validTheme);

      const finalTheme = this.getFinalTheme(highlighter, validTheme);
      const themeData = highlighter.getTheme(finalTheme);

      const bg =
        themeData.colors?.["editor.background"] ||
        themeData.bg ||
        this.getDefaultBackgroundColor(finalTheme);

      const fg =
        themeData.colors?.["editor.foreground"] ||
        themeData.fg ||
        this.getDefaultForegroundColor(finalTheme);

      return { bg, fg };
    } catch (error) {
      console.warn("Failed to get theme colors:", error);
      return this.getDefaultThemeColors(theme);
    }
  }

  private async ensureLanguageLoaded(
    highlighter: Highlighter,
    language: BundledLanguage,
  ): Promise<void> {
    if (this.loadedLanguages.has(language)) return;

    const loadKey = `lang-${language}`;
    if (this.loadingPromises.has(loadKey)) {
      await this.loadingPromises.get(loadKey);
      return;
    }

    const loadPromise = this.loadLanguage(highlighter, language);
    this.loadingPromises.set(loadKey, loadPromise);

    try {
      await loadPromise;
    } finally {
      this.loadingPromises.delete(loadKey);
    }
  }

  private async loadLanguage(
    highlighter: Highlighter,
    language: BundledLanguage,
  ): Promise<void> {
    try {
      await highlighter.loadLanguage(language);
      this.loadedLanguages.add(language);
    } catch (error) {
      console.warn(`Failed to load language '${language}':`, error);
    }
  }

  private async ensureThemeLoaded(
    highlighter: Highlighter,
    theme: BundledTheme,
  ): Promise<void> {
    if (this.loadedThemes.has(theme)) return;

    const loadKey = `theme-${theme}`;
    if (this.loadingPromises.has(loadKey)) {
      await this.loadingPromises.get(loadKey);
      return;
    }

    const loadPromise = this.loadTheme(highlighter, theme);
    this.loadingPromises.set(loadKey, loadPromise);

    try {
      await loadPromise;
    } finally {
      this.loadingPromises.delete(loadKey);
    }
  }

  private async loadTheme(
    highlighter: Highlighter,
    theme: BundledTheme,
  ): Promise<void> {
    try {
      await highlighter.loadTheme(theme);
      this.loadedThemes.add(theme);
    } catch (error) {
      console.warn(`Failed to load theme '${theme}':`, error);
    }
  }

  private resolveLanguage(language: string): BundledLanguage {
    const normalizedLang = language.toLowerCase().trim();

    if (normalizedLang in bundledLanguages) {
      return normalizedLang as BundledLanguage;
    }

    if (normalizedLang in LANGUAGE_FALLBACKS) {
      return LANGUAGE_FALLBACKS[normalizedLang];
    }

    const availableLanguages = Object.keys(bundledLanguages);
    const partialMatch = availableLanguages.find(
      (lang) => lang.includes(normalizedLang) || normalizedLang.includes(lang),
    );

    if (partialMatch) {
      return partialMatch as BundledLanguage;
    }

    return "text" as BundledLanguage;
  }

  private resolveTheme(theme: string): BundledTheme {
    const normalizedTheme = theme.toLowerCase().trim();

    if (normalizedTheme in bundledThemes) {
      return normalizedTheme as BundledTheme;
    }

    const availableThemes = Object.keys(bundledThemes);
    const partialMatch = availableThemes.find(
      (t) => t.includes(normalizedTheme) || normalizedTheme.includes(t),
    );

    if (partialMatch) {
      return partialMatch as BundledTheme;
    }

    if (normalizedTheme.includes("dark") || normalizedTheme.includes("night")) {
      return "github-dark";
    } else if (normalizedTheme.includes("light")) {
      return "github-light";
    }

    return "github-dark";
  }

  private getFinalLanguage(
    highlighter: Highlighter,
    preferredLanguage: BundledLanguage,
  ): BundledLanguage {
    return this.loadedLanguages.has(preferredLanguage)
      ? preferredLanguage
      : ("text" as BundledLanguage);
  }

  private getFinalTheme(
    highlighter: Highlighter,
    preferredTheme: BundledTheme,
  ): BundledTheme {
    if (this.loadedThemes.has(preferredTheme)) {
      return preferredTheme;
    }

    const fallbacks: BundledTheme[] = ["github-dark", "github-light"];

    for (const fallback of fallbacks) {
      if (this.loadedThemes.has(fallback)) {
        return fallback;
      }
    }

    const loadedThemesArray = Array.from(this.loadedThemes);
    return (loadedThemesArray[0] as BundledTheme) || "github-dark";
  }

  private createCacheKey(
    code: string,
    language: string,
    theme: string,
  ): string {
    const content = `${language}:${theme}:${code.substring(0, 40)}:${code.length}`;
    return btoa(encodeURIComponent(content))
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 20);
  }

  private createFallbackHighlight(code: string, language: string): string {
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    return `<pre class="shiki-fallback" style="background-color: var(--color-muted); color: var(--color-foreground); padding: 1rem; border-radius: 6px; overflow: auto; font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;"><code data-language="${language}">${escapedCode}</code></pre>`;
  }

  private getDefaultBackgroundColor(theme: string): string {
    const isDark =
      theme.includes("dark") ||
      theme.includes("night") ||
      theme.includes("monokai");
    return isDark ? "#0d1117" : "#ffffff";
  }

  private getDefaultForegroundColor(theme: string): string {
    const isDark =
      theme.includes("dark") ||
      theme.includes("night") ||
      theme.includes("monokai");
    return isDark ? "#c9d1d9" : "#24292f";
  }

  private getDefaultThemeColors(theme: string): { bg: string; fg: string } {
    const isDark =
      theme.includes("dark") ||
      theme.includes("night") ||
      theme.includes("monokai");
    return {
      bg: isDark ? "#0d1117" : "#ffffff",
      fg: isDark ? "#c9d1d9" : "#24292f",
    };
  }

  getAvailableThemes(): {
    name: string;
    label: string;
    isDark: boolean;
    isLoaded: boolean;
  }[] {
    const allThemes = [...CORE_THEMES, ...POPULAR_THEMES];
    const uniqueThemes = [...new Set(allThemes)];

    return uniqueThemes
      .map((theme) => {
        const isDark =
          theme.includes("dark") ||
          theme.includes("night") ||
          theme.includes("monokai") ||
          theme.includes("dracula") ||
          theme.includes("nord");

        return {
          name: theme,
          label: theme
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          isDark,
          isLoaded: this.loadedThemes.has(theme),
        };
      })
      .sort((a, b) => {
        if (a.isLoaded !== b.isLoaded) {
          return a.isLoaded ? -1 : 1;
        }

        const aIsCoreTheme = CORE_THEMES.includes(a.name as BundledTheme);
        const bIsCoreTheme = CORE_THEMES.includes(b.name as BundledTheme);

        if (aIsCoreTheme !== bIsCoreTheme) {
          return aIsCoreTheme ? -1 : 1;
        }

        return a.label.localeCompare(b.label);
      });
  }

  getAvailableLanguages(): {
    name: string;
    label: string;
    isLoaded: boolean;
  }[] {
    const allLanguages = [...CORE_LANGUAGES, ...POPULAR_LANGUAGES];
    const uniqueLanguages = [...new Set(allLanguages)];

    return uniqueLanguages
      .map((lang) => ({
        name: lang,
        label: lang.charAt(0).toUpperCase() + lang.slice(1),
        isLoaded: this.loadedLanguages.has(lang),
      }))
      .sort((a, b) => {
        if (a.isLoaded !== b.isLoaded) {
          return a.isLoaded ? -1 : 1;
        }
        return a.label.localeCompare(b.label);
      });
  }

  async preloadPopular(): Promise<void> {
    if (!this.highlighter) return;

    try {
      const criticalThemes = POPULAR_THEMES.slice(0, 4);
      const criticalLangs = POPULAR_LANGUAGES.slice(0, 6);

      const themePromises = criticalThemes.map((theme) =>
        this.ensureThemeLoaded(this.highlighter!, theme),
      );
      const langPromises = criticalLangs.map((lang) =>
        this.ensureLanguageLoaded(this.highlighter!, lang),
      );

      await Promise.allSettled([...themePromises, ...langPromises]);
      console.log("Critical themes and languages preloaded");
    } catch (error) {
      console.warn("Failed to preload popular themes and languages:", error);
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log("Shiki cache cleared");
  }

  getCacheStats(): { size: number; maxSize: number; hitRate?: number } {
    return this.cache.getStats();
  }

  dispose(): void {
    if (this.highlighter) {
      this.highlighter.dispose();
      this.highlighter = null;
      this.initPromise = null;
      this.isInitializing = false;
    }
    this.cache.dispose();
    this.loadedLanguages.clear();
    this.loadedThemes.clear();
    this.loadingPromises.clear();
  }
}

export const shikiService = ShikiService.getInstance();

export function getAllLanguages(): {
  value: string;
  label: string;
  category: string;
}[] {
  const coreLanguages = CORE_LANGUAGES.map((lang) => ({
    value: lang,
    label: lang.charAt(0).toUpperCase() + lang.slice(1).replace(/[-_]/g, " "),
    category: "Core Languages",
  }));

  const popularLanguages = POPULAR_LANGUAGES.map((lang) => {
    let category = "Popular Languages";

    if (["python"].includes(lang)) {
      category = "Python";
    } else if (["java"].includes(lang)) {
      category = "JVM Languages";
    } else if (["c", "cpp", "csharp"].includes(lang)) {
      category = "C/C++/C#";
    } else if (["php", "ruby", "go", "rust"].includes(lang)) {
      category = "System Languages";
    } else if (["bash", "shell"].includes(lang)) {
      category = "Shell/Terminal";
    } else if (["sql"].includes(lang)) {
      category = "Databases";
    } else if (["yaml", "xml", "dockerfile"].includes(lang)) {
      category = "Configuration";
    } else {
      category = "Other Languages";
    }

    return {
      value: lang,
      label: lang.charAt(0).toUpperCase() + lang.slice(1).replace(/[-_]/g, " "),
      category,
    };
  });

  const allBundledLanguages = Object.keys(
    bundledLanguages,
  ) as BundledLanguage[];
  const coreAndPopularSet = new Set([...CORE_LANGUAGES, ...POPULAR_LANGUAGES]);

  const otherLanguages = allBundledLanguages
    .filter((lang) => !coreAndPopularSet.has(lang))
    .map((lang) => {
      let category = "Other Languages";

      if (["kotlin", "scala", "clojure", "groovy"].includes(lang)) {
        category = "JVM Languages";
      } else if (["swift", "objective-c", "objective-cpp"].includes(lang)) {
        category = "iOS/macOS";
      } else if (["dart", "flutter"].includes(lang)) {
        category = "Mobile";
      } else if (
        ["lua", "perl", "r", "julia", "matlab", "octave"].includes(lang)
      ) {
        category = "Scripting";
      } else if (
        ["haskell", "elm", "fsharp", "ocaml", "erlang", "elixir"].includes(lang)
      ) {
        category = "Functional";
      } else if (["assembly", "asm", "wasm"].includes(lang)) {
        category = "Assembly";
      } else if (["prolog", "scheme", "racket", "lisp"].includes(lang)) {
        category = "Logic/Lisp";
      } else if (["latex", "tex", "bibtex"].includes(lang)) {
        category = "Document";
      } else if (["graphql", "apollo"].includes(lang)) {
        category = "Query Languages";
      } else if (["nginx", "apache", "htaccess"].includes(lang)) {
        category = "Web Server";
      } else if (
        ["vue", "svelte", "astro", "solid", "angular", "react"].includes(lang)
      ) {
        category = "Frontend Frameworks";
      } else if (["prisma", "graphql", "cypher"].includes(lang)) {
        category = "Databases";
      } else if (["terraform", "bicep", "cloudformation"].includes(lang)) {
        category = "Infrastructure";
      } else if (["powershell", "batch", "cmd"].includes(lang)) {
        category = "Shell/Terminal";
      } else if (["ini", "properties", "cfg", "conf", "env"].includes(lang)) {
        category = "Configuration";
      } else if (["csv", "tsv", "log"].includes(lang)) {
        category = "Data";
      }

      return {
        value: lang,
        label:
          lang.charAt(0).toUpperCase() + lang.slice(1).replace(/[-_]/g, " "),
        category,
      };
    });

  return [...coreLanguages, ...popularLanguages, ...otherLanguages].sort(
    (a, b) => {
      if (a.category !== b.category) {
        if (a.category === "Core Languages") return -1;
        if (b.category === "Core Languages") return 1;
        if (
          a.category === "Popular Languages" ||
          a.category.includes("Popular")
        )
          return -1;
        if (
          b.category === "Popular Languages" ||
          b.category.includes("Popular")
        )
          return 1;
        return a.category.localeCompare(b.category);
      }
      return a.label.localeCompare(b.label);
    },
  );
}

export function getAllThemes(): {
  value: string;
  label: string;
  category: string;
}[] {
  const coreThemes = CORE_THEMES.map((theme) => ({
    value: theme,
    label: theme
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    category: "Core Themes",
  }));

  const popularThemes = POPULAR_THEMES.map((theme) => {
    let category = "Popular Themes";

    if (theme.includes("light")) {
      category = "Light Themes";
    } else if (theme.includes("dark")) {
      category = "Dark Themes";
    } else if (theme.includes("material")) {
      category = "Material Themes";
    } else if (theme.includes("catppuccin")) {
      category = "Catppuccin Themes";
    } else if (theme.includes("tokyo")) {
      category = "Tokyo Night Themes";
    }

    return {
      value: theme,
      label: theme
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      category,
    };
  });

  const allBundledThemes = Object.keys(bundledThemes) as BundledTheme[];
  const coreAndPopularSet = new Set([...CORE_THEMES, ...POPULAR_THEMES]);

  const otherThemes = allBundledThemes
    .filter((theme) => !coreAndPopularSet.has(theme))
    .map((theme) => {
      let category = "Other Themes";

      if (theme.includes("light") || theme.includes("day")) {
        category = "Light Themes";
      } else if (theme.includes("dark") || theme.includes("night")) {
        category = "Dark Themes";
      } else if (theme.includes("material")) {
        category = "Material Themes";
      } else if (theme.includes("catppuccin")) {
        category = "Catppuccin Themes";
      } else if (theme.includes("tokyo")) {
        category = "Tokyo Night Themes";
      } else if (theme.includes("solarized")) {
        category = "Solarized Themes";
      } else if (theme.includes("gruvbox")) {
        category = "Gruvbox Themes";
      } else if (theme.includes("one")) {
        category = "One Themes";
      } else if (theme.includes("monokai")) {
        category = "Monokai Themes";
      } else if (theme.includes("dracula")) {
        category = "Dracula Themes";
      } else if (theme.includes("nord")) {
        category = "Nord Themes";
      } else if (theme.includes("vitesse")) {
        category = "Vitesse Themes";
      } else if (theme.includes("ayu")) {
        category = "Ayu Themes";
      } else if (theme.includes("github")) {
        category = "GitHub Themes";
      } else if (theme.includes("vs") || theme.includes("visual")) {
        category = "Visual Studio Themes";
      } else if (theme.includes("sublime")) {
        category = "Sublime Themes";
      } else if (theme.includes("atom")) {
        category = "Atom Themes";
      } else if (theme.includes("slack")) {
        category = "Slack Themes";
      } else if (theme.includes("synthwave")) {
        category = "Synthwave Themes";
      } else if (theme.includes("laserwave")) {
        category = "Laserwave Themes";
      } else if (theme.includes("shades") || theme.includes("everforest")) {
        category = "Nature Themes";
      }

      return {
        value: theme,
        label: theme
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        category,
      };
    });

  return [...coreThemes, ...popularThemes, ...otherThemes].sort((a, b) => {
    if (a.category !== b.category) {
      if (a.category === "Core Themes") return -1;
      if (b.category === "Core Themes") return 1;
      if (
        a.category.includes("Popular") ||
        a.category.includes("Light") ||
        a.category.includes("Dark")
      )
        return -1;
      if (
        b.category.includes("Popular") ||
        b.category.includes("Light") ||
        b.category.includes("Dark")
      )
        return 1;
      return a.category.localeCompare(b.category);
    }
    return a.label.localeCompare(b.label);
  });
}

if (typeof window !== "undefined") {
  const preloadWhenIdle = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(
        () => {
          shikiService.preloadPopular().catch(console.warn);
        },
        { timeout: 5000 },
      );
    } else {
      setTimeout(() => {
        shikiService.preloadPopular().catch(console.warn);
      }, 3000);
    }
  };

  const events = ["click", "scroll", "keydown", "touchstart"];
  const onUserInteraction = () => {
    preloadWhenIdle();
    events.forEach((event) => {
      document.removeEventListener(event, onUserInteraction);
    });
  };

  events.forEach((event) => {
    document.addEventListener(event, onUserInteraction, {
      once: true,
      passive: true,
    });
  });
}
