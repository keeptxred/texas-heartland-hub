import { useLocation } from "@tanstack/react-router";
import { getTexasDefinedLinks } from "@/lib/texas-defined-crosslinks";

export function TexasDefinedCrosslinks() {
  const location = useLocation();
  const links = getTexasDefinedLinks(location.pathname);

  if (links.length === 0) return null;

  return (
    <aside className="mx-auto mt-14 max-w-4xl px-4 sm:px-6" aria-label="More Texas from TexasDefined">
      <div className="border-y border-border bg-muted/30 px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">More Texas</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">Explore with TexasDefined</h2>
          </div>
          <p className="max-w-md text-xs leading-5 text-muted-foreground">
            Independent, nonpolitical Texas guides and reference pages related to this story.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border bg-background p-4 transition-colors hover:border-primary/60"
            >
              <strong className="block font-serif text-base leading-6 group-hover:text-primary">{link.label} ↗</strong>
              <span className="mt-2 block text-xs leading-5 text-muted-foreground">{link.description}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
