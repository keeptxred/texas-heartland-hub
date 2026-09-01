import { createFileRoute, Link } from "@tanstack/react-router";
import { PageExpansion } from "@/components/page-expansion";
import { SocialLinks } from "@/components/social-links";
import { SITE_URL } from "@/lib/seo";

const title = "Contact Keep TX Red | Newsroom & Order Support";
const description = "Contact Keep TX Red for shop order support, news tips, corrections, story ideas, privacy requests, or general feedback.";
const canonical = `${SITE_URL}/contact`;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-foreground">Contact</li>
        </ol>
      </nav>

      <div className="mb-10 border-b-2 border-foreground pb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">★ Get In Touch</span>
        <h1 className="mt-1 font-display text-5xl tracking-tight md:text-6xl">Contact Keep TX Red</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Order support, tips, corrections, story ideas, privacy requests, or general feedback. Email is our primary customer-service and newsroom contact channel.
        </p>
      </div>

      <section className="mb-10 rounded-xl border border-border bg-secondary/40 p-6">
        <h2 className="font-display text-2xl">Shop Order Support</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          For damaged, defective, misprinted, incorrect, delayed, or missing orders, email <a href="mailto:admin@keeptxred.com" className="text-primary underline underline-offset-4">admin@keeptxred.com</a>. Include your order number, a description of the issue, and clear photographs when applicable.
        </p>
        <a
          href="mailto:admin@keeptxred.com?subject=Keep%20TX%20Red%20Order%20Support"
          className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-display text-sm uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90"
        >
          Email Order Support
        </a>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/return-refund-policy" className="text-primary underline underline-offset-4">Return &amp; Refund Policy</Link>
          <Link to="/shipping-policy" className="text-primary underline underline-offset-4">Shipping Policy</Link>
          <Link to="/about" className="text-primary underline underline-offset-4">Store &amp; Business Information</Link>
        </div>
      </section>

      <div className="grid gap-10 md:grid-cols-3">
        <aside className="space-y-6 text-sm md:col-span-1">
          <div>
            <h2 className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-primary">Order Support &amp; General</h2>
            <a href="mailto:admin@keeptxred.com" className="text-muted-foreground hover:text-primary">admin@keeptxred.com</a>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-primary">News Tips</h2>
            <a href="mailto:tips@keeptxred.com" className="text-muted-foreground hover:text-primary">tips@keeptxred.com</a>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-primary">Corrections</h2>
            <a href="mailto:corrections@keeptxred.com" className="text-muted-foreground hover:text-primary">corrections@keeptxred.com</a>
          </div>
          <div>
            <h2 className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-primary">Customer-Service Region</h2>
            <p className="text-muted-foreground">Texas, United States</p>
          </div>
        </aside>

        <section className="space-y-5 md:col-span-2" aria-labelledby="contact-options-heading">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 id="contact-options-heading" className="font-display text-2xl tracking-tight">Choose the Right Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              These addresses are provided for the purposes shown below. Using the most relevant address helps route your request appropriately.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ContactCard
              title="Orders & General"
              email="admin@keeptxred.com"
              description="Order status, damaged products, refunds, privacy requests, business questions, and general inquiries."
            />
            <ContactCard
              title="News Tips"
              email="tips@keeptxred.com"
              description="Documents, meeting notices, public records, story leads, and time-sensitive Texas news tips."
            />
            <ContactCard
              title="Corrections"
              email="corrections@keeptxred.com"
              description="Send the article URL and the specific factual statement you believe should be corrected."
            />
            <div className="rounded-xl border border-border p-5">
              <h3 className="font-display text-lg">Store Policies</h3>
              <p className="mt-2 text-sm text-muted-foreground">Review production, shipping, returns, refunds, privacy, and terms before or after ordering.</p>
              <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">
                <Link to="/shipping-policy" className="text-primary underline underline-offset-4">Shipping Policy</Link>
                <Link to="/return-refund-policy" className="text-primary underline underline-offset-4">Return &amp; Refund Policy</Link>
                <Link to="/terms-of-service" className="text-primary underline underline-offset-4">Terms of Service</Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <PageExpansion
        perspectiveTitle="Why Your Tip Matters"
        perspective={<>Texas is too large for any publication to see every local development as it happens. Reader tips can help identify public records, government meetings, election developments, and other Texas stories worth reviewing. Send enough detail for the newsroom to verify the information independently.</>}
        blocks={[
          { heading: "What to Send With a News Tip", body: <>Useful tips include a source document or link, the relevant date, and the county, city, district, agency, or public body involved. Agendas, public filings, bill text, court records, meeting recordings, photographs, and other verifiable material can help establish what happened. Do not send sensitive personal information that is not necessary to evaluate the tip.</> },
          { heading: "Sensitive or Confidential Information", body: <>If a tip involves sensitive information, say so clearly in your message and explain any confidentiality concern before sharing additional material. Ordinary email is not presented as a secure or anonymous submission system, so consider what information you include and what metadata may accompany it.</> },
          { heading: "Response Times", body: <>Response times vary with message volume and the amount of verification a request requires. Time-sensitive tips should identify the relevant deadline, hearing, meeting, vote, or other event in the subject line or opening sentence.</> },
          { heading: "Corrections, Take-Down Requests, and Legal", body: <>For corrections, email <a href="mailto:corrections@keeptxred.com" className="text-primary underline">corrections@keeptxred.com</a> with the URL and the specific factual statement you believe is wrong, along with supporting evidence when available. Other legal or publication-related inquiries can be sent to <a href="mailto:admin@keeptxred.com" className="text-primary underline">admin@keeptxred.com</a>.</> },
          { heading: "What We Cannot Help With", body: <>Keep TX Red is a publication, not a government constituent-services office. For help reaching your elected officials, see <a href="/contact-legislators" className="text-primary underline">Contact Your Legislators</a>. For voter-registration questions, see the <a href="/register-to-vote" className="text-primary underline">voter registration guide</a>. For property tax disputes, contact your county appraisal district directly.</> },
        ]}
        faqs={[
          { q: "Can I request confidentiality?", a: <>Yes. State the request clearly before sending sensitive material. Keep TX Red does not describe ordinary email as a secure or anonymous submission channel.</> },
          { q: "Do you pay for tips?", a: <>No. Keep TX Red does not pay sources for information.</> },
          { q: "How long until I hear back?", a: <>Response times vary depending on message volume and the verification or research required.</> },
          { q: "Can I send large files or recordings?", a: <>For large material, send a link to a reputable file-sharing service rather than attaching very large files directly to email.</> },
          { q: "Do you cover federal stories?", a: <>Federal developments may be covered when they have a direct Texas connection, such as actions involving Texas officials, institutions, laws, courts, elections, or communities.</> },
        ]}
        summary={<>Shop customers should include their order number and photographs when relevant. News tips should include verifiable details and source material when available. Corrections go to corrections@keeptxred.com, and general or order-support questions go to admin@keeptxred.com.</>}
        related={[
          { to: "/return-refund-policy", label: "Return and refund policy" },
          { to: "/shipping-policy", label: "Shipping policy" },
          { to: "/about", label: "About and store information" },
          { to: "/editorial-standards", label: "Editorial standards and corrections policy" },
          { to: "/privacy", label: "Privacy policy" },
        ]}
      />
      <SocialLinks />
    </main>
  );
}

function ContactCard({ title, email, description }: { title: string; email: string; description: string }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="font-display text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <a href={`mailto:${email}`} className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4">{email}</a>
    </div>
  );
}
