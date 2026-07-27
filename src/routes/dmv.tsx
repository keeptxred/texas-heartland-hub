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
    title: "Get a Texas driver license",
    description: "Prepare for a first license, an out-of-state transfer, REAL ID, and the documents DPS may require.",
    resources: [
      ["Complete Texas Driver License Guide", "/dmv/driver-license"],
      ["Documents Required for a Texas Driver License", "/dmv/driver-license-documents"],
      ["Texas REAL ID Guide", "/dmv/real-id"],
      ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
    ],
  },
  {
    title: "Maintain your driver license",
    description: "Renew a credential, replace a lost or stolen card, or update your address after moving.",
    resources: [
      ["Texas Driver License Renewal", "/dmv/driver-license-renewal"],
      ["Replace a Lost or Stolen Texas Driver License", "/dmv/replace-lost-license"],
      ["Change Address on a Texas Driver License", "/dmv/change-address"],
      ["Check Texas Driver License Status", "/dmv/license-status"],
      ["Texas CDL Guide", "/dmv/cdl"],
    ],
  },
  {
    title: "Vehicle registration, titles, and plates",
    description: "TxDMV sets statewide vehicle rules, while county tax assessor-collector offices complete most public-facing title and registration transactions.",
    resources: [
      ["Texas Vehicle Registration Guide", "/vehicles/registration"],
      ["Texas Registration Renewal", "/vehicles/renewal"],
      ["Texas Title Transfer Guide", "/vehicles/title-transfer"],
      ["Texas License Plates Guide", "/vehicles/plates"],
      ["Texas Temporary Tags Guide", "/vehicles/temporary-tags"],
      ["Vehicle Registration Estimator and Office Finder", "/find-my-dmv"],
    ],
  },
  {
    title: "New Texas residents",
    description: "Coordinate the separate deadlines for registering a vehicle and transferring an out-of-state driver license.",
    resources: [
      ["Complete Texas Driver License Guide", "/dmv/driver-license"],
      ["Texas DPS Appointment Guide", "/dmv/dps-appointments"],
      ["Change Address on a Texas Driver License", "/dmv/change-address"],
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
  "/dmv/driver-license-documents",
  "/dmv/real-id",
  "/dmv/driver-license-renewal",
  "/dmv/replace-lost-license",
  "/dmv/change-address",
  "/dmv/dps-appointments",
  "/find-my-dmv",
  "/moving-to-texas",
  "/moving-to-texas-checklist",
  "/texas-moving-cost-calculator",
  "/laws",
]);

const faq = [
  { question: "Does the Texas DMV issue driver licenses?", answer: "No. The Texas Department of Public Safety issues driver licenses, commercial driver licenses, identification cards, and REAL ID-compliant credentials." },
  { question: "Where do Texans register a vehicle?", answer: "Most vehicle registration and title transactions are completed through the county tax assessor-collector office, which works in partnership with the Texas Department of Motor Vehicles." },
  { question: "Can Texas driver license services be completed online?", answer: "Many eligible renewals, replacements, and address changes can be completed through Texas by Texas, or TxT. DPS makes the final eligibility decision." },
  { question: "Do Texas DPS driver license offices require appointments?", answer: "Texas DPS says all in-office driver license and identification card services are handled by scheduled appointment. Limited same-day openings may be available online at many offices." },
  { question: "How soon must I update my driver license address after moving?", answer: "Texas DPS says the address on a driver license or ID card must be changed within 30 days after moving to a new residence." },
];

function DmvHubPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas DMV & Driver Services" />
      <section className="border-b bg-muted/30"><div className="mx-auto max-w-6xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas vehicle and driver services</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Texas DMV & Driver Services</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Find the right Texas agency, office, appointment, documents, deadlines, and next steps for driver licenses, REAL ID, renewals, replacements, address changes, vehicle registration, titles, and plates.</p><div className="mt-8 flex flex-wrap gap-3"><a href="/dmv/texas-dmv-vs-dps" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Find the right agency</a><a href="/dmv/dps-appointments" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Schedule a DPS appointment</a><a href="/dmv/driver-license" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Get a Texas driver license</a><a href="/find-my-dmv" className="rounded-md border px-5 py-3 text-sm font-semibold hover:bg-muted">Find an office and estimate fees</a></div></div></section>

      <section className="mx-auto max-w-6xl px-4 py-14"><div className="max-w-3xl"><h2 className="text-3xl font-bold">Texas does not have one office for every driving and vehicle task</h2><p className="mt-4 leading-relaxed text-muted-foreground">DPS handles people and driving credentials. TxDMV administers statewide vehicle programs. County tax assessor-collector offices perform most public-facing vehicle title and registration work.</p></div><div className="mt-12 space-y-12">{serviceGroups.map((group) => <section key={group.title}><div className="mb-5 max-w-3xl"><h2 className="text-2xl font-bold">{group.title}</h2><p className="mt-2 text-muted-foreground">{group.description}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{group.resources.map(([title, href]) => availableRoutes.has(href) ? <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary">{title}<span className="mt-3 block text-sm font-medium text-primary">Open guide →</span></a> : <div key={href} className="rounded-xl border border-dashed bg-muted/20 p-5"><span className="font-semibold">{title}</span><span className="mt-3 block text-sm text-muted-foreground">Guide in development</span></div>)}</div></section>)}</div></section>

      <section className="border-y bg-muted/30"><div className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Quick agency guide</h2><div className="mt-7 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/50"><tr><th className="px-4 py-3 font-semibold">Task</th><th className="px-4 py-3 font-semibold">Start with</th></tr></thead><tbody className="divide-y">{[["Driver license, ID card, REAL ID, CDL, driving test", "Texas DPS"],["Schedule an in-person driver license service", "Texas Scheduler"],["Renew, replace, or change a driver license address", "Texas DPS or TxT"],["Vehicle title, registration, plates, disabled placard", "County tax assessor-collector"],["Dealer licensing, motor carriers, statewide vehicle programs", "Texas DMV"],["New resident with a vehicle", "County tax office first, then DPS"]].map(([task, office]) => <tr key={task}><td className="px-4 py-3">{task}</td><td className="px-4 py-3 font-semibold">{office}</td></tr>)}</tbody></table></div></div></section>

      <section className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-7 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p></details>)}</div></section>
      <section className="border-t bg-muted/20"><div className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground"><p>Official requirements can change. Confirm forms, fees, eligibility, office hours, appointment availability, and transaction rules with the relevant Texas agency or county office before traveling.</p></div></section>
    </main>
  );
}

export const Route = createFileRoute("/dmv")({
  head: () => {
    const seo = buildSeo({ title: "Texas DMV & Driver Services: Licenses, Appointments, Registration & Titles", description: "Texas DMV and DPS guides for driver licenses, DPS appointments, REAL ID, renewals, replacements, registration, titles, plates, and offices.", path: "/dmv", type: "website", keywords: "Texas DMV, Texas DPS appointment, Texas driver license, Texas Scheduler, Texas driver license renewal, Texas vehicle registration" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Texas DMV & Driver Services", url: `${SITE_URL}/dmv`, description: "Texas guides for driver licenses, DPS appointments, identification, renewals, replacements, vehicle registration, titles, and plates.", isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: `${SITE_URL}/` } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }] }) },
    ] };
  },
  component: DmvHubPage,
});