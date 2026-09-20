import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  { question: "How long do I have to change the address on my Texas driver license?", answer: "Texas DPS says the address on a driver license or ID card must be updated within 30 days after moving to a new residence." },
  { question: "Can I change my Texas driver license address online?", answer: "Many eligible Texans can request an address change and replacement card through Texas by Texas, also called TxT. DPS determines eligibility." },
  { question: "Does changing my voter registration update my driver license?", answer: "No. Driver license records and voter registration records are separate. Update each one directly through the responsible state or county system." },
  { question: "Does changing my driver license address update vehicle registration?", answer: "No. Driver license and vehicle records are separate. Update vehicle registration and title records through the appropriate TxDMV or county process." },
];

function ChangeAddressPage() {
  return (
    <main>
      <HubBreadcrumbs current="Change Address on a Texas Driver License" />
      <section className="border-b bg-muted/30"><div className="mx-auto max-w-5xl px-4 py-16 sm:py-20"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas DPS address-change guide</p><h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">How to Change the Address on a Texas Driver License</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Meet the 30-day deadline, choose the right online, mail, or in-person method, and update the other Texas records that do not change automatically.</p></div></section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 leading-relaxed">
        <section><h2 className="text-3xl font-bold">Texas gives you 30 days after moving</h2><p className="mt-4">Texas DPS requires the address on a driver license or identification card to be changed within 30 days after moving to a new residence. The transaction produces a replacement credential showing the new address. Do not assume a postal forwarding order, voter-registration update, vehicle-registration change, or county record automatically updates DPS.</p></section>

        <section><h2 className="text-3xl font-bold">The fastest option is usually TxT</h2><p className="mt-4">Eligible Texans can request a replacement card with the new address through Texas by Texas, known as TxT. DPS determines eligibility based on the credential and the applicant's record. Start with the official <a className="text-primary underline underline-offset-4" href="https://www.texas.gov/driver-services/texas-driver-license-id-renewals-replacements/online-eligibility/" rel="noreferrer">online eligibility page</a>, then continue through <a className="text-primary underline underline-offset-4" href="https://www.texas.gov/texas-by-texas/" rel="noreferrer">TxT</a>.</p></section>

        <section><h2 className="text-3xl font-bold">Online, mail, and in-person options</h2><div className="mt-6 overflow-x-auto rounded-xl border bg-card"><table className="w-full text-left text-sm"><thead className="border-b bg-muted/50"><tr><th className="px-4 py-3">Method</th><th className="px-4 py-3">Use when</th><th className="px-4 py-3">Watch for</th></tr></thead><tbody className="divide-y"><tr><td className="px-4 py-3 font-semibold">Online through TxT</td><td className="px-4 py-3">DPS confirms eligibility</td><td className="px-4 py-3">Credential and record restrictions</td></tr><tr><td className="px-4 py-3 font-semibold">Mail</td><td className="px-4 py-3">You meet the mail eligibility rules</td><td className="px-4 py-3">Longer processing and form requirements</td></tr><tr><td className="px-4 py-3 font-semibold">In person</td><td className="px-4 py-3">Online and mail are unavailable or DPS requires review</td><td className="px-4 py-3">Appointment and document requirements</td></tr></tbody></table></div></section>

        <section><h2 className="text-3xl font-bold">What to have ready</h2><ul className="mt-5 list-disc space-y-2 pl-6"><li>Your current Texas driver license or ID information.</li><li>Your new Texas residential address and a reliable mailing address.</li><li>Your Social Security number if requested for verification.</li><li>Payment for the replacement-card fee shown by the official service.</li><li>Supporting documents if DPS requires an in-person transaction or cannot verify the change electronically.</li></ul><p className="mt-4">For an office visit, use the <a className="text-primary underline underline-offset-4" href="/dmv/driver-license-documents">Texas driver license document checklist</a>.</p></section>

        <section><h2 className="text-3xl font-bold">Records you must update separately</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Vehicle title and registration</h3><p className="mt-2 text-sm text-muted-foreground">Driver license and vehicle records are separate. Use the appropriate TxDMV or county process.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Voter registration</h3><p className="mt-2 text-sm text-muted-foreground">Update your voter record separately so the correct county and precinct information is used.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Insurance</h3><p className="mt-2 text-sm text-muted-foreground">Tell your insurer promptly because garaging address and household information can affect the policy.</p></div><div className="rounded-xl border bg-card p-5"><h3 className="font-semibold">Tolls and local accounts</h3><p className="mt-2 text-sm text-muted-foreground">Update toll tags, parking permits, utilities, school records, and other accounts directly.</p></div></div></section>

        <section><h2 className="text-3xl font-bold">Name change is not the same transaction</h2><p className="mt-4">A legal name change generally requires supporting documentation and may require an in-person DPS visit. Do not use the address-change process as a substitute for a marriage, divorce, court-order, or amended-record name change. Confirm the required sequence with DPS and the Social Security Administration before your appointment.</p></section>

        <section className="rounded-xl border bg-muted/20 p-6"><h2 className="text-2xl font-bold">Moving checklist for Texas records</h2><ol className="mt-4 list-decimal space-y-2 pl-6"><li>Update DPS within 30 days.</li><li>Update vehicle title and registration records separately.</li><li>Update voter registration.</li><li>Notify your insurance carrier.</li><li>Update toll, tax, school, utility, and local-government accounts.</li></ol><p className="mt-4">Continue with the <a className="text-primary underline underline-offset-4" href="https://texasdefined.com/moving-to-texas">Texas Defined relocation guide and moving checklist</a> for the rest of the move.</p></section>

        <section><h2 className="text-3xl font-bold">Related Keep TX Red guides</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{[["Texas Driver License Renewal", "/dmv/driver-license-renewal"],["Replace a Lost Texas Driver License", "/dmv/replace-lost-license"],["Complete Texas Driver License Guide", "/dmv/driver-license"],["Moving to Texas Resource Center", "https://texasdefined.com/moving-to-texas"]].map(([title, href]) => <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">{title}<span className="mt-2 block text-sm text-primary">Open guide →</span></a>)}</div></section>

        <section><h2 className="text-3xl font-bold">Frequently asked questions</h2><div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div></section>
        <p className="border-t pt-8 text-sm text-muted-foreground">Confirm current forms, fees, eligibility, and processing instructions with Texas DPS before submitting a transaction.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/change-address")({
  head: () => {
    const seo = buildSeo({ title: "Change Address on a Texas Driver License: 30-Day Rule & Online Steps", description: "Change the address on a Texas driver license or ID within 30 days. Compare TxT, mail, and DPS office options and update related records.", path: "/dmv/change-address", type: "article", keywords: "change address Texas driver license, Texas DPS address change, TxT address change, Texas 30 day address rule" });
    return { meta: seo.meta, links: seo.links, scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Change the Address on a Texas Driver License", url: `${SITE_URL}/dmv/change-address` }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Change Address", item: `${SITE_URL}/dmv/change-address` }] }) },
    ] };
  },
  component: ChangeAddressPage,
});