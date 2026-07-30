import { createFileRoute, Link } from "@tanstack/react-router";

const faqs = [
  {
    question: "What is the usual Texas property tax protest deadline?",
    answer:
      "In most cases, the deadline is May 15 or 30 days after the appraisal district mails the notice of appraised value, whichever is later. Check the deadline printed on your notice and confirm it with your county appraisal district.",
  },
  {
    question: "Can I protest even if my appraised value did not increase?",
    answer:
      "Yes. A property owner may protest several appraisal-district actions, including market value, unequal appraisal, exemption decisions, ownership records, and other matters that affect the property. Select every applicable reason when filing.",
  },
  {
    question: "What evidence is useful in a Texas appraisal protest?",
    answer:
      "Useful evidence can include recent comparable sales, photographs, repair estimates, inspection reports, closing documents, measurements, corrected property characteristics, and examples showing that similar properties are appraised differently.",
  },
  {
    question: "Do I have to attend an ARB hearing?",
    answer:
      "Follow the instructions from your appraisal district. Texas procedures may allow an appearance in person, by telephone or videoconference, or through a written affidavit, depending on the district and the request made. Missing required steps can jeopardize the protest.",
  },
  {
    question: "Does winning a protest permanently set my value?",
    answer:
      "No. An appraisal review board decision generally applies only to the tax year being protested. The appraisal district can appraise the property again in a later year using the law and information applicable to that year.",
  },
];

export const Route = createFileRoute("/texas-property-tax-protest-guide")({
  head: () => {
    const title = "Texas Property Tax Protest Guide 2026 | Deadlines, Evidence & ARB Hearings";
    const description =
      "Learn how to protest a Texas property appraisal in 2026, including filing deadlines, evidence, informal reviews, ARB hearings, appeals, and practical preparation steps.";
    const url = "https://keeptxred.com/texas-property-tax-protest-guide";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            dateModified: "2026-07-24",
            datePublished: "2026-07-24",
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "Keep TX Red" },
            publisher: { "@type": "Organization", name: "Keep TX Red", url: "https://keeptxred.com" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com/" },
              { "@type": "ListItem", position: 2, name: "Texas Property Tax Calculator", item: "https://keeptxred.com/tax-calculator" },
              { "@type": "ListItem", position: 3, name: "Property Tax Protest Guide", item: url },
            ],
          }),
        },
      ],
    };
  },
  component: PropertyTaxProtestGuide,
});

function PropertyTaxProtestGuide() {
  return (
    <main>
      <header className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Texas homeowner guide</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Texas Property Tax Protest Guide 2026
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/85">
            A practical step-by-step guide to reviewing your appraisal notice, filing a timely protest,
            preparing evidence, handling an informal review, and presenting your case to the appraisal review board.
          </p>
          <p className="mt-4 text-sm text-white/80">Updated July 24, 2026</p>
        </div>
      </header>

      <article className="prose prose-gray mx-auto max-w-4xl px-4 py-12 prose-headings:scroll-mt-24 prose-a:text-primary">
        <p className="lead">
          Texas property taxes are based on taxable value and local tax rates. A protest challenges an
          appraisal-district action, most commonly the market value or equal-and-uniform appraisal of a
          property. It is not a complaint about the tax rate adopted by a city, county, school district,
          or special district. A well-prepared protest focuses on facts that the appraisal review board can evaluate.
        </p>

        <div className="not-prose my-8 rounded-xl border-l-4 border-primary bg-muted p-5">
          <strong>Start with the estimate:</strong>{" "}
          <Link to="/tax-calculator" className="font-semibold text-primary underline">
            Use the Texas Property Tax Calculator
          </Link>{" "}
          to see how value, exemptions, county, city, and school-district rates can affect the annual bill.
        </div>

        <h2>1. Read the notice and identify the deadline</h2>
        <p>
          Review the notice of appraised value as soon as it arrives. Confirm the property address, owner,
          legal description, land and improvement values, exemptions, property characteristics, and the
          protest deadline printed on the notice. In most cases, a Texas protest is due by May 15 or 30 days
          after the appraisal district mails the notice, whichever is later. Special circumstances can create
          different deadlines, so use the date on the notice and verify it with the appraisal district.
        </p>
        <p>
          Do not wait for complete evidence before filing. A timely notice of protest preserves the right to
          continue preparing the case. Texas Comptroller Form 50-132 is commonly used, although a written
          protest that identifies the owner, property, and subject of dissatisfaction may be sufficient under
          state procedures. Follow the local district's filing instructions and retain proof of submission.
        </p>

        <h2>2. Choose the correct protest grounds</h2>
        <p>
          Market value and unequal appraisal are related but different arguments. A market-value protest says
          the district's estimate exceeds what the property would likely have sold for on the relevant appraisal
          date. An unequal-appraisal protest says the property is appraised inconsistently compared with a
          reasonable group of similar properties. Other protest grounds may involve exemptions, incorrect
          ownership, property descriptions, agricultural appraisal, taxability, or failure to receive required notice.
        </p>
        <p>
          Select every ground that genuinely applies. A homeowner may have both a market-value argument and an
          unequal-appraisal argument. Avoid making unsupported claims. A concise case tied to documents,
          photographs, measurements, and comparable properties is easier to evaluate than a broad complaint about taxes.
        </p>

        <h2>3. Request and review the appraisal district's evidence</h2>
        <p>
          Property owners have the right to request non-confidential information the appraisal district intends
          to use at the hearing. Review the district's comparable sales, adjustment grid, property record card,
          photographs, maps, condition assumptions, square footage, quality grade, and neighborhood assignment.
          Check whether the comparison properties are genuinely similar in location, size, age, condition, lot,
          renovations, amenities, and sale date.
        </p>
        <p>
          Errors often become clear at this stage. The district may show an incorrect living area, extra bathroom,
          pool, garage, finished space, construction quality, or condition. Document each error with reliable
          evidence rather than simply stating that the record is wrong.
        </p>

        <h2>4. Build a focused evidence packet</h2>
        <p>Strong evidence may include:</p>
        <ul>
          <li>Recent sales of similar properties near the appraisal date.</li>
          <li>A settlement statement or closing disclosure from a recent arm's-length purchase.</li>
          <li>Photographs showing deferred maintenance, storm damage, foundation concerns, or inferior condition.</li>
          <li>Dated contractor estimates, inspection reports, engineering reports, or repair invoices.</li>
          <li>Measurements, surveys, permits, or plans correcting the district's property characteristics.</li>
          <li>Comparable appraisal records supporting an equal-and-uniform argument.</li>
          <li>A professional appraisal when the value at stake justifies the cost.</li>
        </ul>
        <p>
          Organize the packet in the order you plan to present it. Include a one-page summary stating the district's
          value, the value you are requesting, the protest grounds, and the strongest supporting facts. Label
          photographs and comparable properties. Remove irrelevant material that distracts from the central issue.
        </p>

        <h2>5. Use the informal review effectively</h2>
        <p>
          Many appraisal districts offer an informal conference before the formal ARB hearing. Treat it as a real
          opportunity to resolve factual errors or reach an agreed value. Present the strongest evidence first,
          ask how the district calculated its value, and request an explanation of adjustments that appear inconsistent.
        </p>
        <p>
          Evaluate an offer based on the evidence and the likely tax effect, not merely whether it is lower than the
          original notice. Confirm whether an agreement resolves all protest grounds and whether accepting it waives
          the formal hearing. Keep copies of any signed agreement or updated value notice.
        </p>

        <h2>6. Prepare for the appraisal review board hearing</h2>
        <p>
          The ARB is a local body that hears disputes between property owners and appraisal districts. The hearing
          is generally structured, time-limited, and focused on the tax year under protest. Arrive or connect early,
          follow the district's instructions, and bring the required number of evidence copies or submit digital
          materials by the stated deadline.
        </p>
        <p>
          A clear presentation usually works best: identify the property, state the requested value, explain the
          protest grounds, present the best three to five pieces of evidence, respond to the district's comparables,
          and close by repeating the requested value. Be factual and respectful. The ARB determines appraisal issues;
          it does not control the local tax rates or the amount of government spending.
        </p>

        <h2>7. Understand the decision and possible appeals</h2>
        <p>
          The ARB will issue an order determining the protest. Review it immediately and note every appeal deadline.
          Depending on the property, value, and dispute, further review may be available through district court,
          regular binding arbitration, or the State Office of Administrative Hearings. Eligibility, deposits, filing
          requirements, and deadlines differ. Consider qualified legal or appraisal advice when the amount at stake
          or the procedural complexity warrants it.
        </p>
        <p>
          An ARB decision generally applies only to the protested tax year. Keep the evidence packet because it can
          help identify changes in the next appraisal, but update sales, photographs, repair estimates, and comparison
          records each year rather than assuming the prior result will automatically carry forward.
        </p>

        <h2>Practical protest checklist</h2>
        <ol>
          <li>Read the notice and calendar the printed deadline.</li>
          <li>File the protest early and save confirmation.</li>
          <li>Select all applicable protest grounds.</li>
          <li>Request the appraisal district's evidence.</li>
          <li>Verify property characteristics and exemptions.</li>
          <li>Prepare sales, condition, repair, and unequal-appraisal evidence.</li>
          <li>Create a one-page summary with the requested value.</li>
          <li>Attend the informal review and document any agreement.</li>
          <li>Prepare a short, evidence-first ARB presentation.</li>
          <li>Read the order and calendar any appeal deadline.</li>
        </ol>

        <h2>Frequently asked questions</h2>
        {faqs.map((faq) => (
          <section key={faq.question} className="not-prose border-b py-5 last:border-b-0">
            <h3 className="text-xl font-bold">{faq.question}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
          </section>
        ))}

        <h2>Official Texas resources</h2>
        <ul>
          <li><a href="https://comptroller.texas.gov/taxes/property-tax/protests/" rel="noreferrer">Texas Comptroller: Appraisal Protests and Appeals</a></li>
          <li><a href="https://comptroller.texas.gov/taxes/property-tax/calendars/deadlines.php" rel="noreferrer">Texas Property Tax Law Deadlines</a></li>
          <li><a href="https://comptroller.texas.gov/taxes/property-tax/forms/" rel="noreferrer">Texas Comptroller Property Tax Forms</a></li>
          <li><a href="https://comptroller.texas.gov/taxes/property-tax/bill-of-rights.php" rel="noreferrer">Property Taxpayers' Bill of Rights</a></li>
        </ul>

        <p className="rounded-xl bg-amber-50 p-5 text-sm text-amber-950">
          This guide provides general educational information, not legal, tax, appraisal, or representation advice.
          Procedures and deadlines can vary based on the notice, property, county, and circumstances. Confirm current
          requirements with the applicable appraisal district and seek qualified advice when needed.
        </p>
      </article>
    </main>
  );
}
