import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const fees = [
  ["Passenger cars and light trucks", "$50.75 base registration fee, plus $1 for TexasSure"],
  ["Pickup trucks from 6,001 to 10,000 pounds", "$54 base registration fee"],
  ["Trailers up to 6,000 pounds", "$45 base registration fee"],
  ["Motorcycles and mopeds", "$30 base registration fee"],
  ["Title application", "$28 or $33, depending on county"],
  ["Local county fees", "$0 to $31.50"],
  ["Processing and handling", "$4.75"],
  ["Inspection replacement fee", "$7.50 for most annual non-commercial registrations"],
  ["New two-year vehicle inspection replacement fee", "$16.75"],
  ["Fully electric vehicle fee", "$200 annually, or $400 with a qualifying initial two-year registration"],
] as const;

const faq = [
  { question: "What is the standard Texas registration fee for a passenger vehicle?", answer: "The base fee is $50.75. TxDMV also lists a $1 TexasSure insurance-verification charge, making the standard state registration line $51.75 before local, inspection, processing, specialty-plate, or electric-vehicle charges." },
  { question: "How much is Texas motor vehicle sales tax?", answer: "The rate is 6.25%. Dealer purchases are generally taxed on the sales price after an allowed motor-vehicle trade-in. Private-party purchases may be taxed on the greater of the sales price or 80% of the standard presumptive value." },
  { question: "What does a new Texas resident pay for a vehicle already owned?", answer: "A qualifying new resident generally pays a $90 new-resident tax instead of the 6.25% use tax when the vehicle was previously registered in the resident's name outside Texas." },
  { question: "How much is the Texas gift tax on a vehicle?", answer: "An eligible motor-vehicle gift is generally subject to a $10 gift tax when the transfer qualifies under Texas law and the required gift-transfer affidavit is filed." },
  { question: "Are county fees the same everywhere in Texas?", answer: "No. County road-and-bridge, transportation, and child-safety fees can vary. TxDMV says local fees can range from $0 to $31.50." },
];

function VehicleFeesTaxesPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas Vehicle Registration Fees and Taxes" />
      <section className="border-b bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-16"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas vehicle costs</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas Vehicle Registration Fees and Taxes</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Estimate the state, county, title, inspection, electric-vehicle, processing, sales-tax, use-tax, new-resident, gift, and standard-presumptive-value charges that may apply when titling or registering a vehicle in Texas.</p><div className="mt-8 flex flex-wrap gap-3"><a href="/find-my-dmv" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Estimate fees and find an office</a><a href="/vehicles/registration" className="rounded-md border px-5 py-3 text-sm font-semibold">Registration guide</a><a href="/vehicles/buying-selling" className="rounded-md border px-5 py-3 text-sm font-semibold">Buying and selling</a></div></div></section>

      <section className="mx-auto max-w-5xl px-4 py-14"><h2 className="text-3xl font-bold">Common Texas title and registration charges</h2><p className="mt-4 max-w-3xl text-muted-foreground">These are common statewide figures. Your final total depends on the vehicle type, weight, county, title transaction, inspection status, plate choice, tax treatment, and payment method.</p><div className="mt-8 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/50"><tr><th className="px-4 py-3">Charge</th><th className="px-4 py-3">Typical amount</th></tr></thead><tbody className="divide-y">{fees.map(([name, amount]) => <tr key={name}><td className="px-4 py-3 font-semibold">{name}</td><td className="px-4 py-3">{amount}</td></tr>)}</tbody></table></div></section>

      <section className="border-y bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-14"><h2 className="text-3xl font-bold">How Texas vehicle tax is calculated</h2><div className="mt-8 grid gap-5 md:grid-cols-2"><article className="rounded-xl border bg-card p-6"><h3 className="text-xl font-bold">Dealer purchase</h3><p className="mt-3 text-muted-foreground">Texas motor vehicle sales tax is 6.25% of the taxable sales price. A qualifying motor-vehicle trade-in generally reduces the taxable amount. Separately stated title, registration, inspection, and lawful document-processing charges are generally not part of the taxable vehicle price.</p></article><article className="rounded-xl border bg-card p-6"><h3 className="text-xl font-bold">Private-party purchase</h3><p className="mt-3 text-muted-foreground">Tax is generally 6.25% of the greater of the reported sales price or 80% of the vehicle's standard presumptive value. A timely certified appraisal may establish a different taxable value when the purchase price is below that threshold.</p></article><article className="rounded-xl border bg-card p-6"><h3 className="text-xl font-bold">Vehicle brought from another state</h3><p className="mt-3 text-muted-foreground">An existing Texas resident generally owes 6.25% use tax, less allowable credit for sales or use tax paid to another state. A qualifying new resident generally pays the $90 new-resident tax instead.</p></article><article className="rounded-xl border bg-card p-6"><h3 className="text-xl font-bold">Gift or even exchange</h3><p className="mt-3 text-muted-foreground">A qualifying gift generally carries a $10 tax and requires the gift-transfer affidavit. A qualifying even exchange is generally taxed at $5. Transfers that do not meet the statutory rules may be treated as taxable sales.</p></article></div></div></section>

      <section className="mx-auto max-w-5xl px-4 py-14"><h2 className="text-3xl font-bold">Example totals</h2><div className="mt-8 space-y-5"><div className="rounded-xl border bg-card p-6"><h3 className="font-bold">Private sale for $20,000</h3><p className="mt-2 text-muted-foreground">If $20,000 is at least 80% of the vehicle's standard presumptive value, sales tax is $1,250. Title, registration, county, inspection-replacement, processing, and any plate or EV fees are added separately.</p></div><div className="rounded-xl border bg-card p-6"><h3 className="font-bold">Dealer sale for $40,000 with a $10,000 trade-in</h3><p className="mt-2 text-muted-foreground">The taxable amount is generally $30,000, producing $1,875 in motor vehicle sales tax, before title, registration, county, inspection, processing, or specialty charges.</p></div></div></section>

      <section className="border-y bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-14"><h2 className="text-3xl font-bold">Avoid surprises at the county tax office</h2><ul className="mt-6 list-disc space-y-3 pl-6 text-muted-foreground"><li>Ask the county tax assessor-collector for an exact quote and accepted payment methods.</li><li>Bring the title, Form 130-U, identification, insurance, lien release, and inspection evidence when applicable.</li><li>For a private sale, check the standard presumptive value before budgeting the tax.</li><li>Do not assume a low bill-of-sale amount controls the taxable value.</li><li>Include the $200 annual EV fee when comparing ownership costs for a fully electric car or light truck.</li></ul></div></section>

      <section className="mx-auto max-w-4xl px-4 py-14"><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-7 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
      <section className="border-t bg-muted/20"><div className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground">Fee schedules, county charges, exemptions, taxable values, inspection charges, and eligibility rules can change. Confirm the final amount with the county tax assessor-collector and the Texas Comptroller.</div></section>
    </main>
  );
}

export const Route = createFileRoute("/vehicles/registration-fees-taxes")({
  head: () => {
    const seo = buildSeo({ title: "Texas Vehicle Registration Fees and Taxes", description: "Texas vehicle registration fees, title fees, county charges, electric vehicle fees, sales tax, use tax, gift tax, and standard presumptive value explained.", path: "/vehicles/registration-fees-taxes", type: "article", keywords: "Texas vehicle registration fees, Texas car sales tax, Texas title fee, Texas electric vehicle fee, standard presumptive value" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Texas Vehicle Registration Fees and Taxes", url: `${SITE_URL}/vehicles/registration-fees-taxes`, isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: `${SITE_URL}/` } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Registration Fees and Taxes", item: `${SITE_URL}/vehicles/registration-fees-taxes` }] }) },
    ] };
  },
  component: VehicleFeesTaxesPage,
});