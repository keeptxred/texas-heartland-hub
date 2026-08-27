import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const serviceGroups = [
  {
    title: "Start here",
    description: "Identify the correct Texas agency, office, documents, deadlines, and fees before starting a transaction.",
    resources: [
      ["Texas DMV vs. DPS: Which Office Do You Need?", "/dmv/texas-dmv-vs-dps"],
      ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
      ["Find a Texas DMV or County Tax Office", "/find-my-dmv"],
      ["Frequently Used TxDMV Forms and Downloads", "/dmv/forms-downloads"],
      ["Moving to Texas Resource Center", "https://texasdefined.com/moving-to-texas"],
    ],
  },
  {
    title: "Driver licenses, identification and commercial driving",
    description: "Get, renew, replace, or update a Texas credential and understand commercial license classes and endorsements.",
    resources: [
      ["Complete Texas Driver License Guide", "/dmv/driver-license"],
      ["Texas Identification Card Guide", "/dmv/identification-card"],
      ["Texas Commercial Driver License Guide", "/dmv/cdl"],
      ["Texas CDL Classes Explained", "/dmv/cdl-classes"],
      ["Texas CDL Endorsements", "/dmv/cdl-endorsements"],
      ["Documents Required for a Texas Driver License or ID", "/dmv/driver-license-documents"],
      ["Texas REAL ID Guide", "/dmv/real-id"],
      ["Texas Driver License Renewal", "/dmv/driver-license-renewal"],
      ["Replace a Lost or Stolen License or ID", "/dmv/replace-lost-license"],
      ["Change Address on a Texas License or ID", "/dmv/change-address"],
      ["Check Texas Driver License Status", "/dmv/license-status"],
    ],
  },
  {
    title: "Registration, titles and vehicle transactions",
    description: "Complete Texas registration, title, purchase, sale, tax, plate, permit, and special-vehicle transactions.",
    resources: [
      ["Texas Vehicle Registration Guide", "/vehicles/registration"],
      ["Texas Registration Renewal", "/vehicles/renewal"],
      ["Texas Vehicle Registration Fees and Taxes", "/vehicles/registration-fees-taxes"],
      ["Vehicle Registration for New Texas Residents", "/vehicles/new-residents"],
      ["Texas Title Transfer Guide", "/vehicles/title-transfer"],
      ["Replace a Lost Texas Vehicle Title", "/vehicles/duplicate-titles"],
      ["Liens and Corrected Titles", "/vehicles/liens-duplicate-corrected-titles"],
      ["Texas Bonded Title Guide", "/vehicles/bonded-titles"],
      ["Texas Salvage and Rebuilt Title Guide", "/vehicles/salvage-rebuilt-titles"],
      ["Buying a Car in Texas", "/vehicles/buying-a-car"],
      ["Selling a Car in Texas", "/vehicles/selling-a-car"],
      ["Texas Private Party Vehicle Sales", "/vehicles/private-party-sales"],
    ],
  },
  {
    title: "Plates, parking and special registrations",
    description: "Choose plates and permits or handle accessible parking, farm, antique, classic, fleet, and apportioned registration.",
    resources: [
      ["Texas License Plates Guide", "/vehicles/plates"],
      ["Texas Personalized License Plates", "/vehicles/personalized-plates"],
      ["Texas Temporary Tags and Permits", "/vehicles/temporary-tags"],
      ["Disabled Parking Placards and License Plates", "/vehicles/disabled-parking"],
      ["Farm, Antique, Classic and Specialty Registration", "/vehicles/farm-antique-specialty"],
      ["Fleet, Commercial and Apportioned Registration", "/vehicles/commercial-fleet-irp"],
    ],
  },
  {
    title: "Insurance, financial responsibility and inspections",
    description: "Understand liability coverage, proof requirements, SR-22 filings, annual commercial inspections, emissions tests, and equipment rules.",
    resources: [
      ["Texas Auto Insurance Requirements", "/vehicles/auto-insurance-requirements"],
      ["Texas Financial Responsibility Law", "/vehicles/financial-responsibility"],
      ["Texas Vehicle Inspections", "/vehicles/inspections"],
      ["Texas Vehicle Inspections and Emissions", "/vehicles/inspections-emissions"],
    ],
  },
] as const;

const faq = [
  { question: "Does TxDMV issue Texas driver licenses?", answer: "No. Texas DPS issues driver licenses, identification cards, CDLs, and REAL ID credentials. TxDMV administers vehicle programs, while county tax offices complete most title and registration transactions." },
  { question: "Does Texas still require annual vehicle safety inspections?", answer: "Most non-commercial vehicles no longer require comprehensive annual safety inspections. Commercial vehicles still require annual safety inspections, and qualifying vehicles in emissions counties still require emissions testing." },
  { question: "How long does a private-sale buyer have to transfer title?", answer: "A buyer generally must apply for title within 30 calendar days after the sale to avoid delinquent-transfer penalties." },
  { question: "What are the minimum Texas auto liability limits?", answer: "The minimum limits are commonly described as 30/60/25: $30,000 for injury to one person, $60,000 total injury liability per accident, and $25,000 for property damage." },
  { question: "What is a replacement Texas vehicle title called?", answer: "TxDMV calls it a Certified Copy of Title. The application is Form VTR-34." },
];

function DmvHubPage() {
  return <main>
    <HubBreadcrumbs current="Texas DMV & Driver Services" />
    <section className="border-b bg-muted/30"><div className="mx-auto max-w-6xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas vehicle and driver services</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Texas DMV & Driver Services</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Texas guides for driver licenses, CDLs, registration, titles, buying and selling, plates, insurance, financial responsibility, inspections, and emissions testing.</p><div className="mt-8 flex flex-wrap gap-3"><a href="/dmv/texas-dmv-vs-dps" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Find the right agency</a><a href="/find-my-dmv" className="rounded-md border px-5 py-3 text-sm font-semibold">Find an office</a><a href="/vehicles/new-residents" className="rounded-md border px-5 py-3 text-sm font-semibold">New resident guide</a><a href="/vehicles/buying-a-car" className="rounded-md border px-5 py-3 text-sm font-semibold">Buy a vehicle</a><a href="/vehicles/auto-insurance-requirements" className="rounded-md border px-5 py-3 text-sm font-semibold">Insurance requirements</a></div></div></section>
    <section className="mx-auto max-w-6xl px-4 py-14"><div className="space-y-12">{serviceGroups.map((group) => <section key={group.title}><div className="mb-5 max-w-3xl"><h2 className="text-2xl font-bold">{group.title}</h2><p className="mt-2 text-muted-foreground">{group.description}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{group.resources.map(([title, href]) => <a key={`${title}-${href}`} href={href} className="rounded-xl border bg-card p-5 font-semibold transition hover:-translate-y-0.5 hover:shadow-md">{title}<span className="mt-3 block text-sm font-medium text-primary">Open guide →</span></a>)}</div></section>)}</div></section>
    <section className="border-y bg-muted/30"><div className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Which agency handles the task?</h2><div className="mt-7 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/50"><tr><th className="px-4 py-3">Task</th><th className="px-4 py-3">Start with</th></tr></thead><tbody className="divide-y">{[["Driver license, ID, REAL ID, CDL or driving test","Texas DPS"],["Vehicle registration, title or private sale","County tax assessor-collector and TxDMV"],["Commercial safety or emissions inspection","DPS-certified inspection station"],["Motor-vehicle tax questions","County tax office and Texas Comptroller"],["Auto insurance complaint or coverage guidance","Texas Department of Insurance"]].map(([task, office]) => <tr key={task}><td className="px-4 py-3">{task}</td><td className="px-4 py-3 font-semibold">{office}</td></tr>)}</tbody></table></div></div></section>
    <section className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-7 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
    <section className="border-t bg-muted/20"><div className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground">Official requirements can change. Confirm current forms, fees, eligibility, deadlines, office procedures, insurance requirements, and inspection rules with the responsible Texas agency.</div></section>
  </main>;
}

export const Route = createFileRoute("/dmv")({
  head: () => { const seo = buildSeo({ title: "Texas DMV & DPS Guides: Licenses, Titles, Registration and Insurance", description: "Texas DMV and DPS guides for driver licenses, CDLs, vehicle registration, titles, private sales, plates, insurance, inspections and emissions.", path: "/dmv", type: "website", keywords: "Texas DMV, Texas DPS, Texas vehicle registration, Texas title transfer, Texas CDL, Texas auto insurance" }); return { meta: seo.meta, links: seo.links, scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context":"https://schema.org", "@type":"CollectionPage", name:"Texas DMV & Driver Services", url:`${SITE_URL}/dmv` }) }, { type:"application/ld+json", children:JSON.stringify({ "@context":"https://schema.org", "@type":"FAQPage", mainEntity:faq.map((item)=>({ "@type":"Question", name:item.question, acceptedAnswer:{ "@type":"Answer", text:item.answer } })) }) }] }; },
  component: DmvHubPage,
});