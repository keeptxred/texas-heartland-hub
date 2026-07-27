import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const faq = [
  { q: "How quickly must a Texas landlord return a security deposit?", a: "A landlord generally must refund the security deposit or provide an itemized accounting within 30 days after the tenant surrenders the premises and supplies a forwarding address." },
  { q: "Can a landlord enter a Texas rental without notice?", a: "Texas does not impose one universal statutory notice period for every entry. The lease usually controls, while emergency access and reasonable repair access remain common exceptions. Tenants should read the entry clause carefully." },
  { q: "Can a tenant withhold rent because repairs have not been made?", a: "Not automatically. Texas repair remedies require specific conditions and written notice steps. Improperly withholding rent can expose a tenant to eviction, so the statutory process and lease terms matter." },
  { q: "How much notice is required before a Texas eviction case?", a: "A landlord generally must deliver a written notice to vacate before filing an eviction suit. The default period is commonly three days unless the lease or a specific statute provides otherwise." },
];

export const Route = createFileRoute("/texas-renters-rights-guide")({
  head: () => ({
    meta: [
      { title: "Texas Renters' Rights Guide: Leases, Repairs, Deposits & Evictions" },
      { name: "description", content: "A practical Texas renters' rights guide covering leases, security deposits, repairs, landlord entry, notices, eviction procedure, and move-out documentation." },
      { property: "og:title", content: "Texas Renters' Rights Guide" },
      { property: "og:description", content: "Understand Texas lease rules, repair rights, deposits, notices, and eviction procedure before a dispute begins." },
      { property: "og:image", content: `${SITE_URL}/images/texas-renters-rights-guide.svg` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/texas-renters-rights-guide` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Texas Renters' Rights Guide", description: "A practical guide to Texas landlord-tenant law.", image: `${SITE_URL}/images/texas-renters-rights-guide.svg`, datePublished: "2026-07-26", dateModified: "2026-07-26", author: { "@type": "Organization", name: "Keep TX Red" }, publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL }, mainEntityOfPage: `${SITE_URL}/texas-renters-rights-guide` }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }) },
    ],
  }),
  component: TexasRentersRightsGuide,
});

function TexasRentersRightsGuide() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Texas Housing & Law</p>
        <h1 className="font-display text-4xl tracking-tight md:text-6xl">Texas Renters' Rights Guide</h1>
        <p className="max-w-3xl font-serif text-xl leading-relaxed text-muted-foreground">What tenants and landlords should know about leases, deposits, repairs, entry, notices, eviction procedure, and move-out disputes in Texas.</p>
        <img src="/images/texas-renters-rights-guide.svg" alt="Texas home, lease, key, shield, and courthouse illustration" className="w-full rounded-2xl border" />
      </header>

      <article className="prose prose-lg mt-12 max-w-none dark:prose-invert">
        <p>Texas is a lease-driven state. The Texas Property Code supplies important minimum protections, but the signed lease controls many day-to-day questions: when rent is due, how notices must be delivered, who maintains the yard, whether pets are allowed, how guests are treated, and when management may enter. That makes the lease the first document both sides should read when a dispute starts.</p>
        <p>This guide is a practical overview, not a substitute for advice about a specific dispute. It pairs naturally with the site's broader <Link to="/laws">Texas laws hub</Link>, the <Link to="/moving-to-texas">moving to Texas guide</Link>, and the <Link to="/news/$slug" params={{ slug: "renting-vs-buying-in-texas" }}>renting-versus-buying analysis</Link>.</p>

        <h2>Before Signing a Texas Lease</h2>
        <p>Tenants should verify the legal name of the landlord or management company, the complete property address, the rent amount, due date, grace period, late-fee formula, utilities, parking rules, pet terms, renewal language, and required notice before move-out. Any promise about repairs, appliances, paint, flooring, or pest treatment should appear in writing.</p>
        <p>Photograph every room before moving furniture inside. Capture walls, flooring, appliances, windows, fixtures, exterior damage, smoke alarms, and meter readings. Send the move-in condition form by a trackable method and keep a copy. Good documentation is often more valuable than a later argument over who caused damage.</p>

        <h2>Security Deposits and Deductions</h2>
        <p>A security deposit protects the landlord against unpaid rent and damage beyond ordinary wear and tear. It is not automatically the final month's rent unless the landlord agrees in writing. After move-out, the tenant should provide a forwarding address and keep proof of delivery.</p>
        <p>Landlords may generally deduct legitimate charges such as unpaid rent, cleaning required by the lease, missing property, or tenant-caused damage. Ordinary aging is different from damage: faded paint, lightly worn carpet, and normal fixture wear should not be treated the same as holes, burns, broken doors, or pet damage. An itemized move-out record, dated photographs, receipts, and invoices make the accounting easier to evaluate.</p>

        <h2>Repairs, Health, and Safety</h2>
        <p>Texas law can require a landlord to repair conditions that materially affect an ordinary tenant's physical health or safety when the tenant is current on rent and follows the required notice process. Examples may include serious plumbing failures, unsafe electrical conditions, loss of essential services, dangerous structural defects, or conditions that make the home unhealthy.</p>
        <p>Repair requests should be specific, dated, and written. Identify the condition, when it began, why it is unsafe, prior attempts to report it, and reasonable access times. Keep photographs, videos, receipts, and every response. Do not assume that a repair dispute automatically permits rent withholding, lease termination, or self-help repairs. Texas remedies depend on the facts and the notice sequence.</p>

        <h2>Landlord Entry and Privacy</h2>
        <p>Texas does not set one blanket notice period for every landlord entry. The lease often defines access for inspections, repairs, showings, pest control, emergencies, and abandoned-property concerns. Even when a lease grants access, entry should be tied to a legitimate purpose and exercised reasonably.</p>
        <p>Tenants should not change locks or block authorized repair access in violation of the lease. Landlords should avoid surprise non-emergency visits when advance coordination is practical. Written scheduling reduces conflict and creates a record.</p>

        <h2>Rent, Late Fees, and Notices</h2>
        <p>Rent should be paid exactly as the lease requires. Save confirmation numbers, bank records, receipts, money-order stubs, and portal screenshots. When a payment system fails, document the attempt immediately and notify management in writing.</p>
        <p>Late fees must comply with Texas law and the lease. A fee dispute does not erase the underlying rent obligation. Tenants who receive a notice to vacate, lease-violation notice, nonrenewal notice, or demand for payment should record the delivery date and read every deadline carefully.</p>

        <h2>How the Texas Eviction Process Works</h2>
        <p>An eviction is a court process. A landlord generally begins with a written notice to vacate, then files an eviction case in justice court if the tenant does not leave or resolve the alleged default. The tenant must be served and has the right to appear, present evidence, challenge the landlord's claim, and appeal under applicable rules.</p>
        <p>A landlord should not remove doors, shut off utilities outside lawful procedures, seize belongings, or physically force a tenant out merely because rent is disputed. A tenant should not ignore court papers. Bring the lease, payment records, notices, repair requests, photographs, messages, and witnesses to the hearing.</p>

        <h2>Moving Out Without Creating a Deposit Dispute</h2>
        <p>Give notice exactly as the lease requires. Clean the property, remove all belongings and trash, return keys and access devices, document the final condition, and request a move-out inspection when available. Photograph the same surfaces captured at move-in so the two sets can be compared.</p>
        <p>Keep proof of the surrender date and forwarding address. Cancel utilities only after confirming the required handoff. Tenants planning a move can use the site's <Link to="/moving-to-texas-checklist">Texas moving checklist</Link> and <Link to="/texas-moving-cost-calculator">moving-cost calculator</Link> to budget the transition.</p>

        <h2>When to Get Help</h2>
        <p>Legal help is especially important when a dispute involves lockouts, utility interruption, domestic violence protections, disability accommodations, discrimination, serious health hazards, substantial property loss, or an active eviction deadline. Justice-court clerks can explain filing procedures but cannot give legal advice.</p>
        <p>Tenants and landlords should organize a timeline before seeking help: lease date, move-in condition, payment history, notices, repair requests, entry dates, photographs, and claimed damages. A clear file allows a lawyer, mediator, or court to understand the dispute quickly.</p>

        <h2>Texas Renter Checklist</h2>
        <ul><li>Read every lease clause before signing.</li><li>Document move-in and move-out condition.</li><li>Keep rent and deposit records.</li><li>Send repair requests in writing.</li><li>Follow notice and delivery requirements.</li><li>Do not ignore a notice to vacate or court date.</li><li>Provide a forwarding address after surrender.</li></ul>

        <h2>Frequently Asked Questions</h2>
        {faq.map((item) => <section key={item.q}><h3>{item.q}</h3><p>{item.a}</p></section>)}
      </article>
    </main>
  );
}
