import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "Can I have both a Texas driver license and a Texas identification card?",
    answer:
      "Texas DPS says a person who already holds a driver license generally must surrender that license when applying for a Texas identification card. A Texas ID card is intended for identification and does not authorize driving.",
  },
  {
    question: "What documents are required for a Texas ID card?",
    answer:
      "Applicants generally must prove identity, U.S. citizenship or lawful presence, Texas residency, and Social Security number. Names and dates of birth must match across the documents, and legal name-change records may be required.",
  },
  {
    question: "Does a Texas ID card qualify as REAL ID?",
    answer:
      "Texas issues REAL ID-compliant identification cards when the applicant satisfies the federal document requirements. A compliant card displays the star in the upper portion of the card.",
  },
  {
    question: "How long does a Texas ID card last?",
    answer:
      "Texas DPS generally issues standard identification cards for up to six years. Expiration periods and fees can differ for applicants age 60 or older, temporary lawful-presence credentials, and special categories.",
  },
  {
    question: "Can a senior surrender a Texas driver license for an ID card online?",
    answer:
      "Texas DPS offers a TxT option for certain U.S. citizens age 65 or older who hold a REAL ID-compliant Texas driver license or commercial driver license and want to voluntarily surrender it for an identification card.",
  },
];

function IdentificationCardPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas Identification Card" />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas DPS identification guide</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">How to Get a Texas Identification Card</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Learn who can apply, which documents to bring, how appointments work, what a Texas ID costs, how REAL ID affects the process, and what to expect after DPS accepts the application.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://www.dps.texas.gov/section/driver-license/how-apply-texas-identification-card" rel="noreferrer" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Open the official DPS ID guide</a>
            <a href="/dmv/dps-appointments" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Prepare for a DPS appointment</a>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 text-base leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold">A Texas ID card proves identity but does not permit driving</h2>
          <p className="mt-4">
            The Texas Department of Public Safety issues identification cards to Texas residents who need a government-issued photo credential but do not need or do not qualify for a driver license. The card can be used for routine identity purposes, but it does not grant driving privileges.
          </p>
          <p className="mt-4">
            DPS also states that a person who holds a driver license generally cannot keep that license and obtain a separate Texas identification card. The driver license must normally be surrendered when the ID application is completed. Anyone planning to stop driving should confirm the consequences before surrendering a valid license.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Documents DPS generally requires</h2>
          <p className="mt-4">A first-time applicant should expect to prove each of the following:</p>
          <ul className="mt-5 list-disc space-y-2 pl-6">
            <li>Identity.</li>
            <li>U.S. citizenship or lawful presence.</li>
            <li>Texas residency.</li>
            <li>Social Security number, unless DPS recognizes a specific exception.</li>
          </ul>
          <p className="mt-4">
            Texas residency usually requires two printed documents showing the applicant's name and residential address. One generally must show at least 30 days of Texas residency, although DPS lists exceptions and affidavit options for certain applicants. Names and birth dates should match across all documents. Bring original or certified records when required; photocopies of identity and name-change documents are often not accepted.
          </p>
          <p className="mt-4">
            Use the <a className="text-primary underline underline-offset-4" href="/dmv/driver-license-documents">Texas driver license and ID document checklist</a> before the appointment, especially when a marriage, divorce, adoption, court order, or other legal change created a name mismatch.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">How to apply at a DPS office</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6">
            <li>Complete the Texas identification card application before arriving or obtain the form at the office.</li>
            <li>Schedule an appointment through the official Texas Scheduler.</li>
            <li>Bring the identity, citizenship or lawful-presence, Texas residency, and Social Security documentation DPS requires.</li>
            <li>Provide a signature and thumbprints.</li>
            <li>Have a photograph taken.</li>
            <li>Pay the applicable fee.</li>
            <li>Review the temporary credential carefully before leaving the office.</li>
          </ol>
          <p className="mt-4">
            Texas DPS handles in-office driver license and identification services by appointment. Review the <a className="text-primary underline underline-offset-4" href="/dmv/dps-appointments">Texas DPS appointment guide</a> for scheduling, same-day opening, arrival, and cancellation guidance.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Texas ID fees and expiration periods</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3">Applicant or transaction</th><th className="px-4 py-3">Typical DPS treatment</th></tr></thead>
              <tbody className="divide-y">
                <tr><td className="px-4 py-3 font-semibold">Age 59 or younger</td><td className="px-4 py-3">Standard new or renewal ID fee; card generally expires after six years</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Age 60 or older</td><td className="px-4 py-3">Reduced fee and a longer or indefinite validity period may apply under the current DPS fee schedule</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Replacement or address change</td><td className="px-4 py-3">Separate transaction fee; online eligibility depends on the record</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Limited-term credential</td><td className="px-4 py-3">Expiration is tied to the verified lawful-presence period</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Fees and validity rules can change. Confirm the amount on the official <a className="text-primary underline underline-offset-4" href="https://www.dps.texas.gov/section/driver-license/driver-license-fees" rel="noreferrer">Texas DPS fee schedule</a> before applying.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">REAL ID and Texas identification cards</h2>
          <p className="mt-4">
            A Texas identification card can be REAL ID compliant. A compliant card displays the star and can be used for federal identification purposes, such as entering certain federal facilities or boarding a federally regulated domestic flight, subject to federal rules. Applicants who do not have a compliant card can use another federally accepted credential, such as a valid passport.
          </p>
          <p className="mt-4">
            Review the <a className="text-primary underline underline-offset-4" href="/dmv/real-id">Texas REAL ID guide</a> before the appointment. Do not assume an old Texas card automatically proves that DPS already has every federal document on file.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Special situations</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Applicants age 65 or older</h3><p className="mt-2 text-sm text-muted-foreground">Certain U.S. citizens age 65 or older with a REAL ID-compliant Texas driver license or CDL may use TxT to surrender the license and request an ID without an office visit.</p></div>
            <div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Temporary visitors and foreign students</h3><p className="mt-2 text-sm text-muted-foreground">DPS must verify lawful presence through federal systems. The card may be limited to the authorized stay, and additional verification can delay issuance.</p></div>
            <div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Disabled veterans</h3><p className="mt-2 text-sm text-muted-foreground">Some qualifying disabled veterans may receive a fee exemption. DPS documentation requirements still apply.</p></div>
            <div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Address confidentiality or unstable housing</h3><p className="mt-2 text-sm text-muted-foreground">Texas provides alternative residency and address procedures for certain protected applicants, foster youth, homeless youth, judges, military families, and others.</p></div>
          </div>
        </section>

        <section className="rounded-xl border bg-muted/20 p-6">
          <h2 className="text-2xl font-bold">Appointment checklist</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Completed ID application.</li>
            <li>Identity document or the required combination of documents.</li>
            <li>Citizenship or lawful-presence document.</li>
            <li>Two acceptable Texas residency documents, when required.</li>
            <li>Social Security information.</li>
            <li>Legal name-change records, if names do not match.</li>
            <li>Appointment confirmation and payment method.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Related Keep TX Red guides</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
              ["Driver License and ID Document Checklist", "/dmv/driver-license-documents"],
              ["Texas REAL ID Guide", "/dmv/real-id"],
              ["Replace a Lost Texas License or ID", "/dmv/replace-lost-license"],
              ["Change Address on a Texas License or ID", "/dmv/change-address"],
              ["Texas DMV vs. DPS", "/dmv/texas-dmv-vs-dps"],
            ].map(([title, href]) => <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">{title}<span className="mt-2 block text-sm text-primary">Open guide →</span></a>)}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div>
        </section>

        <p className="border-t pt-8 text-sm text-muted-foreground">Texas DPS requirements, fees, forms, and appointment rules can change. Confirm current instructions with DPS or Texas.gov before paying, surrendering a license, or traveling to an office.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/identification-card")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Identification Card: Requirements, Documents, Fees & REAL ID",
      description: "Learn how to get a Texas identification card, including DPS documents, residency proof, appointments, fees, REAL ID, senior options, and delivery.",
      path: "/dmv/identification-card",
      type: "article",
      keywords: "Texas identification card, Texas ID card requirements, get Texas ID, Texas DPS ID card, Texas REAL ID identification card",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Get a Texas Identification Card", url: `${SITE_URL}/dmv/identification-card`, isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL } }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Texas Identification Card", item: `${SITE_URL}/dmv/identification-card` }] }) },
      ],
    };
  },
  component: IdentificationCardPage,
});