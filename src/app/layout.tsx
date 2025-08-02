import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SettingsProvider } from "@/contexts/SettingsContext";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default:
      "Snippets Library - Modern Code Snippet Manager & Sharing Platform",
    template: "%s - Snippets Library",
  },
  description:
    "Store, organize, and share code snippets with beautiful syntax highlighting, instant search, and secure public/private sharing. Built for developers who value clean code organization and seamless collaboration.",
  keywords: [
    "code snippets",
    "programming tools",
    "developer productivity",
    "syntax highlighting",
    "code sharing",
    "snippet manager",
    "development tools",
    "programming library",
    "code organization",
    "developer collaboration",
    "javascript snippets",
    "python code",
    "react components",
    "typescript examples",
    "web development",
    "software engineering",
  ],
  authors: [{ name: "Snippets Library Team", url: baseUrl }],
  creator: "Snippets Library",
  publisher: "Snippets Library",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Snippets Library",
    title: "Snippets Library - Modern Code Snippet Manager & Sharing Platform",
    description:
      "Store, organize, and share code snippets with beautiful syntax highlighting, instant search, and secure public/private sharing. Built for developers who value clean code organization.",
    images: [
      {
        url: `${baseUrl}/api/og?title=Snippets%20Library&description=Modern%20Code%20Snippet%20Manager`,
        width: 1200,
        height: 630,
        alt: "Snippets Library - Code Snippet Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snippets Library - Modern Code Snippet Manager",
    description:
      "Store, organize, and share code snippets with beautiful syntax highlighting and instant search. Built for developers.",
    images: [
      `${baseUrl}/api/og?title=Snippets%20Library&description=Modern%20Code%20Snippet%20Manager`,
    ],
    creator: "@SnippetsLibrary",
    site: "@SnippetsLibrary",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-US": baseUrl,
    },
  },
  other: {
    "theme-color": "#e17009",
    "color-scheme": "light dark",
    "msapplication-TileColor": "#e17009",
  },
};

const themeScript = `
  (function() {
    try {
      const savedTheme = localStorage.getItem('ui-theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let resolvedTheme;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        resolvedTheme = savedTheme;
      } else if (savedTheme === 'system' || !savedTheme) {
        resolvedTheme = systemPrefersDark ? 'dark' : 'light';
      } else {
        resolvedTheme = systemPrefersDark ? 'dark' : 'light';
      }
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolvedTheme);
      document.documentElement.setAttribute('data-theme', resolvedTheme);
    } catch (e) {
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Snippets Library",
    description:
      "Modern code snippet manager and sharing platform for developers",
    url: baseUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Snippets Library",
      url: baseUrl,
    },
    featureList: [
      "Code snippet storage and organization",
      "Syntax highlighting for 100+ languages",
      "Public and private sharing",
      "Instant search functionality",
      "GitHub OAuth authentication",
      "Dark and light themes",
      "Export and import capabilities",
    ],
    screenshot: `${baseUrl}/api/og?title=Snippets%20Library&description=Dashboard%20Preview`,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${syne.variable} ${outfit.variable} antialiased min-h-screen bg-background flex flex-col`}
      >
        <ThemeProvider>
          <SessionProvider>
            <AuthProvider>
              <SettingsProvider>
                {children}
                <Toaster />
              </SettingsProvider>
            </AuthProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
