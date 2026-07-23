import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { shouldDisplayBreakingSports } from "@/lib/sports-lifecycle";
import { isLowValueTitle } from "@/lib/low-value-titles";

const FAQS = [
  {
    q: "What is the status of Texas property tax relief?",
    a: "Texas school districts must provide a $140,000 residence homestead exemption. Homeowners who are age 65 or older or disabled may qualify for an additional $60,000 school-district exemption. Local exemptions and tax rates still vary, so homeowners should confirm eligibility and taxable value with their county appraisal district.",
    sourceLabel: "Texas Comptroller property-tax exemptions",
    sourceUrl: "https://comptroller.texas.gov/taxes/property-tax/exemptions/",
  },
  {
    q: "What are the key 2026 Texas election dates?",
    a: "The 2026 Texas primary was held March 3, followed by primary runoffs on May 26. The general election is November 3, 2026. The Texas Secretary of State publishes the official calendar, candidate information, registration deadlines, and voting guidance.",
    sourceLabel: "Texas Secretary of State election dates",
    sourceUrl: "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml",
  },
  {
    q: "What did the Texas Legislature do on border security?",
    a: "Operation Lone Star continues with state funding for additional DPS troopers, Texas Military Department deployments, and border-barrier construction. SB 4 and related measures created state-level criminal penalties for illegal entry, currently under federal court review.",
  },
  {
    q: "What is Texas doing on school choice?",
    a: "Texas enacted a universal Education Savings Account program providing eligible families approximately $10,000 per student for private school tuition, tutoring, and approved educational expenses. Public school districts retain per-pupil funding through separate appropriations.",
  },
  {
    q: "How does Texas regulate elections?",
    a: "Texas requires photo ID at the polls, prohibits mass mail-ballot solicitation, and limits drive-through and 24-hour voting. The Secretary of State oversees uniform election procedures and audits. Counties run polling locations; early voting typically runs 12 days before Election Day.",
  },
  {
    q: "What is the Texas Attorney General doing right now?",
    a: "The Office of the Attorney General leads multistate litigation against federal overreach, defends Texas election and immigration laws, and prosecutes Medicaid fraud and human trafficking through specialized divisions.",
  },
  {
    q: "How is Texas handling energy policy?",
    a: "Texas continues expanding oil, gas, and natural-gas-fired generation while requiring grid reliability investments through the Public Utility Commission and ERCOT. The Texas Energy Fund provides low-interest loans for dispatchable power plants to strengthen winter grid capacity.",
  },
];

const SOURCE_FILTERS = ["All", "Governor", "Secretary of State", "Register"] as const;

function timeAgo(iso: string) {
  const t = Date.parse(iso);
  if (!t) return "";
  const diff = Date.now() - t;
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60_000))} min ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const Route = createFileRoute("/happening-now")({
  head: () => ({
    meta: [
      { title: "Happening Now — Live Texas Political & Legislative Feeds | Keep TX Red" },
      {
        name: "description",
        content:
          "Happening Now: live aggregated feeds from the Texas Legislature, the Governor's Office, and the Secretary of State. Filter bills, press releases, and political updates in real time.",
      },
      { property: "og:title", content: "Happening Now — Keep TX Red" },
      {
        property: "og:description",
        content:
          "Real-time Texas political and legislative updates aggregated from official state sources.",
      },
      { property: "og:url", content: "https://www.keeptxred.com/happening-now" },
    ],
    links: [{ rel: "canonical", href: "https://www.keeptxred.com/happening-now" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NewsMediaOrganization",
              "@id": "https://www.keeptxred.com/#org",
              name: "Keep TX Red",
              url: "https://www.keeptxred.com",
              logo: "https://www.keeptxred.com/favicon.ico",
              sameAs: [],
              knowsAbout: [
                "Texas Legislative Tracking",
                "Conservative Policy News",
                "Texas Primary Elections",
                "Texas Property Tax Relief",
                "Texas Border Security",
              ],
              areaServed: { "@type": "State", name: "Texas" },
            },
            {
              "@type": "CollectionPage",
              "@id": "https://www.keeptxred.com/happening-now#page",
              url: "https://www.keeptxred.com/happening-now",
              name: "Statewide Conservative News Dashboard",
              description:
                "Live aggregated feeds from official Texas government sources: Legislature bills filed, Governor press releases, and Secretary of State updates.",
              isPartOf: { "@id": "https://www.keeptxred.com/#org" },
              about: [
                { "@type": "Thing", name: "Texas Legislative Tracking" },
                { "@type": "Thing", name: "Conservative Policy News" },
                { "@type": "Thing", name: "Texas Primary Elections" },
              ],
              mainEntity: {
                "@type": "FAQPage",
                mainEntity: FAQS.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            },
          ],
        }),
      },
    ],
  }),
  component: DashboardPage,
});

type Row = {
  id: number;
  title: string;
  source: string;
  link: string; // /news/{slug} for linked articles, external URL otherwise
  external: boolean;
  description: string | null;
  pub_date: string;
};

function DashboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [q, setQ] = useState("");
  const [src, setSrc] = useState<(typeof SOURCE_FILTERS)[number]>("All");

  useEffect(() => {
    let active = true;
    async function load() {
      const sinceIso = new Date(Date.now() - ONE_DAY_MS).toISOString();
      const [{ data, error: feedError }, { data: demoted, error: articleError }] =
        await Promise.all([
          supabase
            .from("texas_news_feed")
            .select("id,title,source,internal_slug,description,pub_date,link")
            .gte("pub_date", sinceIso)
            .order("pub_date", { ascending: false })
            .limit(120),
          supabase
            .from("daily_articles")
            .select("id,slug,title,category,dek,source_url,published_at,kind,body_json")
            .gte("published_at", sinceIso)
            .order("published_at", { ascending: false })
            .limit(40),
        ]);
      if (!active) return;
      if (feedError || articleError) {
        console.error("[happening-now] load failed", {
          feed: feedError?.message,
          articles: articleError?.message,
        });
        setLoadError(true);
        setLoading(false);
        return;
      }

      const rawFeed = (data ?? []) as {
        id: number;
        title: string;
        source: string;
        internal_slug: string | null;
        description: string | null;
        pub_date: string;
        link: string;
      }[];
      const candidateSlugs = Array.from(
        new Set(rawFeed.flatMap((row) => (row.internal_slug ? [row.internal_slug] : []))),
      );
      const { data: linkedArticles, error: linkedArticleError } = candidateSlugs.length
        ? await supabase.from("daily_articles").select("slug").in("slug", candidateSlugs)
        : { data: [], error: null };
      if (!active) return;
      if (linkedArticleError) {
        console.error("[happening-now] linked article lookup failed", linkedArticleError.message);
        setLoadError(true);
        setLoading(false);
        return;
      }

      // Live Feed gates on "a rewritten native article exists" — NOT the
      // 2,000-word long-form floor (that gate applies to sitemaps and
      // evergreen surfaces). Breaking news is intentionally shorter.
      const validArticleSlugs = new Set(
        ((linkedArticles ?? []) as { slug: string }[]).map((r) => r.slug),
      );
      // Diagnostic: reason each feed row was excluded (temporary, safe to keep behind the console).
      const drops = { no_slug: 0, slug_not_in_articles: 0, kept: 0 };
      const feedRows: Row[] = rawFeed
        // RULE: never link out to the original source. Feed items must be
        // rewritten into a native /news/{slug} article before they surface
        // here. Rows without a rewritten article are hidden until the
        // ingest pipeline mints one.
        .filter((r) => {
          if (!r.internal_slug) {
            drops.no_slug += 1;
            return false;
          }
          if (!validArticleSlugs.has(r.internal_slug)) {
            drops.slug_not_in_articles += 1;
            return false;
          }
          drops.kept += 1;
          return true;
        })
        .map((r) => ({
          id: r.id,
          title: r.title,
          source: r.source,
          link: `/news/${r.internal_slug}`,
          external: false,
          description: r.description,
          pub_date: r.pub_date,
        }));
      const demotedRows: Row[] = (
        (demoted ?? []) as {
          id: string;
          slug: string;
          title: string;
          category: string;
          dek: string | null;
          source_url: string | null;
          published_at: string;
          kind?: string | null;
        }[]
      )
        .filter((d) => shouldDisplayBreakingSports(d.kind, d.published_at, "happening-now"))
        .map((d, i) => ({
          id: -1 - i,
          title: d.title,
          source: d.category || "Newsroom",
          link: `/news/${d.slug}`,
          external: false,
          description: d.dek,
          pub_date: d.published_at,
        }));
      const merged = [...feedRows, ...demotedRows].sort(
        (a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date),
      );
      if (typeof window !== "undefined") {
        // Temporary diagnostics — remove once feed density stabilizes.
        console.info("[happening-now] load", {
          feed_raw: rawFeed.length,
          feed_no_slug: drops.no_slug,
          feed_slug_missing_article: drops.slug_not_in_articles,
          feed_kept: drops.kept,
          daily_last_24h: demoted?.length ?? 0,
          linked_articles_found: linkedArticles?.length ?? 0,
          merged: merged.length,
        });
      }
      setItems(merged);
      setFetchedAt(new Date().toISOString());
      setLoadError(false);
      setLoading(false);
    }
    load();
    const t = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const cutoff = Date.now() - ONE_DAY_MS;
    const stats = {
      total: items.length,
      dropped_stale: 0,
      dropped_low_value: 0,
      dropped_source: 0,
      dropped_needle: 0,
      kept: 0,
    };
    const out = items.filter((it) => {
      const ts = Date.parse(it.pub_date);
      if (!isNaN(ts) && ts < cutoff) {
        stats.dropped_stale += 1;
        return false;
      }
      if (isLowValueTitle(it.title)) {
        stats.dropped_low_value += 1;
        return false;
      }
      if (src !== "All" && !it.source.toLowerCase().includes(src.toLowerCase())) {
        stats.dropped_source += 1;
        return false;
      }
      if (!needle) {
        stats.kept += 1;
        return true;
      }
      const match =
        it.title.toLowerCase().includes(needle) ||
        (it.description ?? "").toLowerCase().includes(needle) ||
        it.source.toLowerCase().includes(needle);
      if (!match) stats.dropped_needle += 1;
      else stats.kept += 1;
      return match;
    });
    if (typeof window !== "undefined") {
      console.info("[happening-now] filter", stats);
    }
    return out;
  }, [items, q, src]);

  const QUICK = ["Tax", "Border", "Primary", "Paxton", "Election", "School"];

  return (
    <div className="bg-white">
      <section className="bg-secondary text-secondary-foreground border-b-4 border-primary">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">
            ★ Happening Now
          </span>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight mt-3">
            Happening Now in
            <br />
            <span className="text-primary">Texas Government</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-white/75">
            Real-time feeds from the Texas Legislature, the Governor's Office, and the Secretary of
            State. The live feed shows the last 24 hours — older updates automatically move to the
            matching section page (Elections, Texas Laws, or Texas Politics).
          </p>
          {fetchedAt ? (
            <p className="mt-3 text-xs uppercase tracking-widest text-white/50">
              Last refreshed:{" "}
              {new Date(fetchedAt).toLocaleString("en-US", { timeZone: "America/Chicago" })} CT
            </p>
          ) : null}
        </div>
      </section>

      <section className="border-b border-border bg-white sticky top-[57px] z-30">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Filter by keyword: Tax, Border, Paxton..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border-2 border-foreground/20"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setQ(k)}
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-border hover:border-primary hover:text-primary"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SOURCE_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSrc(s)}
                className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 border ${
                  s === src
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight">
            Live Feed · Last 24 Hours
          </h2>
          <span className="text-xs text-muted-foreground">{filtered.length} updates</span>
        </div>
        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-border p-10 text-center text-muted-foreground">
            {loading
              ? "Loading the latest Texas political feeds…"
              : loadError
                ? "The live feed is temporarily unavailable. Please try again shortly."
                : items.length === 0
                  ? "No Texas political updates in the last 24 hours. Check back soon — the feed refreshes every few minutes."
                  : "No items match your filters."}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it, i) => (
              <article
                key={`${it.link}-${i}`}
                className="border-2 border-foreground/10 bg-card p-5 hover:border-primary transition-colors"
              >
                {it.pub_date ? (
                  <time
                    className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2"
                    dateTime={it.pub_date}
                  >
                    {timeAgo(it.pub_date)}
                  </time>
                ) : null}
                <h3 className="font-serif text-base font-bold leading-snug">
                  <a
                    href={it.link}
                    className="hover:underline underline-offset-4"
                    {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {it.title}
                  </a>
                </h3>
                {it.description ? (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {it.description}
                  </p>
                ) : null}
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-primary">
                  Source: {it.source}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t-2 border-foreground/10 bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">
            ★ Frequently Asked
          </span>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mt-2">
            Texas Political FAQs
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Plain-language answers on the issues driving Texas conservatives — written for readers
            and structured for AI search engines.
          </p>
          <div className="mt-8 bg-white border-2 border-foreground/10 px-6">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="font-serif text-base md:text-lg font-bold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{f.a}</p>
                    {"sourceUrl" in f ? (
                      <a
                        href={f.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4"
                      >
                        {f.sourceLabel}
                      </a>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
