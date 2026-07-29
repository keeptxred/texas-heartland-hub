import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const renewalMethods = [
  {
    title: "Renew online",
    description: "Use Texas by Texas (TxT) or the TxDMV online renewal service. Online renewal is generally available beginning 90 days before expiration and may remain available for up to 12 months after expiration when no expired-registration citation has been issued.",
    action: "Renew with TxT",
    href: "https://txt.texas.gov/dmv/vehicle-registration-renewal",
  },
  {
    title: "Renew by mail",
    description: "Send the renewal notice, required inspection documentation for emissions counties, proof of insurance, identification when requested, and the full amount shown on the notice to the county tax office.",
    action: "Find your county office",
    href: "https://www.txdmv.gov/tax-assessor-collectors/county-tax-offices",
  },
  {
    title: "Renew in person",
    description: "Visit the county tax assessor-collector office, an approved substation, or another county-authorized renewal location with the renewal notice, insurance, identification, and payment.",
    action: "Find renewal locations",
    href: "https://www.txdmv.gov/tax-assessor-collectors/county-tax-offices",
  },
] as const;

const faq = [
  { question: "How early can I renew Texas vehicle registration?", answer: "Texas generally allows online renewal beginning 90 days before the registration expiration date." },
  { question: "Can I renew expired Texas registration online?", answer: "Online renewal may be available for up to 12 months after expiration if you have not received a citation for expired registration. Eligibility is determined by the official renewal system." },
  { question: "Does Texas still require a safety inspection before registration renewal?", answer: "Most non-commercial vehicles no longer need a passing annual safety inspection before renewal. Vehicles registered in designated emissions counties must still satisfy emissions-testing requirements." },
  { question: "Can commercial or government vehicles renew through TxT?", answer: "Texas.gov states that TxT vehicle registration renewal is for individual users and personal vehicles. Commercial and government vehicles may need another TxDMV or county renewal method." },
  { question: "How long does an online registration sticker take to arrive?", answer: "TxDMV advises allowing up to three weeks for processing and mailing. Keep the online receipt as proof of renewal while waiting for the sticker." },
];

function VehicleRegistrationRenewalPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas Vehicle Registration Renewal" />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas vehicle services</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Texas Vehicle Registration Renewal Guide</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Renew online, by mail, or in person. Check timing, insurance, emissions, expired-registration, sticker-delivery, and county-office requirements before you submit payment.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://txt.texas.gov/dmv/vehicle-registration-renewal" target="_blank" rel="noreferrer" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Renew with TxT</a>
            <a href="/vehicles/registration" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Registration guide</a>
            <a href="/find-my-dmv" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Find a county office</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-3xl font-bold">Choose a renewal method</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {renewalMethods.map((method) => (
            <article key={method.title} className="rounded-xl border bg-card p-6">
              <h3 className="text-xl font-bold">{method.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{method.description}</p>
              <a href={method.href} target="_blank" rel="noreferrer" className="mt-5 inline-block font-semibold text-primary hover:underline">{method.action} →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-3xl font-bold">Before renewing</h2>
          <ol className="mt-7 space-y-5">
            {[
              ["Confirm the vehicle record", "Check the plate number, VIN, owner name, mailing address, and county shown on the renewal notice or online record."],
              ["Maintain liability insurance", "Texas registration systems may verify insurance electronically, but keep proof of current coverage available for mail or in-person renewal."],
              ["Complete emissions testing when required", "Vehicles registered in designated emissions counties must receive a passing emissions test before renewal unless an exemption applies."],
              ["Resolve blocks or citations", "Unpaid tolls, certain county holds, emissions failures, or an expired-registration citation can prevent normal online renewal."],
              ["Pay all listed fees", "The total may include the state registration charge, county and local fees, inspection-program charges, processing fees, and optional contributions."],
            ].map(([title, text], index) => (
              <li key={title} className="flex gap-4 rounded-xl border bg-card p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{index + 1}</span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 leading-relaxed text-muted-foreground">{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-3xl font-bold">Expired registration</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">Do not assume that paying online immediately erases an expired-registration issue. The official system determines online eligibility, and a citation may require county-office or court follow-up. Renew promptly, keep the receipt, and follow any instructions connected to the citation.</p>
        <div className="mt-7 rounded-xl border bg-card p-6">
          <h3 className="text-xl font-bold">Online timing and sticker delivery</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">TxDMV advises that online payments may have a short processing hold before the sticker is printed and that delivery can take up to three weeks. Save or print the renewal receipt and verify that the mailing address is correct.</p>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-3xl font-bold">Inspection and emissions rules</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">Texas ended the annual safety-inspection requirement for most non-commercial vehicles, but emissions testing continues in designated counties. Commercial vehicles and certain special vehicle classes can have separate inspection requirements.</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">Confirm the current rule for the vehicle type and registration county before renewing. A recent move between counties can change the applicable emissions requirement.</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-7 space-y-4">
          {faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p></details>)}
        </div>
      </section>

      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground">
          <p>Official renewal windows, fees, inspection rules, county procedures, and online eligibility can change. Confirm the current requirements with TxDMV, Texas.gov, or your county tax assessor-collector.</p>
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/vehicles/renewal")({
  head: () => {
    const seo = buildSeo({ title: "Texas Vehicle Registration Renewal: Online, Mail or In Person", description: "Renew Texas vehicle registration online, by mail, or in person. Check TxT eligibility, emissions rules, expired registration, fees, and sticker delivery.", path: "/vehicles/renewal", type: "article", keywords: "Texas vehicle registration renewal, renew car registration Texas, TxT registration renewal, expired Texas registration, Texas registration sticker" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Texas Vehicle Registration Renewal Guide", description: "How to renew Texas vehicle registration online, by mail, or in person.", mainEntityOfPage: `${SITE_URL}/vehicles/renewal`, publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Vehicle Registration Renewal", item: `${SITE_URL}/vehicles/renewal` }] }) },
    ] };
  },
  component: VehicleRegistrationRenewalPage,
});
