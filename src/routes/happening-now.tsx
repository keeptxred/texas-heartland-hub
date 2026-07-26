import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
const PRIMARY_WINDOW_MS = 24 * 60 * 60 * 1000;
const FALLBACK_WINDOW_MS = 7 * PRIMARY_WINDOW_MS;

const OFFICIAL_SOURCE_PATTERNS = [
  "office of the governor",
  "governor of texas",
  "gov.texas.gov",
  "texas secretary of state",
  "secretary of state",
  "sos.state.tx.us",
  "texas register",
  "texreg.sos.state.tx.us",
  "texas legislature",
  "capitol.texas.gov",
] as const;

function isOfficialGovernmentSource(source: string) {
  const normalized = source.trim().toLowerCase();
  return OFFICIAL_SOURCE_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function timeAgo(iso: string) {
  const timestamp = Date.parse(iso);
  if (!Number.isFinite(timestamp)) return "";
  const diff = Math.max(0, Date.now() - timestamp);
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `${Math.max(1, Math.floor(diff / 60_000))} min ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

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
        content: "Real-time Texas political and legislative updates aggregated from official state sources.",
      },
      { property: "og:url", content: "https://keeptxred.com/happening-now" },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/happening-now" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "NewsMediaOrganization",
              "@id": "https://keeptxred.com/#org",
              name: "Keep TX Red",
              url: "https://keeptxred.com",
              logo: "https://keeptxred.com/favicon.ico",
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
              "@id": "https://keeptxred.com/happening-now#page",
              url: "https://keeptxred.com/happening-now",
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
                mainEntity: FAQS.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: { "@type": "Answer", text: faq.a },
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
  link: string | null;
  pendingArticle: boolean;
  description: string | null;
  pub_date: string;
};

type FeedRow = {
  id: number;
  title: string;
  source: string;
  internal_slug: string | null;
  description: string | null;
  pub_date: string;
};

function DashboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [fetchedAt, setFetchedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] =
    useState<(typeof SOURCE_FILTERS)[number]>("All");

  useEffect(() => {
    let active = true;

    async function load() {
      const sinceIso = new Date(Date.now() - FALLBACK_WINDOW_MS).toISOString();
      const [{ data: feedData, error: feedError }, { data: articleData, error: articleError }] =
        await Promise.all([
          supabase
            .from("texas_news_feed")
            .select("id,title,source,internal_slug,description,pub_date")
            .gte("pub_date", sinceIso)
            .order("pub_date", { ascending: false })
            .limit(240),
          supabase
            .from("daily_articles")
            .select("id,slug,title,category,dek,published_at,kind")
            .gte("published_at", sinceIso)
            .order("published_at", { ascending: false })
            .limit(120),
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

      const rawFeed = (feedData ?? []) as FeedRow[];
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

      const validArticleSlugs = new Set(
        ((linkedArticles ?? []) as { slug: string }[]).map((article) => article.slug),
      );

      const feedRows = rawFeed.flatMap<Row>((row) => {
        const hasNativeArticle =
          Boolean(row.internal_slug) && validArticleSlugs.has(row.internal_slug as string);
        const officialSource = isOfficialGovernmentSource(row.source);

        if (!hasNativeArticle && !officialSource) return [];

        return [
          {
            id: row.id,
            title: row.title,
            source: row.source,
            link: hasNativeArticle ? `/news/${row.internal_slug}` : null,
            pendingArticle: !hasNativeArticle,
            description: row.description,
            pub_date: row.pub_date,
          },
        ];
      });

      const nativeRows: Row[] = (
        (articleData ?? []) as {
          id: string;
          slug: string;
          title: string;
          category: string;
          dek: string | null;
          published_at: string;
          kind?: string | null;
        }[]
      )
        .filter((article) =>
          shouldDisplayBreakingSports(article.kind, article.published_at, "happening-now"),
        )
        .map((article, index) => ({
          id: -1 - index,
          title: article.title,
          source: article.category || "Newsroom",
          link: `/news/${article.slug}`,
          pendingArticle: false,
          description: article.dek,
          pub_date: article.published_at,
        }));

      const deduplicated = new Map<string, Row>();
      [...feedRows, ...nativeRows]
        .sort((a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date))
        .forEach((row) => {
          const key = row.link ?? `${row.source.toLowerCase()}::${row.title.toLowerCase()}`;
          if (!deduplicated.has(key)) deduplicated.set(key, row);
        });

      setItems(Array.from(deduplicated.values()));
      setFetchedAt(new Date().toISOString());
      setLoadError(false);
      setLoading(false);
    }

    void load();
    const timer = window.setInterval(() => void load(), 60_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const displayWindowMs = useMemo(() => {
    const primaryCutoff = Date.now() - PRIMARY_WINDOW_MS;
    const hasPrimaryItems = items.some((item) => {
      const timestamp = Date.parse(item.pub_date);
      return Number.isFinite(timestamp) && timestamp >= primaryCutoff && !isLowValueTitle(item.title);
    });
    return hasPrimaryItems ? PRIMARY_WINDOW_MS : FALLBACK_WINDOW_MS;
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const cutoff = Date.now() - displayWindowMs;

    return items.filter((item) => {
      const timestamp = Date.parse(item.pub_date);
      if (Number.isFinite(timestamp) && timestamp < cutoff) return false;
      if (isLowValueTitle(item.title)) return false;
      if (
        sourceFilter !== "All" &&
        !item.source.toLowerCase().includes(sourceFilter.toLowerCase())
      ) {
        return false;
      }
      if (!needle) return true;
      return (
        item.title.toLowerCase().includes(needle) ||
        (item.description ?? "").toLowerCase().includes(needle) ||
        item.source.toLowerCase().includes(needle)
      );
    });
  }, [displayWindowMs, items, query, sourceFilter]);

  const isFallbackWindow = displayWindowMs === FALLBACK_WINDOW_MS;
  const quickFilters = ["Tax", "Border", "Primary", "Paxton", "Election", "School"];

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
          <p className="mt-4 max-w-2xl text-base md:text-lg text-white/90">
            Current feeds from the Texas Legislature, the Governor&apos;s Office, and the Secretary of
            State. The newest 24 hours are shown when available; during quiet periods, the feed keeps
            the latest seven days visible.
          </p>
          {fetchedAt ? (
            <p className="mt-3 text-xs uppercase tracking-widest text-white/85">
              Last refreshed: {new Date(fetchedAt).toLocaleString("en-US", {
                timeZone: "America/Chicago",
              })}{" "}
              CT
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
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="border-2 border-foreground/20"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setQuery(filter)}
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-border hover:border-primary hover:text-primary"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SOURCE_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSourceFilter(filter)}
                className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 border ${
                  filter === sourceFilter
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-primary hover:text-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="font-display text-2xl md:text-3xl tracking-tight">
            Live Feed · {isFallbackWindow ? "Latest 7 Days" : "Last 24 Hours"}
          </h2>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {filtered.length} updates
          </span>
        </div>
        {isFallbackWindow && filtered.length > 0 ? (
          <p className="mb-5 text-sm text-muted-foreground">
            No qualifying update was published in the last 24 hours, so the most recent Texas updates
            remain visible.
          </p>
        ) : null}
        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-border p-10 text-center text-muted-foreground">
            {loading
              ? "Loading the latest Texas political feeds…"
              : loadError
                ? "The live feed is temporarily unavailable. Please try again shortly."
                : items.length === 0
                  ? "No recent Texas political updates are available. The feed refreshes automatically."
                  : "No items match your filters."}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.link ?? `source-${item.id}`}
                className="border-2 border-foreground/10 bg-card p-5 hover:border-primary transition-colors"
              >
                <time
                  className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2"
                  dateTime={item.pub_date}
                >
                  {timeAgo(item.pub_date)}
                </time>
                <h3 className="font-serif text-base font-bold leading-snug">
                  {item.link ? (
                    <a href={item.link} className="hover:underline underline-offset-4">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                {item.description ? (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>
                ) : null}
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-primary">
                  Source: {item.source}
                </p>
                {item.pendingArticle ? (
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Full Keep TX Red article in progress
                  </p>
                ) : null}
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
              {FAQS.map((faq, index) => (
                <AccordionItem key={faq.q} value={`faq-${index}`}>
                  <AccordionTrigger className="font-serif text-base md:text-lg font-bold">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{faq.a}</p>
                    {"sourceUrl" in faq ? (
                      <a
                        href={faq.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4"
                      >
                        {faq.sourceLabel}
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
