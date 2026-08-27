import { createFileRoute } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "How can I tell whether my Texas license is REAL ID compliant?",
    answer: "Look for a star in the upper-right corner of the card. Texas has issued REAL ID-compliant driver licenses and identification cards since October 10, 2016.",
  },
  {
    question: "Can I still drive with a Texas license that has no star?",
    answer: "Yes, if the license is otherwise valid. A noncompliant card remains valid for state purposes such as driving, but it is not accepted by itself for federal identification purposes after May 7, 2025.",
  },
  {
    question: "Do I need a REAL ID to vote in Texas?",
    answer: "REAL ID compliance is not a separate Texas voting requirement. Texas election identification rules determine which forms of identification are accepted at the polls.",
  },
  {
    question: "Can a passport replace a REAL ID at the airport?",
    answer: "A valid U.S. passport is an acceptable federal identification document for domestic air travel, so a traveler does not need a REAL ID-compliant state card when presenting an accepted passport.",
  },
];

function TexasRealIdPage() {
  return (
    <main>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Federal-compliant Texas identification</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas REAL ID Guide</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            How to identify a compliant Texas card, when REAL ID matters, what documents DPS requires, and what to do if your license has no star.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-8 px-4 py-14 leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold">What REAL ID changes</h2>
          <p className="mt-4">
            REAL ID is a federal security standard for state-issued driver licenses and identification cards. It does not create a separate driving credential. A Texas driver license remains the document that authorizes driving; REAL ID compliance determines whether the card can also be used for certain federal identification purposes.
          </p>
          <p className="mt-4">
            Since May 7, 2025, a Texas card without the REAL ID star is not accepted by itself to board a federally regulated domestic commercial flight or enter certain secure federal facilities. Another federally accepted document, such as a valid U.S. passport, may be used instead.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Check the upper-right corner</h2>
          <p className="mt-4">
            Texas began issuing REAL ID-compliant cards on October 10, 2016. A compliant card displays a star in the upper-right corner. If your valid Texas driver license or ID card already has the star, no separate REAL ID application is required before the card expires.
          </p>
          <p className="mt-4">
            A card without the star can still be valid for state purposes, including driving when it is a driver license. The federal limitation does not automatically cancel the card or shorten its printed expiration date.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">When you need federal-compliant identification</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Boarding a federally regulated domestic commercial flight.</li>
            <li>Entering certain federal buildings or secure federal facilities where compliant identification is required.</li>
            <li>Accessing certain federally controlled locations that apply REAL ID rules.</li>
          </ul>
          <p className="mt-4">
            REAL ID is not required to drive, apply for federal benefits, receive medical care, participate in law-enforcement proceedings, or vote. Each activity can have its own identity rules, so do not assume the airport standard controls every transaction.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Documents Texas DPS generally requires</h2>
          <p className="mt-4">An original or replacement Texas credential generally requires proof in these categories:</p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>One acceptable document proving U.S. citizenship or lawful presence.</li>
            <li>Proof of identity through one primary document, two secondary documents, or one secondary plus two supporting documents.</li>
            <li>Two printed documents proving Texas residency, generally from different companies or agencies.</li>
            <li>A Social Security number that can be verified.</li>
            <li>Documents connecting every legal name change when names differ across records.</li>
          </ul>
          <p className="mt-4">
            The exact acceptable-document list depends on citizenship, immigration status, age, name history, and the credential being requested. Use the <a className="font-semibold text-primary hover:underline" href="/dmv/driver-license-documents">Texas driver license document guide</a> and then complete the official DPS document-check tool before traveling.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Originals, certified copies, and matching names</h2>
          <p className="mt-4">
            DPS warns that documents must generally be originals or certified copies. Photocopies may not be accepted, and laminated records may be rejected. Names, dates of birth, and other identifying information should agree across documents.
          </p>
          <p className="mt-4">
            A married name, restored name after divorce, adoption-related name, or court-ordered name change must be connected to the name shown on the underlying identity or citizenship document. Bring the full chain of marriage licenses, divorce decrees, amended birth records, or court orders when more than one change occurred.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Replacing a noncompliant Texas card</h2>
          <p className="mt-4">
            If your current Texas card has no star and you want a compliant card before its normal renewal date, check whether DPS allows you to request a duplicate online. Eligibility varies. Applicants who cannot complete the transaction online must schedule an in-person DPS appointment and bring the required documents.
          </p>
          <p className="mt-4">
            Do not assume that documents DPS accepted years ago remain electronically verified in your record. Use the official checklist for the transaction you plan to complete.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">New residents and first-time applicants</h2>
          <p className="mt-4">
            A first Texas license application already includes the identity, residency, lawful-presence, and Social Security review used for REAL ID-compliant issuance. New residents should follow the full <a className="font-semibold text-primary hover:underline" href="/dmv/driver-license">Texas driver license guide</a>, register owned vehicles when required, and complete the DPS document checklist before the appointment.
          </p>
          <p className="mt-4">
            The <a className="font-semibold text-primary hover:underline" href="https://texasdefined.com/moving-to-texas">TexasDefined Moving to Texas resource center</a> and <a className="font-semibold text-primary hover:underline" href="https://texasdefined.com/moving-to-texas">interactive moving checklist</a> organize the separate vehicle-registration and driver-license steps.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Official resources</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/federal-real-id-act" target="_blank" rel="noreferrer">Texas DPS REAL ID information →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/apps/DriverLicense/RealID/" target="_blank" rel="noreferrer">Build a DPS document checklist →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/identification-requirements" target="_blank" rel="noreferrer">Texas identity requirements →</a>
            <a className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md" href="https://www.dps.texas.gov/section/driver-license/texas-residency-requirement-driver-licenses-and-id-cards" target="_blank" rel="noreferrer">Texas residency requirements →</a>
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

export const Route = createFileRoute("/dmv/real-id")({
  head: () => {
    const seo = buildSeo({
      title: "Texas REAL ID Guide: Star, Documents & Requirements",
      description:
        "Check whether a Texas license is REAL ID compliant, learn when the star is required, and prepare the identity, residency, and lawful-presence documents DPS needs.",
      path: "/dmv/real-id",
      type: "article",
      keywords: "Texas REAL ID, Texas REAL ID requirements, Texas license star, REAL ID documents Texas, Texas DPS REAL ID",
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
            headline: "Texas REAL ID Guide",
            description: "Texas REAL ID compliance, document, replacement, and federal-use guidance.",
            mainEntityOfPage: `${SITE_URL}/dmv/real-id`,
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
              { "@type": "ListItem", position: 3, name: "Texas REAL ID Guide", item: `${SITE_URL}/dmv/real-id` },
            ],
          }),
        },
      ],
    };
  },
  component: TexasRealIdPage,
});
