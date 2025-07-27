import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";

const globalColors = {
  light: {
    background: "#ffffff",
    foreground: "#141316",
    card: "#ffffff",
    cardForeground: "#141316",
    primary: "#e17009",
    primaryForeground: "#fdf4f0",
    secondary: "#f7f7f6",
    secondaryForeground: "#1e1e1c",
    muted: "#f7f7f6",
    mutedForeground: "#6c6c69",
    accent: "#f7f7f6",
    accentForeground: "#1e1e1c",
    border: "#ebebea",
    ring: "#e17009",
  },
  dark: {
    background: "#141316",
    foreground: "#fcfcfc",
    card: "#1e1e1c",
    cardForeground: "#fcfcfc",
    primary: "#e17009",
    primaryForeground: "#fdf4f0",
    secondary: "#2a2a28",
    secondaryForeground: "#fcfcfc",
    muted: "#2a2a28",
    mutedForeground: "#a8a8a5",
    accent: "#2a2a28",
    accentForeground: "#fcfcfc",
    border: "rgba(255, 255, 255, 0.1)",
    ring: "#e17009",
  },
};

const themes = {
  light: {
    background: `linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)`,
    cardBackground: `${globalColors.light.card}f0`, // 94% opacity
    headerBackground: `${globalColors.light.secondary}cc`, // 80% opacity
    primaryText: globalColors.light.foreground,
    secondaryText: globalColors.light.mutedForeground,
    mutedText: "#8b8b88",
    border: `${globalColors.light.border}cc`, // 80% opacity
    accent: globalColors.light.primary,
    windowControls: ["#ff5f56", "#ffbd2e", "#27ca3f"],
    shadowColor: "rgba(0, 0, 0, 0.15)",
    glowColor: `${globalColors.light.mutedForeground}33`, // 20% opacity
  },
  dark: {
    background: `linear-gradient(135deg, ${globalColors.dark.background} 0%, #2a2a28 50%, #404040 100%)`,
    cardBackground: `${globalColors.dark.card}f0`, // 94% opacity
    headerBackground: `${globalColors.dark.secondary}cc`, // 80% opacity
    primaryText: globalColors.dark.foreground,
    secondaryText: globalColors.dark.mutedForeground,
    mutedText: "#8b8b88",
    border: globalColors.dark.border,
    accent: globalColors.dark.primary,
    windowControls: ["#ff5f56", "#ffbd2e", "#27ca3f"],
    shadowColor: "rgba(0, 0, 0, 0.4)",
    glowColor: `${globalColors.dark.mutedForeground}33`, // 20% opacity
  },
};

const languageColors = {
  javascript: { primary: "#f7df1e", secondary: "#f0d91a" },
  typescript: { primary: "#3178c6", secondary: "#2968a3" },
  python: { primary: "#3776ab", secondary: "#306998" },
  java: { primary: "#ed8b00", secondary: "#d67700" },
  php: { primary: "#777bb4", secondary: "#6b6fa1" },
  ruby: { primary: "#cc342d", secondary: "#b02d26" },
  go: { primary: "#00add8", secondary: "#009bb5" },
  rust: { primary: "#ce422b", secondary: "#b63825" },
  cpp: { primary: "#00599c", secondary: "#004d83" },
  csharp: { primary: "#239120", secondary: "#1f7d1b" },
  html: { primary: "#e34f26", secondary: "#d63919" },
  css: { primary: "#1572b6", secondary: "#1060a3" },
  sql: { primary: "#336791", secondary: "#2d5a7e" },
  shell: { primary: "#4eaa25", secondary: "#429120" },
  json: { primary: "#6c757d", secondary: "#5a6268" },
  markdown: { primary: "#6c757d", secondary: "#5a6268" },
  yaml: { primary: "#6c757d", secondary: "#5a6268" },
  docker: { primary: "#2496ed", secondary: "#1f86d4" },
  default: { primary: "#6c757d", secondary: "#5a6268" },
};

function formatText(text: string, maxWords: number = 0): string {
  if (!text) return "";

  let formatted = text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([0-9])([a-zA-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])([0-9])/g, "$1 $2")
    .replace(/([.!?])\s*([a-zA-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  if (maxWords > 0) {
    const words = formatted.split(" ");
    if (words.length > maxWords) {
      formatted = words.slice(0, maxWords).join(" ") + "...";
    }
  }

  return formatted;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawTitle = searchParams.get("title") || "Code Snippet";
    const rawDescription =
      searchParams.get("description") ||
      "A beautiful code snippet shared with you";
    const language = (searchParams.get("language") || "javascript")
      .toLowerCase()
      .trim();
    const themeParam = searchParams.get("theme") || "dark";
    const rawAuthorName = searchParams.get("author") || "";

    const title = formatText(rawTitle, 12);
    const description = formatText(rawDescription, 25);
    const authorName = formatText(rawAuthorName, 3);

    const selectedTheme =
      themeParam === "system"
        ? "dark"
        : ["light", "dark"].includes(themeParam)
          ? (themeParam as "light" | "dark")
          : "dark";
    const theme = themes[selectedTheme] || themes.dark;
    const languageColor =
      languageColors[language as keyof typeof languageColors] ||
      languageColors.default;

    const cacheKey = `og-${title}-${description}-${language}-${selectedTheme}-${authorName}`;

    const response = new ImageResponse(
      (
        <div
          style={{
            background: theme.background,
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-20%",
              width: "600px",
              height: "600px",
              background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`,
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30%",
              left: "-15%",
              width: "400px",
              height: "400px",
              background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 60%)`,
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              padding: "80px",
              position: "relative",
              zIndex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "60px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: `linear-gradient(135deg, ${theme.accent} 0%, ${languageColor.primary} 100%)`,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: `0 8px 24px ${theme.accent}40`,
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "#ffffff",
                      borderRadius: "6px",
                      position: "relative",
                      transform: "rotate(45deg)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "16px",
                      height: "16px",
                      background: theme.accent,
                      borderRadius: "4px",
                      transform: "rotate(45deg)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "26px",
                      fontWeight: "800",
                      color: theme.primaryText,
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                      letterSpacing: "-0.025em",
                      lineHeight: "1",
                    }}
                  >
                    Snippets Library
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: theme.mutedText,
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Code Collection Platform
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: `linear-gradient(135deg, ${languageColor.primary} 0%, ${languageColor.secondary} 100%)`,
                  padding: "12px 20px",
                  borderRadius: "25px",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  boxShadow: `0 4px 12px ${languageColor.primary}40`,
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                  }}
                />
                {language}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: theme.cardBackground,
                borderRadius: "32px",
                border: `1px solid ${theme.border}`,
                boxShadow: `0 25px 50px -12px ${theme.shadowColor}`,
                backdropFilter: "blur(20px)",
                padding: "80px 60px",
                width: "100%",
                maxWidth: "900px",
                position: "relative",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                {theme.windowControls.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      boxShadow: `0 2px 4px ${color}40`,
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "32px",
                  width: "100%",
                }}
              >
                <h1
                  style={{
                    fontSize: "48px",
                    fontWeight: "800",
                    color: theme.primaryText,
                    margin: 0,
                    lineHeight: "1.1",
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    background: `linear-gradient(135deg, ${theme.primaryText} 0%, ${theme.accent} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.025em",
                    wordWrap: "break-word",
                    textWrap: "balance",
                    textAlign: "center",
                  }}
                >
                  {title}
                </h1>

                <p
                  style={{
                    fontSize: "22px",
                    color: theme.secondaryText,
                    margin: 0,
                    lineHeight: "1.5",
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    wordWrap: "break-word",
                    textWrap: "pretty",
                    textAlign: "center",
                    maxWidth: "700px",
                  }}
                >
                  {description}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "32px",
                    marginTop: "24px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: theme.mutedText,
                      fontSize: "16px",
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                      background: theme.headerBackground,
                      padding: "8px 16px",
                      borderRadius: "12px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <span>💻</span>
                    Code Snippet
                  </div>
                  {authorName && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: theme.mutedText,
                        fontSize: "16px",
                        fontFamily: "ui-sans-serif, system-ui, sans-serif",
                        background: theme.headerBackground,
                        padding: "8px 16px",
                        borderRadius: "12px",
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <span>👤</span>
                      {authorName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                height: "4px",
                background: `linear-gradient(90deg, ${languageColor.primary} 0%, ${theme.accent} 50%, ${languageColor.secondary} 100%)`,
                borderRadius: "2px",
                marginTop: "40px",
                width: "200px",
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=43200",
    );
    response.headers.set("CDN-Cache-Control", "public, s-maxage=86400");
    response.headers.set("Vercel-CDN-Cache-Control", "public, s-maxage=86400");

    const etag = `"${Buffer.from(cacheKey).toString("base64")}"`;
    response.headers.set("ETag", etag);

    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch === etag) {
      return new Response(null, { status: 304 });
    }

    return response;
  } catch (e: unknown) {
    console.error("OG image generation failed:", e);
    return new Response(
      `Failed to generate the image: ${e instanceof Error ? e.message : "Unknown error"}`,
      {
        status: 500,
      },
    );
  }
}
