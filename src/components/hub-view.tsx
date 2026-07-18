import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { Hub } from "@/data/hubs";
import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { matchesTopic } from "@/lib/article-filters";

export type HubSection = { title: string; description: string; href?: string };

export function HubView({ hub, sections, children, filterTopic }: { hub: Hub; sections?: HubSection[]; children?: ReactNode; filterTopic?: string }) {
  const articles = hub.articleSlugs
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a) && isPublished(a as Article));
  const pillar = articles.find((a) => a.slug === hub.pillarSlug);
  const supportingAll = articles.filter((a) => a.slug !== hub.pillarSlug);
  const supporting = (filterTopic ? supportingAll.filter((a) => matchesTopic(a, filterTopic)) : supportingAll).sort(sortByDateDesc);
  // Enforce per-page image uniqueness across pillar + supporting cards.
  const allForPage = pillar ? [pillar, ...supporting] : supporting;
  const uniq = assignUniqueImages(allForPage, (a) => a.slug, (a) => a.image, (a) => a.category ?? null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ {hub.eyebrow}</span>
      <h1 className="font-display text-5xl md:text-7xl tracking-tight mt-2 leading-none">{hub.title}</h1>
      <p className="mt-4 max-w-3xl font-serif text-lg text-muted-foreground">{hub.intro}</p>

      {sections && sections.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {sections.map((s) => {
            const className = "group block border-2 border-foreground/10 bg-card p-5 hover:border-primary hover:bg-primary/5 transition-colors";
            const inner = (
              <>
                <h3 className="font-display text-lg tracking-tight group-hover:text-primary">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                {s.href ? <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">Explore →</span> : null}
              </>
            );
            return s.href ? (
              <a key={s.title} href={s.href} className={className}>{inner}</a>
            ) : (
              <div key={s.title} className={className.replace("group ", "")}>{inner}</div>
            );
          })}
        </div>
      ) : null}

      {pillar ? (
        <Link to="/news/$slug" params={{ slug: pillar.slug }} className="group block mt-10 border-2 border-primary bg-primary/5 p-6 md:p-8 hover:bg-primary/10 transition-colors">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Pillar Guide</span>
          <div className="grid md:grid-cols-2 gap-6 mt-3 items-center">
            <div className="aspect-[16/10] overflow-hidden bg-muted border border-foreground/10">
              <img src={uniq.get(pillar.slug) ?? pillar.image} alt={pillar.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight leading-tight group-hover:underline underline-offset-4">{pillar.title}</h2>
              <p className="mt-3 font-serif text-base text-muted-foreground">{pillar.dek}</p>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-primary">Read the full guide →</span>
            </div>
          </div>
        </Link>
      ) : null}

      {children}

      <h2 className="font-display text-3xl tracking-tight mt-14 mb-6 border-b-2 border-foreground pb-2">All Coverage in this Section</h2>
      {supporting.length === 0 ? (
        <div className="border-2 border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No articles currently available in this topic. Browse related Texas coverage.
          </p>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {supporting.map((a) => (
          <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
            <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
              <img src={uniq.get(a.slug) ?? a.image} alt={a.title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
            <h3 className="font-serif text-base font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.dek}</p>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}