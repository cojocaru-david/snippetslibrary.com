import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/logo";
import {
  CheckCircle,
  XCircle,
  Shield,
  Home,
  Lock,
  Globe,
  AlertTriangle,
  Info,
  Bug,
  MessageCircle,
  Rocket,
} from "lucide-react";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

export const metadata: Metadata = {
  title: "Terms of Service - Snippets Library",
  description:
    "Comprehensive Terms of Service for Snippets Library. Understand your rights, responsibilities, and guidelines for using our advanced code snippet management platform safely and legally.",
  keywords: [
    "terms of service",
    "user agreement",
    "code snippet policies",
    "snippets library terms",
    "user rights",
    "content guidelines",
    "privacy policy",
    "developer tools terms",
    "software license",
    "user responsibilities",
    "legal terms",
    "github oauth",
    "open source",
  ],
  openGraph: {
    title: "Terms of Service - Snippets Library",
    description:
      "Comprehensive Terms of Service for Snippets Library. Understand your rights, responsibilities, and guidelines for using our platform.",
    url: `${baseUrl}/terms`,
    siteName: "Snippets Library",
    type: "article",
    images: [
      {
        url: `${baseUrl}/api/og?title=Terms%20of%20Service&description=Legal%20Guidelines%20for%20Snippets%20Library`,
        width: 1200,
        height: 630,
        alt: "Snippets Library Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - Snippets Library",
    description:
      "Comprehensive Terms of Service for Snippets Library. Understand your rights and responsibilities.",
    images: [
      `${baseUrl}/api/og?title=Terms%20of%20Service&description=Legal%20Guidelines%20for%20Snippets%20Library`,
    ],
  },
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    },
  },
};

export default function TermsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service - Snippets Library",
    description:
      "Comprehensive terms of service and user agreement for Snippets Library platform",
    url: `${baseUrl}/terms`,
    publisher: {
      "@type": "Organization",
      name: "Snippets Library",
      url: baseUrl,
    },
    dateModified: "2025-01-27",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Snippets Library",
      url: baseUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Terms of Service",
          item: `${baseUrl}/terms`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                <Logo />
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/policies">
                  <Button variant="ghost" size="sm">
                    Privacy Policy
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost">← Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Effective Date: July 31, 2025
              </p>
              <p className="text-sm text-muted-foreground">
                These terms govern your use of Snippets Library, a modern code
                snippet management platform.
              </p>
            </div>

            <div className="mb-8 p-6 bg-muted/30 border border-muted rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Quick Summary
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Snippets Library is a free, open-source platform for managing
                code snippets. You authenticate via GitHub, retain ownership of
                your content, and can share snippets publicly or keep them
                private. We respect your privacy and only collect necessary data
                to provide our services.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Agreement to Terms
              </h2>
              <div className="space-y-4">
                <p>
                  By accessing, browsing, or using Snippets Library (&quot;the
                  Service&quot;, &quot;the Platform&quot;, &quot;we&quot;,
                  &quot;us&quot;, or &quot;our&quot;), you acknowledge that you
                  have read, understood, and agree to be bound by these Terms of
                  Service (&quot;Terms&quot;) and our Privacy Policy. If you do
                  not agree with any part of these terms, you must not use our
                  Service.
                </p>
                <p>
                  Snippets Library is an advanced, open-source code snippet
                  management platform that enables developers to:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Store and organize code snippets with intelligent language
                    detection
                  </li>
                  <li>
                    Collaborate through public sharing and private collections
                  </li>
                  <li>
                    Access beautiful syntax highlighting for 50+ programming
                    languages
                  </li>
                  <li>
                    Search and filter snippets with advanced filtering
                    capabilities
                  </li>
                  <li>
                    Authenticate securely through GitHub OAuth integration
                  </li>
                </ul>
                <p>
                  These Terms constitute a legally binding agreement between you
                  and Snippets Library. We reserve the right to modify these
                  Terms at any time, with changes becoming effective immediately
                  upon posting.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Service License &amp;
                Open Source
              </h2>
              <div className="space-y-4">
                <p>
                  Snippets Library is released under the{" "}
                  <strong>MIT License</strong> and is completely free to use. As
                  an open-source project, you are granted extensive rights to
                  use, modify, and distribute the software, subject to the terms
                  of the MIT License.
                </p>

                <div className="bg-muted/20 border border-muted rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    You May:
                  </h3>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>
                      Use the Service for personal and commercial purposes
                    </li>
                    <li>Access and use all features without cost</li>
                    <li>Fork, modify, and contribute to the source code</li>
                    <li>Deploy your own instance of the platform</li>
                    <li>Create unlimited public and private code snippets</li>
                  </ul>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-destructive flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    You May Not:
                  </h3>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>
                      Use the Service for illegal activities or malicious
                      purposes
                    </li>
                    <li>
                      Store or share malicious code, viruses, or harmful content
                    </li>
                    <li>
                      Attempt to compromise the security or integrity of the
                      Service
                    </li>
                    <li>Violate intellectual property rights of others</li>
                    <li>
                      Spam, abuse, or harass other users through shared content
                    </li>
                    <li>Use automated tools to scrape or abuse the Service</li>
                  </ul>
                </div>

                <p>
                  The source code is available on{" "}
                  <a
                    href="https://github.com/cojocaru-david/snippetslibrary.com"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  &nbsp; under the MIT License. Contributions and feedback are
                  welcome and encouraged.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> User Accounts &amp;
                GitHub Authentication
              </h2>
              <div className="space-y-4">
                <p>
                  Snippets Library uses <strong>GitHub OAuth</strong> for secure
                  authentication. To access the full features of our platform,
                  you must sign in with your GitHub account. By authenticating,
                  you grant us permission to access your GitHub profile
                  information.
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                    GitHub Data We Access:
                  </h3>
                  <ul className="list-disc ml-6 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>Public profile information (username, name, avatar)</li>
                    <li>Primary email address</li>
                    <li>Public repository information (read-only)</li>
                  </ul>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                    We use GitHub&apos;s scope:{" "}
                    <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                      read:user user:email
                    </code>
                  </p>
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  Your Account Responsibilities:
                </h3>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    <strong>Account Security:</strong> Maintain the security of
                    your GitHub account, as it controls access to Snippets
                    Library
                  </li>
                  <li>
                    <strong>Accurate Information:</strong> Ensure your GitHub
                    profile information is current and accurate
                  </li>
                  <li>
                    <strong>Account Activity:</strong> You are responsible for
                    all activities that occur under your account
                  </li>
                  <li>
                    <strong>Privacy:</strong> Do not share your account
                    credentials or access with others
                  </li>
                  <li>
                    <strong>Compliance:</strong> Follow both GitHub&apos;s Terms
                    of Service and our platform rules
                  </li>
                </ul>

                <p>
                  We reserve the right to suspend or terminate your account
                  access if you violate these Terms, engage in harmful
                  activities, or if your GitHub account is compromised or
                  suspended.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> User Content &amp; Code
                Ownership
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    Ownership &amp; Rights
                  </h3>
                  <p className="mb-4">
                    <strong>You retain full ownership</strong> of all code
                    snippets, descriptions, tags, and other content you create
                    or upload (&quot;User Content&quot;). By using our Service,
                    you grant us a limited, non-exclusive, worldwide,
                    royalty-free license to:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>
                      Store, display, and process your content to provide the
                      Service
                    </li>
                    <li>
                      Make your public snippets accessible via shareable links
                    </li>
                    <li>
                      Perform automatic language detection and syntax
                      highlighting
                    </li>
                    <li>
                      Generate analytics for your snippet views (public snippets
                      only)
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">
                    This license exists solely to operate the Service and ends
                    when you delete your content or account.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Private Snippets
                    </h3>
                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                      <li>• Visible only to you</li>
                      <li>• Not indexed by search engines</li>
                      <li>• No public sharing links</li>
                      <li>• Complete privacy control</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Public Snippets
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Accessible via unique share links</li>
                      <li>• Viewable by anyone with the link</li>
                      <li>• Anonymous view tracking</li>
                      <li>• Can be copied by other users</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-destructive flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Content Policy
                  </h3>
                  <p className="mb-3">
                    To maintain a safe and productive environment, you must not
                    submit content that:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Security &amp; Safety:
                      </h4>
                      <ul className="list-disc ml-6 space-y-1 text-sm">
                        <li>Contains malicious code, viruses, or exploits</li>
                        <li>
                          Includes security vulnerabilities meant to harm others
                        </li>
                        <li>Contains harmful or dangerous instructions</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Legal &amp; Ethical:
                      </h4>
                      <ul className="list-disc ml-6 space-y-1 text-sm">
                        <li>Violates intellectual property rights</li>
                        <li>
                          Contains personally identifiable information (PII)
                        </li>
                        <li>
                          Includes sensitive data like passwords or API keys
                        </li>
                        <li>Is illegal, abusive, or discriminatory</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> Disclaimers &amp;
                Liability
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Service Disclaimer
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
                    Snippets Library is provided{" "}
                    <strong>&quot;as-is&quot;</strong> without warranties of any
                    kind, either express or implied. To the fullest extent
                    permitted by law, we disclaim:
                  </p>
                  <ul className="text-sm text-gray-800 dark:text-gray-200 list-disc ml-6 space-y-1">
                    <li>
                      All warranties regarding service availability,
                      reliability, or suitability
                    </li>
                    <li>
                      Accuracy, completeness, or timeliness of user-generated
                      content
                    </li>
                    <li>Security guarantees for stored code snippets</li>
                    <li>
                      Responsibility for third-party integrations (GitHub OAuth)
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-red-900 dark:text-red-100 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Limitation of Liability
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                    <strong>As a free service</strong>, our liability is
                    limited. We shall not be liable for:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <ul className="text-red-800 dark:text-red-200 list-disc ml-6 space-y-1">
                      <li>Loss of data or code snippets</li>
                      <li>Service interruptions or downtime</li>
                      <li>Security breaches or unauthorized access</li>
                    </ul>
                    <ul className="text-red-800 dark:text-red-200 list-disc ml-6 space-y-1">
                      <li>Financial losses or business disruption</li>
                      <li>Indirect, incidental, or consequential damages</li>
                      <li>Third-party actions or content</li>
                    </ul>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-3">
                    Some jurisdictions don&apos;t allow these limitations, so
                    they may not apply to you.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Best Practices
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Always backup important code snippets locally. Don&apos;t
                    store sensitive information like API keys or passwords. Use
                    public snippets responsibly and respect intellectual
                    property rights.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Contact &amp; Support
              </h2>
              <div className="space-y-4">
                <p>
                  Questions about these Terms? Need help with the Service?
                  We&apos;re here to help through multiple channels:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Bug className="w-4 h-4" />
                      Technical Issues
                    </h3>
                    <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                      <li>
                        •{" "}
                        <a
                          href="https://github.com/cojocaru-david/snippetslibrary.com/issues"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub Issues
                        </a>
                      </li>
                      <li>• Bug reports with reproduction steps</li>
                      <li>• Feature requests and suggestions</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      General Questions
                    </h3>
                    <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                      <li>
                        •{" "}
                        <a
                          href="https://github.com/cojocaru-david/snippetslibrary.com/discussions"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub Discussions
                        </a>
                      </li>
                      <li>• Community help and tips</li>
                      <li>• Platform usage guidance</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Response Time:</strong> We aim to respond to GitHub
                    issues within 8-12 hours. For urgent security issues, please
                    mark them appropriately for faster response.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center justify-center gap-2">
                  <Rocket className="w-6 h-6" />
                  Thank you for using Snippets Library!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  By using our platform, you acknowledge that you have read,
                  understood, and agree to be bound by these Terms of Service
                  and our Privacy Policy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/policies">
                    <Button variant="outline" size="sm">
                      Read Privacy Policy
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="sm">Start Using Snippets Library</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
