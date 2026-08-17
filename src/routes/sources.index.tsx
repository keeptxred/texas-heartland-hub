import { createFileRoute, Link } from "@tanstack/react-router";
import { SOURCE_AUTHORITY_PROFILES } from "@/data/source-authority";

export const Route = createFileRoute("/sources/")({
  head: () => ({
    meta: [
      { title: "Sources & Primary Records — Keep TX Red" },
      { name: "description", content: "See how Keep TX Red classifies and uses Texas government records, official system data, reporting sources, and commentary sources in aggregated stories." },
      { property: "og:title", content: "Sources & Primary Records — Keep TX Red" },
      { property: "og:description", content: "How Keep TX Red classifies and uses the sources behind its Texas news aggregation." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://keeptxred.com/sources" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/sources" }],
  }),
  component: SourcesIndex,
});

function SourcesIndex() {
  const groups = [
    { key: "government", heading: "Primary government sources" },
    { key: "official", heading: "Official system sources" },
    { key: "news", heading: "Reporting sources" },
    { key: "analysis", heading: "News and commentary sources" },
  ] as const;

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Sources</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Source transparency</span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2">Sources &amp; Primary Records</h1>
      <p className="mt-4 max-w-3xl font-serif text-lg leading-8 text-muted-foreground">
        Keep TX Red aggregates Texas political and public-affairs coverage. We preserve source links, distinguish primary or official records from published reporting, and use multiple sources when a story cluster supports them. A source profile explains what the source is and how we use it; inclusion does not imply endorsement.
      </p>

      <div className="mt-10 border-l-4 border-primary bg-muted/40 px-5 py-4 max-w-3xl">
        <p className="font-serif leading-7">
          <strong>Our hierarchy:</strong> when an exact primary record is available in the research packet, it is labeled as primary or official evidence. Reporting sources remain linked for claims that depend on their reporting. We do not label a general agency homepage as proof of a specific claim.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {groups.map((group) => {
          const profiles = SOURCE_AUTHORITY_PROFILES.filter((profile) => profile.kind === group.key);
          if (!profiles.length) return null;
          return (
            <section key={group.key}>
              <h2 className="font-display text-3xl tracking-tight border-b border-border pb-3">{group.heading}</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {profiles.map((profile) => (
                  <Link
                    key={profile.slug}
                    to="/sources/$slug"
                    params={{ slug: profile.slug }}
                    className="group block border border-border p-5 hover:border-primary/60 transition-colors"
                  >
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{profile.label}</span>
                    <h3 className="font-display text-2xl tracking-tight mt-1 group-hover:underline underline-offset-4">{profile.name}</h3>
                    <p className="font-serif text-sm leading-6 text-muted-foreground mt-2">{profile.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-12 text-sm text-muted-foreground border-t border-border pt-5">
        Source classifications describe the role a source can play in our aggregation workflow. They are not ratings of a source's politics, ideology, accuracy, or viewpoint.
      </p>
    </main>
  );
}
