import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const guides = [
  { title: "Buying a Car in Texas", href: "/vehicles/buying-a-car", description: "Verify the VIN, title, seller, liens, taxes, inspection status, insurance, and transfer documents before paying." },
  { title: "Selling a Car in Texas", href: "/vehicles/selling-a-car", description: "Assign the title correctly, verify payment, manage plates and insurance, keep records, and file the Vehicle Transfer Notification." },
  { title: "Texas Private Party Vehicle Sales", href: "/vehicles/private-party-sales", description: "Follow the complete buyer-and-seller transaction sequence, including Form 130-U, taxes, payment, title filing, and transit permits." },
] as const;

const faq = [
  { question: "What is the safest way to complete a Texas private vehicle sale?", answer: "When possible, buyer and seller should meet at the county tax assessor-collector office so title problems can be identified before the transaction is completed and the seller can confirm that the buyer filed the title application." },
  { question: "How long does the buyer have to apply for title?", answer: "The buyer generally has 30 calendar days from the date of sale to apply for title and avoid delinquent-transfer penalties." },
  { question: "What should the seller file after the sale?", answer: "The seller should file the TxDMV Vehicle Transfer Notification within 30 days and retain the confirmation with the transaction records." },
];

function BuyingSellingHubPage() {
  return <main>
    <HubBreadcrumbs current="Buying and Selling Vehicles in Texas" />
    <section className="border-b bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas vehicle transaction center</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Buying and Selling Vehicles in Texas</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Choose the guide that matches your side of the transaction, or use the private-party guide for the full buyer-and-seller process.</p><div className="mt-8 flex flex-wrap gap-3"><a href="https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle" rel="noreferrer" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Official TxDMV instructions</a><a href="/vehicles/title-transfer" className="rounded-md border px-5 py-3 text-sm font-semibold">Title transfer guide</a></div></div></section>
    <section className="mx-auto max-w-5xl px-4 py-14"><div className="grid gap-6 md:grid-cols-3">{guides.map((guide) => <a key={guide.href} href={guide.href} className="rounded-xl border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"><h2 className="text-2xl font-bold">{guide.title}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{guide.description}</p><span className="mt-5 block font-semibold text-primary">Open guide →</span></a>)}</div></section>
    <section className="border-y bg-muted/30"><div className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Documents used in many Texas private sales</h2><ul className="mt-6 list-disc space-y-3 pl-6 text-muted-foreground"><li>Properly assigned original Texas title.</li><li>Application for Texas Title and/or Registration, Form 130-U.</li><li>Original lien release when a paid lien remains recorded.</li><li>Bill of sale and payment record.</li><li>Vehicle Transfer Notification filed by the seller.</li><li>Proof of liability insurance for registration and lawful operation.</li></ul></div></section>
    <section className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
    <section className="border-t bg-muted/20"><div className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground">Confirm current title records, liens, forms, tax calculations, inspection requirements, and county procedures before exchanging money or possession.</div></section>
  </main>;
}

export const Route = createFileRoute("/vehicles/buying-selling")({
  head: () => { const seo = buildSeo({ title: "Buying and Selling Vehicles in Texas: Transaction Guide", description: "Texas vehicle transaction hub with separate guides for buyers, sellers, and private-party vehicle sales.", path: "/vehicles/buying-selling", type: "website", keywords: "buying a car in Texas, selling a car in Texas, Texas private party vehicle sale" }); return { meta:seo.meta, links:seo.links, scripts:[{ type:"application/ld+json", children:JSON.stringify({ "@context":"https://schema.org", "@type":"CollectionPage", name:"Buying and Selling Vehicles in Texas", url:`${SITE_URL}/vehicles/buying-selling` }) }, { type:"application/ld+json", children:JSON.stringify({ "@context":"https://schema.org", "@type":"FAQPage", mainEntity:faq.map((item)=>({ "@type":"Question", name:item.question, acceptedAnswer:{ "@type":"Answer", text:item.answer } })) }) }] }; },
  component: BuyingSellingHubPage,
});