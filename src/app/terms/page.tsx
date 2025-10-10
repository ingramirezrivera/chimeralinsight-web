// src/app/terms/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Chimeral Insight",
  description:
    "Terms of Service for ChimeralInsight.com and author Robin C. Rickards. Sales, payments, shipping, returns and claims are handled exclusively through Amazon.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-[#494949] font-sans py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-900">
            Terms of Service
          </h1>
          <p className="text-neutral-500 mt-2">
            Last updated: <strong>October 2025</strong>
          </p>
        </header>

        <section className="space-y-6 leading-relaxed">
          <p>
            Welcome to <strong>ChimeralInsight.com</strong> (the “Site”, “we”,
            “us”, “our”), the official website of author{" "}
            <strong>Robin C. Rickards</strong>. These Terms of Service (“Terms”)
            govern your access to and use of this Site. By using the Site, you
            agree to these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            1) Scope of Services
          </h2>
          <p>
            This Site provides information about books and activities related to
            Robin C. Rickards and may include news, events, and contact forms.
            <strong>
              {" "}
              All sales, payments, order processing, shipping, returns and
              claims are handled exclusively via Amazon
            </strong>{" "}
            and its affiliated marketplaces. We do not process payments or
            manage order logistics on this Site.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            2) Regional Marketplaces (Amazon)
          </h2>
          <p>
            Books may be listed on Amazon regional sites, including but not
            limited to:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>United States — amazon.com</li>
            <li>Canada — amazon.ca</li>
            <li>United Kingdom — amazon.co.uk</li>
            <li>Australia — amazon.com.au</li>
          </ul>
          <p className="mt-2">
            Purchases you make are subject to the respective{" "}
            <em>Amazon terms, policies, and procedures</em> applicable in your
            region (pricing, taxes, shipping, returns, warranties and claims).
            Please review those documents on the relevant Amazon site before
            purchasing.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            3) Pricing, Availability & Accuracy
          </h2>
          <p>
            Any prices, availability notices, formats, or promotional details
            displayed or referenced on this Site are for informational purposes
            only and may differ from current details on Amazon. The applicable
            pricing, availability, shipping costs and delivery estimates are
            those shown on the corresponding Amazon product page at the time of
            your order.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            4) Shipping, Returns & Claims
          </h2>
          <p>
            Shipping, returns, refunds and claims are administered solely by
            Amazon under its own policies and customer service processes.
            Instructions and eligibility for returns or refunds will be those
            provided by Amazon in your region. If you have a question or claim
            about an order, please contact Amazon directly using the links in
            your order history.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            5) Intellectual Property
          </h2>
          <p>
            All content on the Site (including text, graphics, logos, images and
            design elements) is owned by Robin C. Rickards or used with
            permission and is protected by applicable intellectual property
            laws. You may not copy, modify, distribute, or create derivative
            works from the Site’s content without prior written consent.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            6) Acceptable Use
          </h2>
          <p>
            You agree not to: (a) use the Site for any unlawful purpose; (b)
            attempt to gain unauthorized access to any systems; (c) interfere
            with the Site’s security, availability, or performance; (d) scrape,
            harvest or collect information for commercial purposes without
            consent; (e) upload or transmit malicious code.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            7) Third-Party Links
          </h2>
          <p>
            The Site may include links to third-party websites (e.g., Amazon,
            social platforms). Those sites are governed by their own terms and
            policies. We are not responsible for third-party content or
            practices.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            8) No Warranties; Disclaimer
          </h2>
          <p>
            The Site is provided “as is” and “as available” without warranties
            of any kind, whether express or implied, including but not limited
            to implied warranties of merchantability, fitness for a particular
            purpose, and non-infringement. We do not guarantee that the Site
            will be uninterrupted, secure, or error-free, or that content will
            always be current or accurate. For purchasing details, rely on the
            product page on the applicable Amazon marketplace.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            9) Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, we shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, whether incurred
            directly or indirectly, or any loss of data, use, or goodwill,
            resulting from your access to or use of the Site. Your exclusive
            remedy for dissatisfaction with the Site is to stop using it.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            10) Indemnification
          </h2>
          <p>
            You agree to indemnify and hold harmless Robin C. Rickards and
            Chimeral Insight from any claims, liabilities, damages, losses and
            expenses (including reasonable attorneys’ fees) arising from your
            use of the Site or your violation of these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">11) Privacy</h2>
          <p>
            Our handling of limited contact information submitted through this
            Site is described in our{" "}
            <Link
              href="/privacy"
              className="text-cyan-600 underline hover:text-cyan-800"
            >
              Privacy Policy
            </Link>
            . We do not process payments or store order details here. For
            purchases, Amazon’s privacy and data practices apply.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            12) Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms are governed by the laws of the Province of British
            Columbia and the federal laws of Canada applicable therein, without
            regard to conflict-of-laws principles. You agree to the exclusive
            jurisdiction of the courts located in British Columbia, Canada,
            regarding any dispute arising from or related to these Terms or your
            use of the Site.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            13) Changes to These Terms
          </h2>
          <p>
            We may update these Terms from time to time. The “Last updated” date
            at the top indicates the most recent revision. Your continued use of
            the Site after a change constitutes acceptance of the updated Terms.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">14) Contact</h2>
          <p>If you have questions about these Terms, please contact us:</p>
          <ul className="ml-6">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@chimeralinsight.com"
                className="text-cyan-600 underline hover:text-cyan-800"
              >
                info@chimeralinsight.com
              </a>
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <Link
                href="/"
                className="text-cyan-600 underline hover:text-cyan-800"
              >
                chimeralinsight.com
              </Link>
            </li>
          </ul>
        </section>

        <div className="pt-10 text-center text-sm text-gray-500 border-t border-gray-200">
          © {new Date().getFullYear()} Chimeral Insight. All rights reserved.
        </div>
      </div>
    </main>
  );
}
