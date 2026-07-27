import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const PAGE_PATH = "/texas-business-licenses-permits-guide";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const IMAGE_URL = `${SITE_URL}/images/texas-business-licenses-permits-guide.svg`;

const faq = [
  {
    question: "Does Texas require a general business license?",
    answer:
      "No. Texas does not require one statewide general business license. A business may still need entity filings, an assumed-name filing, tax registrations, professional or industry licenses, and city or county permits.",
  },
  {
    question: "Who needs a Texas sales tax permit?",
    answer:
      "Businesses generally need a Texas sales and use tax permit when they sell, lease, or rent taxable goods, provide taxable services, or otherwise meet Texas sales-tax nexus requirements. The permit itself has no application fee, although the Comptroller may require security in some cases.",
  },
  {
    question: "Can I operate from home in Texas?",
    answer:
      "Often, but home-based businesses remain subject to local zoning, deed restrictions, lease terms, health rules, signage limits, parking rules, and any activity-specific licensing requirements.",
  },
  {
    question: "Do online businesses need local permits?",
    answer:
      "They can. An online business may still need entity registration, sales-tax registration, a home-occupation approval, assumed-name filing, professional licensing, or local permits based on where and how it operates.",
  },
  {
    question: "What happens if a required license expires?",
    answer:
      "Consequences depend on the license and agency, but they can include fines, late fees, stop-work orders, loss of authority to operate, enforcement actions, or difficulty renewing other permits. Track every renewal date and responsible agency in one compliance calendar.",
  },
];

export const Route = createFileRoute(PAGE_PATH)({
  head: () => ({
    meta: [
      { title: "Texas Business Licenses and Permits Guide | Keep TX Red" },
      {
        name: "description",
        content:
          "A practical guide to Texas business licenses, sales tax permits, professional licensing, local approvals, home-based business rules, and renewal tracking.",
      },
      { property: "og:title", content: "Texas Business Licenses and Permits Guide" },
      {
        property: "og:description",
        content:
          "Learn which Texas businesses need permits, where to apply, and how state and local requirements fit together.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Texas Business Licenses and Permits Guide" },
      { name: "twitter:image", content: IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Texas Business Licenses and Permits Guide",
          description:
            "A practical guide to state and local licensing, tax permits, professional credentials, and compliance for Texas businesses.",
          image: IMAGE_URL,
          mainEntityOfPage: PAGE_URL,
          author: { "@type": "Organization", name: "Keep TX Red" },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          datePublished: "2026-07-26",
          dateModified: "2026-07-26",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Texas Business", item: `${SITE_URL}/texas-business` },
            { "@type": "ListItem", position: 3, name: "Business Licenses and Permits", item: PAGE_URL },
          ],
        }),
      },
    ],
  }),
  component: TexasBusinessLicensesPermitsGuide,
});

function TexasBusinessLicensesPermitsGuide() {
  return (
    <main className="bg-background text-foreground">
      <header className="border-b-4 border-foreground bg-secondary/10">
        <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary hover:underline">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link to="/texas-business" className="hover:text-primary hover:underline">Texas Business</Link>
            <span aria-hidden="true"> / Business licenses and permits</span>
          </nav>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Texas Small Business Guide</span>
          <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Texas Business Licenses and Permits: What You Need Before Opening
          </h1>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
            Texas does not issue a single statewide general business license. That does not mean a new business can simply open its doors without approvals. The real system is a stack of entity filings, tax registrations, professional credentials, industry permits, and local rules that depends on what you sell, where you operate, and how the public interacts with your business.
          </p>
          <p className="mt-5 text-sm text-muted-foreground">Updated July 26, 2026 · General information, not legal or tax advice</p>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-12 font-serif text-[17px] leading-8">
        <figure className="mb-12 overflow-hidden border-2 border-foreground bg-card">
          <img
            src="/images/texas-business-licenses-permits-guide.svg"
            alt="Illustrated checklist showing Texas business registration, tax permit, local approval, and professional license steps"
            className="h-auto w-full"
            width={1600}
            height={900}
          />
          <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
            Texas businesses often answer to several agencies rather than one universal licensing office.
          </figcaption>
        </figure>

        <section className="mb-12 rounded-none border-l-4 border-primary bg-secondary/10 p-6 font-sans">
          <h2 className="text-xl font-bold">The five-part Texas compliance check</h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 sm:grid-cols-2">
            <li><strong>1. Business identity:</strong> entity formation or assumed-name filing.</li>
            <li><strong>2. Tax registration:</strong> sales tax and other activity-specific taxes.</li>
            <li><strong>3. Professional licensing:</strong> credentials for regulated occupations.</li>
            <li><strong>4. Industry permits:</strong> approvals tied to products, facilities, or activities.</li>
            <li><strong>5. Local permission:</strong> zoning, occupancy, health, fire, signage, and home-use rules.</li>
          </ol>
        </section>

        <h2 className="font-display text-3xl tracking-tight">Texas Has No General State Business License</h2>
        <p className="mt-4">
          One of the most repeated claims about starting a company in Texas is also one of the most misunderstood: Texas does not require a general statewide business license. The Governor&apos;s Business Permit Office confirms that there is no single license every company purchases merely to operate. Instead, a business establishes its legal identity through the Texas Secretary of State or, in some cases, through an assumed-name filing with a county clerk.
        </p>
        <p className="mt-4">
          That distinction matters. Forming an LLC is not the same thing as obtaining every license the LLC needs. A certificate of formation creates the entity. It does not automatically authorize the company to sell alcohol, prepare food, practice a regulated profession, operate a child-care facility, install electrical systems, or occupy a commercial building. Those permissions come from separate agencies.
        </p>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Step 1: Establish the Business Name and Legal Structure</h2>
        <p className="mt-4">
          Texas corporations, limited liability companies, and limited partnerships are generally created by filing formation documents with the Secretary of State. A sole proprietor may operate without creating a separate entity, but an assumed-name certificate may be required when the public-facing name differs from the owner&apos;s legal name. Partnerships and entities using alternate names may also have assumed-name obligations.
        </p>
        <p className="mt-4">
          An LLC or corporation must maintain a registered agent and a physical registered office in Texas. The registered agent receives lawsuits and official notices. It is not a decorative line on the formation form; failure to maintain one can cause missed legal documents and jeopardize good standing.
        </p>
        <p className="mt-4">
          Before choosing an entity, consider liability exposure, management, ownership, financing, federal tax treatment, and ongoing Texas reporting. After formation, read our <Link to="/texas-franchise-tax-guide" className="font-semibold text-primary underline underline-offset-4">Texas franchise tax guide</Link> so you understand the Comptroller filings that can apply even when no tax is due.
        </p>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Step 2: Determine Whether You Need a Texas Sales Tax Permit</h2>
        <p className="mt-4">
          A Texas sales and use tax permit is commonly required when a business sells tangible personal property, leases or rents taxable property, or provides taxable services. Out-of-state sellers can also create Texas collection duties when they meet the state&apos;s economic-nexus rules. The Comptroller currently identifies $500,000 in Texas revenue during the preceding twelve months as the economic-nexus threshold for remote sellers.
        </p>
        <p className="mt-4">
          There is no application fee for the permit, although the Comptroller may require a security bond in some circumstances. Once approved, the permit holder must collect tax on taxable sales, file returns on the assigned schedule, remit the tax, maintain records, and display the permit at the business location. A zero-sales period does not necessarily eliminate the filing requirement; permit holders generally still submit the required return.
        </p>
        <p className="mt-4">
          Texas imposes a 6.25 percent state sales and use tax. Cities, counties, transit authorities, and special-purpose districts may add up to 2 percent, producing a maximum combined rate of 8.25 percent. The correct local rate can depend on the seller&apos;s location, the customer&apos;s location, delivery, and the type of transaction, so businesses should use the Comptroller&apos;s address-based rate tools rather than guessing.
        </p>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Step 3: Check Professional and Occupational Licensing</h2>
        <p className="mt-4">
          Texas regulates many occupations through specialized boards and agencies. Examples include health-care professionals, attorneys, accountants, engineers, architects, real-estate professionals, barbers and cosmetologists, electricians, air-conditioning contractors, plumbers, security companies, and child-care operators. Requirements may attach to the individual professional, the business entity, or both.
        </p>
        <p className="mt-4">
          Do not assume that hiring a licensed worker solves the company&apos;s licensing problem. Some industries require a separate company registration, a qualifying responsible person, insurance, bonding, continuing education, background checks, inspections, or a license displayed at each location. Confirm whether the license belongs to the person, the firm, the facility, or the specific project.
        </p>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Step 4: Identify Activity-Specific State Permits</h2>
        <p className="mt-4">
          The state&apos;s licensing map follows the activity. Restaurants and food manufacturers may interact with state or local health authorities. Alcohol sellers work with the Texas Alcoholic Beverage Commission. Transportation businesses may need motor-carrier authority, vehicle credentials, or federal approvals. Environmental permits can apply to air emissions, wastewater, stormwater, waste handling, and industrial operations. Agricultural, fuel, insurance, financial, firearms, gaming, and public-safety activities each have their own regulators.
        </p>
        <p className="mt-4">
          The Governor&apos;s Business Permit Office publishes a Texas Business Licenses and Permits Guide organized by industry and agency. Use that guide as a screening tool, then verify every requirement with the issuing agency. The permit office helps businesses navigate the system but does not issue the licenses itself.
        </p>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Step 5: Clear City and County Requirements</h2>
        <p className="mt-4">
          Many expensive startup delays occur locally, after the state paperwork is complete. A city may require a certificate of occupancy, zoning confirmation, building permit, fire inspection, food permit, health inspection, sign permit, alarm permit, vendor permit, or registration for a particular trade. Counties may regulate septic systems, floodplain development, food establishments, driveway access, and other activities outside city limits.
        </p>
        <p className="mt-4">
          Never sign a long commercial lease solely because the space looks suitable. Confirm that the intended use is allowed, whether a change of use triggers building upgrades, whether adequate parking is required, and who pays for code compliance. A location previously used as an office may not be approved for a restaurant, child-care center, auto shop, assembly venue, or medical practice.
        </p>
        <p className="mt-4">
          Local property taxes can also affect the real cost of operating. Businesses may owe tax on real estate and taxable business personal property. Our <Link to="/tax-calculator" className="font-semibold text-primary underline underline-offset-4">Texas property tax calculator</Link> and <Link to="/texas-property-tax-protest-guide" className="font-semibold text-primary underline underline-offset-4">property tax protest guide</Link> provide useful background for budgeting and reviewing assessments.
        </p>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Home-Based and Online Businesses</h2>
        <p className="mt-4">
          A home-based business is still a business. City zoning or home-occupation rules may limit customer traffic, outside employees, deliveries, storage, noise, signs, commercial vehicles, or visible changes to the property. A lease can prohibit business use, and deed restrictions or an HOA may impose additional limits. Review our <Link to="/texas-hoa-laws-guide" className="font-semibold text-primary underline underline-offset-4">Texas HOA laws guide</Link> before assuming residential use is unrestricted.
        </p>
        <p className="mt-4">
          Online sellers face many of the same requirements as storefronts. Selling through a marketplace does not automatically remove all tax and licensing duties. Marketplace providers may collect tax on marketplace sales, but sellers can still have filing obligations, direct-channel sales, inventory locations, employees, or other activities that create separate responsibilities.
        </p>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Hiring Employees Adds Another Compliance Layer</h2>
        <p className="mt-4">
          Employers must address federal employment eligibility, payroll withholding, wage records, new-hire reporting, unemployment tax, workplace safety, and posters. Texas employers generally register with the Texas Workforce Commission when they become liable for unemployment tax. Businesses should also classify workers carefully; calling someone an independent contractor does not control the legal result when the actual working relationship indicates employment.
        </p>
        <p className="mt-4">
          Industry licenses may impose additional staffing rules, such as background checks, training hours, supervision ratios, continuing education, or credential verification. Build these requirements into hiring and scheduling rather than treating them as an afterthought.
        </p>

        <h2 className="mt-12 font-display text-3xl tracking-tight">A Practical Permit Search Workflow</h2>
        <ol className="mt-5 space-y-4 pl-6 marker:font-bold marker:text-primary">
          <li><strong>Describe every activity.</strong> List what you sell, manufacture, install, transport, serve, store, or advise on.</li>
          <li><strong>Map every location.</strong> Include offices, homes, warehouses, temporary events, vehicles, and remote inventory.</li>
          <li><strong>Identify regulators.</strong> Search the state permits guide, professional boards, the Comptroller, city departments, and county offices.</li>
          <li><strong>Verify prerequisites.</strong> Ask about zoning, inspections, insurance, bonds, responsible parties, training, and background checks.</li>
          <li><strong>Sequence applications.</strong> Some permits require an entity number, EIN, site plan, occupancy approval, or another license first.</li>
          <li><strong>Document the answer.</strong> Save agency emails, application receipts, permit numbers, inspection records, and renewal dates.</li>
          <li><strong>Recheck before expanding.</strong> A second location, new product, delivery service, employee, or remodel can trigger new requirements.</li>
        </ol>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Common Mistakes That Delay Texas Openings</h2>
        <ul className="mt-5 space-y-3 pl-6">
          <li><strong>Confusing LLC formation with licensing.</strong> The entity can exist while the proposed activity remains unauthorized.</li>
          <li><strong>Ignoring local approvals.</strong> State permission does not override zoning, occupancy, fire, health, or building codes.</li>
          <li><strong>Applying under inconsistent names.</strong> Entity names, assumed names, tax accounts, bank records, and leases should align.</li>
          <li><strong>Opening before inspection.</strong> Some permits require approval before equipment is installed, inventory is received, or customers enter.</li>
          <li><strong>Missing zero-activity filings.</strong> Tax accounts and licenses can require reports even during periods with no sales.</li>
          <li><strong>Forgetting renewals.</strong> A license may expire annually, biennially, by location, or with the credential of a responsible individual.</li>
        </ul>

        <h2 className="mt-12 font-display text-3xl tracking-tight">Build a Compliance Calendar</h2>
        <p className="mt-4">
          Keep one master record containing the issuing agency, license name, number, covered location, responsible employee, issue date, renewal deadline, continuing-education requirement, insurance expiration, inspection date, login credentials, and fee. Set reminders well before expiration, especially where renewal depends on an inspection, fingerprinting, bond, or certificate of insurance.
        </p>
        <p className="mt-4">
          Review the calendar whenever ownership changes, the business moves, a new location opens, services expand, or the company begins selling in another jurisdiction. Compliance is not a one-time opening-day task; it changes with the business.
        </p>

        <aside className="mt-12 border-2 border-foreground bg-secondary/10 p-6 font-sans">
          <h2 className="text-2xl font-bold">Related Keep TX Red resources</h2>
          <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <li><Link to="/texas-franchise-tax-guide" className="font-semibold text-primary underline underline-offset-4">Texas franchise tax guide</Link></li>
            <li><Link to="/texas-business" className="font-semibold text-primary underline underline-offset-4">Texas business and economy</Link></li>
            <li><Link to="/moving-to-texas-checklist" className="font-semibold text-primary underline underline-offset-4">Moving to Texas checklist</Link></li>
            <li><Link to="/texas-laws" className="font-semibold text-primary underline underline-offset-4">Texas laws explained</Link></li>
            <li><Link to="/texas-budget-planner" className="font-semibold text-primary underline underline-offset-4">Texas budget planner</Link></li>
            <li><Link to="/texas-cost-of-living-calculator" className="font-semibold text-primary underline underline-offset-4">Texas cost-of-living calculator</Link></li>
          </ul>
        </aside>

        <section className="mt-14 border-t-4 border-foreground pt-10">
          <h2 className="font-display text-3xl tracking-tight">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6">
            {faq.map((item) => (
              <div key={item.question} className="border-b border-border pb-6">
                <h3 className="font-sans text-lg font-bold">{item.question}</h3>
                <p className="mt-2 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
          <h2 className="font-sans text-base font-bold text-foreground">Primary official resources</h2>
          <p className="mt-3">
            Texas Governor&apos;s Business Permit Office and Start a Business portal; Texas Secretary of State business-formation resources; Texas Comptroller sales and use tax guidance; and the Texas Workforce Commission employer guide. Requirements vary by activity and locality, so verify them with the issuing agency before operating.
          </p>
        </section>
      </article>
    </main>
  );
}
