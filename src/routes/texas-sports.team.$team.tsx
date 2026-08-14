import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { listSportsByTeam, type SportsListItem } from "@/lib/sports.functions";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { TEAM_BY_SLUG, canonicalTeamSlug, LEAGUE_META, teamsForLeague, type TeamMeta } from "@/lib/texas-teams";
import { resolveArticleImage } from "@/lib/seo-headline";
import { MIN_ARTICLES_DEFAULT, isReadyFromItems } from "@/lib/content-readiness";
import { SportsCoveragePlaceholder } from "@/components/sports-coverage-placeholder";

export const Route = createFileRoute("/texas-sports/team/$team")({
  loader: async ({ params }) => {
    const requestedSlug = params.team.toLowerCase();
    const slug = canonicalTeamSlug(requestedSlug);
    if (!slug) throw notFound();
    if (slug !== requestedSlug) throw redirect({ to: "/texas-sports/team/$team", params: { team: slug }, statusCode: 301 });
    const { items } = await listSportsByTeam({ data: { team: slug } });
    return { team: TEAM_BY_SLUG[slug], items };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Team not found" }, { name: "robots", content: "noindex" }] };
    const team = loaderData.team;
    const title = `${team.name} News, Analysis & Texas Sports Coverage`;
    const desc = `${team.name} news, roster moves, analysis and Texas-focused coverage, plus related league and sports-business stories.`;
    const url = `https://keeptxred.com/texas-sports/team/${team.slug}`;
    const thin = !isReadyFromItems(loaderData.items, MIN_ARTICLES_DEFAULT);
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title }, { property: "og:description", content: desc },
        { property: "og:url", content: url }, { property: "og:type", content: "website" },
        ...(thin ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "SportsTeam", name: team.name, sport: LEAGUE_META[team.league].name, location: { "@type": "Place", name: `${team.city}, Texas` }, url }) },
        { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Texas Sports", item: "https://keeptxred.com/texas-sports" }, { "@type": "ListItem", position: 2, name: LEAGUE_META[team.league].name, item: `https://keeptxred.com/texas-sports/${team.league}` }, { "@type": "ListItem", position: 3, name: team.name, item: url } ] }) },
      ],
    };
  },
  component: TeamPage,
  errorComponent: () => <div className="p-8">Something went wrong loading this team.</div>,
  notFoundComponent: () => <div className="p-8">Team not found.</div>,
});

function TeamPage() {
  const { team, items } = Route.useLoaderData() as { team: TeamMeta; items: SportsListItem[] };
  const league = LEAGUE_META[team.league];
  const uniqImg = assignUniqueImages(items, (article) => article.slug, (article) => resolveArticleImage(article), undefined, (article) => article.image_hash);
  const siblings = teamsForLeague(team.league).filter((other) => other.slug !== team.slug);

  return <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 sm:py-14">
    <nav className="mb-4 text-xs text-muted-foreground"><Link to="/texas-sports" className="hover:underline">Texas Sports</Link><span className="mx-2">/</span><Link to="/texas-sports/$league" params={{ league: team.league }} className="hover:underline">{league.name}</Link><span className="mx-2">/</span><span>{team.short}</span></nav>
    <header className="border-b border-border pb-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{league.name} · {team.city}{team.conference ? ` · ${team.conference}` : ""}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{team.name} News</h1><p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">Latest {team.short} reporting, roster moves, season storylines and the Texas business or policy issues connected to the program.</p></header>

    <section className="py-10">{items.length === 0 ? <SportsCoveragePlaceholder label={team.name} /> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((article) => <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }} className="group overflow-hidden rounded-lg border border-border bg-card hover:shadow-md transition-shadow"><img src={uniqImg.get(article.slug) ?? resolveArticleImage(article)} alt={article.image_alt_text || article.title} loading="lazy" className="h-44 w-full object-cover"/><div className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{article.category}</p><h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-primary">{article.title}</h2>{article.dek && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.dek}</p>}<p className="mt-3 text-xs text-muted-foreground">{new Date(article.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div></Link>)}</div>}</section>

    <section className="border-t border-border pt-8"><h2 className="text-2xl font-semibold">More {league.name} coverage</h2><div className="mt-4 flex flex-wrap gap-4 text-sm">{siblings.map((sibling) => <Link key={sibling.slug} to="/texas-sports/team/$team" params={{ team: sibling.slug }} className="text-primary hover:underline">{sibling.name} →</Link>)}<Link to="/texas-sports/$league" params={{ league: team.league }} className="text-primary hover:underline">{league.name} overview →</Link><Link to="/texas-sports" className="text-primary hover:underline">All Texas Sports →</Link></div></section>
  </main>;
}
