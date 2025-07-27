import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/logo";

export default function TermsPage() {
  return (
    <>
      <div className="min-h-screen bg-background">
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
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: Jul 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                1. Agreement to Terms
              </h2>
              <p className="mb-4">
                By accessing and using Snippets Library (&quot;the
                Service&quot;), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by
                the above, please do not use this service.
              </p>
              <p className="mb-4">
                Snippets Library is a code snippet management platform that
                allows users to store, organize, and share code snippets with
                syntax highlighting and various management features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of
                Snippets Library per device for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>modify or copy the materials</li>
                <li>
                  use the materials for any commercial purpose or for any public
                  display (commercial or non-commercial)
                </li>
                <li>
                  attempt to decompile or reverse engineer any software
                  contained on the website
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  use the service to store or share malicious code, viruses, or
                  harmful content
                </li>
              </ul>
              <p className="mb-4">
                This license shall automatically terminate if you violate any of
                these restrictions and may be terminated by us at any time. Upon
                terminating your viewing of these materials or upon the
                termination of this license, you must destroy any downloaded
                materials in your possession whether in electronic or printed
                format.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                3. User Accounts and Authentication
              </h2>
              <p className="mb-4">
                To use certain features of our Service, you must register for an
                account through GitHub OAuth. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Promptly update any changes to your information</li>
                <li>
                  Be responsible for all activities that occur under your
                  account
                </li>
                <li>Not share your account with others</li>
              </ul>
              <p className="mb-4">
                We reserve the right to suspend or terminate your account if you
                violate these terms or engage in activities that could harm our
                Service or other users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                4. User Content and Code Snippets
              </h2>
              <p className="mb-4">
                You retain ownership of any code snippets, descriptions, and
                other content you submit to our Service (&quot;User
                Content&quot;). By submitting User Content, you grant us a
                non-exclusive, worldwide, royalty-free license to use,
                reproduce, modify, and distribute your content solely for the
                purpose of operating the Service.
              </p>

              <h3 className="text-xl font-semibold mb-3">
                4.1 Public vs Private Snippets
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Private Snippets:</strong> Only accessible to you and
                  remain private unless you choose to make them public
                </li>
                <li>
                  <strong>Public Snippets:</strong> Can be viewed by anyone with
                  the shared link and may be indexed by search engines
                </li>
                <li>
                  <strong>Shared Links:</strong> Generate unique, shareable URLs
                  for public snippets
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">
                4.2 Content Guidelines
              </h3>
              <p className="mb-4">You agree not to submit User Content that:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Contains malicious code, viruses, or security vulnerabilities
                </li>
                <li>Violates intellectual property rights of others</li>
                <li>
                  Contains personally identifiable information (PII) or
                  sensitive data
                </li>
                <li>Is illegal, harmful, threatening, abusive, or offensive</li>
                <li>
                  Contains spam or promotional content unrelated to code
                  snippets
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                5. Privacy and Data Protection
              </h2>
              <p className="mb-4">
                We collect and process the following information:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  GitHub profile information (username, email, avatar, bio)
                </li>
                <li>Code snippets and related metadata</li>
                <li>Usage analytics and performance data</li>
                <li>Session and authentication tokens</li>
              </ul>
              <p className="mb-4">
                We use this information to provide and improve our Service,
                authenticate users, and ensure security. We do not sell your
                personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                6. Service Availability and Modifications
              </h2>
              <p className="mb-4">
                We strive to maintain high availability of our Service but do
                not guarantee uninterrupted access. We may:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Temporarily suspend the Service for maintenance or updates
                </li>
                <li>Modify or discontinue features with reasonable notice</li>
                <li>Implement usage limits or rate limiting</li>
                <li>Update these terms with 30 days notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                7. Prohibited Uses
              </h2>
              <p className="mb-4">You may not use our Service:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  For any unlawful purpose or to solicit others to unlawful acts
                </li>
                <li>
                  To violate any international, federal, provincial, or state
                  regulations, rules, laws, or local ordinances
                </li>
                <li>
                  To infringe upon or violate our intellectual property rights
                  or the intellectual property rights of others
                </li>
                <li>
                  To harass, abuse, insult, harm, defame, slander, disparage,
                  intimidate, or discriminate
                </li>
                <li>To submit false or misleading information</li>
                <li>
                  To upload or transmit viruses or any other type of malicious
                  code
                </li>
                <li>To collect or track the personal information of others</li>
                <li>
                  To spam, phish, pharm, pretext, spider, crawl, or scrape
                </li>
                <li>For any obscene or immoral purpose</li>
                <li>
                  To interfere with or circumvent the security features of the
                  Service
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Disclaimer</h2>
              <p className="mb-4">
                The information on this website is provided on an &quot;as
                is&quot; basis. To the fullest extent permitted by law, this
                Company:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Excludes all representations and warranties relating to this
                  website and its contents
                </li>
                <li>
                  Does not warrant that the Service will be constantly available
                  or available at all
                </li>
                <li>
                  Makes no representations about the suitability of the
                  information contained on this website for any purpose
                </li>
                <li>
                  Does not guarantee the accuracy, completeness, or timeliness
                  of user-generated content
                </li>
              </ul>
              <p className="mb-4">
                Nothing on this website constitutes, or is meant to constitute,
                advice of any kind. If you require advice in relation to any
                legal, financial, or medical matter you should consult an
                appropriate professional.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitations</h2>
              <p className="mb-4">
                In no event shall Snippets Library or its suppliers be liable
                for any damages (including, without limitation, damages for loss
                of data or profit, or due to business interruption) arising out
                of the use or inability to use the materials on Snippets
                Library&apos;s website, even if Snippets Library or an
                authorized representative has been notified orally or in writing
                of the possibility of such damage. Because some jurisdictions do
                not allow limitations on implied warranties, or limitations of
                liability for consequential or incidental damages, these
                limitations may not apply to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                10. Accuracy of Materials
              </h2>
              <p className="mb-4">
                The materials appearing on Snippets Library could include
                technical, typographical, or photographic errors. Snippets
                Library does not warrant that any of the materials on its
                website are accurate, complete, or current. Snippets Library may
                make changes to the materials contained on its website at any
                time without notice. However, Snippets Library does not make any
                commitment to update the materials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Links</h2>
              <p className="mb-4">
                Snippets Library has not reviewed all of the sites linked to our
                website and is not responsible for the contents of any such
                linked site. The inclusion of any link does not imply
                endorsement by Snippets Library of the site. Use of any such
                linked website is at the user&apos;s own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Modifications</h2>
              <p className="mb-4">
                Snippets Library may revise these terms of service for its
                website at any time without notice. By using this website, you
                are agreeing to be bound by the then current version of these
                terms of service. We will notify users of significant changes
                through the Service or via email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p className="mb-4">
                These terms and conditions are governed by and construed in
                accordance with the laws of the jurisdiction in which Snippets
                Library operates and you irrevocably submit to the exclusive
                jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Open Source</h2>
              <p className="mb-4">
                Snippets Library is built using various open source technologies
                including React, TypeScript, Tailwind CSS, and other libraries.
                The project itself is released under the MIT License. You can
                view the source code and contribute to the project on GitHub.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                15. Contact Information
              </h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please
                contact us by:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Creating an issue on our GitHub repository</li>
                <li>Starting a discussion on our GitHub Discussions page</li>
                <li>
                  Reaching out through the contact information provided in the
                  application
                </li>
              </ul>
            </section>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                By using Snippets Library, you acknowledge that you have read
                and understood these Terms of Service and agree to be bound by
                them.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
