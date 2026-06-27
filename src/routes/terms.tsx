import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Keep TX Red" },
      { name: "description", content: "The terms governing use of keeptxred.com — an independent Texas conservative news site." },
      { property: "og:title", content: "Terms of Service — Keep TX Red" },
      { property: "og:description", content: "Terms governing use of keeptxred.com." },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const updated = "June 2026";
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Legal</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      </div>

      <div className="space-y-8 font-serif text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Acceptance</h2>
          <p>By accessing keeptxred.com you agree to these Terms. If you do not agree, do not use the site.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Editorial Content</h2>
          <p>
            Opinion, analysis, and editorial commentary on this site reflect the views of Keep TX Red's editors. Statements of opinion are editorial content — not statements of fact — and are protected speech under the First Amendment.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">No Professional Advice</h2>
          <p>
            Property-tax estimates, election information, and legal explainers are provided for general civic education only. They are not legal, tax, accounting, or financial advice. Consult your county appraisal district, a licensed attorney, or a qualified professional before acting on anything you read here.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Intellectual Property</h2>
          <p>
            Original Keep TX Red articles, headlines, and graphics are © Keep TX Red. You may share excerpts with attribution and a link back. Republication of full articles requires written permission.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Third-Party Links & Sources</h2>
          <p>
            We link to official government sites, statutes, and outside news sources to let readers verify our reporting. Keep TX Red is not responsible for the content of third-party sites.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">User Submissions</h2>
          <p>
            Tips, contact form messages, and other voluntary submissions may be used in reporting unless you mark them confidential. Do not send confidential or privileged material you are not authorized to share.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Disclaimer of Warranties</h2>
          <p>The site is provided "as is" without warranties of any kind. We do not warrant that the site will be uninterrupted, error-free, or free of harmful components.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Limitation of Liability</h2>
          <p>To the maximum extent permitted by Texas law, Keep TX Red is not liable for any indirect, incidental, consequential, or punitive damages arising from your use of the site.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Governing Law</h2>
          <p>These Terms are governed by the laws of the State of Texas. Any dispute will be resolved in the state or federal courts located in Texas.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Changes</h2>
          <p>We may update these Terms at any time. The "Last updated" date above reflects the current version.</p>
        </section>
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Contact</h2>
          <p>Questions? Email hello@keeptxred.com.</p>
        </section>
      </div>
    </div>
  );
}