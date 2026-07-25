import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  const [sent, setSent] = useState(false);
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
          Order support, tips, corrections, story ideas, privacy requests, or general feedback — we read everything.
        </p>
      </div>

      <section className="mb-10 rounded-xl border border-border bg-secondary/40 p-6">
        <h2 className="font-display text-2xl">Shop Order Support</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          For damaged, defective, misprinted, incorrect, delayed, or missing orders, email <a href="mailto:contact@keeptxred.com" className="text-primary underline underline-offset-4">contact@keeptxred.com</a>. Include your order number, a description of the issue, and clear photographs when applicable.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link to="/return-refund-policy" className="text-primary underline underline-offset-4">Return &amp; Refund Policy</Link>
          <Link to="/shipping-policy" className="text-primary underline underline-offset-4">Shipping Policy</Link>
        </div>
      </section>

      <div className="grid gap-10 md:grid-cols-3">
        <aside className="space-y-6 text-sm md:col-span-1">
          <div>
            <h2 className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-primary">Order Support & General</h2>
            <a href="mailto:contact@keeptxred.com" className="text-muted-foreground hover:text-primary">contact@keeptxred.com</a>
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
            <h2 className="mb-2 font-display text-xs uppercase tracking-[0.25em] text-primary">Mail</h2>
            <p className="text-muted-foreground">Keep TX Red<br />Austin, Texas</p>
          </div>
        </aside>

        <form
          className="space-y-5 md:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {sent ? (
            <div className="border-2 border-primary bg-primary/5 p-6" role="status">
              <h2 className="font-display text-2xl tracking-tight">Message received.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for writing. We&apos;ll be in touch if a response is warranted. Texas strong. ★
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
              </div>
              <Field label="Order number (optional)" name="orderNumber" />
              <Field label="Subject" name="subject" required />
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={7}
                  className="w-full border border-border bg-background p-3 font-serif text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary px-7 py-3 font-display text-sm uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
              >
                Send Message ★
              </button>
              <p className="text-xs text-muted-foreground">
                By submitting you agree to our <Link to="/privacy" className="text-primary underline">privacy policy</Link>.
              </p>
            </>
          )}
        </form>
      </div>

      <PageExpansion
        perspectiveTitle="Why Your Tip Matters"
        perspective={<>According to our internal review, the strongest Keep TX Red stories of the last year started with a reader email — a county clerk noticing an unusual purge, a parent forwarding a school board agenda, a small-business owner sharing an appraisal notice. Texas is too big for any newsroom to cover end-to-end. Our reporting depends on Texans on the ground sending us what they see. Every tip is read by a human editor, and confidentiality is the default unless you tell us otherwise.</>}
        blocks={[
          { heading: "What to Send With a News Tip", body: <>The fastest path from tip to published story is documents plus a date. Send the agenda, the appraisal notice, the campaign filing, the bill text, or the meeting recording — whatever primary source backs the claim. Include the county or district name, a date, and your best phone number. If you want anonymity, say so up front and we will honor it.</> },
          { heading: "How We Handle Sensitive Tips", body: <>Tips marked confidential are seen only by the editorial team. We do not share sender identities with subjects of reporting, advertisers, or third parties. For high-sensitivity material, request a secure channel in your first email and we will arrange one. We do not publish documents that would identify a confidential source without explicit permission.</> },
          { heading: "Response Times", body: <>We aim to acknowledge every tip within two business days. Investigative leads take longer — sometimes weeks — because verifying public records, cross-checking filings, and reaching named subjects for comment takes time. If your tip is time-sensitive (a vote in the next 48 hours, a hearing tomorrow), put “TIME SENSITIVE” in the subject line.</> },
          { heading: "Corrections, Take-Down Requests, and Legal", body: <>For corrections, email <a href="mailto:corrections@keeptxred.com" className="text-primary underline">corrections@keeptxred.com</a> with the URL and the specific factual error. We do not honor blanket take-down requests for accurate, lawfully reported information. Legal notices should go to <a href="mailto:contact@keeptxred.com" className="text-primary underline">contact@keeptxred.com</a> with “Legal” in the subject line.</> },
          { heading: "What We Cannot Help With", body: <>We are a newsroom, not a constituent-services office. For help reaching your elected officials, see <a href="/contact-legislators" className="text-primary underline">Contact Your Legislators</a>. For voter-registration questions, see the <a href="/register-to-vote" className="text-primary underline">voter registration guide</a>. For property tax disputes, contact your county appraisal district directly.</> },
        ]}
        faqs={[
          { q: "Will you keep my identity confidential?", a: <>Yes, if you ask. State it in your first message. Confidential tips are seen only by editors.</> },
          { q: "Do you pay for tips?", a: <>No. Keep TX Red does not pay sources for information.</> },
          { q: "How long until I hear back?", a: <>We acknowledge tips within two business days. Investigative work takes longer.</> },
          { q: "Can I send large files or recordings?", a: <>Yes. Use a file-sharing link in your email; do not attach files larger than 10 MB directly.</> },
          { q: "Do you cover federal stories?", a: <>Only when there is a direct Texas angle — a Texas delegation vote, a federal action against the state, or a ruling affecting Texas law.</> },
        ]}
        summary={<>Shop customers should include their order number and photographs. News tips should include documents and a date. Corrections go to corrections@keeptxred.com, and general or order-support questions go to contact@keeptxred.com.</>}
        related={[
          { to: "/return-refund-policy", label: "Return and refund policy" },
          { to: "/shipping-policy", label: "Shipping policy" },
          { to: "/about", label: "About Keep TX Red" },
          { to: "/editorial-standards", label: "Editorial standards and corrections policy" },
          { to: "/privacy", label: "Privacy policy" },
        ]}
      />
      <SocialLinks />
    </main>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  const id = `contact-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">{label}</label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        className="w-full border border-border bg-background p-3 font-serif text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}
