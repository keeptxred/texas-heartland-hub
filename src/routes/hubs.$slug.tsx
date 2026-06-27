import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { HUBS, type Hub } from "@/data/hubs";
import { ARTICLES, isPublished, sortByDateDesc, type Article } from "@/data/articles";

export const Route = createFileRoute("/hubs/$slug")({
  loader: ({ params }): { hub: Hub } => {
    const hub = HUBS.find((h) => h.slug === params.slug);
    if (!hub) throw notFound();
    return { hub };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { hub } = loaderData;
    return {
      meta: [
        { title: `${hub.title} — Keep TX Red` },
        { name: "description", content: hub.intro.slice(0, 200) },
        { property: "og:title", content: `${hub.title} — Keep TX Red` },
        { property: "og:description", content: hub.intro.slice(0, 200) },
      ],
      links: [{ rel: "canonical", href: `/hubs/${hub.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Section Not Found</h1>
      <Link to="/hubs" className="text-primary underline">All Sections</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Something went wrong</h1>
      <Link to="/hubs" className="text-primary underline">All Sections</Link>
    </div>
  ),
  component: HubPage,
});

function HubPage() {
  const { hub } = Route.useLoaderData() as { hub: Hub };
  const articles = hub.articleSlugs
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is Article => Boolean(a) && isPublished(a as Article));
  const pillar = articles.find((a) => a.slug === hub.pillarSlug);
  const supporting = articles.filter((a) => a.slug !== hub.pillarSlug).sort(sortByDateDesc);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/hubs" className="hover:text-primary">Sections</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{hub.title}</span>
      </nav>
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ {hub.eyebrow}</span>
      <h1 className="font-display text-5xl md:text-7xl tracking-tight mt-2 leading-none">{hub.title}</h1>
      <p className="mt-4 max-w-3xl font-serif text-lg text-muted-foreground">{hub.intro}</p>

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

      <h2 className="font-display text-3xl tracking-tight mt-14 mb-6 border-b-2 border-foreground pb-2">All Coverage in this Section</h2>
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