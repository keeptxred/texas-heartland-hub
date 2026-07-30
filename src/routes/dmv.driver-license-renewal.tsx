import { createFileRoute } from "@tanstack/react-router";
import { HubBreadcrumbs } from "@/components/hub-breadcrumbs";
import { buildSeo, SITE_URL } from "@/lib/seo";

const faq = [
  {
    question: "How early can I renew a Texas driver license?",
    answer:
      "Texas DPS generally allows most driver licenses and identification cards to be renewed up to two years before the expiration date. Eligibility depends on the credential and the applicant's record.",
  },
  {
    question: "Can I renew a Texas driver license online?",
    answer:
      "Many eligible Texans can renew through Texas by Texas, also called TxT. DPS makes the final eligibility decision. Some applicants must renew in person because of age, document, photo, vision, citizenship, lawful-presence, or credential requirements.",
  },
  {
    question: "Can I renew after my Texas license expires?",
    answer:
      "Many licenses can be renewed for a limited period after expiration, but an expired license is not valid for driving. A license expired too long may require a new application and additional testing.",
  },
  {
    question: "Will renewing automatically give me a REAL ID?",
    answer:
      "A renewal produces a REAL ID-compliant card only when DPS has the required identity, lawful-presence, Social Security, and Texas residency documentation on file or you provide it when required.",
  },
];

function DriverLicenseRenewalPage() {
  return (
    <main>
      <HubBreadcrumbs current="Texas Driver License Renewal" />

      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Texas DPS renewal guide</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">How to Renew a Texas Driver License</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Compare online, phone, mail, and in-person renewal options, understand common eligibility limits, and prepare for REAL ID, vision, document, and appointment requirements.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl space-y-10 px-4 py-14 text-base leading-relaxed">
        <section>
          <h2 className="text-3xl font-bold">Start by checking whether DPS will let you renew online</h2>
          <p className="mt-4">
            The fastest path for many Texans is the state's Texas by Texas service, commonly called TxT. It can handle eligible driver license, commercial driver license, and ID card renewals without a trip to a DPS office. Online eligibility is determined by DPS and can depend on your age, license class, expiration status, driving status, citizenship or lawful-presence record, Social Security record, and whether an updated photo, vision check, or original document review is required.
          </p>
          <p className="mt-4">
            Use the official <a className="text-primary underline underline-offset-4" href="https://www.texas.gov/driver-services/texas-driver-license-id-renewals-replacements/online-eligibility/" rel="noreferrer">Texas online-services eligibility page</a> before scheduling an appointment. Eligible applicants can continue through <a className="text-primary underline underline-offset-4" href="https://www.texas.gov/texas-by-texas/" rel="noreferrer">TxT</a>.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Your four renewal paths</h2>
          <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50"><tr><th className="px-4 py-3">Method</th><th className="px-4 py-3">Best for</th><th className="px-4 py-3">Key limitation</th></tr></thead>
              <tbody className="divide-y">
                <tr><td className="px-4 py-3 font-semibold">Online through TxT</td><td className="px-4 py-3">Eligible routine renewals</td><td className="px-4 py-3">DPS must approve eligibility</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Telephone</td><td className="px-4 py-3">Eligible applicants who prefer not to use TxT</td><td className="px-4 py-3">Not every credential qualifies</td></tr>
                <tr><td className="px-4 py-3 font-semibold">Mail</td><td className="px-4 py-3">Certain renewal notices and qualifying out-of-state Texans</td><td className="px-4 py-3">Longer processing and strict documentation rules</td></tr>
                <tr><td className="px-4 py-3 font-semibold">In person</td><td className="px-4 py-3">Applicants needing document review, testing, a photo, or a vision check</td><td className="px-4 py-3">Appointment generally required</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">When an in-person renewal is more likely</h2>
          <ul className="mt-5 list-disc space-y-2 pl-6">
            <li>DPS cannot verify your eligibility electronically.</li>
            <li>Your credential type, age, or expiration history requires an office visit.</li>
            <li>You need to present identity, citizenship, lawful-presence, Social Security, residency, or legal-name-change documents.</li>
            <li>You need a new photo, vision screening, knowledge test, driving test, endorsement, restriction change, or other credential update.</li>
            <li>Your license is suspended, revoked, canceled, or otherwise not eligible for a routine renewal.</li>
          </ul>
          <p className="mt-4">
            Review the <a className="text-primary underline underline-offset-4" href="/dmv/driver-license-documents">Texas driver license document checklist</a> before going to DPS. A document mismatch is one of the easiest ways to lose an appointment.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">REAL ID and renewal</h2>
          <p className="mt-4">
            A Texas driver license can remain valid for driving even if it is not REAL ID compliant, but a noncompliant card is not accepted by federal agencies for purposes such as boarding a federally regulated domestic flight unless you present another accepted credential. Look for the star on the card and read the <a className="text-primary underline underline-offset-4" href="/dmv/real-id">Texas REAL ID guide</a> before renewing.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Expired licenses and driving</h2>
          <p className="mt-4">
            Do not treat a renewal grace period as permission to drive. Once the expiration date passes, the credential is expired. DPS may still allow renewal for a period afterward, but the driver can face legal and practical consequences for driving without a valid license. If the credential has been expired for an extended period, expect the possibility of a new application, document review, and testing.
          </p>
        </section>

        <section className="rounded-xl border bg-muted/20 p-6">
          <h2 className="text-2xl font-bold">Renewal checklist</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>Check your expiration date and current driving eligibility.</li>
            <li>Test online eligibility before booking an office appointment.</li>
            <li>Confirm whether your current card has the REAL ID star.</li>
            <li>Gather any identity, residency, lawful-presence, Social Security, or name-change documents DPS requests.</li>
            <li>Use the official DPS fee schedule and appointment system rather than a third-party site.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Related Keep TX Red guides</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Complete Texas Driver License Guide", "/dmv/driver-license"],
              ["Documents Required for a Texas Driver License", "/dmv/driver-license-documents"],
              ["Texas REAL ID Guide", "/dmv/real-id"],
              ["Texas DMV vs. DPS", "/dmv/texas-dmv-vs-dps"],
            ].map(([title, href]) => <a key={href} href={href} className="rounded-xl border bg-card p-5 font-semibold hover:shadow-md">{title}<span className="mt-2 block text-sm text-primary">Open guide →</span></a>)}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">{faq.map((item) => <details key={item.question} className="rounded-xl border bg-card p-5"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 text-muted-foreground">{item.answer}</p></details>)}</div>
        </section>

        <p className="border-t pt-8 text-sm text-muted-foreground">DPS requirements, fees, and eligibility rules can change. Confirm your transaction through Texas.gov or the Texas Department of Public Safety before paying or traveling.</p>
      </article>
    </main>
  );
}

export const Route = createFileRoute("/dmv/driver-license-renewal")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Driver License Renewal: Online, In Person, Documents & REAL ID",
      description: "Renew a Texas driver license online, by phone, by mail, or in person. Check eligibility, documents, expiration rules, appointments, and REAL ID needs.",
      path: "/dmv/driver-license-renewal",
      type: "article",
      keywords: "Texas driver license renewal, renew Texas drivers license online, Texas DPS renewal, expired Texas license, TxT renewal",
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "How to Renew a Texas Driver License", url: `${SITE_URL}/dmv/driver-license-renewal`, isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL } }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Texas DMV & Driver Services", item: `${SITE_URL}/dmv` }, { "@type": "ListItem", position: 3, name: "Driver License Renewal", item: `${SITE_URL}/dmv/driver-license-renewal` }] }) },
      ],
    };
  },
  component: DriverLicenseRenewalPage,
});