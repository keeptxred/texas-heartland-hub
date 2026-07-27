import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const serviceGroups = [
  {
    title: "Start here",
    description: "Understand which Texas office handles your task before booking an appointment or driving across town.",
    resources: [
      ["Texas DMV vs. DPS: Which Office Do You Need?", "/dmv/texas-dmv-vs-dps"],
      ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
      ["Find a Texas DMV or County Tax Office", "/find-my-dmv"],
      ["Moving to Texas Resource Center", "/moving-to-texas"],
    ],
  },
  {
    title: "Get a Texas driver license or ID",
    description: "Prepare for a first license, an identification card, a commercial license, an out-of-state transfer, REAL ID, and the documents DPS may require.",
    resources: [
      ["Complete Texas Driver License Guide", "/dmv/driver-license"],
      ["Texas Identification Card Guide", "/dmv/identification-card"],
      ["Texas Commercial Driver License Guide", "/dmv/cdl"],
      ["Documents Required for a Texas Driver License or ID", "/dmv/driver-license-documents"],
      ["Texas REAL ID Guide", "/dmv/real-id"],
      ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
    ],
  },
  {
    title: "Maintain your driver license or ID",
    description: "Renew a credential, replace a lost or stolen card, update your address, check driving eligibility, or manage a commercial license.",
    resources: [
      ["Texas Driver License Renewal", "/dmv/driver-license-renewal"],
      ["Replace a Lost or Stolen Texas Driver License or ID", "/dmv/replace-lost-license"],
      ["Change Address on a Texas Driver License or ID", "/dmv/change-address"],
      ["Check Texas Driver License Status", "/dmv/license-status"],
      ["Texas Identification Card Guide", "/dmv/identification-card"],
      ["Texas CDL Guide", "/dmv/cdl"],
    ],
  },
  {
    title: "Vehicle registration, titles, and plates",
    description: "TxDMV sets statewide vehicle rules, while county tax assessor-collector offices complete most public-facing title and registration transactions.",
    resources: [
      ["Buying or Selling a Vehicle in Texas", "/vehicles/buying-selling"],
      ["Texas Vehicle Registration Guide", "/vehicles/registration"],
      ["Texas Registration Renewal", "/vehicles/renewal"],
      ["Texas Title Transfer Guide", "/vehicles/title-transfer"],
      ["Texas Bonded Title Guide", "/vehicles/bonded-titles"],
      ["Texas Salvage and Rebuilt Title Guide", "/vehicles/salvage-rebuilt-titles"],
      ["Texas License Plates Guide", "/vehicles/plates"],
      ["Texas Temporary Tags and Permits Guide", "/vehicles/temporary-tags"],
      ["Vehicle Registration Estimator and Office Finder", "/find-my-dmv"],
    ],
  },
  {
    title: "New Texas residents",
    description: "Coordinate the separate deadlines for registering a vehicle and obtaining a Texas driver license, identification card, or commercial credential.",
    resources: [
      ["Texas Vehicle Registration Guide", "/vehicles/registration"],
      ["Texas Registration Renewal", "/vehicles/renewal"],
      ["Texas Title Transfer Guide", "/vehicles/title-transfer"],
      ["Texas License Plates Guide", "/vehicles/plates"],
      ["Texas Temporary Tags and Permits Guide", "/vehicles/temporary-tags"],
      ["Complete Texas Driver License Guide", "/dmv/driver-license"],
      ["Texas Identification Card Guide", "/dmv/identification-card"],
      ["Texas Commercial Driver License Guide", "/dmv/cdl"],
      ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
      ["Change Address on a Texas Driver License or ID", "/dmv/change-address"],
      ["Moving to Texas Resource Center", "/moving-to-texas"],
      ["Interactive Moving Checklist", "/moving-to-texas-checklist"],
      ["Texas Moving Cost Calculator", "/texas-moving-cost-calculator"],
      ["Texas Laws Hub", "/laws"],
    ],
  },
] as const;

const availableRoutes = new Set([
  "/dmv/texas-dmv-vs-dps",
  "/dmv/driver-license",
  "/dmv/identification-card",
  "/dmv/cdl",
  "/dmv/driver-license-documents",
  "/dmv/real-id",
  "/dmv/driver-license-renewal",
  "/dmv/replace-lost-license",
  "/dmv/change-address",
  "/dmv/dps-appointments",
  "/dmv/license-status",
  "/vehicles/buying-selling",
  "/vehicles/registration",
  "/vehicles/renewal",
  "/vehicles/title-transfer",
  "/vehicles/bonded-titles",
  "/vehicles/salvage-rebuilt-titles",
  "/vehicles/plates",
  "/vehicles/temporary-tags",
  "/find-my-dmv",
  "/moving-to-texas",
  "/moving-to-texas-checklist",
  "/texas-moving-cost-calculator",
  "/laws",
]);

const faq = [
  { question: "Does the Texas DMV issue driver licenses or identification cards?", answer: "No. The Texas Department of Public Safety issues driver licenses, commercial driver licenses, identification cards, and REAL ID-compliant credentials." },
  { question: "Where do Texans register a vehicle?", answer: "Most vehicle registration and title transactions are completed through the county tax assessor-collector office, which works in partnership with the Texas Department of Motor Vehicles." },
  { question: "How long does a new Texas resident have to register a vehicle?", answer: "TxDMV generally requires a new resident to title and register a vehicle within 30 days after establishing Texas residency." },
  { question: "How long does a buyer have to transfer a Texas vehicle title?", answer: "TxDMV says a buyer generally must apply for title within 30 days after the sale. Delinquent-transfer penalties may apply after that deadline." },
  { question: "What should a Texas seller do after a private vehicle sale?", answer: "The seller should provide the properly assigned title and signed Form 130-U, keep detailed transaction records, and file a Vehicle Transfer Notification within 30 days. Going to the county tax office with the buyer offers the strongest confirmation that the title application was filed." },
  { question: "What is a Texas bonded title?", answer: "A bonded title is a Texas title issued after TxDMV determines an applicant is eligible and the applicant purchases a surety bond. The bond amount is generally one and one-half times the vehicle's determined value." },
  { question: "Can a Texas salvage vehicle be driven on public roads?", answer: "No. A salvage or nonrepairable vehicle may not be operated on public roads. A salvage vehicle must be rebuilt, inspected, titled with the proper rebuilt brand, insured, and registered before road use." },
  { question: "How early can Texas vehicle registration be renewed?", answer: "Online renewal is generally available beginning 90 days before expiration. The official system determines eligibility, including whether an expired registration can still be renewed online." },
  { question: "How much do replacement Texas license plates cost?", answer: "TxDMV lists a $6 replacement-plate fee plus a $0.50 automation fee. County or transaction-specific charges may also apply." },
  { question: "Do disabled veteran plates automatically allow disabled parking?", answer: "No. A disabled veteran plate must display the International Symbol of Access, or the person must display a qualifying disabled parking placard, to use an accessible parking space." },
  { question: "Did Texas eliminate temporary paper tags?", answer: "Texas eliminated most dealer-issued paper temporary tags on July 1, 2025. Dealers now generally issue metal plates, while one-trip and 30-day temporary registration use metal Temporary Registration Plates. Paper Vehicle Transit Permits and 72-hour or 144-hour commercial permits remain available for qualifying uses." },
  { question: "Can Texas driver license and ID services be completed online?", answer: "Many eligible renewals, replacements, address changes, and certain senior license-to-ID surrender transactions can be completed through Texas by Texas, or TxT. DPS makes the final eligibility decision." },
  { question: "Do Texas DPS driver license offices require appointments?", answer: "Texas DPS says all in-office driver license and identification card services are handled by scheduled appointment. Limited same-day openings may be available online at many offices." },
  { question: "How do I check whether my Texas driver license is eligible?", answer: "Use the official Texas DPS License Eligibility system. It can show whether your driving privilege is eligible and list outstanding reinstatement fees or compliance requirements." },
  { question: "Who needs entry-level driver training for a Texas CDL?", answer: "Federal ELDT rules generally apply to first-time Class A or Class B applicants, Class B holders upgrading to Class A, and first-time applicants for passenger, school-bus, or hazardous-materials endorsements." },
  { question: "Can I hold a Texas driver license and a Texas ID card at the same time?", answer: "Texas DPS generally requires a driver license holder to surrender that license when applying for a Texas identification card. The ID card proves identity but does not authorize driving." },
  { question: "How soon must I update my driver license or ID address after moving?", answer: "Texas DPS says the address on a driver license or ID card must be changed within 30 days after moving to a new residence." },
];

function DmvHubPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas DMV & Driver Services" />
      <section className="border-b bg-muted/30"><div className="mx-auto max-w-6xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas vehicle and driver services</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Texas DMV & Driver Services</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Find the right Texas agency, office, appointment, documents, eligibility status, deadlines, and next steps for buying or selling vehicles, driver licenses, identification cards, registration, title transfers, bonded titles, salvage and rebuilt titles, license plates, and temporary permits.</p><div className="mt-8 flex flex-wrap gap-3"><a href="/dmv/texas-dmv-vs-dps" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Find the right agency</a><a href="/vehicles/buying-selling" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Buy or sell a vehicle</a><a href="/vehicles/bonded-titles" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Get a bonded title</a><a href="/vehicles/salvage-rebuilt-titles" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Salvage and rebuilt titles</a><a href="/vehicles/temporary-tags" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Get a temporary permit</a><a href="/vehicles/plates" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Choose or replace plates</a><a href="/vehicles/title-transfer" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Transfer a title</a><a href="/vehicles/renewal" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Renew registration</a><a href="/vehicles/registration" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Register a vehicle</a><a href="/dmv/cdl" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Get a Texas CDL</a><a href="/dmv/identification-card" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Get a Texas ID card</a><a href="/dmv/license-status" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Check license status</a><a href="/dmv/dps-appointments" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Schedule a DPS appointment</a><a href="/dmv/driver-license" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Get a Texas driver license</a><a href="/find-my-dmv" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Find an office and estimate fees</a></div></div></section>

      <section className="mx-auto max-w-6xl px-4 py-14"><div className="max-w-3xl"><h2 className="text-3xl font-bold">Texas does not have one office for every driving and vehicle task</h2><p className="mt-4 leading-relaxed text-muted-foreground">DPS handles people and driving credentials. TxDMV administers statewide vehicle programs. County tax assessor-collector offices perform most public-facing vehicle title and registration work.</p></div><div className="mt-12 space-y-12">{serviceGroups.map((group) => <section key={group.title}><div className="mb-5 max-w-3xl"><h2 className="text-2xl font-bold">{group.title}</h2><p className="mt-2 text-muted-foreground">{group.description}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{group.resources.map(([title, href]) => availableRoutes.has(href) ? <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary">{title}<span className="mt-3 block text-sm font-medium text-primary">Open guide →</span></a> : <div key={href} className="rounded-xl border border-dashed bg-muted/20 p-5"><span className="font-semibold">{title}</span><span className="mt-3 block text-sm text-muted-foreground">Guide in development</span></div>)}</div></section>)}</div></section>

      <section className="border-y bg-muted/30"><div className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Quick agency guide</h2><div className="mt-7 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/50"><tr><th className="px-4 py-3 font-semibold">Task</th><th className="px-4 py-3 font-semibold">Start with</th></tr></thead><tbody className="divide-y">{[["Driver license, ID card, REAL ID, CDL, driving test", "Texas DPS"],["Apply for a commercial learner permit or CDL", "Texas DPS and FMCSA"],["Apply for a non-driver Texas identification card", "Texas DPS"],["Check license eligibility, holds, or reinstatement items", "DPS License Eligibility"],["Schedule an in-person driver license or ID service", "Texas Scheduler"],["Renew, replace, or change a driver license or ID address", "Texas DPS or TxT"],["Buy or sell a vehicle in a private transaction", "TxDMV guidance and county tax assessor-collector"],["Register or title a vehicle", "County tax assessor-collector"],["Transfer a vehicle title after a sale or gift", "County tax assessor-collector"],["Start a bonded-title eligibility review", "TxDMV Regional Service Center"],["File an approved bonded title", "County tax assessor-collector"],["Title a rebuilt salvage vehicle", "County tax assessor-collector after TxDMV salvage-title steps"],["Renew vehicle registration", "TxT, TxDMV, or county tax office"],["Obtain a one-trip or 30-day temporary registration plate", "County tax office or TxDMV Regional Service Center"],["Print a private-sale Vehicle Transit Permit", "TxDMV online"],["Order, replace, or transfer license plates", "TxDMV or county tax office"],["Disabled parking plates or placards", "County tax assessor-collector"],["Dealer licensing, motor carriers, statewide vehicle programs", "Texas DMV"],["New resident with a vehicle", "County tax office first, then DPS"]].map(([task, office]) => <tr key={task}><td className="px-4 py-3">{task}</td><td className="px-4 py-3 font-semibold">{office}</td></tr>)}</tbody></table></div></div></section>

      <section className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-7 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p></details>)}</div></section>
      <section className="border-t bg-muted/20"><div className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground"><p>Official requirements can change. Confirm forms, taxes, private-sale records, title and lien status, bond amounts, permit and plate fees, salvage-title eligibility, inspections, office hours, emissions rules, and transaction requirements with the relevant Texas or federal agency.</p></div></section>
    </main>
  );
}

export const Route = createFileRoute("/dmv")({
  head: () => {
    const seo = buildSeo({ title: "Texas DMV & DPS: Vehicle Sales, Titles, Permits & Licenses", description: "Texas DMV and DPS guides for buying and selling vehicles, title transfers, bonded and rebuilt titles, temporary permits, registration, plates, driver licenses, and ID cards.", path: "/dmv", type: "website", keywords: "Texas DMV, buying a car in Texas, selling a car in Texas, Texas title transfer, Texas bonded title, Texas temporary permits, Texas vehicle registration, Texas driver license" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Texas DMV & Driver Services", url: `${SITE_URL}/dmv`, description: "Texas guides for buying and selling vehicles, title transfers, bonded and rebuilt titles, temporary permits, registration, license plates, driver licenses, identification cards, and DPS appointments.", isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: `${SITE_URL}/` } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }] }) },
    ] };
  },
  component: DmvHubPage,
});