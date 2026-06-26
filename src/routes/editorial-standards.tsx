import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editorial-standards")({
  head: () => ({
    meta: [
      { title: "Editorial Standards — Keep TX Red" },
      { name: "description", content: "How Keep TX Red verifies facts, maintains independence, and earns reader trust." },
      { property: "og:title", content: "Editorial Standards — Keep TX Red" },
      { property: "og:description", content: "How Keep TX Red verifies facts, maintains independence, and earns reader trust." },
    ],
    links: [{ rel: "canonical", href: "/editorial-standards" }],
  }),
  component: EditorialStandardsPage,
});

function EditorialStandardsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="border-b-2 border-foreground pb-4 mb-10">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ Our Standards</span>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-1">Editorial Standards</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          How we verify facts, maintain independence, and earn your trust.
        </p>
      </div>

      <div className="prose-like space-y-10 font-serif text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Our Mission</h2>
          <p>
            Keep TX Red exists to provide Texans with clear, accurate, and accessible information about state policy, elections, local government, and the issues shaping the future of the Lone Star State. Our editorial standards ensure that every article we publish reflects our commitment to transparency, accuracy, and reader trust.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Accuracy & Verification</h2>
          <p>We strive to ensure that all information published on Keep TX Red is accurate at the time of publication.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>We verify facts using official sources such as the Texas Legislature, Texas Comptroller, Secretary of State, ERCOT, TEA, and county appraisal districts.</li>
            <li>When reporting on public statements, legislation, or government actions, we link directly to primary documents whenever possible.</li>
            <li>If an error is identified, we correct it promptly and transparently.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Editorial Independence</h2>
          <p>Keep TX Red is an independent publication. We are not authorized by any candidate or candidate’s committee.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Our coverage decisions are made by our editorial team.</li>
            <li>We do not accept payment for coverage, placement, or favorable treatment.</li>
            <li>Sponsored content, if ever used, will be clearly labeled.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Use of AI‑Assisted Tools</h2>
          <p>We use AI‑assisted tools to help generate drafts, summaries, and research support. However:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Every evergreen article includes human‑written sections, edits, and review.</li>
            <li>All content is checked for accuracy, clarity, and relevance before publication.</li>
            <li>AI tools never determine our editorial stance or coverage priorities.</li>
          </ul>
          <p className="mt-2">This hybrid approach allows us to publish efficiently while maintaining human oversight and accountability.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Sourcing & Transparency</h2>
          <p>We prioritize transparency in how we gather and present information.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Official sources are linked directly in each article.</li>
            <li>When citing data, we reference the originating agency or dataset.</li>
            <li>When using third‑party reports, we attribute them clearly and avoid misrepresentation.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Corrections Policy</h2>
          <p>If we publish an error, we correct it as quickly as possible.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Minor corrections (typos, formatting) may be made silently.</li>
            <li>Substantive corrections (facts, figures, misstatements) include an editor’s note at the bottom of the article.</li>
            <li>Readers may submit correction requests through our <a href="/contact" className="text-primary underline underline-offset-4">Contact page</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Editorial Voice</h2>
          <p>Our editorial voice is clear, direct, and focused on Texas policy, governance, and civic engagement.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Evergreen explainers aim to educate, not sensationalize.</li>
            <li>News updates summarize key developments without unnecessary speculation.</li>
            <li>Opinion or analysis pieces, if published, will be clearly labeled.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Reader Trust</h2>
          <p>We believe Texans deserve journalism that respects their intelligence and their time.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Articles include “Last Updated” timestamps.</li>
            <li>FAQs and related‑article sections help readers explore topics in depth.</li>
            <li>We maintain a <a href="/glossary" className="text-primary underline underline-offset-4">glossary</a> to ensure clarity around Texas political terminology.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Contact Us</h2>
          <p>
            We welcome feedback, corrections, and questions. Readers can reach us anytime through our <a href="/contact" className="text-primary underline underline-offset-4">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
