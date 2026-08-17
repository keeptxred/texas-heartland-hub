import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editorial-standards")({
  head: () => ({
    meta: [
      { title: "Editorial Standards — Keep TX Red" },
      { name: "description", content: "How Keep TX Red aggregates, attributes, verifies, and labels Texas news and public-affairs information." },
      { property: "og:title", content: "Editorial Standards — Keep TX Red" },
      { property: "og:description", content: "How Keep TX Red aggregates, attributes, verifies, and labels Texas news and public-affairs information." },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/editorial-standards" }],
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
          How we aggregate, attribute, verify, and label the information behind our Texas coverage.
        </p>
      </div>

      <div className="prose-like space-y-10 font-serif text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">What Keep TX Red Is</h2>
          <p>
            Keep TX Red is a Texas news aggregation and synthesis publication. Much of our news coverage begins with publicly available reporting, RSS feeds, government releases, public records, and other linked source material. We organize and rewrite that material for Texas readers rather than presenting aggregated articles as original on-the-ground reporting.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Accuracy &amp; Verification</h2>
          <p>Our publishing systems are designed to preserve the underlying source trail and reject content that does not meet our evidence and publication checks.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>When an exact government record or official source is available, we identify it separately from third-party reporting.</li>
            <li>We do not treat a general agency homepage as proof of a specific claim.</li>
            <li>Published-source links remain available so readers can inspect the material behind an aggregated story.</li>
            <li>Automated publishing is subject to source-sufficiency, article-length, ownership, and quality validation gates.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Source Roles</h2>
          <p>
            A source can play different roles in a story. A government filing, bill text, election result, or official system notice is different from a news report or policy analysis. We label those roles instead of presenting every link as equivalent evidence.
          </p>
          <p className="mt-2">
            Our public <a href="/sources" className="text-primary underline underline-offset-4">Sources &amp; Primary Records directory</a> explains how major sources are classified and used. Inclusion of a source does not imply endorsement of its viewpoint or conclusions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Single-Source vs. Multi-Source Articles</h2>
          <p>
            We distinguish a one-source rewrite from a multi-source synthesis. Generated articles carry provenance metadata and visible sourcing language. Our clustered newsroom pipeline can combine multiple independent reports and primary records about the same event; when it does, the article identifies the number and role of the linked sources and may include a coverage timeline.
          </p>
          <p className="mt-2">
            One-source generated articles are tagged internally so we can audit and progressively replace lower-value rewrites with stronger multi-source coverage.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Use of AI-Assisted Tools</h2>
          <p>We use AI-assisted tools in parts of our aggregation, rewriting, summarization, classification, and research workflow.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>AI output must stay grounded in the source material supplied to the generation step.</li>
            <li>Our automated validators reject drafts that fail required structure, evidence, length, or publication rules.</li>
            <li>AI-generated wording does not convert a source-based rewrite into original reporting.</li>
            <li>AI tools do not change the role of the underlying source: reporting remains reporting, analysis remains analysis, and primary records remain primary records.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Entity &amp; Topic Context</h2>
          <p>
            News articles are connected to permanent Keep TX Red resources where relevant, including Election Central, Texas Legislature, bills, laws, government pages, topic pages, and other canonical resources. The goal is to turn short-lived news coverage into a useful Texas public-affairs reference network rather than a collection of isolated rewrites.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Editorial Independence</h2>
          <p>Keep TX Red is an independent publication. We are not authorized by any candidate or candidate’s committee.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>We do not accept payment for favorable news treatment.</li>
            <li>Sponsored content, if used, will be clearly labeled.</li>
            <li>Source inclusion is not an endorsement of a publisher, organization, candidate, agency, or viewpoint.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Corrections Policy</h2>
          <p>If we publish an error, we correct it as quickly as possible.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Minor corrections such as typos or formatting may be made without a correction note.</li>
            <li>Substantive factual corrections should be identified on the affected article when appropriate.</li>
            <li>Readers may submit correction requests through our <a href="/contact" className="text-primary underline underline-offset-4">Contact page</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Reader Trust</h2>
          <p>Our goal is to make the source trail easier—not harder—to inspect.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Articles retain linked sources and publication/update dates.</li>
            <li>Known source types are labeled as government, official, reporting, or analysis sources.</li>
            <li>Related Keep TX Red resources provide durable context around bills, elections, laws, government, and Texas issues.</li>
            <li>Our <a href="/glossary" className="text-primary underline underline-offset-4">glossary</a> helps explain Texas political terminology.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Contact Us</h2>
          <p>
            We welcome feedback, corrections, and sourcing questions through our <a href="/contact" className="text-primary underline underline-offset-4">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}