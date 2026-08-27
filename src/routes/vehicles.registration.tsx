import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  { question: "Where do I register a vehicle in Texas?", answer: "Most Texans complete title and registration transactions through their county tax assessor-collector office. TxDMV sets statewide requirements and provides forms, policy, and online services." },
  { question: "How long does a new Texas resident have to register a vehicle?", answer: "TxDMV generally requires a new resident to title and register a vehicle within 30 days after establishing Texas residency." },
  { question: "Do I need a Texas inspection before registration?", answer: "Inspection requirements depend on the vehicle, county, and current Texas law. Confirm whether your vehicle needs a safety or emissions inspection before visiting the county tax office." },
  { question: "Can I register a Texas vehicle online?", answer: "Many routine renewals can be completed online, but first-time registration, title transfers, ownership changes, and document problems generally require a county tax office or other approved process." },
];

function VehicleRegistrationPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas Vehicle Registration" />
      <section className="border-b bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas title and registration guide</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">How to Register a Vehicle in Texas</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Learn where to register, what documents to bring, what new residents must do, how inspections and insurance fit into the process, and when a county tax office visit is required.</p></div></section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 leading-relaxed">
        <section><h2 className="text-3xl font-bold">Start with the county tax assessor-collector</h2><p className="mt-4">Texas vehicle registration is not usually completed at a DPS driver license office. TxDMV administers the statewide vehicle program, while county tax assessor-collector offices handle most customer-facing title and registration transactions.</p><p className="mt-4">Use the official <a className="text-primary underline underline-offset-4" href="https://www.txdmv.gov/tax-assessor-collectors/county-tax-offices" rel="noreferrer">TxDMV county tax office directory</a> or the Keep TX Red <a className="text-primary underline underline-offset-4" href="/find-my-dmv">office finder and registration estimator</a> before traveling.</p></section>

        <section><h2 className="text-3xl font-bold">Documents commonly required</h2><ul className="mt-5 list-disc space-y-2 pl-6"><li>Evidence of vehicle ownership, such as a properly assigned title or manufacturer certificate of origin.</li><li>A completed Texas title and registration application when required.</li><li>Acceptable identification for the owner or authorized representative.</li><li>Proof of financial responsibility that meets Texas requirements.</li><li>Inspection or emissions documentation when the vehicle and county require it.</li><li>Odometer disclosure, lien information, power of attorney, or supporting forms when applicable.</li><li>Payment for state, county, local, plate, title, and processing fees.</li></ul><p className="mt-4">Document requirements vary for dealer purchases, private-party sales, inherited vehicles, gifts, trailers, imported vehicles, rebuilt vehicles, and vehicles with liens.</p></section>

        <section><h2 className="text-3xl font-bold">New Texas residents</h2><p className="mt-4">A new resident should generally complete vehicle inspection requirements, obtain Texas insurance, and title and register the vehicle within 30 days of establishing residency. Registering the vehicle and obtaining a Texas driver license are separate transactions handled by different offices.</p><ol className="mt-5 list-decimal space-y-2 pl-6"><li>Confirm whether the vehicle needs a Texas safety or emissions inspection.</li><li>Obtain insurance that satisfies Texas financial-responsibility rules.</li><li>Gather the out-of-state title or registration record and ownership documents.</li><li>Visit the county tax assessor-collector office to apply for Texas title and registration.</li><li>Then complete the separate DPS driver license process if needed.</li></ol></section>

        <section><h2 className="text-3xl font-bold">Inspection and emissions rules</h2><p className="mt-4">Texas inspection rules have changed over time and can differ by vehicle and county. Some vehicles may still need emissions testing even when a general safety inspection is not required. Verify the current rule for the county where the vehicle will be registered before paying fees or visiting an office.</p></section>

        <section><h2 className="text-3xl font-bold">Fees</h2><p className="mt-4">The final amount can include the base registration fee, local county fees, title fees, plate fees, inspection-related charges, processing charges, and sales or use tax. Vehicle weight, type, county, plate choice, and transaction history can change the total.</p><p className="mt-4">Use the <a className="text-primary underline underline-offset-4" href="/find-my-dmv">Keep TX Red registration estimator</a> for planning, then confirm the official amount with your county office.</p></section>

        <section className="rounded-xl border bg-muted/20 p-6"><h2 className="text-2xl font-bold">Registration checklist</h2><ol className="mt-4 list-decimal space-y-2 pl-6"><li>Identify the correct county tax office.</li><li>Confirm inspection or emissions requirements.</li><li>Verify insurance and ownership documents.</li><li>Complete required TxDMV forms.</li><li>Bring identification and payment.</li><li>Keep copies of submitted records and receipts.</li></ol></section>

        <section><h2 className="text-3xl font-bold">Related Keep TX Red guides</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{[["Texas DMV vs. DPS", "/dmv/texas-dmv-vs-dps"],["Find a County Tax Office", "/find-my-dmv"],["Moving to Texas Resource Center", "https://texasdefined.com/moving-to-texas"],["Texas Driver License Guide", "/dmv/driver-license"]].map(([title, href]) => <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">{title}<span className="mt-2 block text-sm text-primary">Open guide →</span></a>)}</div></section>

        <section><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
        <p className="border-t pt-8 text-sm text-muted-foreground">Vehicle registration rules, inspections, forms, and fees can change. Confirm current requirements with TxDMV and your county tax assessor-collector before traveling or paying.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/vehicles/registration")({
  head: () => {
    const seo = buildSeo({ title: "Texas Vehicle Registration Guide: Documents, Fees & New Residents", description: "Register a vehicle in Texas. Learn county office requirements, documents, inspections, insurance, fees, and the 30-day new-resident process.", path: "/vehicles/registration", type: "article", keywords: "Texas vehicle registration, register car in Texas, Texas new resident vehicle registration, county tax office, TxDMV registration" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Register a Vehicle in Texas", url: `${SITE_URL}/vehicles/registration`, isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Vehicle Registration", item: `${SITE_URL}/vehicles/registration` }] }) },
    ] };
  },
  component: VehicleRegistrationPage,
});