import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { listSportsByLeague, type SportsListItem } from "@/lib/sports.functions";
import { assignUniqueImages } from "@/lib/dedupe-images";

const LEAGUE_META: Record<string, { name: string; title: string; desc: string; teams: string }> = {
  nfl: {
    name: "NFL",
    title: "Texas NFL News – Houston Texans & Dallas Cowboys",
    desc: "Houston Texans and Dallas Cowboys weekly coverage — game recaps, injury reports, draft outlook, and the storylines shaping the Texas NFL season.",
    teams: "Houston Texans and Dallas Cowboys",
  },
  mlb: {
    name: "MLB",
    title: "Texas MLB News – Houston Astros & Texas Rangers",
    desc: "Houston Astros and Texas Rangers coverage — series recaps, lineup moves, trade-deadline updates, and the storylines driving the Texas baseball season.",
    teams: "Houston Astros and Texas Rangers",
  },
  nba: {
    name: "NBA",
    title: "Texas NBA News – Spurs, Rockets & Mavericks",
    desc: "San Antonio Spurs, Houston Rockets, and Dallas Mavericks coverage — game recaps, roster news, and the storylines shaping the Texas NBA season.",
    teams: "San Antonio Spurs, Houston Rockets, and Dallas Mavericks",
  },
};

export const Route = createFileRoute("/texas-sports/$league")({
  loader: async ({ params }) => {
    const league = params.league.toLowerCase();
    if (!LEAGUE_META[league]) throw notFound();
    const { items } = await listSportsByLeague({ data: { league: league as "nfl" | "mlb" | "nba" } });
    return { league, items };
  },
  head: ({ loaderData }) => {
    const meta = loaderData ? LEAGUE_META[loaderData.league] : null;
    if (!meta) return {};
    const url = `https://www.keeptxred.com/texas-sports/${loaderData!.league}`;
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.desc },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: LeaguePage,
});

function LeaguePage() {
  const { league, items } = Route.useLoaderData();
  const meta = LEAGUE_META[league];
  const uniqImg = assignUniqueImages<SportsListItem>(
    items,
    (a) => a.slug,
    (a) => a.image_url,
    undefined,
    (a) => a.image_hash,
  );
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/texas-sports" className="hover:underline">Texas Sports</Link>
        <span className="mx-2">/</span>
        <span>{meta.name}</span>
      </nav>
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Texas Sports · {meta.name}</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">{meta.title}</h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Coverage of the {meta.teams}. Updated weekly with recaps, roster moves, and the stories shaping the {meta.name} in Texas.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="border border-border rounded-md p-8 bg-card text-center">
          <p className="text-base text-foreground font-medium">Fresh {meta.name} coverage is on the way.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Our weekly Texas sports update publishes every Monday morning. Check back soon, or browse other Texas coverage below.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((a: SportsListItem) => (
            <Link
              key={a.slug}
              to="/news/$slug"
              params={{ slug: a.slug }}
              className="group block border border-border rounded-md overflow-hidden bg-card hover:shadow-md transition-shadow"
            >
              <img src={uniqImg.get(a.slug) ?? a.image_url ?? ""} alt={a.title} loading="lazy" className="w-full h-44 object-cover" />
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.category}</span>
                <h2 className="mt-2 font-sans text-lg font-semibold text-foreground group-hover:text-primary leading-snug">
                  {a.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{a.dek}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Date(a.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">More Texas sports</h2>
        <ul className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
          {(["nfl", "mlb", "nba"] as const).filter((l) => l !== league).map((l) => (
            <li key={l}>
              <Link to="/texas-sports/$league" params={{ league: l }} className="text-primary hover:underline">
                {LEAGUE_META[l].name} →
              </Link>
            </li>
          ))}
          <li><Link to="/texas-sports" className="text-primary hover:underline">All Texas Sports →</Link></li>
        </ul>
      </section>
    </div>
  );
}