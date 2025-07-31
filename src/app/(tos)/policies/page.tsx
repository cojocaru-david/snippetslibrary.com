import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/logo";
import {
  Key,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  XCircle,
  Database,
  Shield,
  CheckCircle,
  XOctagon,
  Folder,
  Trash2,
  Globe,
  Clock,
  Archive,
  Cookie,
  Edit,
  Lock,
  Mail,
  AlertCircle,
  Eye,
} from "lucide-react";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://snippetslibrary.com";

export const metadata: Metadata = {
  title: "Privacy Policy - Snippets Library",
  description:
    "Comprehensive Privacy Policy for Snippets Library. Understand how we collect, use, and protect your data while using our advanced code snippet management platform.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "snippets library privacy",
    "data collection",
    "github oauth privacy",
    "code snippets privacy",
    "developer tools privacy",
    "personal data",
    "data security",
    "GDPR compliance",
    "data processing",
  ],
  openGraph: {
    title: "Privacy Policy - Snippets Library",
    description:
      "Comprehensive Privacy Policy for Snippets Library. Understand how we protect your privacy and handle your data.",
    url: `${baseUrl}/policies`,
    siteName: "Snippets Library",
    type: "article",
    images: [
      {
        url: `${baseUrl}/api/og?title=Privacy%20Policy&description=Data%20Protection%20for%20Snippets%20Library`,
        width: 1200,
        height: 630,
        alt: "Snippets Library Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - Snippets Library",
    description:
      "Comprehensive Privacy Policy for Snippets Library. Learn how we protect your privacy and handle your data.",
    images: [
      `${baseUrl}/api/og?title=Privacy%20Policy&description=Data%20Protection%20for%20Snippets%20Library`,
    ],
  },
  alternates: {
    canonical: `${baseUrl}/policies`,
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

export default function PoliciesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy - Snippets Library",
    description:
      "Comprehensive privacy policy and data protection information for Snippets Library platform",
    url: `${baseUrl}/policies`,
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
          name: "Privacy Policy",
          item: `${baseUrl}/policies`,
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
                <Link href="/terms">
                  <Button variant="ghost" size="sm">
                    Terms of Service
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
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Effective Date: July 31, 2025
              </p>
              <p className="text-sm text-muted-foreground">
                This privacy policy explains how Snippets Library collects,
                uses, and protects your personal information.
              </p>
            </div>

            <div className="mb-8 p-6 bg-muted/30 border border-muted rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Privacy Summary
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We respect your privacy and only collect data necessary to
                provide our services. We use GitHub OAuth for authentication,
                store your code snippets securely, and provide analytics for
                public snippets. We never sell your data or track you across
                other websites.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Information We Collect
              </h2>
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    GitHub Authentication Data
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    When you sign in with GitHub OAuth, we collect:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Profile Information:
                      </h4>
                      <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• GitHub username</li>
                        <li>• Display name</li>
                        <li>• Profile avatar/image</li>
                        <li>• Primary email address</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technical Data:</h4>
                      <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• OAuth access tokens</li>
                        <li>• Session identifiers</li>
                        <li>• Account creation/update timestamps</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
                    OAuth Scope:{" "}
                    <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                      read:user user:email
                    </code>
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Content & Usage Data
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Snippet Data:</h4>
                      <ul className="text-green-800 dark:text-green-200 space-y-1">
                        <li>• Code snippet content</li>
                        <li>• Titles and descriptions</li>
                        <li>• Programming language</li>
                        <li>• Tags and metadata</li>
                        <li>• Public/private settings</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Platform Preferences:
                      </h4>
                      <ul className="text-green-800 dark:text-green-200 space-y-1">
                        <li>• Theme preferences (light/dark)</li>
                        <li>• Code highlighting themes</li>
                        <li>• Language preferences</li>
                        <li>• Notification settings</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics & Performance
                  </h3>
                  <div className="text-sm text-purple-800 dark:text-purple-200">
                    <p className="mb-3">
                      For public snippets only, we collect minimal analytics:
                    </p>
                    <ul className="space-y-1">
                      <li>
                        • <strong>View Counts:</strong> Anonymous visitor counts
                        for public snippets
                      </li>
                      <li>
                        • <strong>Access Timestamps:</strong> When public
                        snippets are viewed
                      </li>
                      <li>
                        • <strong>Viewer IP (Hashed):</strong> For deduplication
                        purposes only
                      </li>
                      <li>
                        • <strong>No Personal Tracking:</strong> We don&apos;t
                        track individual browsing behavior
                      </li>
                    </ul>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-3">
                      Private snippets are never tracked or analyzed.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> How We Use Your
                Information
              </h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Essential Services
                    </h3>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                      <li>• User authentication and account management</li>
                      <li>• Code snippet storage and retrieval</li>
                      <li>• Syntax highlighting and language detection</li>
                      <li>• Public snippet sharing functionality</li>
                    </ul>
                  </div>

                  <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-cyan-900 dark:text-cyan-100 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Platform Improvement
                    </h3>
                    <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1">
                      <li>• Understanding popular programming languages</li>
                      <li>
                        • Identifying performance optimization opportunities
                      </li>
                      <li>
                        • Improving user experience based on usage patterns
                      </li>
                      <li>• Debugging and error monitoring</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    What We DON&apos;T Do
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <ul className="text-red-800 dark:text-red-200 space-y-1">
                      <li>• Sell your personal information</li>
                      <li>• Share data with third-party advertisers</li>
                      <li>• Track you across other websites</li>
                    </ul>
                    <ul className="text-red-800 dark:text-red-200 space-y-1">
                      <li>• Use your code for training AI models</li>
                      <li>• Send marketing emails (unless opted in)</li>
                      <li>• Access your private GitHub repositories</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> Data Storage & Security
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Infrastructure
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Database:</h4>
                      <ul className="text-gray-800 dark:text-gray-200 space-y-1">
                        <li>• PostgreSQL with Drizzle ORM</li>
                        <li>• Encrypted data transmission (HTTPS)</li>
                        <li>• Regular automated backups</li>
                        <li>• Access controls and authentication</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Security Measures:</h4>
                      <ul className="text-gray-800 dark:text-gray-200 space-y-1">
                        <li>• Secure OAuth token handling</li>
                        <li>• Session management with NextAuth.js</li>
                        <li>• Input validation and sanitization</li>
                        <li>• Protection against common web vulnerabilities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-orange-900 dark:text-orange-100 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Access Controls
                  </h3>
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <ul className="space-y-1">
                      <li>
                        • <strong>Private Snippets:</strong> Only accessible by
                        the snippet owner
                      </li>
                      <li>
                        • <strong>Public Snippets:</strong> Accessible via
                        unique share links only
                      </li>
                      <li>
                        • <strong>User Data:</strong> Protected by
                        authentication and authorization layers
                      </li>
                      <li>
                        • <strong>Admin Access:</strong> Strictly limited and
                        logged for security purposes
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Data Sharing & Third
                Parties
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Limited Third-Party Integration
                  </h3>
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="mb-3">
                      We only share data with essential service providers:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">
                          GitHub (OAuth Provider):
                        </h4>
                        <p>
                          • Authentication and profile data exchange as per
                          OAuth 2.0 standards
                        </p>
                        <p>
                          • Subject to{" "}
                          <a
                            href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GitHub&apos;s Privacy Policy
                          </a>
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold">
                          Hosting Infrastructure:
                        </h4>
                        <p>
                          • Cloud hosting providers (encrypted data storage)
                        </p>
                        <p>
                          • Database services with appropriate security
                          certifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100 flex items-center gap-2">
                    <XOctagon className="w-5 h-5" />
                    What We Never Share
                  </h3>
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <ul className="space-y-1">
                      <li>
                        • Personal information with advertisers or marketers
                      </li>
                      <li>• Private code snippets with any third party</li>
                      <li>• User behavior data for commercial purposes</li>
                      <li>
                        • Email addresses for spam or unsolicited communications
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> Your Privacy Rights
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      Access & Control
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• View all your stored data</li>
                      <li>• Edit or delete your snippets</li>
                      <li>• Update your profile information</li>
                      <li>• Manage privacy settings</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Data Deletion
                    </h3>
                    <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                      <li>• Delete individual snippets</li>
                      <li>• Request complete account deletion</li>
                      <li>• Export your data before deletion</li>
                      <li>• Permanent removal within 30 days</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    International Users & GDPR
                  </h3>
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="mb-3">
                      For users in the European Union and other jurisdictions
                      with data protection laws:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-1">
                          Your Rights Include:
                        </h4>
                        <ul className="space-y-1">
                          <li>• Right to access your data</li>
                          <li>• Right to rectification</li>
                          <li>
                            • Right to erasure (&quot;right to be
                            forgotten&quot;)
                          </li>
                          <li>• Right to data portability</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Legal Basis:</h4>
                        <ul className="space-y-1">
                          <li>• Legitimate interest for service provision</li>
                          <li>• Consent for optional features</li>
                          <li>• Contract performance for core functionality</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Data Retention &
                Deletion
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Retention Periods
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Active Account Data:
                        </h4>
                        <ul className="text-gray-800 dark:text-gray-200 space-y-1">
                          <li>• Code snippets: Until user deletion</li>
                          <li>• Profile information: Until account deletion</li>
                          <li>• User preferences: Until account deletion</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">System Data:</h4>
                        <ul className="text-gray-800 dark:text-gray-200 space-y-1">
                          <li>• Session tokens: 30 days or logout</li>
                          <li>• Analytics data: 12 months maximum</li>
                          <li>• Error logs: 90 days for debugging</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100 flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    Account Deletion Process
                  </h3>
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <p className="mb-2">When you delete your account:</p>
                    <ol className="list-decimal ml-6 space-y-1">
                      <li>All private snippets are immediately deleted</li>
                      <li>
                        Public snippets can be retained or deleted (your choice)
                      </li>
                      <li>Personal information is removed within 30 days</li>
                      <li>
                        Anonymized analytics may be retained for historical
                        purposes
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">7.</span> Cookies & Tracking
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100 flex items-center gap-2">
                    <Cookie className="w-5 h-5" />
                    Essential Cookies Only
                  </h3>
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="mb-3">
                      We use minimal cookies necessary for platform
                      functionality:
                    </p>
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold">
                          Authentication Cookies:
                        </h4>
                        <p>• Session management and login persistence</p>
                        <p>• GitHub OAuth token storage</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Preference Cookies:</h4>
                        <p>• Theme settings (dark/light mode)</p>
                        <p>• Language and UI preferences</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    No Tracking Scripts
                  </h3>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <ul className="space-y-1">
                      <li>• No Google Analytics or similar tracking</li>
                      <li>• No third-party advertising cookies</li>
                      <li>• No cross-site tracking mechanisms</li>
                      <li>• No behavioral profiling or user fingerprinting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">8.</span> Policy Updates &
                Contact
              </h2>
              <div className="space-y-6">
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Policy Changes
                  </h3>
                  <div className="text-sm text-purple-800 dark:text-purple-200">
                    <p className="mb-2">
                      We may update this Privacy Policy to reflect:
                    </p>
                    <ul className="space-y-1 mb-3">
                      <li>• Changes in our data practices</li>
                      <li>• New features or services</li>
                      <li>• Legal or regulatory requirements</li>
                    </ul>
                    <p>
                      <strong>Notice:</strong> 30 days advance notice for
                      material changes via platform notification.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Privacy Concerns
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
                        </a>{" "}
                        (privacy label)
                      </li>
                      <li>• Data protection questions</li>
                      <li>• Security vulnerability reports</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Data Requests
                    </h3>
                    <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                      <li>• Account deletion requests</li>
                      <li>• Data export requests</li>
                      <li>• GDPR compliance inquiries</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Response Time:</strong> We aim to respond to
                    privacy-related inquiries within 8-12 hours and fulfill data
                    requests within 30 days as required by applicable laws.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center justify-center gap-2">
                  <Shield className="w-6 h-6" />
                  Your Privacy Matters
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We&apos;re committed to protecting your privacy and being
                  transparent about our data practices. If you have any
                  questions or concerns, don&apos;t hesitate to reach out.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/terms">
                    <Button variant="outline" size="sm">
                      Read Terms of Service
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/cojocaru-david/snippetslibrary.com/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm">Report Privacy Concern</Button>
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
