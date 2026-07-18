import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AUTHORS, authorSlug, type Author } from "@/data/authors";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/authors/$slug")({
  loader: ({ params }): { author: Author } => {
    const author = AUTHORS.find((a) => a.slug === params.slug);
    if (!author) throw notFound();
    return { author };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Author not found — Keep TX Red" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }
    const { author } = loaderData;
    const url = `${SITE_URL}/authors/${author.slug}`;
    const description = `${author.name}, ${author.role} at Keep TX Red. ${author.bio[0].slice(0, 140)}`;
    return {
      meta: [
        { title: `${author.name} — Keep TX Red` },
        { name: "description", content: description },
        { property: "og:title", content: `${author.name} — Keep TX Red` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "profile" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: author.name,
              jobTitle: author.role,
              description: author.bio.join(" "),
              knowsAbout: author.beats,
              url,
              worksFor: {
                "@type": "NewsMediaOrganization",
                name: "Keep TX Red",
                url: `${SITE_URL}/`,
              },
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Author Not Found</h1>
      <Link to="/news" className="text-primary underline">Back to the newsroom</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Something went wrong</h1>
      <Link to="/news" className="text-primary underline">Back to the newsroom</Link>
    </div>
  ),
  component: AuthorPage,
});

function AuthorPage() {
  const { author } = Route.useLoaderData() as { author: Author };
  const byAuthor = ARTICLES.filter((a) => isPublished(a) && authorSlug(a.author) === author.slug).sort(sortByDateDesc);
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Author</span>
      </nav>
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Keep TX Red</span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2">{author.name}</h1>
      <p className="mt-2 font-serif italic text-muted-foreground">{author.role}</p>

      <div className="mt-6 space-y-4 font-serif text-base leading-relaxed">
        {author.bio.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      {author.beats.length > 0 ? (
        <div className="mt-6">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Beats</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {author.beats.map((b) => (
              <span key={b} className="text-xs border border-border px-2 py-1">{b}</span>
            ))}
          </div>
        </div>
      ) : null}

      <section className="mt-12 pt-6 border-t-2 border-foreground">
        <h2 className="font-display text-2xl tracking-tight mb-4">Recent Articles</h2>
        {byAuthor.length === 0 ? (
          <p className="text-muted-foreground">No published articles yet.</p>
        ) : (
          <ul className="space-y-5">
            {byAuthor.map((a) => (
              <li key={a.slug}>
                <Link to="/news/$slug" params={{ slug: a.slug }} className="group block">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.category}</span>
                  <h3 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.dek}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-12 text-xs italic text-muted-foreground border-t border-border pt-4">
        Opinions and analysis published under this byline are editorial content and reflect the views of the author and Keep TX Red's editors — not statements of fact.
      </p>
    </div>
  );
}