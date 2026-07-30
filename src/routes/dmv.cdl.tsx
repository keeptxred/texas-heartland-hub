import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "What is the difference between a Texas CLP and CDL?",
    answer:
      "A commercial learner permit, or CLP, lets a qualified applicant practice operating the applicable class of commercial vehicle with the required supervision. A commercial driver license, or CDL, authorizes independent operation after the applicant completes the required knowledge, training, and skills-testing steps.",
  },
  {
    question: "Who must complete entry-level driver training?",
    answer:
      "Federal ELDT rules generally apply to first-time Class A or Class B applicants, Class B holders upgrading to Class A, and first-time applicants for passenger, school bus, or hazardous-materials endorsements. Required training must be completed through a provider listed in the FMCSA Training Provider Registry.",
  },
  {
    question: "Do all large-vehicle drivers need a CDL?",
    answer:
      "No. Texas recognizes limited exemptions for certain military, farm, emergency, recreational, airport, cotton, historic military, and covered farm vehicle operations. Some exempt operators may still need a non-commercial Class A or Class B license.",
  },
  {
    question: "Can I get a Texas CDL without medical certification?",
    answer:
      "It depends on the type of commercial operation you certify. Many interstate and some intrastate drivers must maintain medical qualification. Applicants should select the correct self-certification category and follow DPS and FMCSA medical-document rules.",
  },
];

function TexasCdlPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas Commercial Driver License" />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas DPS commercial licensing guide</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Texas CDL Guide: Classes, CLP, ELDT, Testing and Medical Rules</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Understand when a commercial driver license is required, how Class A, B, and C credentials differ, and how to move from application to learner permit, training, testing, endorsements, and final issuance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://www.dps.texas.gov/section/driver-license/commercial-driver-license" rel="noreferrer" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Open official Texas CDL information</a>
            <a href="/dmv/dps-appointments" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Schedule a DPS appointment</a>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 text-base leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold">Start with the vehicle and the work, not the job title</h2>
          <p className="mt-4">
            CDL requirements are based primarily on the vehicle or combination being operated, its weight ratings, passenger capacity, hazardous-materials status, and whether an exemption applies. A company calling someone a delivery driver, equipment operator, farmer, mechanic, or contractor does not by itself answer the licensing question.
          </p>
          <p className="mt-4">
            Review the vehicle's gross vehicle weight rating, gross combination weight rating, passenger design capacity, trailer rating, and hazardous-material placarding requirements before choosing a license class.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Texas CDL classes</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3">Class</th><th className="px-4 py-3">Typical threshold</th><th className="px-4 py-3">Common examples</th></tr></thead>
              <tbody className="divide-y">
                <tr><td className="px-4 py-3 font-semibold">Class A</td><td className="px-4 py-3">Combination vehicle at or above 26,001 pounds when the towed unit exceeds 10,000 pounds</td><td className="px-4 py-3">Tractor-trailer combinations and certain heavy truck-and-trailer setups</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Class B</td><td className="px-4 py-3">Single vehicle at or above 26,001 pounds, or that vehicle towing 10,000 pounds or less</td><td className="px-4 py-3">Large straight trucks, many buses, and heavy single-unit vehicles</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Class C</td><td className="px-4 py-3">Vehicle outside Class A or B that carries regulated passengers or placarded hazardous materials</td><td className="px-4 py-3">Certain passenger vehicles and hazardous-materials vehicles</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">The normal path from application to CDL</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6">
            <li>Confirm the correct CDL class and any endorsements or restrictions.</li>
            <li>Gather identity, lawful-presence, Social Security, Texas residency, and current-license documents.</li>
            <li>Choose the correct interstate or intrastate self-certification category and complete medical requirements when applicable.</li>
            <li>Pass the required knowledge examinations and obtain a commercial learner permit.</li>
            <li>Complete required entry-level driver training through an FMCSA-registered provider when ELDT applies.</li>
            <li>Practice only under the CLP restrictions and required supervision.</li>
            <li>Complete the vehicle inspection, basic control, and road skills tests in an appropriate representative vehicle.</li>
            <li>Pay the required fees and complete issuance through Texas DPS.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Commercial learner permit rules matter</h2>
          <p className="mt-4">
            A CLP is not an unrestricted license. The permit holder must follow federal and state supervision rules, operate only the classes and types of vehicles authorized by the permit, and observe any endorsement-related restrictions. The supervising driver must hold the proper CDL for the vehicle and operation.
          </p>
          <p className="mt-4">
            Applicants should not schedule a skills test until the applicable waiting period, training record, medical status, and vehicle requirements are satisfied.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Entry-level driver training</h2>
          <p className="mt-4">
            Federal ELDT requirements generally apply to first-time Class A and Class B applicants, Class B holders upgrading to Class A, and first-time applicants for hazardous-materials, passenger, or school-bus endorsements. The training provider must be listed in the <a href="https://tpr.fmcsa.dot.gov/" rel="noreferrer" className="text-primary underline underline-offset-4">FMCSA Training Provider Registry</a>.
          </p>
          <p className="mt-4">
            Theory training may be delivered separately from behind-the-wheel instruction, but the required completion information must be reported to the federal registry before the state can complete the affected testing or issuance step.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Endorsements and restrictions</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["T", "Double or triple trailers"],
              ["P", "Passenger vehicles"],
              ["N", "Tank vehicles"],
              ["H", "Hazardous materials"],
              ["X", "Tank and hazardous materials"],
              ["S", "School bus"],
            ].map(([code, label]) => <div key={code} className="rounded-xl border bg-card p-5"><span className="text-xl font-bold">{code}</span><p className="mt-2 text-muted-foreground">{label}</p></div>)}
          </div>
          <p className="mt-4">
            Testing in a vehicle without the equipment or transmission needed for unrestricted operation can result in restrictions. Common examples involve air brakes, manual transmissions, fifth-wheel connections, or passenger and school-bus testing conditions.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Medical certification and self-certification</h2>
          <p className="mt-4">
            CDL and CLP applicants must identify the type of commercial operation they perform. That self-certification determines whether a federal medical examiner's certificate is required. When required, the examination must be completed by a medical examiner listed on the National Registry of Certified Medical Examiners.
          </p>
          <p className="mt-4">
            Keep copies of current medical documentation and verify that DPS records have been updated. An expired or missing medical status can lead to loss or downgrade of commercial driving privileges even when the physical card has not yet expired.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">CDL exemptions are narrow</h2>
          <p className="mt-4">
            Texas recognizes limited exemptions for qualifying military operations, certain farm operations, firefighting and emergency vehicles, recreational vehicles used personally, some airport-only operations, specific cotton transport, qualifying historic military vehicles, and covered farm vehicles. The facts of the operation control.
          </p>
          <p className="mt-4">
            An exempt driver may still need a Texas non-commercial Class A or Class B license. Review the official <a href="https://www.dps.texas.gov/section/driver-license/cdl-exempt-drivers" rel="noreferrer" className="text-primary underline underline-offset-4">Texas CDL-exempt driver guidance</a> before relying on an exemption.
          </p>
        </section>

        <section className="rounded-xl border bg-muted/20 p-6">
          <h2 className="text-2xl font-bold">Before your DPS visit</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Read the current Texas Commercial Motor Vehicle Drivers Handbook.</li>
            <li>Confirm the class, endorsements, and restrictions you need.</li>
            <li>Bring original identity and residency documents.</li>
            <li>Complete medical certification and self-certification steps when required.</li>
            <li>Use an eligible vehicle for the skills test.</li>
            <li>Verify that any ELDT completion has reached the federal registry.</li>
            <li>Confirm appointment, test-site, and third-party testing rules before traveling.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Related Keep TX Red guides</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
              ["Texas Driver License Document Checklist", "/dmv/driver-license-documents"],
              ["Check Texas Driver License Status", "/dmv/license-status"],
              ["Texas DMV vs. DPS", "/dmv/texas-dmv-vs-dps"],
            ].map(([title, href]) => <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">{title}<span className="mt-2 block text-sm text-primary">Open guide →</span></a>)}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div>
        </section>

        <p className="border-t pt-8 text-sm text-muted-foreground">Commercial licensing rules can change and may depend on federal law, vehicle configuration, cargo, route, employer, medical status, immigration category, and exemptions. Confirm current requirements with Texas DPS and FMCSA before operating a commercial vehicle.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/cdl")({
  head: () => {
    const seo = buildSeo({
      title: "Texas CDL Guide: Classes, CLP, ELDT, Testing & Medical Requirements",
      description: "Learn how to get a Texas commercial driver license, including CDL classes, learner permits, ELDT, endorsements, skills testing, medical certification, and exemptions.",
      path: "/dmv/cdl",
      type: "article",
      keywords: "Texas CDL, Texas commercial driver license, Texas CLP, CDL classes Texas, ELDT Texas, Texas CDL medical card, Texas CDL test",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Texas CDL Guide: Classes, CLP, ELDT, Testing and Medical Rules", url: `${SITE_URL}/dmv/cdl`, isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL } }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Texas Commercial Driver License", item: `${SITE_URL}/dmv/cdl` }] }) },
      ],
    };
  },
  component: TexasCdlPage,
});