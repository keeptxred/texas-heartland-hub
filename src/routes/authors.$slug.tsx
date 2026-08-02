import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AUTHORS, authorSlug, type Author } from "@/data/authors";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import {
  buildSeo,
  ORGANIZATION_ID,
  personJsonLd,
  SITE_URL,
  WEBSITE_ID,
} from "@/lib/seo";

export function isIndexableAuthor(author: Author | null | undefined): author is Author {
  if (!author) return false;
  const biography = author.bio.join(" ").trim();
  return Boolean(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(author.slug) &&
      author.name.trim().length >= 3 &&
      author.role.trim().length >= 3 &&
      biography.length >= 100 &&
      author.beats.length > 0 &&
      author.beats.every((beat) => beat.trim().length >= 3),
  );
}

export const Route = createFileRoute("/authors/$slug")({
  loader: ({ params }): { author: Author } => {
    const author = AUTHORS.find((candidate) => candidate.slug === params.slug);
    if (!isIndexableAuthor(author)) throw notFound();
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
    const path = `/authors/${author.slug}`;
    const url = `${SITE_URL}${path}`;
    const description = `${author.name} covers ${author.beats.join(", ")} for Keep TX Red. ${author.bio[0]}`;
    const seo = buildSeo({
      title: `${author.name} | Author`,
      description,
      path,
      type: "website",
    });
    const person = {
      ...personJsonLd({
        name: author.name,
        url,
        id: `${url}#person`,
        jobTitle: author.role,
        description: author.bio.join(" "),
      }),
      "@context": undefined,
      knowsAbout: author.beats,
    };
    const profilePage = {
      "@type": "ProfilePage",
      "@id": `${url}#webpage`,
      url,
      name: `${author.name} | Keep TX Red`,
      description: seo.description,
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORGANIZATION_ID },
      mainEntity: { "@id": `${url}#person` },
      about: { "@id": `${url}#person` },
      inLanguage: "en-US",
    };

    return {
      meta: [
        ...seo.meta,
        { property: "og:type", content: "profile" },
        { property: "profile:username", content: author.slug },
      ],
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [person, profilePage],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Newsroom", item: `${SITE_URL}/news` },
              { "@type": "ListItem", position: 3, name: author.name, item: url },
            ],
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
  const byAuthor = ARTICLES.filter(
    (article) => isPublished(article) && authorSlug(article.author) === author.slug,
  ).sort(sortByDateDesc);

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
        {author.bio.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>

      <div className="mt-6">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Coverage areas</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {author.beats.map((beat) => (
            <span key={beat} className="text-xs border border-border px-2 py-1">{beat}</span>
          ))}
        </div>
      </div>

      <section className="mt-12 pt-6 border-t-2 border-foreground">
        <h2 className="font-display text-2xl tracking-tight mb-4">Recent Articles</h2>
        {byAuthor.length === 0 ? (
          <p className="text-muted-foreground">No published articles yet.</p>
        ) : (
          <ul className="space-y-5">
            {byAuthor.map((article) => (
              <li key={article.slug}>
                <Link to="/news/$slug" params={{ slug: article.slug }} className="group block">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{article.category}</span>
                  <h3 className="font-serif text-lg font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.dek}</p>
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
