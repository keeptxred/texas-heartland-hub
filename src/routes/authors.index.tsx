import { createFileRoute, Link } from "@tanstack/react-router";
import { AUTHORS } from "@/data/authors";

export const Route = createFileRoute("/authors/")({
  head: () => ({
    meta: [
      { title: "Authors & Desks — Keep TX Red" },
      { name: "description", content: "Meet the Keep TX Red newsroom — our desks and bureaus covering Texas politics, energy, the border, elections, education, and taxpayers." },
      { property: "og:title", content: "Authors & Desks — Keep TX Red" },
      { property: "og:description", content: "Meet the Keep TX Red newsroom — our desks and bureaus covering Texas politics, energy, the border, elections, education, and taxpayers." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.keeptxred.com/authors" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/authors" }],
  }),
  component: AuthorsIndex,
});

function AuthorsIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
        <Link to="/news" className="hover:text-primary">Newsroom</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Authors</span>
      </nav>
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Keep TX Red</span>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-2">Authors &amp; Desks</h1>
      <p className="mt-3 font-serif italic text-muted-foreground max-w-2xl">
        Keep TX Red is organized around subject-matter desks and bureaus. Each byline below represents a team of reporters and editors covering a specific Texas beat.
      </p>

      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {AUTHORS.map((a) => (
          <li key={a.slug} className="border border-border p-5">
            <Link to="/authors/$slug" params={{ slug: a.slug }} className="group block">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">{a.role}</span>
              <h2 className="font-display text-2xl tracking-tight mt-1 group-hover:underline underline-offset-4">{a.name}</h2>
              <p className="font-serif text-sm text-muted-foreground mt-2 line-clamp-3">{a.bio[0]}</p>
              {a.beats.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.beats.slice(0, 4).map((b) => (
                    <span key={b} className="text-[10px] border border-border px-2 py-0.5">{b}</span>
                  ))}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}