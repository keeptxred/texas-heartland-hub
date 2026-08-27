import { createFileRoute } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "How long does a new Texas resident have to get a Texas driver license?",
    answer:
      "A new Texas resident may generally drive with a valid, unexpired license from another U.S. state, U.S. territory, Canadian province, or qualifying country for up to 90 days after moving to Texas.",
  },
  {
    question: "Does a first-time Texas driver license applicant need an appointment?",
    answer:
      "Yes. First-time applicants and people transferring an out-of-state license must visit a Texas DPS driver license office in person. DPS currently provides in-office driver license and identification services by appointment.",
  },
  {
    question: "Do new residents have to take the written and driving tests?",
    answer:
      "Applicants surrendering a valid, unexpired license from another U.S. state, U.S. territory, or Canada are generally not required to take the knowledge or skills exams. Other applicants may need testing based on age, prior licensing, and reciprocity rules.",
  },
  {
    question: "Do I need to register my vehicle before applying for a Texas driver license?",
    answer:
      "New residents surrendering an out-of-state driver license should bring evidence of Texas registration and insurance for each vehicle they own. A person who does not own a vehicle signs a statement confirming that fact.",
  },
];

function TexasDriverLicensePage() {
  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas DPS driver services</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Complete Guide to Getting a Texas Driver License</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            The practical process for first-time applicants, new Texas residents, adults, and drivers transferring an out-of-state license.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-8 px-4 py-14 text-base leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold">Start with the correct agency</h2>
          <p className="mt-4">
            Texas driver licenses are issued by the Texas Department of Public Safety, not the Texas Department of Motor Vehicles. TxDMV and county tax offices handle vehicle titles and registration. DPS handles licenses, identification cards, REAL ID, testing, and driving records. Review our <a className="font-semibold text-primary hover:underline" href="/dmv/texas-dmv-vs-dps">Texas DMV vs. DPS guide</a> before making an appointment if your transaction involves both a vehicle and a driver credential.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Who must apply in person</h2>
          <p className="mt-4">
            First-time Texas applicants and people transferring a license from another state must visit a DPS driver license office. Eligible existing Texas license holders may be able to renew, replace, or change an address online, but an original Texas license requires an in-person identity and document review.
          </p>
          <p className="mt-4">
            DPS appointments can be scheduled up to 180 days in advance. Appointment availability varies by office, so begin early rather than waiting until a moving or employment deadline is close.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Texas driver license process</h2>
          <ol className="mt-5 space-y-4 list-decimal pl-6">
            <li><strong>Determine your applicant category.</strong> Requirements differ for a new resident transferring a valid license, an adult who has never been licensed, a teen, and a person applying under an international reciprocity agreement.</li>
            <li><strong>Gather original or certified documents.</strong> Bring proof of identity, U.S. citizenship or lawful presence, Texas residency, and your Social Security number. See the <a className="font-semibold text-primary hover:underline" href="/dmv/driver-license-documents">Texas driver license document checklist</a>.</li>
            <li><strong>Handle Texas vehicle requirements.</strong> New residents who own vehicles should complete Texas registration before the DPS appointment and bring evidence of registration and insurance.</li>
            <li><strong>Complete required driver education.</strong> Applicants ages 18 through 24 generally must complete an approved adult driver education course. Teen applicants have separate education, enrollment, and parent or guardian requirements.</li>
            <li><strong>Schedule the DPS appointment.</strong> Use the official Texas DPS appointment scheduler and select the service that matches an original application or out-of-state transfer.</li>
            <li><strong>Complete testing when required.</strong> Depending on your prior license, age, and applicant category, DPS may require a vision test, knowledge exam, and driving skills test.</li>
            <li><strong>Review the temporary license.</strong> Confirm your name, address, restrictions, and other printed information before leaving the office. The permanent card is mailed after issuance.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-3xl font-bold">New Texas residents</h2>
          <p className="mt-4">
            A new resident may generally drive on a valid, unexpired license from another U.S. state, U.S. territory, Canadian province, or qualifying country for up to 90 days after moving to Texas. Do not treat the 90-day period as a recommended waiting period; appointment availability and document problems can consume much of that window.
          </p>
          <p className="mt-4">
            Applicants surrendering a valid, unexpired license from another U.S. state, U.S. territory, or Canada are generally exempt from the knowledge and driving skills exams. Texas also has specific reciprocity arrangements with France, Germany, South Korea, the United Arab Emirates, and Taiwan. The exemption depends on the license being valid and on surrender or other DPS conditions.
          </p>
          <p className="mt-4">
            Coordinate the license transfer with your vehicle registration steps using the <a className="font-semibold text-primary hover:underline" href="https://texasdefined.com/moving-to-texas">interactive Texas moving checklist</a>, the <a className="font-semibold text-primary hover:underline" href="https://texasdefined.com/moving-to-texas">TexasDefined Moving to Texas resource center</a>, and the <a className="font-semibold text-primary hover:underline" href="/find-my-dmv">vehicle registration estimator and office finder</a>.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Documents to bring</h2>
          <p className="mt-4">A standard original application generally requires:</p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Proof of U.S. citizenship or lawful presence.</li>
            <li>Proof of identity.</li>
            <li>Two documents proving Texas residency.</li>
            <li>A Social Security number that DPS can verify.</li>
            <li>Legal name-change documents when names do not match.</li>
            <li>Texas vehicle registration and insurance evidence when required for a vehicle-owning new resident.</li>
            <li>Driver education, Impact Texas Drivers, or school enrollment documents when required by age and applicant type.</li>
          </ul>
          <p className="mt-4">
            Documents should be originals or certified copies. Photocopies and laminated documents may not be accepted. DPS may request additional proof when a document cannot be electronically verified or when information conflicts.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">REAL ID</h2>
          <p className="mt-4">
            Texas has issued REAL ID-compliant licenses and identification cards since October 10, 2016. A compliant Texas card has a star in the upper-right corner. Since May 7, 2025, a noncompliant Texas card is still valid for state purposes such as driving, but it is not accepted by itself for federal identification purposes such as boarding a domestic commercial flight or entering certain federal facilities.
          </p>
          <p className="mt-4">
            Read the <a className="font-semibold text-primary hover:underline" href="/dmv/real-id">Texas REAL ID guide</a> before your appointment if your current card has no star or you are unsure whether your documents satisfy federal requirements.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Avoid these common failures</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Booking a county tax office appointment for a driver license transaction.</li>
            <li>Bringing only one residency document.</li>
            <li>Using two residency documents from the same company or agency.</li>
            <li>Bringing photocopies instead of originals or certified copies.</li>
            <li>Failing to document every legal name change between a birth record and current identity.</li>
            <li>Waiting until the final days of the new-resident period to search for an appointment.</li>
            <li>Arriving without vehicle registration or insurance evidence when those items apply.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Official Texas resources</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/apply-texas-driver-license" target="_blank" rel="noreferrer">Apply for a Texas Driver License →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/apps/DriverLicense/RealID/" target="_blank" rel="noreferrer">DPS REAL ID Document Check →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/moving-texas-guide-driver-licenses-and-ids" target="_blank" rel="noreferrer">DPS New Resident Guide →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/requirements" target="_blank" rel="noreferrer">DPS Driver License Requirements →</a>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-5 space-y-4">
            {faq.map((item) => (
              <details key={item.question} className="rounded-xl border bg-card p-5">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="mt-3 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/driver-license")({
  head: () => {
    const seo = buildSeo({
      title: "How to Get a Texas Driver License: Complete 2026 Guide",
      description:
        "Get a Texas driver license with the correct DPS documents, appointment, tests, new-resident deadlines, vehicle registration proof, and REAL ID steps.",
      path: "/dmv/driver-license",
      type: "article",
      keywords:
        "Texas driver license, how to get a Texas driver license, Texas DPS appointment, new Texas resident driver license, transfer out of state license Texas",
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
            headline: "Complete Guide to Getting a Texas Driver License",
            description: "Texas DPS application, transfer, document, testing, and new-resident requirements.",
            mainEntityOfPage: `${SITE_URL}/dmv/driver-license`,
            publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
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
              { "@type": "ListItem", position: 3, name: "Texas Driver License Guide", item: `${SITE_URL}/dmv/driver-license` },
            ],
          }),
        },
      ],
    };
  },
  component: TexasDriverLicensePage,
});
