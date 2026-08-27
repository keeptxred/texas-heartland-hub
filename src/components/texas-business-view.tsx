import { Link } from "@tanstack/react-router";
import { ARTICLES, isPublished, sortByDateDesc } from "@/data/articles";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { filterArticlesByCategory } from "@/lib/article-filters";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import schoolbus from "@/assets/article-schoolbus.jpg";
import boardroom from "@/assets/article-boardroom.jpg";
import rotunda from "@/assets/article-rotunda.jpg";
import openmeeting from "@/assets/article-openmeeting.jpg";

const EMPTY_BILLS_SEARCH = {
  q: "",
  status: "",
  legislature: 0,
  chamber: "",
  billType: "",
  page: 1,
} as const;

export const BUSINESS_SLUGS: Record<string, string[]> = {
  energy: [
    "texas-energy-economy-overview",
    "permian-energy",
    "texas-energy-policy-guide",
    "texas-grid-ercot-explained",
  ],
  jobs: ["texas-energy-economy-overview", "why-texas-has-no-income-tax"],
  regulation: ["texas-energy-policy-guide", "what-local-governments-control"],
  taxation: [
    "property-tax-relief-package",
    "county-appraisal-districts-explained",
    "isd-tax-burdens",
    "how-texas-counties-spend",
  ],
  policy: [
    "texas-energy-policy-guide",
    "property-tax-relief-package",
    "what-local-governments-control",
  ],
};

export const BUSINESS_TOPIC_SLUGS = Object.keys(BUSINESS_SLUGS);
const ALL_BUSINESS_SLUGS = Array.from(new Set(Object.values(BUSINESS_SLUGS).flat()));

const IMAGE_OVERRIDES: Record<string, string> = {
  "isd-tax-burdens": schoolbus,
  "texas-energy-economy-overview": boardroom,
  "how-texas-counties-spend": rotunda,
  "what-local-governments-control": openmeeting,
};

const COPY_OVERRIDES: Record<string, { title: string; dek: string }> = {
  "isd-tax-burdens": {
    title: "Texas School Tax Rates: What the 2025 Data Shows — and Why 2026 Is Not Final Yet",
    dek: "The latest complete statewide school-district tax-rate data is for 2025. Here is what changed for 2026 and why a final 2026 ranking would be premature.",
  },
};

export const BUSINESS_SECTIONS = [
  { id: "energy", title: "Energy", description: "Oil and gas, ERCOT, generation policy, and Permian production." },
  { id: "jobs", title: "Jobs & Workforce", description: "Employment policy, wages, workforce programs, and the Texas labor market." },
  { id: "regulation", title: "Regulation", description: "State agencies, permitting, local authority, and rules affecting employers." },
  { id: "taxation", title: "Taxes & Spending", description: "Business taxes, property-tax policy, appropriations, and local government finance." },
  { id: "policy", title: "Legislation", description: "Bills and state decisions affecting Texas businesses and workers." },
];

export function TexasBusinessView({ topic }: { topic: string }) {
  const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const curated = topic && BUSINESS_SLUGS[topic] ? BUSINESS_SLUGS[topic] : ALL_BUSINESS_SLUGS;
  const curatedArticles = curated
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a) && isPublished(a!) && isStaticArticleIndexable(a!));
  const filtered = topic ? filterArticlesByCategory(ARTICLES, topic) : [];
  const merged = new Map<string, (typeof ARTICLES)[number]>();
  for (const a of [...curatedArticles, ...filtered]) merged.set(a.slug, a);
  const businessArticles = Array.from(merged.values())
    .filter(isStaticArticleIndexable)
    .sort(sortByDateDesc);
  const uniqImg = assignUniqueImages(
    businessArticles,
    (a) => a.slug,
    (a) => IMAGE_OVERRIDES[a.slug] ?? a.image,
    (a) => a.category ?? "business",
  );
  const activeSection = BUSINESS_SECTIONS.find((s) => s.id === topic);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-6 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Texas Business</span>
            <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-foreground">
              {activeSection ? `${activeSection.title} — Texas Business` : "Texas Business, Regulation & Economic Policy"}
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">
              {activeSection
                ? activeSection.description
                : "Reporting on Texas energy, jobs, regulation, taxation, state spending, and legislation affecting employers and workers. TexasDefined separately owns household calculators, relocation guidance, real-estate planning, and cost-of-living tools."}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
          <div className="shrink-0 lg:max-w-xs">
            <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">Government resources</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/bills" search={EMPTY_BILLS_SEARCH} className="text-primary hover:underline">Search Texas bills →</Link></li>
              <li><Link to="/texas-economy" className="text-primary hover:underline">Texas economic policy →</Link></li>
              <li><Link to="/texas-legislature" className="text-primary hover:underline">Texas Legislature →</Link></li>
              <li><Link to="/texas-legislature/committees" className="text-primary hover:underline">Legislative committees →</Link></li>
            </ul>
          </div>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground mb-4">What we cover</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {BUSINESS_SECTIONS.map((s) => {
            const active = topic === s.id;
            const linkProps = active
              ? ({ to: "/texas-business", search: { topic: "" } } as const)
              : ({ to: "/texas-business", search: { topic: s.id } } as const);
            return (
              <Link
                key={s.id}
                {...linkProps}
                className={`group block border-2 p-5 transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-foreground/10 bg-card hover:border-primary hover:bg-primary/5"
                }`}
              >
                <h3 className="font-sans text-lg font-semibold tracking-tight group-hover:text-primary">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">
                  {active ? "Showing ✓ — clear" : "Filter →"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
              {activeSection ? `${activeSection.title} coverage` : "Latest Texas business coverage"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeSection ? activeSection.description : "Energy, taxes, jobs, regulation, and legislation shaping the Texas economy."}
            </p>
          </div>
          {activeSection && (
            <Link to="/texas-business" search={{ topic: "" }} className="text-sm text-primary hover:underline">
              Show all business coverage →
            </Link>
          )}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessArticles.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No articles currently available in this topic. Browse related Texas coverage.
              </p>
              <Link to="/texas-business" search={{ topic: "" }} className="mt-3 inline-block text-sm text-primary hover:underline">
                ← Back to all business coverage
              </Link>
            </div>
          )}
          {businessArticles.map((a) => {
            const copy = COPY_OVERRIDES[a.slug];
            const title = copy?.title ?? a.title;
            const dek = copy?.dek ?? a.dek;
            return (
              <Link key={a.slug} to="/news/$slug" params={{ slug: a.slug }} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
                  <img src={uniqImg.get(a.slug) ?? IMAGE_OVERRIDES[a.slug] ?? a.image} alt={title} loading="lazy" className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{a.category}</span>
                <h3 className="font-serif text-base font-bold leading-snug mt-1 group-hover:underline underline-offset-4">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{dek}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">More from Keep Texas Red</h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <li><Link to="/news" className="text-primary hover:underline">Texas News →</Link></li>
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas Politics →</Link></li>
          <li><Link to="/houston" className="text-primary hover:underline">Houston News →</Link></li>
          <li><Link to="/texas-sports" className="text-primary hover:underline">Texas Sports →</Link></li>
          <li><Link to="/elections/2026" className="text-primary hover:underline">Election Central →</Link></li>
          <li><Link to="/bills" search={EMPTY_BILLS_SEARCH} className="text-primary hover:underline">Texas Bills →</Link></li>
        </ul>
      </section>
    </div>
  );
}
