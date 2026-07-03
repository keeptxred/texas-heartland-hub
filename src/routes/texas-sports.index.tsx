import { createFileRoute, Link } from "@tanstack/react-router";
import { TEAMS, LEAGUE_META, type LeagueSlug } from "@/lib/texas-teams";

export const Route = createFileRoute("/texas-sports/")({
  head: () => ({
    meta: [
      { title: "Texas Sports – Texans, Cowboys, Astros & Rangers News" },
      { name: "description", content: "Texas sports news covering the Houston Texans, Dallas Cowboys, Houston Astros, Texas Rangers, Spurs, and Mavericks — game updates, recaps, and storylines that matter." },
      { property: "og:title", content: "Texas Sports – Texans, Cowboys, Astros & Rangers News" },
      { property: "og:description", content: "Texas sports news covering the Texans, Cowboys, Astros, Rangers, Spurs, and Mavericks." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-sports" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-sports" }],
  }),
  component: SportsPage,
});

function SportsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const leagues: LeagueSlug[] = ["nfl", "mlb", "nba", "cfb"];
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Texas Sports</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
          Texas Sports News &amp; Game Coverage
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Every Texas team gets its own section. Pro football, baseball, basketball, and college football — recaps, roster moves, and the storylines Texas fans actually care about. Articles that touch more than one team are cross-posted so nothing gets missed.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <div className="space-y-12">
        {leagues.map((lg) => {
          const teamsInLeague = TEAMS.filter((t) => t.league === lg);
          const leagueLinkable = lg !== "cfb"; // no aggregate league page for college yet
          return (
            <section key={lg}>
              <div className="flex items-baseline justify-between border-b border-border pb-3 mb-6">
                <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">{LEAGUE_META[lg].long}</h2>
                {leagueLinkable && (
                  <Link
                    to="/texas-sports/$league"
                    params={{ league: lg as "nfl" | "mlb" | "nba" }}
                    className="text-sm text-primary hover:underline shrink-0"
                  >
                    League overview →
                  </Link>
                )}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamsInLeague.map((t) => (
                  <Link
                    key={t.slug}
                    to="/texas-sports/team/$team"
                    params={{ team: t.slug }}
                    className="group block border border-border rounded-md p-5 bg-card hover:shadow-md transition-shadow"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.city}</span>
                    <h3 className="mt-1 font-sans text-lg font-semibold text-foreground group-hover:text-primary">{t.name}</h3>
                    <p className="mt-3 text-xs font-medium text-primary">Latest {t.short} coverage →</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">Related coverage</h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <li><Link to="/texas-news" className="text-primary hover:underline">Texas News →</Link></li>
          <li><Link to="/houston" className="text-primary hover:underline">Houston News →</Link></li>
          <li><Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link></li>
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
        </ul>
      </section>
    </div>
  );
}