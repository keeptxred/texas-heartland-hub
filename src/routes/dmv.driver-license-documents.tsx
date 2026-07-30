import { createFileRoute } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "How many Texas residency documents do I need?",
    answer:
      "Texas DPS generally requires two printed residency documents showing your name and the same residential address. They should come from different companies or agencies.",
  },
  {
    question: "Can I bring photocopies to a Texas DPS appointment?",
    answer:
      "DPS generally requires originals or certified copies for identity, citizenship, lawful-presence, and name-change records. Photocopies and laminated documents may not be accepted.",
  },
  {
    question: "What if my current name is different from my birth certificate?",
    answer:
      "Bring legal documents connecting every name change, such as marriage licenses, divorce decrees, amended birth certificates, or court orders.",
  },
  {
    question: "Do I need my Social Security card?",
    answer:
      "You must provide a Social Security number that DPS can verify. The exact proof needed can vary, so use the official DPS checklist for your transaction.",
  },
];

function DriverLicenseDocumentsPage() {
  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas DPS appointment preparation</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Documents Required for a Texas Driver License</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A plain-English checklist for identity, citizenship or lawful presence, Texas residency, Social Security verification, name changes, vehicles, and age-specific requirements.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-8 px-4 py-14 leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold">The core document categories</h2>
          <p className="mt-4">
            A Texas driver license application is not approved from one all-purpose document. DPS verifies several separate facts. Most original applicants should prepare proof of identity, U.S. citizenship or lawful presence, Texas residency, and a Social Security number. Additional records apply when names differ, when the applicant owns a vehicle, or when driver education is required.
          </p>
          <p className="mt-4">
            Use this guide to organize your records, then complete the official DPS REAL ID Document Check tool because immigration status, age, prior licensing, and the exact transaction can change the final list.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">1. Proof of identity</h2>
          <p className="mt-4">DPS allows three general identity-document combinations:</p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>One primary identity document.</li>
            <li>Two secondary identity documents.</li>
            <li>One secondary identity document plus two supporting identity documents.</li>
          </ul>
          <p className="mt-4">
            Common primary records include a valid U.S. passport or passport card, certain citizenship or naturalization certificates with a photograph, and qualifying DHS or USCIS documents. A Texas driver license or ID card that has not been expired more than two years may also qualify in some situations, although citizenship proof may still be required if it was not previously established.
          </p>
          <p className="mt-4">
            Supporting records can include an actual Social Security card, W-2 or 1099, another state license, school records, voter registration card, professional license, military records, insurance records, and certain vehicle or boat title and registration records. Acceptance depends on the exact DPS category and condition of the document.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">2. Proof of U.S. citizenship or lawful presence</h2>
          <p className="mt-4">
            Every applicant must establish U.S. citizenship or lawful presence. A U.S. citizen may use an acceptable birth certificate, U.S. passport, Consular Report of Birth Abroad, or citizenship or naturalization document. A noncitizen must provide an acceptable immigration document that DPS can verify with the U.S. Department of Homeland Security.
          </p>
          <p className="mt-4">
            If lawful presence cannot be verified immediately, DPS may begin an additional verification process. The license or ID cannot be issued until the verification is complete.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">3. Two proofs of Texas residency</h2>
          <p className="mt-4">
            Bring two printed documents showing your name and the same Texas residential address. The documents should be issued by different companies or agencies. At least one normally must show that you have lived in Texas for 30 days.
          </p>
          <p className="mt-4">
            The 30-day residency period is waived for a person surrendering a valid, unexpired driver license or ID card from another state and for certain commercial-license applicants, but the two-document requirement still applies.
          </p>
          <p className="mt-4">Common residency evidence can include:</p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Mortgage, deed, lease, or residential rental agreement.</li>
            <li>Utility, cable, satellite, or home-internet bill.</li>
            <li>Bank, credit-card, or financial statement.</li>
            <li>Insurance policy or statement.</li>
            <li>Government mail, tax records, or vehicle registration.</li>
            <li>School, employment, or medical records that satisfy DPS rules.</li>
          </ul>
          <p className="mt-4">
            Applicants who cannot produce two qualifying documents may be eligible to use a Texas Residency Affidavit. The affidavit has its own eligibility and supporting-document requirements.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">4. Social Security number</h2>
          <p className="mt-4">
            DPS requires a Social Security number and verifies it electronically with the federal government. A mismatch in name, date of birth, or number can prevent issuance. Correct inconsistent federal records before the appointment when possible.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">5. Legal name-change documents</h2>
          <p className="mt-4">
            The name on your identity, citizenship, residency, and Social Security records should match. When it does not, bring legal proof connecting the names. Accepted records can include an original or certified marriage license, divorce decree, amended birth certificate, or court-ordered name change.
          </p>
          <p className="mt-4">
            Bring a document for every link in the chain. For example, a person whose birth name changed at marriage and changed again by court order should bring both records, not only the newest document.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">6. Vehicle registration and insurance</h2>
          <p className="mt-4">
            New residents surrendering an out-of-state driver license should bring evidence of current Texas registration and insurance for each vehicle they own. A person who owns no vehicle signs a statement confirming that fact.
          </p>
          <p className="mt-4">
            Complete the vehicle step through a county tax assessor-collector office, not a DPS driver license office. Use the <a className="font-semibold text-primary hover:underline" href="/find-my-dmv">registration estimator and office finder</a> and review <a className="font-semibold text-primary hover:underline" href="/dmv/texas-dmv-vs-dps">which Texas agency handles each transaction</a>.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">7. Age-specific education and testing records</h2>
          <p className="mt-4">
            Applicants ages 18 through 24 generally need an approved adult driver education certificate and an Impact Texas Drivers certificate when a skills test is required. Applicants under 18 have separate teen driver education, Impact Texas Drivers, Verification of Enrollment, and parent or guardian requirements.
          </p>
          <p className="mt-4">
            Verification of Enrollment documents have short validity periods. Confirm the current date rules before the appointment rather than relying on an older school form.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Document quality rules</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Bring originals or certified copies when DPS requires them.</li>
            <li>Do not rely on a phone photo, scan, or ordinary photocopy.</li>
            <li>Avoid laminated vital records because DPS may reject them.</li>
            <li>Check that names, dates of birth, and addresses agree.</li>
            <li>Bring more than the bare minimum when a record is unusual or difficult to verify.</li>
            <li>Review expiration dates and document-issue dates before leaving home.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Appointment-day checklist</h2>
          <div className="mt-5 rounded-xl border bg-card p-6">
            <ul className="list-disc space-y-2 pl-6">
              <li>Completed application or the information needed to complete it.</li>
              <li>Identity document combination.</li>
              <li>Citizenship or lawful-presence document.</li>
              <li>Two Texas residency documents from different sources.</li>
              <li>Social Security information.</li>
              <li>Every legal name-change record.</li>
              <li>Vehicle registration and insurance evidence when applicable.</li>
              <li>Driver education, Impact Texas Drivers, and school records when applicable.</li>
              <li>Glasses or contact lenses used for driving.</li>
              <li>Payment method accepted by the office.</li>
            </ul>
          </div>
          <p className="mt-4">
            For the full sequence, read <a className="font-semibold text-primary hover:underline" href="/dmv/driver-license">how to get a Texas driver license</a>. For federal-use questions, read the <a className="font-semibold text-primary hover:underline" href="/dmv/real-id">Texas REAL ID guide</a>.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Official Texas resources</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/apps/DriverLicense/RealID/" target="_blank" rel="noreferrer">DPS personalized document checklist →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/identification-requirements" target="_blank" rel="noreferrer">DPS identity requirements →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/texas-residency-requirement-driver-licenses-and-id-cards" target="_blank" rel="noreferrer">DPS residency requirements →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/us-citizenship-or-lawful-presence-requirement" target="_blank" rel="noreferrer">Citizenship and lawful-presence rules →</a>
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

export const Route = createFileRoute("/dmv/driver-license-documents")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Driver License Documents: Complete DPS Checklist",
      description:
        "Prepare the identity, citizenship or lawful-presence, Texas residency, Social Security, name-change, vehicle, and driver-education documents DPS requires.",
      path: "/dmv/driver-license-documents",
      type: "article",
      keywords:
        "Texas driver license documents, Texas DPS document checklist, proof of Texas residency, Texas driver license requirements, REAL ID documents Texas",
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
            headline: "Documents Required for a Texas Driver License",
            description: "Texas DPS identity, residency, lawful-presence, Social Security, and supporting-document checklist.",
            mainEntityOfPage: `${SITE_URL}/dmv/driver-license-documents`,
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
              { "@type": "ListItem", position: 3, name: "Driver License Documents", item: `${SITE_URL}/dmv/driver-license-documents` },
            ],
          }),
        },
      ],
    };
  },
  component: DriverLicenseDocumentsPage,
});
