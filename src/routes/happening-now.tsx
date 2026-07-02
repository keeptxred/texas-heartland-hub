import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

const FAQS = [
  {
    q: "What is the status of Texas property tax relief?",
    a: "Texas has enacted multiple rounds of property tax relief, including increases to the homestead exemption (raised to $100,000 for school district taxes) and compression of school M&O rates funded by state surplus. Ongoing legislative proposals aim to expand exemptions for seniors, disabled veterans, and to cap appraisal growth on non-homestead properties.",
  },
  {
    q: "Who is running in the 2026 Texas Republican Primary?",
    a: "Statewide races include Governor, Lieutenant Governor, Attorney General, and Comptroller. Incumbents are expected to face primary challengers focused on border enforcement, school choice expansion, and election integrity. The candidate filing period closes in December; the primary is held the first Tuesday in March.",
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
      { name: "description", content: "Happening Now: live aggregated feeds from the Texas Legislature, the Governor's Office, and the Secretary of State. Filter bills, press releases, and political updates in real time." },
      { property: "og:title", content: "Happening Now — Keep TX Red" },
      { property: "og:description", content: "Real-time Texas political and legislative updates aggregated from official state sources." },
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
              description: "Live aggregated feeds from official Texas government sources: Legislature bills filed, Governor press releases, and Secretary of State updates.",
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
  link: string; // internal path only — always /news/{slug}
  description: string | null;
  pub_date: string;
};

function DashboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [src, setSrc] = useState<(typeof SOURCE_FILTERS)[number]>("All");

  useEffect(() => {
    let active = true;
    async function load() {
      const sinceIso = new Date(Date.now() - ONE_DAY_MS).toISOString();
      const [{ data }, { data: demoted }] = await Promise.all([
        supabase
        .from("texas_news_feed")
        .select("id,title,source,internal_slug,description,pub_date")
        .not("internal_slug", "is", null)
        .order("pub_date", { ascending: false })
        .limit(120),
        supabase
          .from("daily_articles")
          .select("id,slug,title,category,dek,source_url,published_at")
          .eq("is_breaking", true)
          .gte("published_at", sinceIso)
          .order("published_at", { ascending: false })
          .limit(40),
      ]);
      if (!active) return;
      const feedRows: Row[] = ((data ?? []) as { id: number; title: string; source: string; internal_slug: string | null; description: string | null; pub_date: string }[])
        .filter((r) => Boolean(r.internal_slug))
        .map((r) => ({
          id: r.id,
          title: r.title,
          source: r.source,
          link: `/news/${r.internal_slug}`,
          description: r.description,
          pub_date: r.pub_date,
        }));
      const demotedRows: Row[] = (demoted ?? []).map((d: { id: string; slug: string; title: string; category: string; dek: string | null; source_url: string | null; published_at: string }, i: number) => ({
        id: -1 - i,
        title: d.title,
        source: d.category || "Newsroom",
        link: `/news/${d.slug}`,
        description: d.dek,
        pub_date: d.published_at,
      }));
      const merged = [...feedRows, ...demotedRows].sort(
        (a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date),
      );
      setItems(merged);
      setFetchedAt(new Date().toISOString());
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
    return items.filter((it) => {
      const ts = Date.parse(it.pub_date);
      if (!isNaN(ts) && ts < cutoff) return false;
      if (src !== "All" && !it.source.toLowerCase().includes(src.toLowerCase())) return false;
      if (!needle) return true;
      return (
        it.title.toLowerCase().includes(needle) ||
        (it.description ?? "").toLowerCase().includes(needle) ||
        it.source.toLowerCase().includes(needle)
      );
    });
  }, [items, q, src]);

  const QUICK = ["Tax", "Border", "Primary", "Paxton", "Election", "School"];

  return (
    <div className="bg-white">
      <section className="bg-secondary text-secondary-foreground border-b-4 border-primary">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">★ Happening Now</span>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight mt-3">
            Happening Now in
            <br />
            <span className="text-primary">Texas Government</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-white/75">
            Real-time feeds from the Texas Legislature, the Governor's Office, and the Secretary of State. The live feed shows the last 24 hours — older updates automatically move to the matching section page (Elections, Texas Laws, or Texas Politics).
          </p>
          {fetchedAt ? (
            <p className="mt-3 text-xs uppercase tracking-widest text-white/50">
              Last refreshed: {new Date(fetchedAt).toLocaleString("en-US", { timeZone: "America/Chicago" })} CT
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
          <h2 className="font-display text-2xl md:text-3xl tracking-tight">Live Feed · Last 24 Hours</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} updates</span>
        </div>
        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-border p-10 text-center text-muted-foreground">
            {loading
              ? "Loading the latest Texas political feeds…"
              : items.length === 0
              ? "Feed database is warming up. New entries appear automatically every 30 minutes."
              : "No items match your filters."}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it, i) => (
              <article
                key={`${it.link}-${i}`}
                className="border-2 border-foreground/10 bg-card p-5 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {it.source}
                  </span>
                  {it.pub_date ? (
                    <time className="text-[10px] text-muted-foreground" dateTime={it.pub_date}>
                      {timeAgo(it.pub_date)}
                    </time>
                  ) : null}
                </div>
                <h3 className="font-serif text-base font-bold leading-snug">
                  <a href={it.link} className="hover:underline underline-offset-4">
                    {it.title}
                  </a>
                </h3>
                {it.description ? (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{it.description}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t-2 border-foreground/10 bg-muted/40">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ Frequently Asked</span>
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mt-2">
            Texas Political FAQs
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Plain-language answers on the issues driving Texas conservatives — written for readers and structured for AI search engines.
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