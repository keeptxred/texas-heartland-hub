import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageExpansion } from "@/components/page-expansion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Keep TX Red" },
      { name: "description", content: "Send tips, corrections, or feedback to the Keep TX Red newsroom." },
      { property: "og:title", content: "Contact Keep TX Red" },
      { property: "og:description", content: "Send tips, corrections, or feedback to the Keep TX Red newsroom." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Get In Touch</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Contact the Newsroom</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Tips, corrections, story ideas, or feedback — we read everything.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <aside className="md:col-span-1 space-y-6 text-sm">
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary mb-2">News Tips</h3>
            <p className="text-muted-foreground">tips@keeptxred.com</p>
          </div>
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary mb-2">Corrections</h3>
            <p className="text-muted-foreground">corrections@keeptxred.com</p>
          </div>
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary mb-2">General</h3>
            <p className="text-muted-foreground">contact@keeptxred.com</p>
          </div>
          <div>
            <h3 className="font-display text-xs tracking-[0.25em] uppercase text-primary mb-2">Mail</h3>
            <p className="text-muted-foreground">Keep TX Red<br />Austin, Texas</p>
          </div>
        </aside>

        <form
          className="md:col-span-2 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {sent ? (
            <div className="border-2 border-primary bg-primary/5 p-6">
              <h2 className="font-display text-2xl tracking-tight">Message received.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for writing. We'll be in touch if a response is warranted. Texas strong. ★
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
              </div>
              <Field label="Subject" name="subject" required />
              <div>
                <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-foreground mb-2">Message</label>
                <textarea
                  required
                  rows={7}
                  className="w-full border border-border bg-background p-3 text-sm font-serif focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-display tracking-[0.2em] uppercase text-sm px-7 py-3 hover:bg-primary/90"
              >
                Send Message ★
              </button>
              <p className="text-xs text-muted-foreground">
                By submitting you agree to our <a href="/privacy" className="text-primary underline">privacy policy</a>.
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
          { heading: "Response Times", body: <>We aim to acknowledge every tip within two business days. Investigative leads take longer — sometimes weeks — because verifying public records, cross-checking filings, and reaching named subjects for comment takes time. If your tip is time-sensitive (a vote in the next 48 hours, a hearing tomorrow), put "TIME SENSITIVE" in the subject line.</> },
          { heading: "Corrections, Take-Down Requests, and Legal", body: <>For corrections, email <a href="mailto:corrections@keeptxred.com" className="text-primary underline">corrections@keeptxred.com</a> with the URL and the specific factual error. We do not honor blanket take-down requests for accurate, lawfully reported information. Legal notices should go to <a href="mailto:contact@keeptxred.com" className="text-primary underline">contact@keeptxred.com</a> with "Legal" in the subject line.</> },
          { heading: "What We Cannot Help With", body: <>We are a newsroom, not a constituent-services office. For help reaching your elected officials, see <a href="/contact-legislators" className="text-primary underline">Contact Your Legislators</a>. For voter-registration questions, see the <a href="/register-to-vote" className="text-primary underline">voter registration guide</a>. For property tax disputes, contact your county appraisal district directly.</> },
        ]}
        faqs={[
          { q: "Will you keep my identity confidential?", a: <>Yes, if you ask. State it in your first message. Confidential tips are seen only by editors.</> },
          { q: "Do you pay for tips?", a: <>No. Keep TX Red does not pay sources for information.</> },
          { q: "How long until I hear back?", a: <>We acknowledge tips within two business days. Investigative work takes longer.</> },
          { q: "Can I send large files or recordings?", a: <>Yes. Use a file-sharing link in your email; do not attach files larger than 10 MB directly.</> },
          { q: "Do you cover federal stories?", a: <>Only when there is a direct Texas angle — a Texas delegation vote, a federal action against the state, or a ruling affecting Texas law.</> },
        ]}
        summary={<>Send tips to tips@keeptxred.com with documents and a date. Confidentiality is honored when requested. Corrections go to corrections@keeptxred.com. We respond within two business days and verify every claim against primary sources before publishing.</>}
        related={[
          { to: "/about", label: "About Keep TX Red" },
          { to: "/editorial-standards", label: "Editorial standards and corrections policy" },
          { to: "/contact-legislators", label: "Contact your legislators" },
          { to: "/privacy", label: "Privacy policy" },
        ]}
      />
    </div>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-foreground mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full border border-border bg-background p-3 text-sm font-serif focus:outline-none focus:border-primary"
      />
    </div>
  );
}