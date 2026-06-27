import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";

export const Route = createFileRoute("/texas-news")({
  head: () => ({
    meta: [
      { title: "Texas News – Breaking News & Statewide Updates" },
      { name: "description", content: "Breaking Texas news and statewide updates on politics, the economy, energy, education, and the stories shaping life in the Lone Star State." },
      { property: "og:title", content: "Texas News – Breaking News & Statewide Updates" },
      { property: "og:description", content: "Breaking Texas news and statewide updates from across the Lone Star State." },
      { property: "og:url", content: "https://www.keeptxred.com/texas-news" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/texas-news" }],
  }),
  component: TexasNewsPage,
});

function TexasNewsPage() {
  const articles = ARTICLES.filter(isPublished).sort(sortByDateDesc);
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Texas News</span>
        <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
          Texas News &amp; Statewide Updates
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
          Independent reporting on breaking Texas news — politics in Austin, energy and the economy, border security, and the policy fights shaping daily life across the state. Updated every morning.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {articles.map((a) => (
          <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
            <div className="aspect-[16/10] overflow-hidden bg-muted mb-4 rounded-md">
              <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.category}</span>
            <h2 className="font-sans text-base font-semibold mt-1.5 leading-snug text-foreground group-hover:text-primary transition-colors">{a.title}</h2>
            {a.dek && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{a.dek}</p>}
            <p className="mt-2 text-xs text-muted-foreground">{a.author} • {a.date}</p>
          </Link>
        ))}
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">More from Keep Texas Red</h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
          <li><Link to="/houston" className="text-primary hover:underline">Houston News →</Link></li>
          <li><Link to="/texas-sports" className="text-primary hover:underline">Texas Sports →</Link></li>
          <li><Link to="/texas-business" className="text-primary hover:underline">Texas Business →</Link></li>
          <li><Link to="/elections" className="text-primary hover:underline">Elections →</Link></li>
          <li><Link to="/tax-calculator" className="text-primary hover:underline">Property Tax Calculator →</Link></li>
        </ul>
      </section>
    </div>
  );
}