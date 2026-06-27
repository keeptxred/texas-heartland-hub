import { createFileRoute, Link } from "@tanstack/react-router";

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
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Texas Sports</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
          Texas Sports News &amp; Game Coverage
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Houston sports news and statewide coverage — the Houston Texans, Dallas Cowboys, Houston Astros, Texas Rangers, San Antonio Spurs, and Dallas Mavericks. Game recaps, season storylines, and the front-office moves shaping Texas franchises.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { league: "nfl" as const, name: "NFL – Texans & Cowboys", desc: "Houston Texans and Dallas Cowboys weekly updates, draft coverage, and playoff outlook." },
          { league: "mlb" as const, name: "MLB – Astros & Rangers", desc: "Houston Astros and Texas Rangers season tracking, trade-deadline moves, and postseason analysis." },
          { league: "nba" as const, name: "NBA – Spurs, Rockets & Mavericks", desc: "San Antonio Spurs, Houston Rockets, and Dallas Mavericks roster news and game recaps." },
        ].map((c) => (
          <Link
            key={c.league}
            to="/texas-sports/$league"
            params={{ league: c.league }}
            className="group block border border-border rounded-md p-6 bg-card hover:shadow-md transition-shadow"
          >
            <h2 className="font-sans text-lg font-semibold text-foreground group-hover:text-primary">{c.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            <p className="mt-4 text-xs font-medium text-primary">Read the latest →</p>
          </Link>
        ))}
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