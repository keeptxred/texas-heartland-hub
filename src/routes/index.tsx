import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { AdSlot } from "@/components/ad-slot";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ELECTION_FEATURE_FLAGS } from "@/lib/elections";
import { buildSeo, organizationJsonLd, SITE_URL, webPageJsonLd, websiteJsonLd } from "@/lib/seo";

const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;
const EMPTY_SHOP_SEARCH = { category: undefined, collection: undefined, q: undefined, sort: undefined } as const;

const HOMEPAGE_FAQS = [
  {
    question: "What does Keep TX Red cover?",
    answer: "Keep TX Red covers Texas news, elections, the Legislature, bills, public officials, government accountability, business and the economy, and major policy debates affecting Texans.",
  },
  {
    question: "Is Keep TX Red news, commentary, or both?",
    answer: "Both. Keep TX Red publishes source-backed reporting and reference pages as well as clearly labeled commentary. The Texas Case section contains the site's permanent editorial positions, while factual reference resources preserve source and methodology context.",
  },
  {
    question: "Where can I follow the 2026 Texas elections?",
    answer: "Election Central brings together verified Texas races, candidates, polling, forecasts, voting information, and sourced results. It also links to methodology and official voting resources.",
  },
  {
    question: "How does Keep TX Red source government and election information?",
    answer: "Reference pages prioritize official Texas records, election authorities, legislative sources, government agencies, and other attributable primary sources. Keep TX Red separates sourced facts from forecasts, model output, and editorial conclusions.",
  },
  {
    question: "How can I find my Texas representatives or track a bill?",
    answer: "Use the Representatives and Find Your Representative resources for elected officials, and the Texas Bill Tracker for legislation, actions, sponsors, committees, and official documents.",
  },
  {
    question: "How can I request a correction or send Keep TX Red a tip?",
    answer: "Use the Contact page to send questions, tips, or correction requests. Keep TX Red's Editorial Standards explain the site's sourcing, accuracy, corrections, and AI-use practices.",
  },
] as const;

const DISCOVERY_PRIORITY_GROUPS = [
  {
    title: "News & analysis",
    description: "Go deeper than the headline feed with durable economic context and KTR's permanent editorial case.",
    links: [
      { title: "Texas economy", href: "/texas-economy", description: "Jobs, taxes, business, growth, regulation, and major economic developments." },
      { title: "The Texas Case", href: "/texas-case", description: "KTR's permanent editorial arguments on life, liberty, taxes, rights, education, and border security." },
    ],
  },
  {
    title: "Government & representation",
    description: "Use permanent authority pages to move from statewide coverage to the officials and districts behind it.",
    links: [
      { title: "Representatives", href: "/representatives", description: "Find Texas lawmakers and connect legislative coverage to public officials." },
      { title: "Legislative districts", href: "/districts", description: "Permanent authority pages for every Texas House and Senate district." },
    ],
  },
  {
    title: "Issues & reference",
    description: "Use source-first trackers and official-data references when you need more than a category landing page.",
    links: [
      { title: "Policy trackers", href: "/policy", description: "Current issue pages for taxes, border security, education, energy, elections, crime, water, healthcare, and more." },
      { title: "Texas Data Center", href: "/data", description: "Authoritative source maps for taxes, spending, elections, demographics, energy, water, and public safety." },
    ],
  },
] as const;

function homepageFaqJsonLd() {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: HOMEPAGE_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function homepageHead() {
  const title = "Keep TX Red | Texas Politics, Elections & Government Accountability";
  const description = "Texas political news, elections, government accountability, legislative tracking, law and policy guides, business and economic context, and clearly labeled commentary from Keep TX Red.";
  const seo = buildSeo({ title, description, path: "/", image: heroFlag, imageAlt: "Keep TX Red Texas politics and election coverage", type: "website" });
  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { ...organizationJsonLd(), "@context": undefined },
          { ...websiteJsonLd(), "@context": undefined },
          { ...webPageJsonLd({ name: title, description, path: "/", image: { url: heroFlag, caption: "Keep TX Red", alt: "Keep TX Red Texas politics and election coverage" } }), "@context": undefined, url: `${SITE_URL}/` },
          homepageFaqJsonLd(),
        ],
      }),
    }],
  };
}

export const Route = createFileRoute("/")({ head: homepageHead, loader: () => getDailyArticles(), component: Index });

function BreakingStrip({ articles }: { articles: DailyArticle[] }) {
  const breaking = articles.filter((article) => article.slug && article.title && article.is_breaking).slice(0, 3);
  if (breaking.length === 0) return null;

  return (
    <section className="border-b bg-primary text-primary-foreground" aria-label="Breaking news">
      <div className="mx-auto max-w-[1200px] px-6 py-4 sm:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
          <p className="shrink-0 text-xs font-extrabold uppercase tracking-[0.22em]">Breaking</p>
          <div className="grid flex-1 gap-3 md:grid-cols-3 md:gap-5">
            {breaking.map((article) => (
              <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }} className="font-semibold leading-snug hover:underline">
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ElectionSeasonSpotlight() {
  if (!ELECTION_FEATURE_FLAGS.homepagePromotion) return null;

  return (
    <section className="border-b bg-primary/5" aria-labelledby="election-central-spotlight">
      <div className="mx-auto grid max-w-[1200px] gap-6 px-6 py-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">2026 election season</p>
          <h2 id="election-central-spotlight" className="mt-2 font-display text-3xl tracking-tight">Election Central is KTR's dedicated election authority destination</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Follow Texas races, candidate profiles, polls, forecasts, voting logistics, methodology, district pages, and sourced results from one canonical destination.</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link to="/elections/2026" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Open Election Central →</Link>
          <Link to="/elections/voting" className="rounded-md border bg-background px-5 py-3 text-sm font-semibold">Voting guide</Link>
        </div>
      </div>
    </section>
  );
}

function DiscoveryPriorityLinks() {
  return (
    <section className="border-t bg-background" aria-labelledby="keep-tx-red-discovery-priority">
      <div className="mx-auto max-w-[1200px] px-6 py-12 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">More from Keep TX Red</p>
          <h2 id="keep-tx-red-discovery-priority" className="mt-2 font-display text-3xl sm:text-4xl">Find the part of KTR you need</h2>
          <p className="mt-3 leading-7 text-muted-foreground">Election Central remains the dedicated election destination while the homepage preserves KTR's broader identity across politics, government, law, policy, business, and the Texas economy.</p>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-3">
          {DISCOVERY_PRIORITY_GROUPS.map((group) => (
            <section key={group.title} aria-labelledby={`discovery-${group.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}>
              <div className="border-b pb-4">
                <h3 id={`discovery-${group.title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`} className="text-lg font-semibold text-foreground">{group.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
              </div>
              <nav className="mt-4 grid gap-3" aria-label={group.title}>
                {group.links.map((item) => (
                  <a key={item.href} href={item.href} className="group rounded-xl border bg-card p-4 transition hover:border-primary hover:shadow-sm">
                    <h4 className="font-semibold text-foreground group-hover:text-primary">{item.title}</h4>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    <span className="mt-3 block text-sm font-semibold text-primary">Explore →</span>
                  </a>
                ))}
              </nav>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageFaqs() {
  return (
    <section className="border-t bg-muted/30" aria-labelledby="keep-tx-red-faq">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Keep TX Red FAQ</p>
          <h2 id="keep-tx-red-faq" className="mt-2 font-display text-3xl sm:text-4xl">Questions about Keep TX Red</h2>
          <p className="mt-3 leading-7 text-muted-foreground">A quick guide to what KTR covers, how its reference material is sourced, and where to find election, government, and correction resources.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {HOMEPAGE_FAQS.map((item) => (
            <article key={item.question} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
        <p className="mt-7 text-sm text-muted-foreground">
          Need more detail? <Link to="/editorial-standards" className="font-semibold text-primary hover:underline">Read the Editorial Standards</Link> or <Link to="/contact" className="font-semibold text-primary hover:underline">contact Keep TX Red</Link>.
        </p>
      </div>
    </section>
  );
}

function Index() {
  return <PoliticalHomepage />;
}

function PoliticalHomepage() {
  const { articles } = Route.useLoaderData() as { articles: DailyArticle[] };
  const valid = articles.filter((article) => article.slug && article.title);
  const latest = valid.slice(0, 9);
  const images = assignUniqueImages(latest, (article) => article.slug, (article) => article.featured_image_url ?? article.image_url ?? heroFlag, (article) => article.category);

  return (
    <main className="bg-background">
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Texas politics. Elections. Government. Verified facts. Clear context.</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none tracking-tight sm:text-6xl">Follow the decisions shaping Texas</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">Keep TX Red covers Texas politics, elections, bills, public officials, government accountability, law, policy, business and the economy — and makes the common-sense case for the principles we believe Texas should defend.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/elections/2026" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Election Central</Link>
              <a href="/texas-case" className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold">The Texas Case</a>
              <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold">Track Texas bills</Link>
              <Link to="/texas-politics" className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold">Texas politics</Link>
            </div>
          </div>
          <aside className="rounded-xl border border-white/15 bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Start here</p>
            <nav className="mt-4 grid gap-3">
              {[["Read The Texas Case", "/texas-case"], ["Find your representatives", "/find-representative"], ["Browse legislative districts", "/districts"], ["Explore policy trackers", "/policy"], ["Explore the Texas Legislature", "/texas-legislature"], ["Browse Texas laws", "/laws"]].map(([label, to]) => <Link key={to} to={to} className="flex justify-between border-b border-white/10 py-2 text-sm font-semibold hover:text-primary"><span>{label}</span><span aria-hidden>→</span></Link>)}
            </nav>
          </aside>
        </div>
      </section>

      <ElectionSeasonSpotlight />
      <BreakingStrip articles={valid} />

      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Latest coverage</p><h2 className="mt-2 font-display text-4xl">Texas political news</h2></div><Link to="/news" className="text-sm font-semibold text-primary hover:underline">View all news →</Link></div>
        {latest.length === 0 ? <p className="mt-8 text-muted-foreground">New coverage is being prepared.</p> : <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{latest.map((article, index) => <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }} className="group block"><div className="aspect-[16/10] overflow-hidden rounded-lg bg-muted"><img src={images.get(article.slug) ?? heroFlag} alt="" width={640} height={400} loading={index === 0 ? "eager" : "lazy"} className="size-full object-cover transition-transform group-hover:scale-[1.02]" /></div><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{article.category ?? "Texas News"}</p><h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-primary">{article.title}</h3></Link>)}</div>}
        <AdSlot placement="banner" />
      </section>

      <section className="border-y bg-muted/40"><div className="mx-auto grid max-w-[1200px] gap-5 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/elections/2026" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Elections</h3><p className="mt-2 text-sm text-muted-foreground">Candidates, races, polling, forecasts, voting information, and results.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <Link to="/texas-legislature" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Texas Legislature</h3><p className="mt-2 text-sm text-muted-foreground">Sessions, chambers, committees, lawmakers, and legislative resources.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Bills</h3><p className="mt-2 text-sm text-muted-foreground">Search and follow Texas legislation, actions, sponsors, and documents.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <a href="/texas-case" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">The Texas Case</h3><p className="mt-2 text-sm text-muted-foreground">Permanent KTR editorial positions backed by laws, data, and primary records.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></a>
      </div></section>

      <DiscoveryPriorityLinks />

      <section className="mx-auto grid max-w-[1200px] gap-8 px-6 py-16 md:grid-cols-[1fr_0.8fr] md:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Support independent coverage</p><h2 className="mt-2 font-display text-4xl">Stay informed and support the newsroom</h2><p className="mt-4 max-w-2xl text-muted-foreground">Subscribe for important Texas updates and visit the Keep TX Red shop. Store purchases support independent reporting and platform operations.</p><div className="mt-6"><Link to="/shop" search={EMPTY_SHOP_SEARCH} className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Visit the shop</Link></div></div><NewsletterSignup /></section>

      <HomepageFaqs />
    </main>
  );
}
