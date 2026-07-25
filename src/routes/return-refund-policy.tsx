import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { SITE_URL } from "@/lib/seo";

const title = "Return & Refund Policy | Keep TX Red";
const description = "Read the Keep TX Red policy for damaged, defective, misprinted, incorrect, lost, or made-to-order merchandise.";
const canonical = `${SITE_URL}/return-refund-policy`;

export const Route = createFileRoute("/return-refund-policy")({
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
  component: ReturnRefundPolicyPage,
});

function ReturnRefundPolicyPage() {
  return (
    <LegalPage title="Return & Refund Policy" description="Our products are created on demand. This policy explains when replacements, refunds, returns, exchanges, and cancellations are available.">
      <section>
        <h2>Made-to-Order Products</h2>
        <p>
          Keep TX Red merchandise is produced specifically for each customer after an order is placed. Because these items are made to order, we generally cannot accept returns or exchanges for buyer&apos;s remorse, an incorrect size or color selected by the customer, a changed mind, or an accidentally ordered item.
        </p>
        <p className="mt-3">Please review product descriptions, color choices, and sizing information carefully before completing checkout.</p>
      </section>

      <section>
        <h2>Damaged, Defective, Misprinted, or Incorrect Items</h2>
        <p>Contact us within 30 days after delivery when an item arrives damaged, defective, misprinted, or materially different from what was ordered.</p>
        <p className="mt-3">Include:</p>
        <ul className="mt-2">
          <li>Your order number.</li>
          <li>A description of the problem.</li>
          <li>Clear photographs of the item, packaging, shipping label, and affected area.</li>
        </ul>
        <p className="mt-3">After the issue is verified, we may provide a replacement, refund, or other appropriate resolution. We may not require the defective item to be returned.</p>
      </section>

      <section>
        <h2>Wrong Address and Unclaimed Shipments</h2>
        <p>
          Customers are responsible for entering a complete and accurate shipping address. Orders returned because of an incorrect or insufficient address, refusal, or failure to claim the package may require payment of additional shipping or production costs before reshipment.
        </p>
      </section>

      <section>
        <h2>Lost or Stolen Packages</h2>
        <p>
          When tracking shows a package is still in transit beyond the expected delivery window, contact us so we can review the shipment with the carrier or fulfillment provider. When tracking shows delivered, first check the delivery area, household members, neighbors, property management, and the carrier. We will help investigate, but replacement or refund decisions depend on the available tracking and carrier information.
        </p>
      </section>

      <section>
        <h2>Order Changes and Cancellations</h2>
        <p>
          Production can begin shortly after checkout. Changes and cancellations are not guaranteed once an order has entered production. Contact us immediately after ordering, and we will attempt to help before fulfillment begins.
        </p>
      </section>

      <section>
        <h2>Approved Refunds</h2>
        <p>
          Approved refunds are returned to the original payment method. Processing time after approval depends on Stripe, the card network, and the customer&apos;s financial institution. Original shipping charges may be nonrefundable unless the order was defective, incorrect, or otherwise eligible under this policy.
        </p>
      </section>

      <section>
        <h2>How to Request Help</h2>
        <p>
          Use our <Link to="/contact">contact page</Link> and include your order number and supporting photographs. Nothing in this policy limits rights that cannot legally be waived under applicable consumer-protection law.
        </p>
      </section>
    </LegalPage>
  );
}
