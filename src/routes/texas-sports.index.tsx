import { createFileRoute, Link } from "@tanstack/react-router";
import { listSportsLatest, type SportsListItem } from "@/lib/sports.functions";
import { TEAMS, LEAGUE_META, type LeagueSlug } from "@/lib/texas-teams";
import { resolveArticleImage } from "@/lib/seo-headline";

const LEAGUES: LeagueSlug[] = ["nfl", "mlb", "nba", "nhl", "mls", "nwsl", "wnba", "cfb"];

const DESKS = [
  { title: "Latest Texas Sports", description: "The newest reporting from teams and sports across the state.", league: "nfl" as LeagueSlug },
  { title: "Texas College Sports", description: "Longhorns, Aggies, Big 12 programs, recruiting, NIL and conference business.", league: "cfb" as LeagueSlug },
  { title: "Sports Business & Policy", description: "Stadium financing, NIL, sports betting, public money and Texas sports policy.", league: null },
  { title: "Texas Motorsports", description: "COTA, Texas Motor Speedway, NASCAR, Formula 1 and major racing news.", league: null },
] as const;

export const Route = createFileRoute("/texas-sports/")({
  loader: async () => listSportsLatest({ data: { limit: 12 } }),
  head: () => ({
    meta: [
      { title: "Texas Sports News, Teams, College Sports & Policy | Keep TX Red" },
      { name: "description", content: "Texas sports news covering every major pro team, college football, recruiting, NIL, motorsports, stadium finance and sports policy across the Lone Star State." },
      { property: "og:title", content: "Texas Sports News, Teams, College Sports & Policy" },
      { property: "og:description", content: "Texas pro teams, college sports, motorsports and the money and policy shaping sports across the state." },
      { property: "og:url", content: "https://keeptxred.com/texas-sports" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/texas-sports" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Texas Sports News",
        url: "https://keeptxred.com/texas-sports",
        description: "Texas sports news, team coverage, college sports, motorsports and sports policy.",
        isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: "https://keeptxred.com" },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com" },
            { "@type": "ListItem", position: 2, name: "Texas Sports", item: "https://keeptxred.com/texas-sports" },
          ],
        },
      }),
    }],
  }),
  component: SportsPage,
});

function StoryCard({ article }: { article: SportsListItem }) {
  return (
    <Link to="/news/$slug" params={{ slug: article.slug }} className="group block overflow-hidden rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
      <img src={resolveArticleImage(article)} alt={article.image_alt_text || article.title} loading="lazy" className="h-40 w-full object-cover" />
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{article.category}</p>
        <h3 className="mt-2 font-sans text-lg font-semibold leading-snug group-hover:text-primary">{article.title}</h3>
        {article.dek && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{article.dek}</p>}
      </div>
    </Link>
  );
}

function SportsPage() {
  const { items } = Route.useLoaderData();
  const pro = TEAMS.filter((team) => team.kind === "pro");
  const college = TEAMS.filter((team) => team.kind === "college");

  return (
    <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 sm:py-14">
      <header className="border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Keep TX Red Sports</p>
        <h1 className="mt-3 max-w-4xl font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Texas Sports News, Teams &amp; the Business of the Game</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Follow every major Texas pro team and leading college program, plus recruiting, NIL, motorsports, stadium finance, sports betting legislation and the policy decisions shaping competition in Texas.
        </p>
      </header>

      <section className="py-10" aria-labelledby="sports-desks-heading">
        <h2 id="sports-desks-heading" className="text-2xl font-semibold tracking-tight">Texas sports desks</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DESKS.map((desk) => desk.league ? (
            <Link key={desk.title} to="/texas-sports/$league" params={{ league: desk.league }} className="rounded-lg border border-border bg-card p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold">{desk.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desk.description}</p>
            </Link>
          ) : (
            <div key={desk.title} className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold">{desk.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desk.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-10" aria-labelledby="latest-sports-heading">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Newsroom</p><h2 id="latest-sports-heading" className="mt-1 text-2xl font-semibold tracking-tight">Latest Texas Sports</h2></div>
          <Link to="/news" className="text-sm font-medium text-primary hover:underline">All Texas news →</Link>
        </div>
        {items.length ? <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.slice(0, 6).map((article) => <StoryCard key={article.slug} article={article} />)}</div> : <p className="mt-5 rounded-lg border border-dashed p-6 text-sm text-muted-foreground">Fresh Texas sports coverage will appear here as it publishes.</p>}
      </section>

      <section className="border-t border-border py-10" aria-labelledby="pro-teams-heading">
        <h2 id="pro-teams-heading" className="text-2xl font-semibold tracking-tight">Texas professional teams</h2>
        <p className="mt-2 text-sm text-muted-foreground">Dedicated team pages collect current reporting and cross-post stories that involve more than one Texas franchise.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pro.map((team) => <Link key={team.slug} to="/texas-sports/team/$team" params={{ team: team.slug }} className="rounded-md border border-border bg-card p-4 hover:border-primary/50"><p className="text-xs uppercase tracking-wider text-muted-foreground">{LEAGUE_META[team.league].name} · {team.city}</p><h3 className="mt-1 font-semibold">{team.name}</h3></Link>)}
        </div>
      </section>

      <section className="border-t border-border py-10" aria-labelledby="college-heading">
        <div className="flex items-end justify-between"><div><h2 id="college-heading" className="text-2xl font-semibold tracking-tight">Texas college sports</h2><p className="mt-2 text-sm text-muted-foreground">Major programs, football, recruiting, NIL, conference moves and athletic business.</p></div><Link to="/texas-sports/$league" params={{ league: "cfb" }} className="hidden sm:inline text-sm text-primary hover:underline">College overview →</Link></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{college.map((team) => <Link key={team.slug} to="/texas-sports/team/$team" params={{ team: team.slug }} className="rounded-md border border-border bg-card p-4 hover:border-primary/50"><p className="text-xs uppercase tracking-wider text-muted-foreground">{team.conference || "College"} · {team.city}</p><h3 className="mt-1 font-semibold">{team.name}</h3></Link>)}</div>
      </section>

      <section className="border-t border-border py-10" aria-labelledby="leagues-heading">
        <h2 id="leagues-heading" className="text-2xl font-semibold tracking-tight">Browse by league</h2>
        <div className="mt-5 flex flex-wrap gap-3">{LEAGUES.map((league) => <Link key={league} to="/texas-sports/$league" params={{ league }} className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted">{LEAGUE_META[league].name}</Link>)}</div>
      </section>

      <section className="border-t border-border py-10">
        <h2 className="text-2xl font-semibold tracking-tight">Where sports meets Texas policy</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">KTR Sports goes beyond scores: NIL and athlete compensation, sports betting law, taxpayer-backed stadium deals, major-event economics, university athletic spending and state or local government decisions that affect Texas teams and fans.</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm"><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link><Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link><Link to="/news" className="text-primary hover:underline">Latest News →</Link></div>
      </section>
    </main>
  );
}
