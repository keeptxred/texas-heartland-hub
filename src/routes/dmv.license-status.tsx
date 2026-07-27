import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "How do I check the status of my Texas driver license?",
    answer:
      "Use the official Texas DPS License Eligibility system. It shows whether your driving privilege is currently eligible and lists outstanding compliance requirements or reinstatement fees tied to your record.",
  },
  {
    question: "Does an eligible status mean my physical card is current?",
    answer:
      "Not necessarily. Eligibility describes whether DPS considers you legally eligible to drive or obtain a credential. You should also confirm that your physical driver license has not expired and that the information on it is current.",
  },
  {
    question: "How long does it take for a Texas driver record to update?",
    answer:
      "Timing depends on the item. Texas DPS says online reinstatement-fee payments generally process quickly, while court-reported compliance updates can take several business days after the court reports them.",
  },
  {
    question: "Can I drive while my Texas license status is suspended?",
    answer:
      "A suspended, revoked, cancelled, or denied status generally means you do not have ordinary driving privileges. Some people may qualify for an occupational license, but eligibility and court requirements vary.",
  },
];

function LicenseStatusPage() {
  return (
    <main>
      <HubBreadcrumbs current="Check Texas Driver License Status" />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas DPS eligibility guide</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">How to Check Your Texas Driver License Status</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Use the official Texas DPS system to see whether your driving privilege is eligible, identify holds or compliance requirements, and understand the next steps for reinstatement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90" href="https://txapps.texas.gov/txapp/txdps/dleligibility/login.do" rel="noreferrer">Open Texas License Eligibility</a>
            <a className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted" href="/dmv/dps-appointments">DPS appointment guide</a>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 text-base leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold">Use the official DPS License Eligibility system</h2>
          <p className="mt-4">
            Texas DPS maintains an online License Eligibility system for checking whether a Texas driver license or driving privilege is currently eligible. The system can also show reinstatement requirements, compliance items, and fees associated with a suspended, revoked, cancelled, or denied status.
          </p>
          <p className="mt-4">
            Start with the official <a className="text-primary underline underline-offset-4" href="https://txapps.texas.gov/txapp/txdps/dleligibility/login.do" rel="noreferrer">Texas License Eligibility portal</a>. Avoid third-party websites that charge merely to redirect you or collect personal information.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">What the status results mean</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3">Result</th><th className="px-4 py-3">What it generally means</th><th className="px-4 py-3">Next step</th></tr></thead>
              <tbody className="divide-y">
                <tr><td className="px-4 py-3 font-semibold">Eligible</td><td className="px-4 py-3">DPS records do not currently block ordinary driving eligibility</td><td className="px-4 py-3">Confirm the card is unexpired and your address is current</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Not eligible</td><td className="px-4 py-3">One or more enforcement actions, holds, fees, or compliance items remain</td><td className="px-4 py-3">Review every listed requirement before paying or submitting documents</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Pending update</td><td className="px-4 py-3">A court, insurer, education provider, or DPS unit may still be processing information</td><td className="px-4 py-3">Allow the stated processing time, then check again</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Eligibility is separate from the expiration date printed on your card. A person can be eligible but still need to renew an expired credential.</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Common reasons a Texas license is not eligible</h2>
          <ul className="mt-5 list-disc space-y-2 pl-6">
            <li>A suspension, revocation, cancellation, or denial remains active.</li>
            <li>A mandatory suspension period has not ended.</li>
            <li>A required reinstatement fee has not been paid.</li>
            <li>A court has not yet reported that a ticket, failure-to-appear matter, or other obligation was cleared.</li>
            <li>DPS has not received required proof such as an SR-22, course completion, or another compliance document.</li>
            <li>An out-of-state withdrawal or hold remains unresolved.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold">How to restore an eligible status</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6">
            <li>Open the License Eligibility portal and review every enforcement action and compliance item.</li>
            <li>Confirm whether a suspension period must end before reinstatement is possible.</li>
            <li>Resolve court, insurance, education-program, or out-of-state requirements with the agency that controls that item.</li>
            <li>Pay any required reinstatement fees through the official DPS process.</li>
            <li>Submit remaining compliance documents using the method DPS specifies.</li>
            <li>Check the portal again after the applicable processing period.</li>
          </ol>
          <p className="mt-4">
            Texas DPS explains the submission options on its <a className="text-primary underline underline-offset-4" href="https://www.dps.texas.gov/section/driver-license/reinstating-your-driver-license-or-driving-privilege" rel="noreferrer">driver license reinstatement page</a>.
          </p>
        </section>

        <section className="rounded-xl border bg-muted/20 p-6">
          <h2 className="text-2xl font-bold">Do not schedule a routine renewal appointment until you check eligibility</h2>
          <p className="mt-3">
            An appointment does not erase a suspension or unresolved hold. Check your status first, complete the listed reinstatement requirements, and then use the <a className="text-primary underline underline-offset-4" href="/dmv/dps-appointments">Texas DPS appointment guide</a> if an in-person transaction is still required.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Related Keep TX Red guides</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Texas Driver License Renewal", "/dmv/driver-license-renewal"],
              ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
              ["Replace a Lost or Stolen License", "/dmv/replace-lost-license"],
              ["Change Your Texas License Address", "/dmv/change-address"],
              ["Complete Texas Driver License Guide", "/dmv/driver-license"],
              ["Texas DMV vs. DPS", "/dmv/texas-dmv-vs-dps"],
            ].map(([title, href]) => <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">{title}<span className="mt-2 block text-sm text-primary">Open guide →</span></a>)}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div>
        </section>

        <p className="border-t pt-8 text-sm text-muted-foreground">Driver eligibility and reinstatement requirements are specific to each record and can change as courts and other agencies report information. Use the official Texas DPS system for the controlling status.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/license-status")({
  head: () => {
    const seo = buildSeo({
      title: "Check Texas Driver License Status: Eligibility, Suspensions & Reinstatement",
      description: "Check a Texas driver license status through DPS, understand eligible and suspended results, review holds, fees, compliance items, and reinstatement steps.",
      path: "/dmv/license-status",
      type: "article",
      keywords: "check Texas driver license status, Texas license eligibility, Texas suspended license status, Texas DPS reinstatement, driver license hold Texas",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Check Your Texas Driver License Status", url: `${SITE_URL}/dmv/license-status`, isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL } }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Driver License Status", item: `${SITE_URL}/dmv/license-status` }] }) },
      ],
    };
  },
  component: LicenseStatusPage,
});
