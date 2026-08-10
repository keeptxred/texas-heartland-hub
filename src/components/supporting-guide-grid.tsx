import { Link } from "@tanstack/react-router";
import { supportingGuidesForPillar } from "@/data/all-guides";

export function SupportingGuideGrid({ pillarHref }: { pillarHref: string }) {
  const guides = supportingGuidesForPillar(pillarHref);
  if (guides.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 border-t-2 border-foreground/10">
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Evergreen Library</span>
      <h2 className="font-display text-3xl md:text-4xl tracking-tight mt-2">Explore this pillar</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Plain-English guides that explain the agencies, laws, programs, institutions, and recurring issues behind the daily headlines.
      </p>
      <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            to="/guides/$slug"
            params={{ slug: guide.slug }}
            className="group border-2 border-foreground/10 bg-card p-5 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Pillar Guide</span>
            <h3 className="mt-2 font-display text-xl tracking-tight group-hover:underline underline-offset-4">{guide.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-3">{guide.dek}</p>
            <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">Read guide →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
