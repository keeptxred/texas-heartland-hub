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
              These addresses are monitored for the purposes shown below. We no longer display an on-page form that only acknowledges a message locally; contacting us by email ensures your message actually reaches the appropriate inbox.
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
        perspective={<>According to our internal review, the strongest Keep TX Red stories of the last year started with a reader email — a county clerk noticing an unusual purge, a parent forwarding a school board agenda, a small-business owner sharing an appraisal notice. Texas is too big for any newsroom to cover end-to-end. Our reporting depends on Texans on the ground sending us what they see. Every tip is read by a human editor, and confidentiality is the default unless you tell us otherwise.</>}
        blocks={[
          { heading: "What to Send With a News Tip", body: <>The fastest path from tip to published story is documents plus a date. Send the agenda, the appraisal notice, the campaign filing, the bill text, or the meeting recording — whatever primary source backs the claim. Include the county or district name, a date, and your best phone number. If you want anonymity, say so up front and we will honor it.</> },
          { heading: "How We Handle Sensitive Tips", body: <>Tips marked confidential are seen only by the editorial team. We do not share sender identities with subjects of reporting, advertisers, or third parties. For high-sensitivity material, request a secure channel in your first email and we will arrange one. We do not publish documents that would identify a confidential source without explicit permission.</> },
          { heading: "Response Times", body: <>We aim to acknowledge every tip within two business days. Investigative leads take longer — sometimes weeks — because verifying public records, cross-checking filings, and reaching named subjects for comment takes time. If your tip is time-sensitive (a vote in the next 48 hours, a hearing tomorrow), put “TIME SENSITIVE” in the subject line.</> },
          { heading: "Corrections, Take-Down Requests, and Legal", body: <>For corrections, email <a href="mailto:corrections@keeptxred.com" className="text-primary underline">corrections@keeptxred.com</a> with the URL and the specific factual error. We do not honor blanket take-down requests for accurate, lawfully reported information. Legal notices should go to <a href="mailto:admin@keeptxred.com" className="text-primary underline">admin@keeptxred.com</a> with “Legal” in the subject line.</> },
          { heading: "What We Cannot Help With", body: <>We are a newsroom, not a constituent-services office. For help reaching your elected officials, see <a href="/contact-legislators" className="text-primary underline">Contact Your Legislators</a>. For voter-registration questions, see the <a href="/register-to-vote" className="text-primary underline">voter registration guide</a>. For property tax disputes, contact your county appraisal district directly.</> },
        ]}
        faqs={[
          { q: "Will you keep my identity confidential?", a: <>Yes, if you ask. State it in your first message. Confidential tips are seen only by editors.</> },
          { q: "Do you pay for tips?", a: <>No. Keep TX Red does not pay sources for information.</> },
          { q: "How long until I hear back?", a: <>We acknowledge tips within two business days. Investigative work takes longer.</> },
          { q: "Can I send large files or recordings?", a: <>Yes. Use a file-sharing link in your email; do not attach files larger than 10 MB directly.</> },
          { q: "Do you cover federal stories?", a: <>Only when there is a direct Texas angle — a Texas delegation vote, a federal action against the state, or a ruling affecting Texas law.</> },
        ]}
        summary={<>Shop customers should include their order number and photographs. News tips should include documents and a date. Corrections go to corrections@keeptxred.com, and general or order-support questions go to admin@keeptxred.com.</>}
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
