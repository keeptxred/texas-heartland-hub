import { Link } from "@tanstack/react-router";
import type { Hub } from "@/data/hubs";
import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";

export function HubView({ hub, sections }: { hub: Hub; sections?: { title: string; description: string }[] }) {
  const articles = hub.articleSlugs
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a) && isPublished(a as Article));
  const pillar = articles.find((a) => a.slug === hub.pillarSlug);
  const supporting = articles.filter((a) => a.slug !== hub.pillarSlug).sort(sortByDateDesc);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ {hub.eyebrow}</span>
      <h1 className="font-display text-5xl md:text-7xl tracking-tight mt-2 leading-none">{hub.title}</h1>
      <p className="mt-4 max-w-3xl font-serif text-lg text-muted-foreground">{hub.intro}</p>

      {sections && sections.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {sections.map((s) => (
            <div key={s.title} className="border-2 border-foreground/10 bg-card p-5">
              <h3 className="font-display text-lg tracking-tight">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      ) : null}

      {pillar ? (
        <Link to="/news/$slug" params={{ slug: pillar.slug }} className="group block mt-10 border-2 border-primary bg-primary/5 p-6 md:p-8 hover:bg-primary/10 transition-colors">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Pillar Guide</span>
          <div className="grid md:grid-cols-2 gap-6 mt-3 items-center">
            <div className="aspect-[16/10] overflow-hidden bg-muted border border-foreground/10">
              <img src={pillar.image} alt={pillar.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight leading-tight group-hover:underline underline-offset-4">{pillar.title}</h2>
              <p className="mt-3 font-serif text-base text-muted-foreground">{pillar.dek}</p>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Read the full guide →</span>
            </div>
          </div>
        </Link>
      ) : null}

      <h2 className="font-display text-3xl tracking-tight mt-14 mb-6 border-b-2 border-foreground pb-2">All Coverage in this Hub</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {supporting.map((a) => (
          <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
            <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
              <img src={a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
            <h3 className="font-serif text-base font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}