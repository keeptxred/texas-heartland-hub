import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { SITE_URL } from "@/lib/seo";

const title = "Terms of Service | Keep TX Red";
const description = "Terms governing use of KeepTXRed.com, its editorial content, calculators, shop, checkout, and made-to-order merchandise.";
const canonical = `${SITE_URL}/terms-of-service`;

export const Route = createFileRoute("/terms-of-service")({
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
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" description="These terms govern your access to KeepTXRed.com and purchases made through the Keep TX Red shop.">
      <section>
        <h2>Acceptance of These Terms</h2>
        <p>
          By accessing KeepTXRed.com, using its tools, or placing an order, you agree to these Terms of Service and the policies linked from this page. Do not use the site or complete a purchase when you do not agree.
        </p>
      </section>

      <section>
        <h2>Editorial Content and Calculators</h2>
        <p>
          Articles, commentary, guides, estimates, calculators, and other information are provided for general informational purposes. They are not legal, tax, financial, medical, engineering, real-estate, or other professional advice. Results may depend on user-supplied assumptions and may not reflect every rule, fee, exemption, jurisdiction, or personal circumstance.
        </p>
      </section>

      <section>
        <h2>Shop Orders</h2>
        <p>
          Product images, colors, dimensions, and descriptions are presented as accurately as reasonably possible. Screen settings, garment batches, manufacturing tolerances, and print placement can create minor variations. We may limit quantities, reject suspected fraudulent orders, correct pricing or listing errors, and cancel an order when a product becomes unavailable. When we cancel a paid order, the applicable charge will be refunded.
        </p>
      </section>

      <section>
        <h2>Payments</h2>
        <p>
          Shop payments are processed through Stripe or another payment provider shown at checkout. You authorize the payment provider to charge the selected payment method for the order total, shipping, taxes, and any other amounts disclosed before purchase. Keep TX Red does not receive or store your complete card number.
        </p>
      </section>

      <section>
        <h2>Shipping, Returns, and Refunds</h2>
        <p>
          Production and delivery are governed by our <Link to="/shipping-policy">Shipping Policy</Link>. Returns, replacements, cancellations, and refunds are governed by our <Link to="/return-refund-policy">Return &amp; Refund Policy</Link>. Those policies are incorporated into these terms.
        </p>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          Unless otherwise stated, the site design, original articles, graphics, logos, product artwork, software, and other original materials belong to Keep TX Red or its licensors. You may not reproduce, sell, scrape, republish, or create derivative commercial products from protected material without written permission. Ordinary personal sharing of links and brief attributed excerpts is permitted where lawful.
        </p>
      </section>

      <section>
        <h2>Acceptable Use</h2>
        <p>You may not use the site to:</p>
        <ul className="mt-2">
          <li>Break applicable law or infringe another person&apos;s rights.</li>
          <li>Attempt unauthorized access, interfere with security, or disrupt service.</li>
          <li>Upload malicious code or misuse forms, checkout, APIs, or automated systems.</li>
          <li>Misrepresent identity, payment authority, or order information.</li>
        </ul>
      </section>

      <section>
        <h2>Third-Party Services and Links</h2>
        <p>
          The site may rely on or link to third-party publishers, payment processors, analytics providers, fulfillment companies, carriers, social platforms, or other services. Their own terms and privacy policies govern their services. We are not responsible for independent third-party content or conduct.
        </p>
      </section>

      <section>
        <h2>Disclaimer and Limitation of Liability</h2>
        <p>
          The site and its content are provided on an “as available” basis to the fullest extent permitted by law. We do not guarantee uninterrupted operation, error-free content, specific results, or continuous product availability. To the fullest extent permitted by law, Keep TX Red will not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the site or products. Any direct liability related to an order will not exceed the amount paid for the affected order, except where applicable law requires otherwise.
        </p>
      </section>

      <section>
        <h2>Changes and Governing Law</h2>
        <p>
          We may update these terms by posting a revised version with a new effective date. Continued use after an update constitutes acceptance of the revised terms. These terms are governed by applicable United States and Texas law, without limiting consumer rights that legally apply in another jurisdiction.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Questions about these terms may be submitted through our <Link to="/contact">contact page</Link>.</p>
      </section>
    </LegalPage>
  );
}
