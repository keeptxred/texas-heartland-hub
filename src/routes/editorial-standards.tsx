import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editorial-standards")({
  head: () => ({
    meta: [
      { title: "Editorial Standards — Keep TX Red" },
      { name: "description", content: "How Keep TX Red verifies, attributes, analyzes, and adds original Texas political-intelligence context to news, elections, legislation, and public records." },
      { property: "og:title", content: "Editorial Standards — Keep TX Red" },
      { property: "og:description", content: "How Keep TX Red verifies, attributes, analyzes, and adds original Texas political-intelligence context to news, elections, legislation, and public records." },
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
          How we verify, attribute, analyze, and add durable Texas public-affairs context to our coverage.
        </p>
      </div>

      <div className="prose-like space-y-10 font-serif text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">What Keep TX Red Is</h2>
          <p>
            Keep TX Red is a Texas political-intelligence and public-affairs publication. We combine current news coverage with permanent reference pages for elections, candidates, officeholders, legislative districts, bills, laws, government institutions, policy issues, and public data so readers can move from a headline to the underlying Texas record.
          </p>
          <p className="mt-2">
            Some news articles begin with publicly available reporting, RSS feeds, government releases, public records, and other linked source material. When we synthesize or rewrite source-based reporting, we identify that sourcing rather than presenting it as original on-the-ground reporting. Our editorial goal is not to reproduce another publisher's article; it is to verify the event, preserve the source trail, connect it to primary records, and add Texas-specific context that remains useful after the news cycle moves on.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Original Value Standard</h2>
          <p>
            Publication is not justified by paraphrase alone. Indexable Keep TX Red content should provide meaningful value beyond the source material through one or more of the following: primary-record verification, multi-source synthesis, Texas legal or institutional context, entity and district connections, legislative history, election context, data interpretation, timelines, clearly labeled analysis, or links into our permanent government reference graph.
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Thin summaries and mechanically repetitive pages are held back from search indexing until they meet the relevant content standard.</li>
            <li>Permanent authority pages are maintained separately from short-lived news articles so candidate, officeholder, district, bill, law, and election information can be updated without creating duplicate pages.</li>
            <li>When a page cannot add durable value, our preferred remedies are expansion, consolidation, noindex, redirect, or removal rather than publishing more near-duplicate text.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Accuracy &amp; Verification</h2>
          <p>Our publishing systems are designed to preserve the underlying source trail and reject content that does not meet our evidence and publication checks.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>When an exact government record or official source is available, we identify it separately from third-party reporting.</li>
            <li>We do not treat a general agency homepage as proof of a specific claim.</li>
            <li>Published-source links remain available so readers can inspect the material behind a source-based story.</li>
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
            We distinguish source-based single-report coverage from multi-source synthesis. Generated articles carry provenance metadata and visible sourcing language. Our clustered newsroom pipeline can combine multiple independent reports and primary records about the same event; when it does, the article identifies the number and role of the linked sources and may include a coverage timeline.
          </p>
          <p className="mt-2">
            Single-source generated articles are tagged internally so we can audit them, strengthen them with primary records and additional context, or keep them out of the index when they do not provide enough independent value.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Use of AI-Assisted Tools</h2>
          <p>We use AI-assisted tools in parts of our aggregation, rewriting, summarization, classification, and research workflow.</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>AI output must stay grounded in the source material supplied to the generation step.</li>
            <li>Our automated validators reject drafts that fail required structure, evidence, length, or publication rules.</li>
            <li>AI-generated wording does not convert source-based reporting into original reporting.</li>
            <li>AI tools do not change the role of the underlying source: reporting remains reporting, analysis remains analysis, and primary records remain primary records.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl tracking-tight mb-2 text-foreground">Entity &amp; Topic Context</h2>
          <p>
            News articles are connected to permanent Keep TX Red resources where relevant, including Election Central, Texas Legislature, candidates, officeholders, districts, bills, laws, government pages, topic pages, policy trackers, and public-data references. The goal is to make each useful article an entry point into a durable Texas public-affairs reference network rather than an isolated rewrite.
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
            <li>Related Keep TX Red resources provide durable context around bills, elections, laws, government, districts, officeholders, and Texas issues.</li>
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
