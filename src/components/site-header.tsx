import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { nextElectionHeadline } from "@/lib/election-calendar";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { SHOP_LINK, SITE_NAV_GROUPS } from "@/lib/site-navigation";

function isPathActive(pathname: string, to: string) {
  return pathname === to || (to !== "/" && pathname.startsWith(`${to}/`));
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const electionHeadline = nextElectionHeadline();
  const fetchDaily = useServerFn(getDailyArticles);
  const { data } = useQuery({
    queryKey: ["site-header-ticker"],
    queryFn: () => fetchDaily(),
    staleTime: 5 * 60 * 1000,
  });
  const articles: DailyArticle[] = data?.articles ?? [];
  const validTicker = articles.filter((article) => article.slug && article.title);
  const breaking = validTicker.filter((article) => article.is_breaking);
  const rest = validTicker.filter((article) => !article.is_breaking);
  const tickerItems = [...breaking, ...rest].slice(0, 6);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-secondary text-secondary-foreground shadow-sm">
      <div className="border-b border-white/10 bg-tx-ink/50">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/80">
            Latest
          </span>
          <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max items-center gap-6 pr-4 text-xs text-white/90">
              {tickerItems.length > 0 ? (
                tickerItems.map((article) => (
                  <Link
                    key={article.slug}
                    to="/news/$slug"
                    params={{ slug: article.slug }}
                    className="flex max-w-[320px] items-center gap-2 whitespace-nowrap hover:text-white"
                  >
                    <span
                      className={`size-1.5 shrink-0 rounded-full ${article.is_breaking ? "bg-primary" : "bg-accent"}`}
                      aria-hidden
                    />
                    <span className="truncate">{article.title}</span>
                  </Link>
                ))
              ) : (
                <Link to="/elections/2026" className="flex items-center gap-2 whitespace-nowrap hover:text-white">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                  {electionHeadline}
                </Link>
              )}
            </div>
          </div>
          <Link to="/news" className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 hover:text-white sm:block">
            All news →
          </Link>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group shrink-0">
          <span className="flex items-baseline gap-1.5 font-display text-2xl leading-none tracking-tight">
            Keep <span className="text-primary">TX</span> Red
          </span>
          <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55 sm:block">
            Texas news · politics · accountability
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {SITE_NAV_GROUPS.map((group) => {
            const active =
              isPathActive(pathname, group.href) ||
              group.links.some((link) => isPathActive(pathname, link.to));

            return (
              <DropdownMenu.Root key={group.id}>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className={`inline-flex min-h-10 items-center gap-1 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {group.label}
                    <span className="text-[10px] text-white/55" aria-hidden>⌄</span>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="start"
                    sideOffset={9}
                    className="z-[70] w-[360px] rounded-lg border border-border bg-background p-2 text-foreground shadow-xl"
                  >
                    <div className="px-3 pb-2 pt-2">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{group.label}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{group.description}</p>
                    </div>
                    <div className="mt-1 border-t border-border pt-1">
                      {group.links.map((link) => (
                        <DropdownMenu.Item key={link.to} asChild>
                          <Link
                            to={link.to}
                            className="block rounded-md px-3 py-2.5 outline-none transition-colors hover:bg-muted focus:bg-muted"
                          >
                            <span className="block text-sm font-semibold">{link.label}</span>
                            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{link.description}</span>
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            );
          })}
          <Link
            to={SHOP_LINK.to}
            className="ml-1 inline-flex min-h-10 items-center rounded-md border border-white/20 px-3 text-sm font-semibold text-white/90 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
            activeProps={{ className: "border-primary text-white" }}
          >
            {SHOP_LINK.label}
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-md p-2 transition hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block w-6 border-t-2 border-current" />
          <span className="mt-1.5 block w-6 border-t-2 border-current" />
          <span className="mt-1.5 block w-4 border-t-2 border-current" />
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-white/10 bg-secondary px-4 py-5 sm:px-6 lg:hidden"
        >
          <div className="mx-auto grid max-w-2xl gap-6">
            {SITE_NAV_GROUPS.map((group) => (
              <section key={group.id}>
                <Link
                  to={group.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between text-sm font-bold text-white"
                >
                  <span>{group.label}</span>
                  <span className="text-primary" aria-hidden>→</span>
                </Link>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-white/10 pt-2">
                  {group.links
                    .filter((link) => link.to !== group.href)
                    .map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className="rounded py-2 text-xs font-medium leading-5 text-white/70 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>
              </section>
            ))}
            <Link
              to={SHOP_LINK.to}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground"
            >
              Visit the KTR Shop
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
