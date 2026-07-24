import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { SITE_URL } from "@/lib/seo";

const title = "Privacy Policy | Keep TX Red";
const description = "How KeepTXRed.com collects, uses, shares, and protects information from readers, calculator users, and shop customers.";
const canonical = `${SITE_URL}/privacy`;

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" description="This policy explains the information Keep TX Red handles when you read the site, use our tools, contact us, or place a shop order.">
      <section>
        <h2>Who We Are</h2>
        <p>
          Keep TX Red operates KeepTXRed.com, an independent Texas news, civic-tools, relocation, and e-commerce website. References to “we,” “us,” and “our” mean Keep TX Red.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Information you provide:</strong> name, email address, message contents, order details, shipping and billing information, product selections, and other information submitted through checkout or contact forms.</li>
          <li><strong>Transaction information:</strong> order number, products purchased, amount, payment status, refunds, shipping status, and related records. Complete payment-card details are handled by Stripe and are not stored by Keep TX Red.</li>
          <li><strong>Technical and usage information:</strong> pages viewed, referring page, browser and device type, approximate location derived from IP address, timestamps, cookies, and similar diagnostic information.</li>
          <li><strong>Calculator inputs:</strong> most public calculator values are processed in your browser or used only to generate the requested result. Do not enter sensitive personal information unless a tool specifically requests it.</li>
        </ul>
      </section>

      <section>
        <h2>How We Use Information</h2>
        <ul>
          <li>Process, fulfill, deliver, support, replace, and refund shop orders.</li>
          <li>Respond to questions, news tips, corrections, and customer-service requests.</li>
          <li>Operate, secure, troubleshoot, and improve the website and its tools.</li>
          <li>Measure readership, product performance, and site effectiveness.</li>
          <li>Prevent fraud, abuse, unauthorized transactions, and security incidents.</li>
          <li>Comply with legal, tax, accounting, and regulatory obligations.</li>
        </ul>
        <p className="mt-3">We do not sell personal information for money.</p>
      </section>

      <section>
        <h2>Service Providers</h2>
        <p>
          We share information only as reasonably needed with companies that provide hosting, analytics, advertising, payment processing, print-on-demand production, shipping, email, fraud prevention, and other operational services. This may include Stripe, Printify and its fulfillment partners, shipping carriers, hosting vendors, and analytics or advertising providers. Each provider handles information under its own terms and privacy practices.
        </p>
      </section>

      <section>
        <h2>Payments</h2>
        <p>
          Stripe processes card payments. Keep TX Red receives transaction status and limited payment-related details needed to manage the order, but does not receive or store your complete card number or security code.
        </p>
      </section>

      <section>
        <h2>Order Fulfillment and Shipping</h2>
        <p>
          We provide order and delivery information to print providers and carriers so merchandise can be produced and shipped. This generally includes the recipient&apos;s name, address, ordered items, and information needed to resolve fulfillment problems.
        </p>
      </section>

      <section>
        <h2>Cookies, Analytics, and Advertising</h2>
        <p>
          We and our service providers may use cookies and similar technologies to remember preferences, measure traffic, secure checkout, understand site performance, and display advertising. Google and its partners may use cookies or device identifiers to provide and measure ads. Browser controls and available consent controls can be used to limit cookies, though some features may not work correctly when they are disabled.
        </p>
        <p className="mt-3">
          Personalized Google advertising choices can be managed through <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
        </p>
      </section>

      <section>
        <h2>Legal Disclosures</h2>
        <p>
          We may disclose information when reasonably necessary to comply with law, enforce site policies, investigate fraud or security threats, protect rights and safety, or complete a business transfer. We may also disclose aggregated or de-identified information that does not reasonably identify an individual.
        </p>
      </section>

      <section>
        <h2>Data Retention and Security</h2>
        <p>
          Information is retained for as long as reasonably needed for the purposes described above, including order support, accounting, fraud prevention, dispute resolution, and legal compliance. We use reasonable administrative and technical safeguards, but no online system can guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>Your Choices</h2>
        <p>
          You may ask to access, correct, or delete personal information we control, subject to legal and operational exceptions. You may also disable cookies in your browser and unsubscribe from optional email communications using the instructions in those messages. Submit privacy requests through our <Link to="/contact">contact page</Link> and include enough information for us to verify and respond to the request.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>KeepTXRed.com is not directed to children under 13, and we do not knowingly collect personal information from children under 13.</p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>We may update this policy as our services or legal obligations change. The revised date will appear at the top of this page.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions or privacy requests may be submitted through our <Link to="/contact">contact page</Link>.</p>
      </section>
    </LegalPage>
  );
}
