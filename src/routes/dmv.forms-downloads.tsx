import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const forms = [
  ["130-U", "Application for Texas Title and/or Registration", "Title transfers, new titles, registration, lien changes, gifts, and many ownership transactions"],
  ["VTR-34", "Application for a Certified Copy of Title", "Replace a lost, destroyed, or unreceived Texas title"],
  ["VTR-346", "Texas Motor Vehicle Transfer Notification", "Notify TxDMV after selling or transferring a vehicle"],
  ["VTR-146", "Change of Address for Texas Motor Vehicle", "Update the address connected to a vehicle record"],
  ["VTR-214", "Application for Persons with Disabilities Parking Placard and/or License Plate", "Apply for a disabled parking placard or qualifying plate"],
  ["VTR-267", "Additional Liens Statement", "Record an additional lienholder on a Texas vehicle title"],
  ["VTR-262", "Affidavit of Heirship for a Motor Vehicle", "Transfer a vehicle from an estate when the statutory heirship process applies"],
  ["VTR-61", "Rebuilt Vehicle Statement", "Document repairs and component parts for rebuilt or assembled-vehicle transactions"],
  ["VTR-54", "Application for Antique License Plate", "Apply for qualifying antique vehicle registration"],
  ["VTR-66", "Application for Timed Temporary Permits", "Request a qualifying 30-day or other timed temporary permit"],
  ["14-317", "Affidavit of Motor Vehicle Gift Transfer", "Texas Comptroller form for qualifying vehicle gifts"],
];

const faq = [
  { question: "Where should I download Texas vehicle forms?", answer: "Use the official TxDMV forms search page or the Texas Comptroller website for tax forms. Download a fresh copy before filing because forms and instructions can change." },
  { question: "Can I submit every TxDMV form online?", answer: "No. Submission options vary. Some transactions are online, while others require mail, a county tax office, or a TxDMV Regional Service Center." },
  { question: "Is Form 130-U used for driver licenses?", answer: "No. Form 130-U is for vehicle title and registration transactions. Texas DPS handles driver licenses and identification cards." },
];

function Page() {
  return <main>
    <HubBreadcrumbs current="Frequently Used TxDMV Forms & Downloads" />
    <section className="border-b bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-16"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas vehicle paperwork</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Frequently Used TxDMV Forms & Downloads</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Find the form number and purpose for common Texas title, registration, lien, disabled-parking, antique-vehicle, temporary-permit, sale, gift, and estate transactions.</p></div></section>
    <section className="mx-auto max-w-5xl px-4 py-14 space-y-12">
      <section><h2 className="text-3xl font-bold">Common Texas vehicle forms</h2><p className="mt-4 text-muted-foreground">Use this list to identify the form, then download the latest version from the official TxDMV or Texas Comptroller website.</p><div className="mt-6 overflow-x-auto rounded-xl border"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/50"><tr><th className="px-4 py-3">Form</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Common use</th></tr></thead><tbody className="divide-y">{forms.map(([number, title, use]) => <tr key={number}><td className="px-4 py-3 font-bold text-primary">{number}</td><td className="px-4 py-3 font-semibold">{title}</td><td className="px-4 py-3 text-muted-foreground">{use}</td></tr>)}</tbody></table></div></section>
      <section><h2 className="text-3xl font-bold">Before submitting a form</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Use the current edition</h3><p className="mt-2 text-sm text-muted-foreground">Discard saved or printed copies when the revision date, fee, mailing address, or instructions may be outdated.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Follow signature rules</h3><p className="mt-2 text-sm text-muted-foreground">Some forms require every recorded owner, a lienholder, a medical professional, a donor and recipient, or notarization.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Bring supporting evidence</h3><p className="mt-2 text-sm text-muted-foreground">Identification, ownership records, lien releases, insurance, inspections, photographs, receipts, or tax documents may be required.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Use the correct office</h3><p className="mt-2 text-sm text-muted-foreground">County tax offices handle most titles and registrations. Regional Service Centers handle certified title copies and certain specialized transactions.</p></div></div></section>
      <section><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
    </section>
    <section className="border-t bg-muted/20"><div className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted-foreground">This page identifies common forms but does not replace official instructions. Verify the current form, revision date, eligibility, fees, signatures, supporting documents, and filing location before submitting.</div></section>
  </main>;
}

export const Route = createFileRoute("/dmv/forms-downloads")({
  head: () => { const seo = buildSeo({ title: "Texas DMV Forms: 130-U, VTR-34, VTR-346 & More", description: "Guide to frequently used TxDMV forms for Texas titles, registration, liens, sales, gifts, placards, antique plates, permits, and address changes.", path: "/dmv/forms-downloads", type: "article", keywords: "Texas DMV forms, Form 130-U, VTR-34, VTR-346, VTR-214, TxDMV forms download" }); return { meta: seo.meta, links: seo.links, scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Frequently Used TxDMV Forms & Downloads", url: `${SITE_URL}/dmv/forms-downloads` }) }, { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) }] }; },
  component: Page,
});