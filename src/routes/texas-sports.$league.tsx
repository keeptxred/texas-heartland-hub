import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { listSportsByLeague, SPORTS_LEAGUES, type SportsListItem } from "@/lib/sports.functions";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { teamsForLeague, detectTeams, type LeagueSlug } from "@/lib/texas-teams";
import { resolveArticleImage } from "@/lib/seo-headline";
import { MIN_ARTICLES_DEFAULT, isReadyFromItems } from "@/lib/content-readiness";
import { SportsCoveragePlaceholder } from "@/components/sports-coverage-placeholder";

const META: Record<LeagueSlug, { name: string; title: string; desc: string }> = {
  nfl: { name: "NFL", title: "Texas NFL News — Cowboys & Texans", desc: "Dallas Cowboys and Houston Texans news, roster moves, injuries, draft coverage and the biggest NFL stories affecting Texas fans." },
  mlb: { name: "MLB", title: "Texas MLB News — Astros & Rangers", desc: "Houston Astros and Texas Rangers news, roster moves, prospects, the Lone Star Series and postseason coverage." },
  nba: { name: "NBA", title: "Texas NBA News — Spurs, Rockets & Mavericks", desc: "San Antonio Spurs, Houston Rockets and Dallas Mavericks news, roster moves and the Texas NBA storylines that matter." },
  nhl: { name: "NHL", title: "Dallas Stars & Texas Hockey News", desc: "Dallas Stars news and the major hockey stories that matter to Texas fans." },
  mls: { name: "MLS", title: "Texas MLS News — Austin FC, FC Dallas & Houston Dynamo", desc: "Austin FC, FC Dallas and Houston Dynamo news, rivalry coverage and the business of soccer in Texas." },
  nwsl: { name: "NWSL", title: "Houston Dash & Texas Women's Soccer News", desc: "Houston Dash coverage and women's professional soccer news with a Texas focus." },
  wnba: { name: "WNBA", title: "Dallas Wings & Texas Women's Basketball News", desc: "Dallas Wings coverage and WNBA stories with a Texas focus." },
  cfb: { name: "College Sports", title: "Texas College Sports — Football, Recruiting & NIL", desc: "Longhorns, Aggies, Big 12 and other major Texas programs, with college football, recruiting, NIL and conference-business coverage." },
};

function isLeague(value: string): value is LeagueSlug {
  return (SPORTS_LEAGUES as readonly string[]).includes(value);
}

export const Route = createFileRoute("/texas-sports/$league")({
  loader: async ({ params }) => {
    const league = params.league.toLowerCase();
    if (!isLeague(league)) throw notFound();
    const { items } = await listSportsByLeague({ data: { league } });
    return { league, items };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const meta = META[loaderData.league];
    const url = `https://keeptxred.com/texas-sports/${loaderData.league}`;
    const thin = !isReadyFromItems(loaderData.items, MIN_ARTICLES_DEFAULT);
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.desc },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        ...(thin ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: meta.title, url, isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: "https://keeptxred.com" } }) }],
    };
  },
  component: LeaguePage,
});

function ArticleCard({ article, image }: { article: SportsListItem; image: string }) {
  return <Link to="/news/$slug" params={{ slug: article.slug }} className="group block overflow-hidden rounded-lg border border-border bg-card hover:shadow-md transition-shadow"><img src={image} alt={article.image_alt_text || article.title} loading="lazy" className="h-44 w-full object-cover"/><div className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{article.category}</p><h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-primary">{article.title}</h3>{article.dek && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.dek}</p>}</div></Link>;
}

function LeaguePage() {
  const { league, items } = Route.useLoaderData();
  const meta = META[league];
  const teams = teamsForLeague(league);
  const uniqImg = assignUniqueImages(items, (article) => article.slug, (article) => resolveArticleImage(article), undefined, (article) => article.image_hash);
  const grouped = new Map(teams.map((team) => [team.slug, [] as SportsListItem[]]));
  const more: SportsListItem[] = [];
  for (const article of items) {
    const tags = article.teams?.length ? article.teams : detectTeams(`${article.title} ${article.dek}`);
    const matches = tags.filter((tag) => grouped.has(tag));
    if (!matches.length) more.push(article); else matches.forEach((tag) => grouped.get(tag)!.push(article));
  }

  return <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 sm:py-14">
    <nav className="mb-4 text-xs text-muted-foreground"><Link to="/texas-sports" className="hover:underline">Texas Sports</Link><span className="mx-2">/</span><span>{meta.name}</span></nav>
    <header className="border-b border-border pb-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Texas Sports · {meta.name}</p><h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{meta.title}</h1><p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{meta.desc}</p></header>

    <section className="py-8"><h2 className="text-xl font-semibold">Teams & programs</h2><div className="mt-4 flex flex-wrap gap-3">{teams.map((team) => <Link key={team.slug} to="/texas-sports/team/$team" params={{ team: team.slug }} className="rounded-full border px-4 py-2 text-sm hover:bg-muted">{team.name}</Link>)}</div></section>

    {items.length === 0 ? <SportsCoveragePlaceholder label={`Texas ${meta.name}`} /> : <div className="space-y-12 border-t border-border pt-10">
      {teams.map((team) => { const rows = grouped.get(team.slug) ?? []; return <section key={team.slug}><div className="flex items-end justify-between border-b pb-3"><h2 className="text-2xl font-semibold">{team.name}</h2><Link to="/texas-sports/team/$team" params={{ team: team.slug }} className="text-sm text-primary hover:underline">All {team.short} coverage →</Link></div>{rows.length ? <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{rows.slice(0,6).map((article) => <ArticleCard key={`${team.slug}-${article.slug}`} article={article} image={uniqImg.get(article.slug) ?? resolveArticleImage(article)} />)}</div> : <p className="mt-4 text-sm text-muted-foreground">No recent {team.short} stories have cleared publication gates yet.</p>}</section>; })}
      {more.length > 0 && <section><h2 className="border-b pb-3 text-2xl font-semibold">More {meta.name} coverage</h2><div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{more.slice(0,9).map((article) => <ArticleCard key={article.slug} article={article} image={uniqImg.get(article.slug) ?? resolveArticleImage(article)} />)}</div></section>}
    </div>}

    <section className="mt-14 border-t pt-8"><h2 className="text-xl font-semibold">More Texas sports</h2><div className="mt-4 flex flex-wrap gap-3">{SPORTS_LEAGUES.filter((other) => other !== league).map((other) => <Link key={other} to="/texas-sports/$league" params={{ league: other }} className="text-sm text-primary hover:underline">{META[other].name} →</Link>)}</div></section>
  </main>;
}
