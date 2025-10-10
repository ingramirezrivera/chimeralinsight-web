// src/app/privacy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Chimeral Insight",
  description:
    "Privacy Policy for ChimeralInsight.com and author Robin C. Rickards. All sales and data processing are managed through Amazon. Only contact information submitted through the website form is collected.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-[#494949] font-sans py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-900">
            Privacy Policy
          </h1>
          <p className="text-neutral-500 mt-2">
            Last updated: <strong>October 2025</strong>
          </p>
        </header>

        <section className="space-y-6 leading-relaxed">
          <p>
            Welcome to <strong>ChimeralInsight.com</strong> (the “Site”, “we”,
            “us”, “our”). This Privacy Policy explains how we collect, use, and
            protect the limited information you share with us. All product
            sales, payments, and order processing are fully managed by{" "}
            <strong>Amazon</strong> under their own global privacy policies.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            1. Data Collected Through This Website
          </h2>
          <p>
            This website does <strong>not</strong> process any payments, store
            financial information, or manage shipping details. The only data we
            collect directly through this site is:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Contact form submissions</strong> — name and email address
              voluntarily provided by visitors.
            </li>
            <li>
              <strong>Optional messages</strong> or inquiries you send via the
              contact form.
            </li>
            <li>
              Basic, anonymous site analytics (e.g., page visits, device type)
              to improve performance and usability.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-teal-900">
            2. Sales and Customer Data Managed by Amazon
          </h2>
          <p>
            All sales, payments, shipping, refunds, and customer information
            related to purchases of <strong>Robin C. Rickards</strong> books are
            managed entirely by <strong>Amazon</strong> and its affiliated
            companies. Chimeral Insight does not access or store your financial,
            billing, or address details.
          </p>
          <p>
            Please refer to Amazon’s own policies for details on how they handle
            and protect your data:
          </p>
          <a
            href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 underline hover:text-cyan-800"
          >
            Amazon Privacy Notice
          </a>

          <h2 className="text-2xl font-semibold text-teal-900">
            3. How We Use Your Contact Information
          </h2>
          <p>
            The contact details you provide are used solely to respond to your
            inquiries or messages. We may use your email address to reply to
            requests for information, press inquiries, or event invitations.
          </p>
          <p>
            We do not send unsolicited marketing emails and do not share your
            contact data with any third parties.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            4. Cookies and Analytics
          </h2>
          <p>
            This website may use lightweight analytics tools or cookies to
            understand general traffic patterns, such as which pages are most
            visited. No personal or identifiable data is collected through
            cookies. You can disable cookies in your browser at any time.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            5. Data Retention and Security
          </h2>
          <p>
            Contact form submissions are securely stored in our email system
            only for as long as necessary to respond to your message. We employ
            industry-standard encryption (SSL/TLS) to protect data in transit.
            No personal data is stored permanently on this website’s servers.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            6. Your Rights
          </h2>
          <p>
            You may request that we delete any personal information you’ve
            provided via the contact form. To do so, contact us directly at{" "}
            <a
              href="mailto:info@chimeralinsight.com"
              className="text-cyan-600 underline hover:text-cyan-800"
            >
              info@chimeralinsight.com
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">
            7. Updates to This Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in
            our practices or legal requirements. The most recent version will
            always be available on this page.
          </p>

          <h2 className="text-2xl font-semibold text-teal-900">8. Contact</h2>
          <p>
            For questions about this Privacy Policy or data handling, please
            contact us:
          </p>
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
