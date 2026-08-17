import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SOURCE_AUTHORITY_PROFILES } from "@/data/source-authority";

export const Route = createFileRoute("/sources/$slug")({
  loader: ({ params }) => {
    const profile = SOURCE_AUTHORITY_PROFILES.find((candidate) => candidate.slug === params.slug);
    if (!profile) throw notFound();
    return { profile };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Source not found — Keep TX Red" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }
    const { profile } = loaderData;
    const url = `https://keeptxred.com/sources/${profile.slug}`;
    return {
      meta: [
        { title: `${profile.name} Source Profile — Keep TX Red` },
        { name: "description", content: `${profile.label}. ${profile.description}` },
        { property: "og:title", content: `${profile.name} Source Profile — Keep TX Red` },
        { property: "og:description", content: profile.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${profile.name} source profile`,
            url,
            description: profile.description,
            isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: "https://keeptxred.com" },
            about: { "@type": "Organization", name: profile.name, url: profile.homepage },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Source Profile Not Found</h1>
      <Link to="/sources" className="text-primary underline">Browse source profiles</Link>
    </div>
  ),
  component: SourceProfilePage,
});

function SourceProfilePage() {
  const { profile } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <Link to="/sources" className="hover:text-primary">Sources</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{profile.name}</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ {profile.label}</span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2">{profile.name}</h1>
      <p className="mt-5 font-serif text-lg leading-8 text-muted-foreground">{profile.description}</p>

      <section className="mt-10 border-t-2 border-foreground pt-6">
        <h2 className="font-display text-2xl tracking-tight">How Keep TX Red uses this source</h2>
        <p className="mt-3 font-serif text-[17px] leading-8">{profile.usage}</p>
      </section>

      <section className="mt-9 border-t border-border pt-6">
        <h2 className="font-display text-2xl tracking-tight">Source classification</h2>
        <p className="mt-3 font-serif text-[17px] leading-8">
          <strong>{profile.label}.</strong> This classification describes the source's role in Keep TX Red's aggregation and verification workflow. It is not an endorsement or an ideological rating.
        </p>
      </section>

      <div className="mt-9 flex flex-wrap gap-3">
        <a href={profile.homepage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center border-2 border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">
          Visit official source site ↗
        </a>
        <Link to="/sources" className="inline-flex items-center border border-border px-4 py-2 text-sm font-semibold hover:border-primary">
          All source profiles
        </Link>
      </div>
    </main>
  );
}
