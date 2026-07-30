import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { SITE_URL } from "@/lib/seo";

const title = "Shipping Policy | Keep TX Red";
const description = "Production, delivery estimates, tracking, address changes, delays, and international shipping information for Keep TX Red orders.";
const canonical = `${SITE_URL}/shipping-policy`;

export const Route = createFileRoute("/shipping-policy")({
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
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <LegalPage title="Shipping Policy" description="Keep TX Red products are printed on demand. The timelines below include both production and carrier transit time.">
      <section>
        <h2>Order Processing and Production</h2>
        <p>
          Most products are produced within 3–7 business days after payment is confirmed. Production time can vary by product, size, color, fulfillment facility, order volume, holidays, or quality-control needs. Production time is separate from shipping time.
        </p>
      </section>

      <section>
        <h2>Estimated Delivery</h2>
        <p>
          U.S. delivery commonly takes an additional 2–5 business days after an order ships. These are estimates, not guarantees. Weather, carrier congestion, address problems, holidays, regional disruptions, and other events outside our control can cause delays.
        </p>
      </section>

      <section>
        <h2>Multiple Packages</h2>
        <p>
          Products in the same order may be produced by different facilities. As a result, one order may arrive in multiple packages on different days and may have more than one tracking number.
        </p>
      </section>

      <section>
        <h2>Tracking</h2>
        <p>
          When tracking is available, it will be sent using the contact information supplied at checkout. Tracking may take 24–48 hours to update after a shipping label is created. A label-created status does not always mean the carrier has physically scanned the package yet.
        </p>
      </section>

      <section>
        <h2>Shipping Addresses</h2>
        <p>
          Customers are responsible for providing a complete and accurate delivery address. Contact us immediately after ordering when an address needs correction. We cannot guarantee changes after production or shipment begins. Additional production or shipping charges may apply when a package is returned because of an incorrect, incomplete, refused, or unclaimed address.
        </p>
      </section>

      <section>
        <h2>Shipping Charges</h2>
        <p>
          Shipping charges are displayed at checkout and may vary by product, quantity, destination, and fulfillment location. Any promotional shipping offer applies only under the terms shown with that promotion.
        </p>
      </section>

      <section>
        <h2>International Orders</h2>
        <p>
          International availability, delivery times, taxes, duties, customs charges, and import fees vary by destination. Unless checkout states otherwise, the recipient is responsible for customs duties, taxes, brokerage charges, or other government fees imposed after shipment.
        </p>
      </section>

      <section>
        <h2>Delayed, Lost, or Damaged Shipments</h2>
        <p>
          Contact us through the <Link to="/contact">contact page</Link> when tracking has not moved for an unusual period, a package appears lost, or an item arrives damaged. Include the order number and photographs when applicable. Eligibility for replacement or refund is governed by our <Link to="/return-refund-policy">Return &amp; Refund Policy</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
