import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { listSportsByTeam, type SportsListItem } from "@/lib/sports.functions";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { TEAM_BY_SLUG, isTeamSlug, LEAGUE_META, teamsForLeague, type TeamMeta } from "@/lib/texas-teams";
import { resolveArticleImage } from "@/lib/seo-headline";
import { MIN_ARTICLES_DEFAULT, isReadyFromItems } from "@/lib/content-readiness";
import { SportsCoveragePlaceholder } from "@/components/sports-coverage-placeholder";

export const Route = createFileRoute("/texas-sports/team/$team")({
  loader: async ({ params }) => {
    const slug = params.team.toLowerCase();
    if (!isTeamSlug(slug)) throw notFound();
    const { items } = await listSportsByTeam({ data: { team: slug } });
    return { team: TEAM_BY_SLUG[slug], items };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Team not found" }, { name: "robots", content: "noindex" }] };
    const t = loaderData.team;
    const title = `${t.name} News – Texas Sports Coverage`;
    const desc = `${t.name} weekly coverage — recaps, roster moves, and storylines shaping the ${t.short} season, from a Texas fan perspective.`;
    const url = `https://www.keeptxred.com/texas-sports/team/${t.slug}`;
    const thin = !isReadyFromItems(loaderData.items, MIN_ARTICLES_DEFAULT);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        ...(thin ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: TeamPage,
  errorComponent: () => <div className="p-8">Something went wrong loading this team.</div>,
  notFoundComponent: () => <div className="p-8">Team not found.</div>,
});

function TeamPage() {
  const { team, items } = Route.useLoaderData() as { team: TeamMeta; items: SportsListItem[] };
  const league = LEAGUE_META[team.league];
  const uniqImg = assignUniqueImages<SportsListItem>(
    items,
    (a) => a.slug,
    (a) => resolveArticleImage(a),
    undefined,
    (a) => a.image_hash,
  );
  const siblings = teamsForLeague(team.league).filter((t) => t.slug !== team.slug);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/texas-sports" className="hover:underline">Texas Sports</Link>
        <span className="mx-2">/</span>
        <Link
          to="/texas-sports/$league"
          params={{ league: team.league === "cfb" ? "nfl" : team.league }}
          className="hover:underline"
        >
          {league.name}
        </Link>
        <span className="mx-2">/</span>
        <span>{team.short}</span>
      </nav>

      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{league.name} · {team.city}</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">{team.name}</h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Weekly {team.short} coverage — recaps, roster moves, and the storylines shaping the season for {team.city} fans.
        </p>
      </header>

      {items.length === 0 ? (
        <SportsCoveragePlaceholder label={team.name} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((a: SportsListItem) => (
            <Link
              key={a.slug}
              to="/news/$slug"
              params={{ slug: a.slug }}
              className="group block border border-border rounded-md overflow-hidden bg-card hover:shadow-md transition-shadow"
            >
              <img src={uniqImg.get(a.slug) ?? resolveArticleImage(a)} alt={a.title} loading="lazy" className="w-full h-44 object-cover" />
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.category}</span>
                <h2 className="mt-2 font-sans text-lg font-semibold text-foreground group-hover:text-primary leading-snug">{a.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{a.dek}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(a.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {siblings.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">Other {league.name} teams in Texas</h2>
          <ul className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link to="/texas-sports/team/$team" params={{ team: s.slug }} className="text-primary hover:underline">
                  {s.name} →
                </Link>
              </li>
            ))}
            <li><Link to="/texas-sports" className="text-primary hover:underline">All Texas Sports →</Link></li>
          </ul>
        </section>
      )}
    </div>
  );
}