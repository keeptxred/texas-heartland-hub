import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const FAQ = [
  { q: "Can a Texas HOA fine a homeowner?", a: "Generally yes, when the declaration or rules authorize enforcement and the association follows the notice and hearing procedures required by Texas law and its governing documents." },
  { q: "Can a Texas HOA foreclose on a home?", a: "In limited circumstances an association may pursue foreclosure for qualifying unpaid assessments, but Texas law imposes notice, payment-plan, and procedural protections. Homeowners should act quickly when an account becomes delinquent." },
  { q: "Do homeowners have a right to inspect HOA records?", a: "Texas property owners' association law gives members inspection rights for many association records, subject to written-request procedures, reasonable production rules, and limited exceptions." },
  { q: "Can an HOA ban political signs?", a: "Texas law restricts how far many associations may go in regulating certain political signs during election periods, although reasonable rules concerning size, number, location, and safety may still apply." },
];

export const Route = createFileRoute("/texas-hoa-laws-guide")({
  head: () => ({
    meta: [
      { title: "Texas HOA Laws Explained: Homeowner Rights, Fines, Records & Foreclosure" },
      { name: "description", content: "A plain-English guide to Texas HOA laws, including assessments, fines, records, meetings, deed restrictions, liens, foreclosure, solar panels, flags, and homeowner dispute steps." },
      { property: "og:title", content: "Texas HOA Laws Explained" },
      { property: "og:description", content: "What Texas homeowners should know about HOA rules, fines, records, liens, meetings, and enforcement." },
      { property: "og:image", content: `${SITE_URL}/images/texas-hoa-laws-guide.svg` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/texas-hoa-laws-guide` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Texas HOA Laws Explained", description: "A practical guide to Texas homeowners association law.", image: `${SITE_URL}/images/texas-hoa-laws-guide.svg`, mainEntityOfPage: `${SITE_URL}/texas-hoa-laws-guide`, author: { "@type": "Organization", name: "Keep TX Red" }, publisher: { "@type": "Organization", name: "Keep TX Red" } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }) },
    ],
  }),
  component: TexasHoaLawsGuide,
});

function TexasHoaLawsGuide() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="max-w-4xl">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Texas Housing Law</span>
        <h1 className="mt-3 font-display text-4xl md:text-6xl tracking-tight">Texas HOA Laws Explained</h1>
        <p className="mt-5 font-serif text-xl leading-relaxed text-muted-foreground">Homeowners associations can collect assessments and enforce deed restrictions, but they are not unlimited governments. Texas law sets procedures for records, meetings, fines, liens, payment plans, elections, and foreclosure.</p>
      </header>

      <img src="/images/texas-hoa-laws-guide.svg" alt="Illustrated Texas neighborhood with homes, an HOA document, and a balance scale" className="mt-10 w-full border border-border bg-muted" />

      <article className="mt-10 max-w-4xl space-y-7 font-serif text-lg leading-relaxed">
        <p>For millions of Texans, buying a home also means joining a property owners' association. The association's authority usually comes from recorded deed restrictions, a declaration, bylaws, rules, and state law. Those documents operate together. A board cannot simply invent authority that the declaration does not grant, and a homeowner cannot ignore a valid restriction merely because it is inconvenient.</p>

        <h2 className="font-display text-3xl tracking-tight">Where an HOA's authority comes from</h2>
        <p>The recorded declaration is the foundation. It typically creates mandatory membership, assessment obligations, architectural controls, use restrictions, lien rights, voting rules, and amendment procedures. Bylaws usually govern board operations. Rules fill in day-to-day details, but they generally must remain consistent with the declaration and applicable law.</p>
        <p>Before buying, request the resale certificate, current declaration, bylaws, rules, budget, insurance information, pending litigation disclosures, assessment history, and any notices affecting the property. Buyers comparing neighborhoods should also use the site's <Link to="/texas-homeownership-cost-calculator" className="text-primary underline underline-offset-4">Texas homeownership cost calculator</Link> because HOA dues can materially change the true monthly cost.</p>

        <h2 className="font-display text-3xl tracking-tight">Assessments, special assessments, and payment plans</h2>
        <p>Regular assessments fund common-area maintenance, management, insurance, reserves, amenities, and enforcement. Special assessments may be authorized for major repairs or unexpected costs. The declaration controls how assessments are approved and allocated.</p>
        <p>When an owner falls behind, fees and collection costs can grow quickly. Texas law requires many associations to adopt payment-plan guidelines and follow specific collection procedures before using stronger remedies. A homeowner who receives a delinquency notice should request a complete ledger, compare every charge with the governing documents, and propose a written payment plan immediately.</p>

        <h2 className="font-display text-3xl tracking-tight">Fines and enforcement</h2>
        <p>An association may enforce valid restrictions through notices, hearings, fines, self-help in limited situations, or litigation. Good enforcement should identify the exact restriction, explain the alleged violation, state the cure, provide a deadline, and describe any hearing right. Selective enforcement, vague notices, or penalties unsupported by governing documents can create legitimate disputes.</p>
        <p>Keep photographs, correspondence, envelopes, account statements, architectural applications, approvals, and meeting notices. A dated paper trail is often more useful than an emotional exchange with a board member or management company.</p>

        <h2 className="font-display text-3xl tracking-tight">Records, meetings, and board accountability</h2>
        <p>Members generally have rights to inspect many association records through a written request. Financial statements, meeting minutes, contracts, governing documents, and certain owner-account records may be available, while privileged legal advice, sensitive personal information, and other protected material may be withheld or redacted.</p>
        <p>Board meetings are subject to statutory and governing-document requirements concerning notice, open deliberation, and executive sessions. Homeowners researching public-meeting principles may also find the guide to <Link to="/news/$slug" params={{ slug: "texas-open-meetings-public-info" }} className="text-primary underline underline-offset-4">Texas open meetings and public information</Link> useful, although an HOA is not the same as a governmental body.</p>

        <h2 className="font-display text-3xl tracking-tight">Liens and foreclosure</h2>
        <p>Assessment obligations may be secured by a lien created in the declaration and recognized by law. Foreclosure is among the most serious remedies and is restricted by notice, opportunity-to-cure, payment-plan, and procedural requirements. Some charges are treated differently from assessments, and not every fine or fee supports the same remedy.</p>
        <p>Do not ignore certified mail, collection notices, lawsuit papers, or foreclosure warnings. Owners facing collection should obtain the recorded declaration, a transaction-level account ledger, copies of every notice, and qualified legal advice. The site's <Link to="/texas-property-tax-protest-guide" className="text-primary underline underline-offset-4">property tax protest guide</Link> addresses a separate homeowner cost, while the <Link to="/texas-property-tax-increase-calculator" className="text-primary underline underline-offset-4">property tax increase calculator</Link> can help households budget for rising ownership expenses.</p>

        <h2 className="font-display text-3xl tracking-tight">Common protected homeowner activities</h2>
        <p>Texas statutes limit certain HOA restrictions involving subjects such as flags, political signs, religious displays, solar energy devices, standby generators, swimming-pool enclosures, security measures, rain barrels, and some landscaping choices. These protections are rarely absolute. Associations may retain reasonable authority over placement, appearance, safety, dimensions, installation standards, or maintenance.</p>
        <p>Submit architectural requests in writing, include plans and specifications, and keep proof of delivery. Silence is not always approval. Review both the statute and the declaration before beginning work.</p>

        <h2 className="font-display text-3xl tracking-tight">A practical HOA dispute checklist</h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Identify the exact declaration, bylaw, rule, or statute involved.</li>
          <li>Request the complete account ledger and relevant records in writing.</li>
          <li>Document the property condition with dated photographs.</li>
          <li>Use the hearing or internal appeal process before deadlines expire.</li>
          <li>Keep communications factual and propose a specific resolution.</li>
          <li>Seek legal advice early when a lien, lawsuit, or foreclosure is threatened.</li>
        </ol>

        <p>Homeowners should also review the broader <Link to="/laws" className="text-primary underline underline-offset-4">Texas laws hub</Link>, the <Link to="/texas-renters-rights-guide" className="text-primary underline underline-offset-4">Texas renters' rights guide</Link> for rental-property issues, and the <Link to="/texas-law-policy" className="text-primary underline underline-offset-4">Texas Law & Policy section</Link> for related coverage.</p>

        <h2 className="font-display text-3xl tracking-tight">Frequently asked questions</h2>
        <div className="space-y-5">
          {FAQ.map((item) => <section key={item.q}><h3 className="font-display text-xl">{item.q}</h3><p className="mt-1">{item.a}</p></section>)}
        </div>

        <p className="border-t border-border pt-6 text-sm text-muted-foreground">This guide provides general educational information, not legal advice. Governing documents and facts vary by community.</p>
      </article>
    </main>
  );
}
