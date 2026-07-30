import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  { question: "What is a duplicate Texas vehicle title called?", answer: "TxDMV calls the replacement document a Certified Copy of Title." },
  { question: "Where do I apply for a certified copy of title?", answer: "Applications are handled through a Texas Department of Motor Vehicles Regional Service Center, either in person or by mail under current TxDMV procedures." },
  { question: "What form is required?", answer: "Use Application for a Certified Copy of Title, Form VTR-34. All recorded owners must sign unless another authorized party is applying under the applicable rules." },
  { question: "Can Texas replace a title issued by another state?", answer: "No. A replacement for an out-of-state title must normally be requested from the state that issued it." },
];

function DuplicateTitlesPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas Duplicate Vehicle Title" />
      <section className="border-b bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas certified copy of title</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">How to Replace a Lost, Stolen or Destroyed Texas Vehicle Title</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Use Form VTR-34 and the correct owner, lien, identification, fee, and submission documents to request a Certified Copy of Title from TxDMV.</p><div className="mt-8 flex flex-wrap gap-3"><a href="https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle/get-a-copy-of-your-title" rel="noreferrer" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Official TxDMV instructions</a><a href="/vehicles/title-transfer" className="rounded-md border px-5 py-3 text-sm font-semibold">Title transfer guide</a></div></div></section>
      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 leading-relaxed">
        <section><h2 className="text-3xl font-bold">What you are requesting</h2><p className="mt-4">Texas does not issue a casual photocopy of a lost title. The replacement is a Certified Copy of Title with legal effect. It is available only for a title issued by Texas and is sent or released according to the ownership and lien information in the state record.</p></section>
        <section><h2 className="text-3xl font-bold">Documents normally required</h2><ul className="mt-5 list-disc space-y-3 pl-6"><li>Completed Form VTR-34.</li><li>Current government-issued photo identification for each recorded owner.</li><li>Original lien release when a paid lien still appears in the title record.</li><li>Required fee in an accepted payment form.</li><li>Authority documentation when an agent or business representative applies.</li></ul></section>
        <section><h2 className="text-3xl font-bold">Recorded liens change the process</h2><p className="mt-4">When a lien remains recorded, the lienholder may need to apply or provide an original release of lien. TxDMV states that a fax or photocopy of a lien release is not acceptable for this purpose. Contact the lienholder early if the loan was paid but the title record was never cleared.</p></section>
        <section><h2 className="text-3xl font-bold">Apply by mail or in person</h2><p className="mt-4">Mail applications go to the appropriate TxDMV Regional Service Center with Form VTR-34, copies of identification, lien evidence when applicable, and the mail fee. In-person applicants should confirm appointment availability, accepted payment methods, identification requirements, and current fees before traveling.</p></section>
        <section><h2 className="text-3xl font-bold">Waiting-period and ownership issues</h2><p className="mt-4">TxDMV currently describes a 30-day waiting period after the last title was issued before another certified copy may be requested. If ownership names, signatures, a deceased owner, divorce, trust, business, power of attorney, or lien information complicates the record, contact TxDMV before submitting the application.</p></section>
        <section className="rounded-xl border bg-muted/20 p-6"><h2 className="text-2xl font-bold">Avoid common rejection reasons</h2><ul className="mt-4 list-disc space-y-2 pl-6"><li>Every recorded owner did not sign.</li><li>ID names do not match the title record.</li><li>A recorded lien lacks an acceptable original release.</li><li>The vehicle was titled in another state.</li><li>The wrong fee or payment type was included.</li><li>An agent omitted proof of signing authority.</li></ul></section>
        <section><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
        <p className="border-t pt-8 text-sm text-muted-foreground">Verify the current form revision, fees, mailing address, appointment rules, lien documentation, and accepted identification with TxDMV before applying.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/vehicles/duplicate-titles")({
  head: () => { const seo = buildSeo({ title: "Texas Duplicate Title: Replace a Lost Vehicle Title", description: "Learn how to request a Texas Certified Copy of Title using Form VTR-34, including owner ID, lien release, mail and in-person requirements.", path: "/vehicles/duplicate-titles", type: "article", keywords: "Texas duplicate title, replace lost car title Texas, certified copy of title Texas, VTR-34" }); return { meta: seo.meta, links: seo.links, scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Replace a Texas Vehicle Title", url: `${SITE_URL}/vehicles/duplicate-titles` }) }, { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) }] }; },
  component: DuplicateTitlesPage,
});