import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeo, SITE_URL } from "@/lib/seo";

const PATH = "/texas-politics/why-texas-is-politically-competitive";
const CANONICAL = `${SITE_URL}${PATH}`;
const TITLE = "Why Is Texas Politically Competitive? Population, Cities, Suburbs and Voting Trends";
const SEO_TITLE = "Why Is Texas Politically Competitive? Voting Trends & Political Geography | KeepTXRed";
const DESCRIPTION =
  "Why Texas can remain Republican statewide while metros, suburbs, South Texas and individual districts stay politically competitive. A source-backed guide to population growth, turnout, geography and coalition change.";

const SOURCES = [
  {
    href: "https://www.sos.state.tx.us/elections/historical/elections-results-archive.shtml",
    label: "Texas Secretary of State — Election Results Archive",
  },
  {
    href: "https://www.sos.state.tx.us/elections/historical/presidential.shtml",
    label: "Texas Secretary of State — Presidential Election Results",
  },
  {
    href: "https://www.census.gov/quickfacts/fact/table/TX/PST045225",
    label: "U.S. Census Bureau — Texas QuickFacts",
  },
  {
    href: "https://www.census.gov/newsroom/press-releases/2026/2025-popest-metro-micro-counties.html",
    label: "U.S. Census Bureau — Vintage 2025 County Population Estimates",
  },
  {
    href: "https://texaspolitics.utexas.edu/blog/some-notes-political-geography-2022-election-texas",
    label: "University of Texas Texas Politics Project — Political Geography of the 2022 Election",
  },
  {
    href: "https://www.tshaonline.org/handbook/entries/republican-party",
    label: "Handbook of Texas — Republican Party",
  },
  {
    href: "https://www.tshaonline.org/handbook/entries/urbanization",
    label: "Handbook of Texas — Urbanization",
  },
];

const FAQS = [
  {
    question: "Is Texas a swing state?",
    answer:
      "A single label can be misleading. Republicans have continued to win statewide offices in recent election cycles, but competitiveness varies substantially by office, district, region and election year. Large metropolitan counties, suburbs, South Texas and individual legislative or congressional districts can move differently from the statewide result.",
  },
  {
    question: "Why can Texas be Republican statewide and still politically competitive?",
    answer:
      "Statewide results combine very different regional vote margins. Republicans can win large margins in rural and exurban areas while Democrats win large margins in major urban counties, with suburbs and parts of South Texas contributing changing margins between them. Population growth and turnout determine how those pieces add up.",
  },
  {
    question: "Do fast-growing Texas suburbs automatically become more Democratic?",
    answer:
      "No. Growth changes the electorate, but it does not determine a partisan outcome. Fast-growing counties differ in age, income, education, ethnicity, housing patterns, local issues and migration sources. Some have become more competitive while others remain strongly Republican.",
  },
  {
    question: "Why does South Texas matter to statewide competitiveness?",
    answer:
      "South Texas has a distinct political history and has shown meaningful partisan movement in recent elections. Its counties are not politically uniform, so changes in turnout and party margins there can alter statewide arithmetic even when the largest metro counties vote differently.",
  },
];

const clusterLinks = [
  {
    href: "/keep-texas-red",
    title: "What does Keep Texas Red mean?",
    description: "The KTR pillar explaining elections, policy, government and accountability.",
  },
  {
    href: "/texas-politics/texas-political-geography-history",
    title: "Texas Political Geography",
    description: "How regions and counties built the statewide electoral map.",
  },
  {
    href: "/texas-politics/texas-urban-suburban-rural-politics-history",
    title: "Urban, Suburban and Rural Texas Politics",
    description: "How community type became one of the state's most important electoral divides.",
  },
  {
    href: "/texas-politics/texas-election-history",
    title: "Texas Election History",
    description: "The long transition from one-party dominance to modern two-party competition.",
  },
  {
    href: "/texas-politics/how-texas-became-republican",
    title: "How Texas Became Republican",
    description: "The modern partisan realignment from the 1950s through statewide GOP control.",
  },
  {
    href: "/elections/2026",
    title: "2026 Texas Election Central",
    description: "Current races, candidates, voting information, polls and results.",
  },
];

export const Route = createFileRoute(PATH)({
  head: () => {
    const seo = buildSeo({
      title: SEO_TITLE,
      description: DESCRIPTION,
      path: PATH,
      type: "article",
      section: "Texas Politics",
      author: "Keep TX Red Editorial Desk",
      publishedTime: "2026-09-24",
      modifiedTime: "2026-09-24",
      imageAlt: "Texas political geography and election competitiveness explainer",
    });

    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        ...(seo.scripts ?? []),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: TITLE,
            description: DESCRIPTION,
            datePublished: "2026-09-24",
            dateModified: "2026-09-24",
            mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
            author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
            publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
            citation: SOURCES.map((source) => ({
              "@type": "CreativeWork",
              name: source.label,
              url: source.href,
            })),
          }).replace(/</g, "\\u003c"),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }).replace(/</g, "\\u003c"),
        },
      ],
    };
  },
  component: TexasPoliticalCompetitivenessPage,
});

function TexasPoliticalCompetitivenessPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link to="/">Home</Link> / <Link to="/texas-politics">Texas Politics</Link> / Why Texas Is Politically Competitive
      </nav>

      <article>
        <header className="rounded-2xl border bg-card p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas electoral geography</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">{TITLE}</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
            Texas can produce durable Republican statewide victories while still containing highly competitive regions,
            districts and voter coalitions. The reason is arithmetic: population growth, turnout and partisan margins
            are moving at different speeds in different parts of the state.
          </p>
          <div className="mt-5 text-sm text-muted-foreground">
            Updated <time dateTime="2026-09-24">September 24, 2026</time>
          </div>
        </header>

        <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Short answer</h2>
          <p className="mt-4 leading-8 text-foreground/90">
            Texas is politically competitive in different ways at different geographic scales. Republicans have
            continued to win statewide contests, but Democrats have built large margins in several major urban
            counties, some suburbs have narrowed or changed direction, rural Republican margins have become extremely
            large, and South Texas has moved in ways that do not fit a simple urban-versus-rural model. Rapid population
            growth keeps changing the number and location of voters. The result is a state where a statewide advantage
            can coexist with competitive congressional districts, legislative seats, suburban counties, local offices
            and shifting regional coalitions.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-3xl font-bold">1. Statewide control and political competitiveness are not the same thing</h2>
          <p className="leading-8 text-foreground/90">
            The Texas Secretary of State's official election archive shows that Republicans have continued to win
            statewide races in recent cycles. That does not mean every part of Texas votes the same way or that every
            race is equally secure. Statewide totals are produced by adding together very different county and regional
            margins. A party can lose several of the largest counties while winning statewide if it builds enough margin
            elsewhere.
          </p>
          <p className="leading-8 text-foreground/90">
            That distinction matters when people call Texas either "solid red" or "a battleground." Both descriptions can
            hide more than they reveal. The statewide result, the competitiveness of a congressional district, the
            direction of a suburban county and the political balance of a city are four different questions.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-3xl font-bold">2. Texas is adding voters in places that matter to both parties</h2>
          <p className="leading-8 text-foreground/90">
            The Census Bureau estimated Texas at more than 31.7 million residents in 2025, up 8.8 percent from the 2020
            estimates base. That growth is not spread evenly. Census estimates for 2024 to 2025 placed Harris, Collin,
            Montgomery, Fort Bend and Williamson Counties among the nation's largest numeric county gainers, while
            several Texas counties also ranked among the fastest growing by percentage.
          </p>
          <p className="leading-8 text-foreground/90">
            Population growth does not mechanically create votes for either party. It changes the pool of potential
            voters. New residents differ in age, ethnicity, education, income, homeownership, religion, occupation,
            migration history and political participation. Fast growth therefore creates opportunity and uncertainty:
            campaigns must repeatedly learn who lives in a place now rather than assuming that yesterday's partisan
            pattern will remain fixed.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-3xl font-bold">3. The biggest cities and the rest of the state pull in different directions</h2>
          <p className="leading-8 text-foreground/90">
            University of Texas Texas Politics Project analysis of the 2014, 2018 and 2022 gubernatorial elections found
            Democrats improving in the five counties with the most registered voters while Republicans maintained their
            statewide advantage through a combination of suburban support, very large rural margins and substantial raw
            vote totals even inside counties they lost.
          </p>
          <p className="leading-8 text-foreground/90">
            This is why political maps can be visually deceptive. A large rural area may contain relatively few voters,
            while one metropolitan county can cast more ballots than dozens of smaller counties combined. What matters
            statewide is not the number of red or blue counties but the number of votes, turnout rate and margin produced
            in each place.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-3xl font-bold">4. Suburbs are not one political category</h2>
          <p className="leading-8 text-foreground/90">
            The word "suburb" covers very different places. An inner-ring suburb with dense housing and long-established
            neighborhoods can behave differently from a fast-growing master-planned community, and both can differ from
            an exurban county where commuters live alongside rural communities. Collin, Denton, Fort Bend, Williamson,
            Montgomery, Brazoria, Hays, Comal and other fast-growth counties illustrate how much variation is hidden
            inside a single suburban label.
          </p>
          <p className="leading-8 text-foreground/90">
            Some suburban areas have become more competitive as their populations changed. Others remain strongly
            Republican. The important statewide question is not whether "the suburbs" move in one direction, but how much
            margin each party gains or loses across dozens of different suburban and exurban environments.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-3xl font-bold">5. Rural Texas still matters because margins can be enormous</h2>
          <p className="leading-8 text-foreground/90">
            Rural Texas represents a smaller share of the state's population than it once did, but large partisan margins
            can preserve its statewide importance. The Texas Politics Project found Republican gubernatorial support in
            the rural counties it analyzed increasing from 2014 through 2022 even as the largest urban counties moved in
            the opposite direction.
          </p>
          <p className="leading-8 text-foreground/90">
            This creates a balancing effect. Democratic gains in populous urban counties can be offset by Republican
            gains across many rural counties and exurbs. A statewide coalition therefore depends not only on where a
            party is gaining voters but also on whether losses elsewhere are widening faster.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-3xl font-bold">6. South Texas makes simple demographic assumptions unreliable</h2>
          <p className="leading-8 text-foreground/90">
            South Texas and the Rio Grande Valley have their own political history shaped by border economics, Mexican
            American civic organization, local political networks, energy, agriculture and federal policy. Recent
            elections have shown meaningful Republican gains in parts of the region, but those gains vary substantially
            by county and election.
          </p>
          <p className="leading-8 text-foreground/90">
            The lesson is broader than South Texas: demographic identity does not determine a permanent party outcome.
            Candidate quality, issue priorities, turnout, local organization and economic conditions can move voters
            inside the same demographic category in different directions.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-3xl font-bold">7. Turnout can matter as much as persuasion</h2>
          <p className="leading-8 text-foreground/90">
            Texas elections are shaped by who participates as well as by how people identify politically. Presidential,
            midterm, primary, runoff and local elections attract different electorates. A county that appears closely
            divided in one high-turnout election may look very different in a low-turnout primary or municipal contest.
          </p>
          <p className="leading-8 text-foreground/90">
            That is especially important in legislative districts where one party has a large general-election advantage.
            In those seats, the most consequential competition may occur in the primary or runoff rather than in
            November. KTR's <Link to="/elections/2026" className="font-semibold text-primary underline underline-offset-4">2026 Election Central</Link> tracks
            those races separately rather than treating statewide toplines as a substitute for district-level analysis.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-3xl font-bold">8. Redistricting converts population change into political competition</h2>
          <p className="leading-8 text-foreground/90">
            Population growth changes representation after each census and can also alter the balance inside existing
            districts between map cycles. Congressional and legislative boundaries determine which communities vote
            together, while federal and state law constrain how those maps are drawn. A fast-growing county may gain
            political importance before it gains a new district simply because thousands of additional voters are being
            added to the districts already covering it.
          </p>
          <p className="leading-8 text-foreground/90">
            That is why the <Link to="/texas-politics/texas-redistricting-history" className="font-semibold text-primary underline underline-offset-4">history of Texas redistricting</Link> belongs
            in the same conversation as population growth and election results. Political competitiveness is partly a
            question of voters and partly a question of how those voters are grouped into districts.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">How this fits the Keep Texas Red topic cluster</h2>
          <p className="mt-4 leading-8 text-foreground/90">
            This page explains why the state's electoral map can change without reducing Texas politics to a single
            label. For the broader KTR framework, start with <Link to="/keep-texas-red" className="font-semibold text-primary underline underline-offset-4">What Keep Texas Red means</Link>,
            then move between political geography, election history, Republican realignment and current 2026 races.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {clusterLinks.map((item) => (
              <a key={item.href} href={item.href} className="rounded-xl border p-5 transition hover:border-primary hover:shadow-sm">
                <h3 className="font-bold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.question} className="rounded-xl border bg-card p-5">
                <summary className="cursor-pointer font-bold">{faq.question}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold">Sources</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {SOURCES.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
