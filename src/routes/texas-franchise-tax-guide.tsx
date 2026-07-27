import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const FAQ = [
  {
    q: "Is the Texas franchise tax an income tax?",
    a: "No. Texas does not impose a personal income tax, and the franchise tax is not calculated the same way as a conventional corporate income tax. It is a privilege tax imposed on many taxable entities doing business in Texas and is generally based on taxable margin.",
  },
  {
    q: "Does every Texas LLC owe franchise tax?",
    a: "Most Texas LLCs are subject to the franchise-tax system and must evaluate filing obligations, but many small entities owe no tax because revenue falls below the no-tax-due threshold. Reporting obligations can still apply even when the tax due is zero.",
  },
  {
    q: "When is the Texas franchise tax report due?",
    a: "The annual franchise tax report is generally due May 15. When May 15 falls on a weekend or legal holiday, the due date moves to the next business day. Extensions may be available, but an extension to file does not always extend the deadline to pay.",
  },
  {
    q: "What happens if a business ignores franchise-tax filings?",
    a: "A business can lose its right to transact business in Texas, face penalties and interest, and eventually risk forfeiture of its entity privileges. Owners should address missing reports promptly through the Texas Comptroller.",
  },
];

export const Route = createFileRoute("/texas-franchise-tax-guide")({
  head: () => ({
    meta: [
      { title: "Texas Franchise Tax Explained: A Practical Guide for Businesses" },
      {
        name: "description",
        content:
          "A plain-English guide to the Texas franchise tax, including who files, taxable margin, no-tax-due rules, deadlines, penalties, and recordkeeping for LLCs and corporations.",
      },
      { property: "og:title", content: "Texas Franchise Tax Explained" },
      {
        property: "og:description",
        content: "What Texas LLCs, corporations, and other businesses need to know about franchise-tax reports, thresholds, deadlines, and compliance.",
      },
      { property: "og:image", content: `${SITE_URL}/images/texas-franchise-tax-guide.svg` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/texas-franchise-tax-guide` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Texas Franchise Tax Explained: A Practical Guide for Businesses",
          description:
            "A practical guide to Texas franchise-tax filing, taxable margin, thresholds, deadlines, penalties, and compliance.",
          image: `${SITE_URL}/images/texas-franchise-tax-guide.svg`,
          author: { "@type": "Organization", name: "Keep TX Red" },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}/texas-franchise-tax-guide`,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: TexasFranchiseTaxGuide,
});

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl md:text-3xl tracking-tight pt-8 border-b-2 border-foreground pb-2">
      {children}
    </h2>
  );
}

function TexasFranchiseTaxGuide() {
  return (
    <main>
      <section className="border-b-4 border-foreground bg-secondary/10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Texas Business Guide</span>
            <h1 className="mt-3 font-display text-4xl md:text-6xl tracking-tight">
              Texas Franchise Tax Explained
            </h1>
            <p className="mt-5 max-w-3xl font-serif text-lg leading-relaxed text-muted-foreground">
              Texas promotes itself as a no-personal-income-tax state, but many businesses still encounter the
              state franchise tax. This guide explains who is covered, how taxable margin works, when reports are
              due, and what small-business owners should do to stay in good standing.
            </p>
          </div>
          <img
            src="/images/texas-franchise-tax-guide.svg"
            alt="Illustration of a Texas business filing a franchise tax report"
            className="w-full border-2 border-foreground bg-card"
          />
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-5 px-4 py-14 text-base leading-relaxed">
        <p className="text-lg font-serif text-muted-foreground">
          The Texas franchise tax is one of the most misunderstood obligations facing a new LLC, corporation,
          partnership, or other taxable entity. The confusion usually begins with the phrase “no state income
          tax.” That statement is true for individuals, but it does not mean every Texas business operates free
          of state-level tax filings. The franchise tax is a separate business tax administered by the Texas
          Comptroller and tied to the privilege of doing business in the state.
        </p>

        <div className="border-l-4 border-primary bg-primary/5 p-5">
          <strong>Important:</strong> This guide is educational and does not replace advice from a CPA, attorney,
          or the Texas Comptroller. Thresholds, rates, forms, and due dates can change, so confirm the rules that
          apply to the report year you are filing.
        </div>

        <SectionHeading>What the Texas Franchise Tax Is</SectionHeading>
        <p>
          The franchise tax applies to many entities formed in Texas and many out-of-state entities that do
          business here. It is often called a “margin tax” because the tax base is generally derived from a
          business&apos;s taxable margin rather than simply its net income. The system is designed to reach a broad
          range of legal entities while allowing exclusions, deductions, thresholds, and alternative calculations.
        </p>
        <p>
          That structure is why two businesses with similar sales can have different franchise-tax outcomes. The
          entity type, total revenue, cost structure, compensation, industry classification, and available filing
          method can all matter. A business can also owe no tax while still being required to submit an annual
          report and associated ownership or public-information filing.
        </p>
        <p>
          The franchise tax belongs within the larger Texas tax picture. Residents may avoid a personal income
          tax, but state and local government rely heavily on sales taxes, property taxes, severance taxes, fees,
          and business taxes. For the household side of that system, see our guide to why Texas has no state income
          tax and our <Link to="/tax-calculator" className="text-primary underline underline-offset-4">Texas property-tax calculator</Link>.
        </p>

        <SectionHeading>Who May Have to File</SectionHeading>
        <p>
          Taxable entities commonly include Texas corporations, limited liability companies, banks, state-limited
          banking associations, professional associations, business trusts, limited partnerships, and many other
          legal entities. An entity organized outside Texas can also fall within the system when it has sufficient
          business activity or nexus in the state.
        </p>
        <p>
          Some organizations are exempt or excluded, including certain nonprofits and other specifically protected
          entities. Sole proprietorships owned by an individual are generally treated differently from separate
          legal entities, but owners should not assume that a small operation is automatically outside the system.
          Entity structure matters more than the everyday label “small business.”
        </p>
        <p>
          A newly formed Texas LLC should therefore treat franchise-tax registration and reporting as part of its
          basic compliance calendar, alongside formation documents, registered-agent maintenance, licenses, sales-tax
          permits where applicable, and federal tax filings.
        </p>

        <SectionHeading>No-Tax-Due Does Not Always Mean No Filing</SectionHeading>
        <p>
          Texas uses a no-tax-due threshold intended to reduce the burden on smaller entities. When an entity&apos;s
          reportable revenue is below the threshold for the relevant report year, the calculated franchise tax may
          be zero. That is a tax result, not necessarily permission to ignore the Comptroller.
        </p>
        <p>
          Businesses may still need to provide required information reports, ownership details, and other filings.
          The exact form package depends on entity status and current Comptroller procedures. This distinction is
          crucial because many compliance problems begin when an owner hears “you owe nothing” and interprets that
          as “you do not have to respond.”
        </p>
        <p>
          Keep copies of every submitted report, confirmation number, payment record, extension request, and notice.
          A clean file can save hours when a lender, buyer, title company, investor, or government agency asks for
          proof that the entity remains in good standing.
        </p>

        <SectionHeading>How Taxable Margin Is Calculated</SectionHeading>
        <p>
          The franchise-tax calculation begins with total revenue and then applies the method permitted under the
          Tax Code and Comptroller rules. Depending on the business, taxable margin may be determined through an
          allowed deduction method such as cost of goods sold or compensation, or through another authorized
          calculation. The resulting amount is then apportioned to Texas when the entity operates in multiple states.
        </p>
        <p>
          The cost-of-goods-sold method can be valuable for businesses that produce, acquire, or sell qualifying
          goods, but the definition is technical. Ordinary operating expenses do not automatically qualify. The
          compensation method can be useful for labor-heavy businesses, but it also has statutory limits and detailed
          rules. Choosing the wrong method can produce an inaccurate filing even when the bookkeeping numbers are correct.
        </p>
        <p>
          Service companies, retailers, contractors, manufacturers, real-estate entities, and professional firms can
          therefore produce very different calculations. Owners should classify revenue and expenses consistently and
          avoid waiting until the filing deadline to decide how the books should map to the franchise-tax return.
        </p>

        <SectionHeading>Annual Deadlines and Extensions</SectionHeading>
        <p>
          The annual franchise-tax report is generally due May 15. If that date falls on a weekend or legal holiday,
          the deadline moves to the next business day. A business that cannot complete the return on time may be able
          to request an extension, but the extension rules should be reviewed carefully because extending the filing
          deadline does not always eliminate the need for a timely estimated payment.
        </p>
        <p>
          A practical compliance calendar should begin well before May. Close the prior year&apos;s books, reconcile revenue,
          confirm entity information, identify changes in ownership, review nexus in other states, and send records to the
          preparer early. Businesses that wait until May often discover that the franchise-tax report depends on federal
          return information that is still incomplete.
        </p>

        <SectionHeading>Public Information Reports and Ownership Reports</SectionHeading>
        <p>
          Franchise-tax compliance is not limited to the tax calculation. Corporations and LLCs may need to file a Public
          Information Report, while other entity types may have an Ownership Information Report or comparable requirement.
          These reports identify officers, directors, managers, members, or other responsible parties depending on the
          entity and form.
        </p>
        <p>
          Owners should review names, addresses, titles, and ownership details rather than automatically copying last
          year&apos;s filing. Changes in management, a relocated office, a new mailing address, or a departed officer can create
          inconsistencies across Comptroller, Secretary of State, banking, insurance, and federal records.
        </p>

        <SectionHeading>Penalties, Forfeiture, and Good Standing</SectionHeading>
        <p>
          Missing reports or payments can trigger penalties and interest. Continued noncompliance can cause the Comptroller
          to forfeit an entity&apos;s right to transact business in Texas. If the problem remains unresolved, the entity can face
          further forfeiture consequences that affect its legal privileges and the liability protections its owners expected
          when forming the company.
        </p>
        <p>
          This is not merely an accounting inconvenience. A forfeited status can disrupt contracts, financing, litigation,
          property transactions, licensing, and a future sale of the business. Anyone buying or investing in a Texas company
          should verify franchise-tax status as part of due diligence.
        </p>
        <p>
          If an entity has fallen behind, the fastest path is usually to identify every missing report, submit accurate
          filings, pay amounts due, and obtain the Comptroller documentation needed for reinstatement or revival. Avoid
          creating a replacement entity merely to escape unresolved obligations without professional guidance.
        </p>

        <SectionHeading>Franchise Tax, Sales Tax, and Property Tax Are Different</SectionHeading>
        <p>
          The franchise tax is imposed on taxable entities. Sales and use tax generally applies to taxable sales, leases,
          and services, with businesses often collecting the tax from customers and remitting it to the state. Property tax
          is imposed locally on real property and certain business personal property. A company can be responsible for all
          three systems at the same time.
        </p>
        <p>
          For a broader look at state consumption taxes, read our <Link to="/texas-sales-tax-explained" className="text-primary underline underline-offset-4">Texas sales tax guide</Link>.
          Businesses that own commercial real estate or taxable equipment should also understand the
          <Link to="/texas-property-tax-protest-guide" className="text-primary underline underline-offset-4"> Texas property-tax protest process</Link>.
        </p>

        <SectionHeading>A Practical Recordkeeping Checklist</SectionHeading>
        <ul className="list-disc space-y-2 pl-6">
          <li>Maintain formation, registration, and registered-agent records.</li>
          <li>Reconcile gross revenue to federal tax returns and financial statements.</li>
          <li>Separate Texas revenue from revenue sourced to other states.</li>
          <li>Document cost-of-goods-sold and compensation calculations.</li>
          <li>Track ownership, officer, manager, and mailing-address changes.</li>
          <li>Save filed reports, extensions, confirmations, notices, and payments.</li>
          <li>Review Comptroller account status before financing or a major transaction.</li>
          <li>Put the May filing cycle on a recurring business compliance calendar.</li>
        </ul>

        <SectionHeading>Where the Franchise Tax Fits in Texas Business Policy</SectionHeading>
        <p>
          Texas competes for employers through a large labor market, central geography, energy infrastructure, ports,
          universities, and the absence of a personal state income tax. The franchise tax remains one of the recurring
          costs businesses must evaluate when comparing entity structures and locations. It is also a frequent subject of
          legislative debate because lawmakers must balance competitiveness, revenue, and administrative simplicity.
        </p>
        <p>
          Follow the <Link to="/texas-business" className="text-primary underline underline-offset-4">Texas Business hub</Link> for ongoing coverage of jobs,
          relocations, energy, real estate, and business policy. The <Link to="/texas-economy" className="text-primary underline underline-offset-4">Texas Economy section</Link> provides additional context on taxes and growth, while our
          <Link to="/legislative-updates" className="text-primary underline underline-offset-4"> Legislative Updates</Link> track changes moving through Austin.
        </p>

        <SectionHeading>Frequently Asked Questions</SectionHeading>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <section key={item.q} className="border-2 border-foreground/10 bg-card p-5">
              <h3 className="font-display text-xl">{item.q}</h3>
              <p className="mt-2 text-muted-foreground">{item.a}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
