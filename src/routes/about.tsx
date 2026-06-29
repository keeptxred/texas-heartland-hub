import { createFileRoute } from "@tanstack/react-router";
import capitol from "@/assets/capitol.jpg";
import { PageExpansion } from "@/components/page-expansion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Keep TX Red | Mission, Editorial Standards & AI Disclosure" },
      { name: "description", content: "About Keep TX Red — our mission, editorial standards, AI disclosure, corrections policy, and contact information for the Texas news and politics newsroom." },
      { property: "og:title", content: "About Keep TX Red | Mission, Editorial Standards & AI Disclosure" },
      { property: "og:description", content: "Mission, editorial standards, AI disclosure, corrections policy, and contact information for Keep TX Red." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">★ About</span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2 leading-none">
        ABOUT <br />
        <span className="text-primary">KEEP TX RED</span>
      </h1>

      <div className="aspect-video overflow-hidden my-10 bg-muted">
        <img src={capitol} alt="Texas State Capitol at dusk" loading="lazy" className="size-full object-cover" />
      </div>

      <div className="space-y-5 text-base leading-relaxed">
        <h2 className="font-display text-3xl tracking-tight">Mission</h2>
        <p className="text-lg">
          <strong>Keep Texas Red is a Texas-focused news and analysis outlet covering policy, elections, and issues shaping the state.</strong>
        </p>
        <p className="text-muted-foreground">
          Keep TX Red is a news and media publication — not a political action committee, campaign, or candidate organization. We do not raise money for candidates or coordinate with campaigns. Our work is informational and explanatory: report the policy fights that matter, track the elections shaping the next decade of Texas, and give readers the data and context they need to follow their state government.
        </p>

        <h2 className="font-display text-3xl tracking-tight pt-4">What We Cover</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>The Texas Legislature, special sessions, and the conservative caucus</li>
          <li>Border security and Operation Lone Star</li>
          <li>Property tax policy, appraisal caps, and ISD spending</li>
          <li>Parental rights and school board elections</li>
          <li>Energy, regulation, and the Texas economy</li>
        </ul>

        <h2 className="font-display text-3xl tracking-tight pt-4">Editorial Standards</h2>
        <p className="text-muted-foreground">
          Our reporting prioritizes verifiable facts from primary sources — the Texas Legislature Online, the Secretary of State, the Comptroller's Office, ERCOT, and county-level filings. Opinion and analysis are clearly labeled. We do not publish anonymous attacks, unverified rumors, or sponsored content disguised as reporting. For our full standards, see our <a href="/editorial-standards" className="text-primary underline">Editorial Standards</a> page.
        </p>

        <h2 className="font-display text-3xl tracking-tight pt-4">AI Disclosure</h2>
        <p className="text-muted-foreground">
          Keep TX Red uses AI tools to assist in drafting, summarizing, and aggregating publicly available information for evergreen explainers and daily news roundups. Every AI-assisted article is reviewed by our editorial team before publication and held to the same factual standards as everything else we publish. Articles produced with AI assistance are labeled as such, and the sources we draw from are linked in each piece.
        </p>

        <h2 className="font-display text-3xl tracking-tight pt-4">Corrections Policy</h2>
        <p className="text-muted-foreground">
          If you spot a factual error in our reporting, email <a href="mailto:contact@keeptxred.com" className="text-primary underline">contact@keeptxred.com</a> with a link to the article and the correction you're suggesting. We review every correction request, update the article when warranted, and add a dated correction note to the bottom of the piece so readers can see what changed and when.
        </p>

        <h2 className="font-display text-3xl tracking-tight pt-4">Editorial Independence</h2>
        <p className="text-muted-foreground">
          Keep TX Red is reader-supported and not authorized by any candidate or candidate's committee. Our property tax estimates draw from county appraisal district filings and Texas Comptroller data.
        </p>

        <h2 className="font-display text-3xl tracking-tight pt-4">Contact</h2>
        <p className="text-muted-foreground">
          General inquiries, tips, and corrections: <a href="mailto:contact@keeptxred.com" className="text-primary underline">contact@keeptxred.com</a>. For more contact options, see our <a href="/contact" className="text-primary underline">Contact</a> page.
        </p>

        <div className="mt-8 border-l-4 border-primary bg-muted/40 p-5">
          <p className="font-serif text-base">
            <a href="/keep-texas-red" className="text-primary font-semibold hover:underline">Read more about Keep Texas Red →</a>
            <span className="text-muted-foreground"> Our full guide to what Keep Texas Red means and why Texans support it.</span>
          </p>
        </div>

        <PageExpansion
          perspectiveTitle="Why a Texas-Only Newsroom"
          perspective={<>Most national outlets cover Texas in passing — a border clip, an ERCOT headline, a quote from the Governor. We do the opposite. According to our internal review of statewide coverage, the issues that move Texans most — appraisal caps, school finance recapture, Operation Lone Star deployments, PUC rule changes — get a fraction of the airtime they deserve. Keep Texas Red exists to close that gap with explainer journalism written from inside the state, not from a Beltway desk.</>}
          blocks={[
            { heading: "Who We Are For", body: <>Our readers are Texas homeowners watching their tax bills, parents tracking school board votes, small-business owners absorbing regulatory shifts, and voters trying to follow the Legislature between sessions. We write so a working Texan can finish an article in five minutes and walk away knowing what changed, who voted, and what to do next.</> },
            { heading: "How We Fund the Work", body: <>Keep TX Red is reader-supported and ad-supported. We run programmatic display ads (clearly labeled) and accept no money from candidates, PACs, or campaigns. We do not run sponsored content disguised as reporting. If a piece is sponsored, it is marked "Sponsored" at the top and the bottom — no exceptions.</> },
            { heading: "How We Decide What to Cover", body: <>We prioritize stories where (1) a decision in Austin will change a Texan's daily life, (2) a primary source is publicly available and verifiable, and (3) other outlets are under-covering it. That filter is why our newsroom skews toward the Legislature, county tax offices, and state agencies rather than national cable-news fights.</> },
            { heading: "Reporting Methods", body: <>Our review of county-level filings, comptroller data, and Texas Legislature Online bill text drives most of our explainers. Local interviews with county clerks, school board members, and appraisal district staff fill in the gaps that paperwork alone cannot. When we draw on AI tools to draft or summarize public records, a human editor verifies every fact before publication.</> },
            { heading: "What We Will Never Do", body: <>We will not publish anonymous attacks, unverified rumors, or AI-generated quotes attributed to real people. We will not endorse candidates. We will not bury corrections — every fix gets a dated note at the bottom of the article so readers can see exactly what changed and when.</> },
          ]}
          faqs={[
            { q: "Is Keep TX Red a PAC or campaign?", a: <>No. Keep TX Red is a news and analysis outlet. We are not a political action committee, do not raise money for candidates, and do not coordinate with any campaign.</> },
            { q: "Do you use AI to write articles?", a: <>Yes, for evergreen explainers and daily roundups. Every AI-assisted piece is reviewed by an editor and labeled. See our <a href="/editorial-standards" className="text-primary underline">Editorial Standards</a> for the full disclosure.</> },
            { q: "How do I pitch a story or tip?", a: <>Email <a href="mailto:tips@keeptxred.com" className="text-primary underline">tips@keeptxred.com</a>. Include the county, a date, and any documents you can share. We read every tip.</> },
            { q: "How do I request a correction?", a: <>Email <a href="mailto:corrections@keeptxred.com" className="text-primary underline">corrections@keeptxred.com</a> with the article URL and the specific factual error. We add a dated correction note when warranted.</> },
            { q: "Where do your property tax numbers come from?", a: <>County appraisal district filings and Texas Comptroller of Public Accounts data. See the <a href="/tax-calculator" className="text-primary underline">property tax calculator</a> for sourcing.</> },
            { q: "Can I republish your articles?", a: <>Short excerpts with a link back are fine. For full republication, email <a href="mailto:contact@keeptxred.com" className="text-primary underline">contact@keeptxred.com</a>.</> },
          ]}
          summary={<>Keep Texas Red is a Texas-only newsroom that covers the Legislature, elections, property tax, energy, and the border with primary-source reporting. We are not a PAC, we label AI assistance, we correct mistakes in public, and we exist to give Texans the context they need to follow their state government.</>}
          related={[
            { to: "/editorial-standards", label: "Editorial Standards" },
            { to: "/contact", label: "Contact the newsroom" },
            { to: "/keep-texas-red", label: "What Keep Texas Red means" },
            { to: "/tax-calculator", label: "Texas property tax calculator" },
          ]}
        />
      </div>
    </div>
  );
}