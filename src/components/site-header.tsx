import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { nextElectionHeadline } from "@/lib/election-calendar";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/texas-news", label: "Texas News" },
  { to: "/happening-now", label: "Happening Now" },
  { to: "/texas-politics", label: "Politics" },
  { to: "/moving-to-texas", label: "Moving to Texas" },
  { to: "/living-in-texas", label: "Living in Texas" },
  { to: "/shop", label: "Shop" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const electionHeadline = nextElectionHeadline();
  const fetchDaily = useServerFn(getDailyArticles);
  const { data } = useQuery({
    queryKey: ["site-header-ticker"],
    queryFn: () => fetchDaily(),
    staleTime: 5 * 60 * 1000,
  });
  const articles: DailyArticle[] = data?.articles ?? [];
  const validTicker = articles.filter((a) => a.slug && a.title);
  const breaking = validTicker.filter((a) => a.is_breaking);
  const rest = validTicker.filter((a) => !a.is_breaking);
  const tickerItems = [...breaking, ...rest].slice(0, 12);

  return (
    <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground border-b border-white/10">
      <div className="overflow-hidden border-b border-white/10 bg-tx-ink/40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-1.5">
          <span className="pl-4 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 shrink-0">
            Latest Texas News:
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-10 whitespace-nowrap animate-marquee text-[10px] font-medium tracking-[0.2em] uppercase text-white/70">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex shrink-0 gap-10 px-5">
                  {tickerItems.length > 0 ? (
                    tickerItems.map((a) => (
                      <Link
                        key={`${i}-${a.slug}`}
                        to="/news/$slug"
                        params={{ slug: a.slug }}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <span
                          className={`size-1.5 rounded-full ${a.is_breaking ? "bg-primary" : "bg-accent"}`}
                        />
                        {a.title}
                      </Link>
                    ))
                  ) : (
                    <Link
                      to="/elections"
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {electionHeadline}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-display text-2xl leading-none tracking-tight flex items-baseline gap-1.5 shrink-0"
        >
          Keep <span className="text-primary">TX</span> Red
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium"
        >
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="whitespace-nowrap hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="w-6 h-0.5 bg-current mb-1.5" />
          <div className="w-6 h-0.5 bg-current mb-1.5" />
          <div className="w-4 h-0.5 bg-current ml-auto" />
        </button>
      </div>
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-white/10 bg-secondary px-6 py-4 flex flex-col gap-3 text-sm font-medium"
        >
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-1"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
