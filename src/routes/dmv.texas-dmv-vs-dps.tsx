import { createFileRoute } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "Does the Texas DMV issue driver licenses?",
    answer: "No. Driver licenses, identification cards, REAL ID credentials, commercial driver licenses, and driving tests are handled by the Texas Department of Public Safety.",
  },
  {
    question: "Who handles Texas vehicle registration and title transfers?",
    answer: "Most public-facing vehicle registration, title transfer, license plate, disabled placard, and temporary registration transactions are completed through the county tax assessor-collector office in partnership with TxDMV.",
  },
  {
    question: "Do I need a DPS appointment for a driver license?",
    answer: "Texas DPS states that in-office driver license and identification card services are appointment-based. Eligible renewal, replacement, and address-change transactions may be available online.",
  },
  {
    question: "Which office should a new Texas resident visit first?",
    answer: "A new resident who owns a vehicle will generally register it through the county tax office before applying for a Texas driver license through DPS, because DPS may require evidence of Texas vehicle registration.",
  },
  {
    question: "Is a county tax office the same as a Texas DMV office?",
    answer: "Not exactly. The county tax assessor-collector is a local office that performs most title and registration services under statewide TxDMV rules. TxDMV also operates regional service centers for certain complex vehicle matters.",
  },
];

const rows = [
  ["Apply for or renew a driver license", "Texas DPS"],
  ["Apply for a Texas ID card or REAL ID", "Texas DPS"],
  ["Take a driving test", "Texas DPS"],
  ["Commercial driver license or endorsement", "Texas DPS"],
  ["Replace a lost driver license", "Texas DPS or eligible online service"],
  ["Check license status or reinstatement requirements", "Texas DPS"],
  ["Register or renew a vehicle", "County tax assessor-collector"],
  ["Transfer a vehicle title", "County tax assessor-collector"],
  ["Obtain standard or specialty plates", "County tax assessor-collector"],
  ["Apply for a disabled parking placard", "County tax assessor-collector"],
  ["Request temporary registration", "County tax assessor-collector"],
  ["Dealer licensing or motor-carrier regulation", "Texas DMV"],
  ["Complex title or registration assistance", "TxDMV regional service center or county tax office"],
] as const;

function TexasDmvVsDpsPage() {
  return (
    <main>
      <nav aria-label="Breadcrumb" className="mx-auto max-w-4xl px-4 pt-6 text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground hover:underline">Home</a>
        <span aria-hidden="true" className="px-2">/</span>
        <a href="/dmv" className="hover:text-foreground hover:underline">Texas DMV & Driver Services</a>
        <span aria-hidden="true" className="px-2">/</span>
        <span className="text-foreground">DMV vs. DPS</span>
      </nav>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <header className="border-b pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas agency guide</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas DMV vs. DPS: Which Office Do You Need?</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">
            Texas divides driver licensing and vehicle services among DPS, TxDMV, and county tax offices. This guide tells you where to start for the most common transactions.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Reviewed July 27, 2026</p>
        </header>

        <section className="mt-10 rounded-xl border-l-4 border-primary bg-muted/30 p-6">
          <h2 className="text-2xl font-bold">The quick answer</h2>
          <p className="mt-3 leading-relaxed">
            <strong>DPS handles the driver.</strong> Use the Texas Department of Public Safety for driver licenses, ID cards, REAL ID, driving tests, commercial licenses, and license-status matters.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>TxDMV and county tax offices handle the vehicle.</strong> Most Texans complete registration, title, and plate transactions through their county tax assessor-collector office, which works with the Texas Department of Motor Vehicles.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Texas DMV, DPS, and county tax offices are not interchangeable</h2>
          <p className="mt-4 leading-relaxed">
            In many states, residents use “DMV” as a general name for every driver and vehicle office. Texas separates those responsibilities. Going to a DPS Driver License Office for a title transfer will not solve the problem, and taking driver-license documents to a county tax office will not produce a license.
          </p>
          <p className="mt-4 leading-relaxed">
            The practical distinction is simple: a credential attached to a person usually belongs to DPS; a record attached to a vehicle usually belongs to TxDMV and the county tax office.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">What Texas DPS handles</h2>
          <p className="mt-4 leading-relaxed">
            The Texas Department of Public Safety operates the state’s driver-license program. DPS verifies identity and lawful presence, administers testing, issues driving credentials, and maintains driver eligibility records.
          </p>
          <ul className="mt-5 list-disc space-y-2 pl-6 leading-relaxed">
            <li>Original Texas driver licenses and identification cards</li>
            <li>Driver license renewals, replacements, and address changes</li>
            <li>REAL ID-compliant licenses and identification cards</li>
            <li>Knowledge tests, road tests, and motorcycle licensing</li>
            <li>Commercial driver licenses and endorsements</li>
            <li>Driver records, suspensions, reinstatement requirements, and occupational-license documentation</li>
          </ul>
          <p className="mt-5 leading-relaxed">
            DPS says in-office driver license and ID services are appointment-based. Some existing customers can complete eligible renewals, replacements, or address changes online, but original applications and transactions requiring document review usually require an office visit.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">What the Texas DMV handles</h2>
          <p className="mt-4 leading-relaxed">
            The Texas Department of Motor Vehicles administers statewide vehicle programs. Its responsibilities include the title and registration system, dealer licensing, motor-carrier regulation, specialty plates, and oversight of many vehicle-related processes.
          </p>
          <p className="mt-4 leading-relaxed">
            TxDMV is the state agency, but it is not where most residents complete routine registration and title work. Texas delegates most of those customer-facing transactions to county tax assessor-collector offices.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">What your county tax assessor-collector handles</h2>
          <p className="mt-4 leading-relaxed">
            County tax offices work in partnership with TxDMV and provide most routine vehicle title and registration services. Exact office locations, accepted payment methods, appointment rules, and available substations vary by county.
          </p>
          <ul className="mt-5 list-disc space-y-2 pl-6 leading-relaxed">
            <li>Registration renewals and registration receipts</li>
            <li>Vehicle title transfers and many title corrections</li>
            <li>License plates and registration stickers</li>
            <li>Address changes on motor-vehicle records</li>
            <li>Disabled parking placards and qualifying non-fee plates</li>
            <li>Temporary registration services</li>
          </ul>
          <p className="mt-5 leading-relaxed">
            Use the existing <a href="/find-my-dmv" className="font-semibold text-primary underline underline-offset-4">Texas vehicle registration estimator and office finder</a> to estimate common fees and locate the appropriate office for your county.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Task-by-task office guide</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">What you need to do</th>
                  <th className="px-4 py-3 font-semibold">Where to start</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map(([task, office]) => (
                  <tr key={task}>
                    <td className="px-4 py-3">{task}</td>
                    <td className="px-4 py-3 font-semibold">{office}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">New to Texas? The order matters</h2>
          <p className="mt-4 leading-relaxed">
            Texas gives new residents separate timelines for vehicles and driver licenses. State guidance says a new resident generally has 30 days to register a vehicle and may drive on a valid, unexpired out-of-state license for up to 90 days after moving.
          </p>
          <ol className="mt-5 list-decimal space-y-3 pl-6 leading-relaxed">
            <li>Confirm the current vehicle-insurance and registration requirements for your county.</li>
            <li>Complete the vehicle title and registration process through the county tax assessor-collector.</li>
            <li>Gather identity, residency, Social Security, lawful-presence, and vehicle-registration documents required by DPS.</li>
            <li>Schedule and complete the Texas driver-license transaction with DPS.</li>
          </ol>
          <p className="mt-5 leading-relaxed">
            The <a href="https://texasdefined.com/moving-to-texas" className="font-semibold text-primary underline underline-offset-4" rel="noreferrer">TexasDefined Moving to Texas guide and checklist</a> organize these steps with the rest of a Texas relocation.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Common mistakes that cause wasted trips</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              ["Booking the wrong office", "A DPS appointment cannot complete a vehicle title transfer, and a county tax office cannot issue a driver license."],
              ["Assuming every county works the same way", "Office hours, substations, appointment policies, payment methods, and document intake can differ by county."],
              ["Relying on a document list from memory", "Identity, residency, insurance, ownership, inspection, and registration requirements depend on the transaction."],
              ["Waiting until the deadline", "Missing documents, title defects, insurance mismatches, or unavailable appointments can turn a one-step transaction into several visits."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border bg-card p-5">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Official Texas starting points</h2>
          <p className="mt-4 leading-relaxed">
            Use official agency tools for live appointment availability, current forms, transaction eligibility, office hours, and fees. Keep TX Red explains the process, but the agency or county office controls the transaction.
          </p>
          <ul className="mt-5 space-y-3">
            <li><a className="font-semibold text-primary underline underline-offset-4" href="https://www.dps.texas.gov/section/driver-license" rel="noreferrer">Texas DPS Driver License Services</a></li>
            <li><a className="font-semibold text-primary underline underline-offset-4" href="https://www.txdmv.gov/" rel="noreferrer">Texas Department of Motor Vehicles</a></li>
            <li><a className="font-semibold text-primary underline underline-offset-4" href="https://www.txdmv.gov/tax-assessor-collectors/county-tax-offices" rel="noreferrer">TxDMV County Tax Office Locator</a></li>
            <li><a className="font-semibold text-primary underline underline-offset-4" href="https://www.texas.gov/moving-to-texas/" rel="noreferrer">Texas.gov New Resident Guidance</a></li>
          </ul>
        </section>

        <section className="mt-12 border-t pt-10">
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faq.map((item) => (
              <details key={item.question} className="rounded-xl border bg-card p-5">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <aside className="mt-12 rounded-xl border bg-muted/30 p-6">
          <h2 className="text-2xl font-bold">Continue with Texas driver and vehicle services</h2>
          <p className="mt-3 text-muted-foreground">
            Return to the <a href="/dmv" className="font-semibold text-primary underline underline-offset-4">Texas DMV & Driver Services hub</a> for current and upcoming guides, or use the <a href="/find-my-dmv" className="font-semibold text-primary underline underline-offset-4">office finder and registration estimator</a> for a vehicle transaction.
          </p>
        </aside>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          This guide provides general information, not legal advice. Requirements and office procedures can change. Verify your transaction with DPS, TxDMV, or the county tax assessor-collector before traveling.
        </p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/texas-dmv-vs-dps")({
  head: () => {
    const title = "Texas DMV vs. DPS: Which Office Do You Need?";
    const description = "Learn whether Texas DPS, TxDMV, or your county tax office handles driver licenses, REAL ID, registration, titles, plates, CDL services, and more.";
    const seo = buildSeo({
      title,
      description,
      path: "/dmv/texas-dmv-vs-dps",
      type: "article",
      keywords: "Texas DMV vs DPS, Texas DPS driver license, Texas vehicle registration office, Texas county tax office, TxDMV",
    });

    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            datePublished: "2026-07-27",
            dateModified: "2026-07-27",
            mainEntityOfPage: `${SITE_URL}/dmv/texas-dmv-vs-dps`,
            author: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
            about: [
              { "@type": "GovernmentOrganization", name: "Texas Department of Public Safety" },
              { "@type": "GovernmentOrganization", name: "Texas Department of Motor Vehicles" },
            ],
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
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` },
              { "@type": "ListItem", position: 3, name: "Texas DMV vs. DPS", item: `${SITE_URL}/dmv/texas-dmv-vs-dps` },
            ],
          }),
        },
      ],
    };
  },
  component: TexasDmvVsDpsPage,
});