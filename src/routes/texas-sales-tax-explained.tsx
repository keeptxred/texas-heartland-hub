import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";

const faqs = [
  {
    question: "What is the Texas state sales tax rate?",
    answer:
      "Texas imposes a statewide sales and use tax, and cities, counties, transit authorities, and special-purpose districts may add local sales taxes. The combined rate depends on the location of the sale and applicable sourcing rules.",
  },
  {
    question: "Does Texas tax groceries?",
    answer:
      "Many basic grocery items are exempt, while prepared food, restaurant meals, candy, soft drinks, and some convenience-store purchases may be taxable. The treatment depends on what is sold and how it is prepared or packaged.",
  },
  {
    question: "Do online purchases have Texas sales tax?",
    answer:
      "Online purchases delivered to Texas may be subject to Texas sales or use tax. Many marketplace providers and remote sellers collect the tax at checkout, but a buyer can still owe use tax when a taxable purchase is not taxed by the seller.",
  },
  {
    question: "Who needs a Texas sales tax permit?",
    answer:
      "A business that sells taxable goods or taxable services in Texas generally needs to determine whether it must obtain a sales tax permit, collect tax, file returns, and keep supporting records. Requirements vary by activity and business model.",
  },
];

export const Route = createFileRoute("/texas-sales-tax-explained")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Sales Tax Explained | Rates, Exemptions, Online Sales & Permits",
      description:
        "Understand Texas sales tax, local rates, exempt purchases, online orders, use tax, business permits, filing responsibilities, and practical ways to check a transaction.",
      path: "/texas-sales-tax-explained",
      type: "article",
      keywords:
        "Texas sales tax, Texas sales tax rate, Texas local sales tax, Texas use tax, Texas sales tax permit, Texas tax exemptions",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasSalesTaxExplained,
});

function TexasSalesTaxExplained() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Texas Sales Tax Explained: Rates, Exemptions, Online Sales and Business Permits",
    description:
      "A practical guide to how Texas sales and use tax works for households, online shoppers, and businesses.",
    image: "https://keeptxred.com/images/texas-sales-tax-guide.svg",
    datePublished: "2026-07-26",
    dateModified: "2026-07-26",
    author: { "@type": "Organization", name: "Keep TX Red Data Desk" },
    publisher: { "@type": "Organization", name: "Keep TX Red" },
    mainEntityOfPage: "https://keeptxred.com/texas-sales-tax-explained",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Texas Economy · Tax & Spending</p>
          <h1 className="mt-3 max-w-5xl font-display text-5xl leading-none md:text-7xl">
            Texas Sales Tax Explained
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Texas has no individual state income tax, so sales tax is one of the most visible ways state and local government collect revenue. The amount charged can change by location, product, service, seller, and even the way an item is delivered.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <img
          src="/images/texas-sales-tax-guide.svg"
          alt="Illustration of a Texas receipt showing state and local sales tax"
          className="w-full rounded-xl border"
          width="1600"
          height="900"
        />

        <article className="mx-auto max-w-4xl space-y-12 font-serif text-lg leading-8">
          <section>
            <h2 className="font-display text-4xl">Why sales tax matters so much in Texas</h2>
            <p className="mt-5">
              Texas relies on a mix of sales taxes, property taxes, franchise taxes, energy-related revenue, fees, and federal funds rather than a personal income tax. That structure shifts more of the everyday tax burden toward consumption and real estate. A household may notice the system at the cash register, while a business feels it through permits, collection rules, filing deadlines, and recordkeeping.
            </p>
            <p className="mt-4">
              Sales tax also connects directly to local government finance. Cities, counties, transit authorities, and special-purpose districts may receive local sales-tax revenue, which means two purchases of the same item can produce different combined rates when they occur in different jurisdictions. For the broader picture, read <Link to="/news/$slug" params={{ slug: "why-texas-has-no-income-tax" }} className="font-semibold text-primary hover:underline">why Texas has no state income tax</Link> and the <Link to="/news/$slug" params={{ slug: "texas-property-tax-guide" }} className="font-semibold text-primary hover:underline">Texas property tax guide</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">The combined rate is state plus local tax</h2>
            <p className="mt-5">
              A Texas receipt may include both the statewide rate and one or more local components. The local portion can come from a city, county, transit authority, or special district. The seller must determine which jurisdictions apply under Texas sourcing rules and calculate the correct combined amount.
            </p>
            <p className="mt-4">
              Consumers should not assume that every city boundary produces the same result or that a mailing address identifies every taxing jurisdiction. Annexation, special districts, delivery locations, and marketplace rules can all matter. When a rate looks wrong, compare the receipt with the official Texas Comptroller rate lookup and ask the seller which location was used to source the sale.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">What is usually taxable</h2>
            <p className="mt-5">
              Most sales of tangible personal property are taxable unless a specific exemption applies. Many common services are not taxed, but Texas does tax certain listed services. Examples can include data processing, telecommunications, amusement services, security services, credit reporting, nonresidential real-property services, and other categories defined by statute and Comptroller guidance.
            </p>
            <p className="mt-4">
              The details matter. A charge described as consulting, installation, repair, maintenance, software, admission, delivery, or membership may be treated differently depending on the actual work performed and how the invoice is structured. Businesses should classify the transaction from the underlying facts rather than relying only on the label placed on the receipt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">Groceries, prepared food, and everyday exemptions</h2>
            <p className="mt-5">
              Many basic food products sold for home consumption are exempt from Texas sales tax. Prepared food and restaurant meals are generally treated differently because the seller has prepared, combined, heated, served, or packaged the food for immediate consumption. Soft drinks, candy, and some vending-machine sales can also fall outside the basic grocery exemption.
            </p>
            <p className="mt-4">
              Texas also provides exemptions for many prescription medicines, certain medical items, qualifying agricultural purchases, manufacturing equipment, resale inventory, and purchases by eligible exempt organizations. Each exemption has its own definitions and documentation rules. An exemption certificate is not a universal coupon; it must match the buyer, seller, item, and legally permitted use.
            </p>
          </section>

          <section className="rounded-xl border bg-muted/20 p-7">
            <h2 className="font-display text-3xl">A practical transaction checklist</h2>
            <ol className="mt-5 list-decimal space-y-3 pl-6">
              <li>Identify exactly what product or service is being sold.</li>
              <li>Determine whether Texas treats that item or service as taxable.</li>
              <li>Check whether the buyer or intended use qualifies for an exemption.</li>
              <li>Determine the correct sales location or delivery destination.</li>
              <li>Confirm the applicable state and local rate.</li>
              <li>Keep the invoice, exemption certificate, and supporting records.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-display text-4xl">Online purchases and marketplace sellers</h2>
            <p className="mt-5">
              Online shopping does not automatically avoid Texas tax. A remote seller with sufficient Texas activity may have collection responsibilities, and a marketplace provider may collect on behalf of sellers using its platform. The tax shown at checkout often depends on the delivery address because the item is being shipped to the buyer.
            </p>
            <p className="mt-4">
              When a taxable purchase arrives without sales tax being collected, the buyer may owe Texas use tax. Use tax is the companion to sales tax and is intended to prevent an untaxed out-of-state purchase from receiving an advantage over the same purchase from a Texas seller. This can affect both households and businesses, although business purchases usually receive more scrutiny because they are recorded in accounting systems and may be reviewed during an audit.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">Sales tax permits and business responsibilities</h2>
            <p className="mt-5">
              A business selling taxable goods or services in Texas generally needs to determine whether it must obtain a Texas sales tax permit. A permit allows the business to collect tax, issue resale certificates when appropriate, file returns, and remit the amount collected. It does not make every purchase by the business tax-free.
            </p>
            <p className="mt-4">
              Collection creates a trust-like responsibility: the tax belongs to the state, not the seller. Businesses should separate collected tax in their records, reconcile taxable and nontaxable sales, retain exemption certificates, track marketplace transactions, and file even when a reporting period has no taxable sales if a return is required. Late filing can trigger penalties and interest, while poor records can cause an auditor to estimate liability.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">Resale certificates are for inventory, not business shopping</h2>
            <p className="mt-5">
              A resale certificate generally applies when a business buys an item for resale in the normal course of business. It is not a blanket exemption for office equipment, furniture, supplies, tools, or items the business will consume. If a seller accepts an invalid certificate without reasonable care, both sides can face problems later.
            </p>
            <p className="mt-4">
              The safest practice is to document the buyer's permit information, describe the items being purchased for resale, and retain the certificate with the transaction records. Businesses with mixed-use purchases should establish a consistent process for paying or accruing use tax on items removed from resale inventory for internal use.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">How sales tax affects household budgeting</h2>
            <p className="mt-5">
              Sales tax can materially increase the final cost of vehicles, furniture, electronics, home improvements, restaurant meals, and other major purchases. A household comparing prices should use the after-tax total rather than the advertised price. This is especially important when budgeting for a move, furnishing a home, or making a large one-time purchase.
            </p>
            <p className="mt-4">
              Sales tax is only one piece of the Texas cost structure. Use the <Link to="/tax-calculator" className="font-semibold text-primary hover:underline">Texas property tax calculator</Link>, the <Link to="/news/$slug" params={{ slug: "texas-utility-costs-guide" }} className="font-semibold text-primary hover:underline">Texas utility-cost guide</Link>, and the <Link to="/news/$slug" params={{ slug: "true-cost-of-owning-a-home-in-texas" }} className="font-semibold text-primary hover:underline">true cost of owning a Texas home</Link> to build a more complete household budget.
            </p>
          </section>

          <section>
            <h2 className="font-display text-4xl">Frequently asked questions</h2>
            <div className="mt-6 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border p-6">
                  <h3 className="font-display text-2xl">{faq.question}</h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-xl border border-primary/30 bg-primary/5 p-7 text-base leading-7">
            <strong>Editorial note:</strong> Tax rules, rates, exemptions, and administrative guidance can change. Verify a specific transaction with the Texas Comptroller or a qualified Texas tax professional before relying on an exemption or filing position.
          </aside>
        </article>
      </div>
    </main>
  );
}
