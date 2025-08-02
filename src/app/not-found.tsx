import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/logo";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

export const metadata: Metadata = {
  title: "Page Not Found (404) - Snippets Library",
  description:
    "The page you're looking for doesn't exist. Explore our collection of code snippets, programming resources, and developer tools on Snippets Library.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Page Not Found - Snippets Library",
    description:
      "The page you're looking for doesn't exist. Explore our collection of code snippets and programming resources instead.",
    type: "website",
    url: `${baseUrl}/404`,
    siteName: "Snippets Library",
  },
  alternates: {
    canonical: `${baseUrl}/404`,
  },
};

export default function NotFound() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Page Not Found - Snippets Library",
    description: "404 error page for Snippets Library",
    url: `${baseUrl}/404`,
    publisher: {
      "@type": "Organization",
      name: "Snippets Library",
      url: baseUrl,
    },
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Snippets Library",
      url: baseUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                <Logo />
              </Link>
              <Link href="/">
                <Button variant="ghost">← Back to Home</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-muted-foreground mb-4">
                404
              </h1>
              <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-8">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved. Let&apos;s get you back to exploring amazing code
                snippets.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link href="/">
                <Button size="lg" className="w-full">
                  Go to Homepage
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full">
                  Browse Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              <p>
                Looking for something specific?{" "}
                <Link href="/explore" className="text-primary hover:underline">
                  Search our snippet library
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
