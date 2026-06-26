import { createFileRoute } from "@tanstack/react-router";
import { ARTICLES, ELECTION_RACES } from "@/data/articles";
import ballot from "@/assets/ballot.jpg";

export const Route = createFileRoute("/elections")({
  head: () => ({
    meta: [
      { title: "Texas Elections 2026 — Keep TX Red" },
      { name: "description", content: "Race-by-race coverage of Texas elections: U.S. Senate, Governor, Congress, statehouse, and school boards." },
      { property: "og:title", content: "Texas Elections 2026 — Keep TX Red" },
      { property: "og:description", content: "Race ratings, polls, and voter guides for every Texas election." },
      { property: "og:url", content: "/elections" },
      { property: "og:image", content: ballot },
    ],
    links: [{ rel: "canonical", href: "/elections" }],
  }),
  component: ElectionsPage,
});

function ElectionsPage() {
  const electionNews = ARTICLES.filter((a) => a.category === "Elections" || a.category === "Education");

  return (
    <>
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">★ 2026 Election Pulse</span>
          <h1 className="font-display text-6xl md:text-7xl tracking-tight mt-2 leading-none">
            EVERY RACE. <br />
            <span className="text-primary">EVERY VOTE.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/70">
            Statewide and district-by-district analysis of the Texas elections shaping the next decade. Polls, ratings, and a complete voter guide.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            <Stat value="142" label="Days to Primary" />
            <Stat value="+8.4" label="GOP Generic Ballot" />
            <Stat value="38" label="Statewide Offices" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-6">Race Ratings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <tr className="border-b border-border">
                <th className="text-left py-3">Office</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Margin</th>
                <th className="text-left py-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {ELECTION_RACES.map((r) => (
                <tr key={r.office} className="border-b border-border last:border-0">
                  <td className="py-4 font-semibold">{r.office}</td>
                  <td className="py-4 text-muted-foreground">{r.incumbent}</td>
                  <td className="py-4 font-mono font-bold text-primary">{r.margin}</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase border border-foreground px-2 py-1">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-3 mb-8">Election News</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {electionNews.map((a) => (
            <article key={a.slug} className="grid grid-cols-[140px_1fr] gap-4 group">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{a.category}</span>
                <h3 className="font-serif font-bold mt-1 leading-snug group-hover:underline underline-offset-4">{a.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-2 italic">{a.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-white/15 p-6">
      <div className="font-display text-5xl text-primary leading-none">{value}</div>
      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">{label}</div>
    </div>
  );
}