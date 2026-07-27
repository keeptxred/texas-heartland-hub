import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  { question: "Can I replace a lost Texas driver license online?", answer: "Many eligible Texans can replace a lost, stolen, or damaged driver license or ID through Texas by Texas, also called TxT. DPS determines eligibility." },
  { question: "What should I do if my Texas license was stolen?", answer: "Replace the credential promptly and consider filing a police report when theft or identity misuse is suspected. Monitor financial and identity records if personal information may have been compromised." },
  { question: "Can DPS issue a replacement if my license is expired?", answer: "An expired credential generally cannot be handled as a simple replacement. You may need to renew instead and meet the renewal requirements." },
  { question: "Does replacing my license change the expiration date?", answer: "A replacement normally reproduces the existing credential rather than creating a new renewal term. Verify the expiration date when the replacement arrives." },
];

function ReplaceLostLicensePage() {
  return (
    <main>
      <HubBreadcrumbs current="Replace a Lost Texas Driver License" />
      <section className="border-b bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas DPS replacement guide</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Replace a Lost, Stolen, or Damaged Texas Driver License</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Use the correct DPS process, protect yourself after theft, and understand when a replacement must become a renewal or in-person transaction.</p></div></section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 leading-relaxed">
        <section><h2 className="text-3xl font-bold">Start with TxT if your credential is still valid</h2><p className="mt-4">Many eligible Texas residents can request a replacement driver license, commercial driver license, or identification card through the state's Texas by Texas service. DPS checks eligibility electronically. A valid credential, a Social Security number on file, an acceptable driving status, and other record requirements may affect whether the transaction can be completed online.</p><p className="mt-4">Check the official <a className="text-primary underline underline-offset-4" href="https://www.texas.gov/driver-services/texas-driver-license-id-renewals-replacements/online-eligibility/" rel="noreferrer">online eligibility rules</a>, then use <a className="text-primary underline underline-offset-4" href="https://www.texas.gov/texas-by-texas/" rel="noreferrer">TxT</a> if approved.</p></section>

        <section><h2 className="text-3xl font-bold">Lost, stolen, damaged, and expired are different situations</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Lost</h3><p className="mt-2 text-sm text-muted-foreground">Request a replacement and review recent activity for signs the credential is being misused.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Stolen</h3><p className="mt-2 text-sm text-muted-foreground">Replace it promptly. Consider a police report and identity-theft precautions when the circumstances suggest misuse.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Damaged or unreadable</h3><p className="mt-2 text-sm text-muted-foreground">Request a replacement before the card becomes unusable for identification or traffic-stop purposes.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Expired</h3><p className="mt-2 text-sm text-muted-foreground">Use the renewal process rather than assuming a replacement will restore validity.</p></div></div></section>

        <section><h2 className="text-3xl font-bold">When an office visit may be required</h2><ul className="mt-5 list-disc space-y-2 pl-6"><li>DPS cannot approve the online transaction.</li><li>The credential is expired, suspended, revoked, canceled, or disqualified.</li><li>Your name, immigration record, identity documents, or other personal information must be reviewed.</li><li>You hold a credential with special restrictions or endorsements that cannot be handled through the routine online process.</li><li>DPS requires a new photo, signature, vision check, or original documentation.</li></ul><p className="mt-4">Review the <a className="text-primary underline underline-offset-4" href="/dmv/driver-license-documents">document checklist</a> before visiting an office.</p></section>

        <section><h2 className="text-3xl font-bold">What to do after a theft</h2><ol className="mt-5 list-decimal space-y-2 pl-6"><li>Request the replacement through the official state service or DPS.</li><li>Write down when and where the theft occurred.</li><li>File a police report when theft, fraud, or identity misuse is suspected.</li><li>Review bank, credit-card, and credit-report activity.</li><li>Do not post images of the temporary document or replacement receipt online.</li></ol></section>

        <section><h2 className="text-3xl font-bold">Temporary proof and driving</h2><p className="mt-4">Follow the instructions DPS provides after the transaction. A receipt or temporary document may serve a limited purpose while the card is produced, but it may not be accepted everywhere as photo identification. Keep another accepted form of identification available when practical.</p></section>

        <section><h2 className="text-3xl font-bold">Related Keep TX Red guides</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{[["Texas Driver License Renewal", "/dmv/driver-license-renewal"],["Complete Texas Driver License Guide", "/dmv/driver-license"],["Documents Required for a Texas Driver License", "/dmv/driver-license-documents"],["Texas REAL ID Guide", "/dmv/real-id"]].map(([title, href]) => <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">{title}<span className="mt-2 block text-sm text-primary">Open guide →</span></a>)}</div></section>

        <section><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
        <p className="border-t pt-8 text-sm text-muted-foreground">Use only official Texas.gov and DPS services. Requirements, fees, processing times, and eligibility can change.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/replace-lost-license")({
  head: () => {
    const seo = buildSeo({ title: "Replace a Lost Texas Driver License: Online, Stolen or Damaged", description: "Replace a lost, stolen, or damaged Texas driver license through TxT or DPS. Learn online eligibility, office requirements, and identity-theft steps.", path: "/dmv/replace-lost-license", type: "article", keywords: "lost Texas driver license, replace Texas drivers license, stolen Texas license, damaged Texas ID, TxT replacement" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Replace a Lost, Stolen, or Damaged Texas Driver License", url: `${SITE_URL}/dmv/replace-lost-license` }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Replace a Lost License", item: `${SITE_URL}/dmv/replace-lost-license` }] }) },
    ] };
  },
  component: ReplaceLostLicensePage,
});