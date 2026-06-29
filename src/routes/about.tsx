import { createFileRoute } from "@tanstack/react-router";
import capitol from "@/assets/capitol.jpg";

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
      </div>
    </div>
  );
}