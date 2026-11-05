import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { AdSlot } from "@/components/ad-slot";
import { ELECTION_FEATURE_FLAGS } from "@/lib/elections/featureFlags";
import { buildSeo, organizationJsonLd, SITE_URL, webPageJsonLd, websiteJsonLd } from "@/lib/seo";
import { shouldContainArticleImage } from "@/lib/article-image-attribution";

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

const FEATURED_RESEARCH = [
  {
    label: "Texas tax analysis",
    title: "Where Texas government gets its money",
    description: "Review official revenue sources and the important distinction between state taxes and local property taxes.",
    href: "/news/why-texas-has-no-income-tax",
  },
  {
    label: "Texas law reference",
    title: "Find Texas laws and official statutes",
    description: "Browse Texas legal topics and cross-check the controlling statutes, effective dates and official source records.",
    href: "/laws",
  },
  {
    label: "Public-record research",
    title: "Trace a bill through the Legislature",
    description: "Search legislative sessions, sponsors, status, actions and documents, then verify details with Texas Legislature Online.",
    href: "/bills",
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
  const title = "Keep TX Red | Texas Politics, Government & Accountability";
  const description = "Keep Texas Red (Keep TX Red) covers Texas politics, elections, government accountability, legislation, public officials, policy, business, and the economy.";
  const seo = buildSeo({ title, description, path: "/", image: heroFlag, imageAlt: "Keep Texas Red (Keep TX Red) Texas politics and election coverage", type: "website" });
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
          { ...webPageJsonLd({ name: title, description, path: "/", image: { url: heroFlag, caption: "Keep Texas Red (Keep TX Red)", alt: "Keep Texas Red (Keep TX Red) Texas politics and election coverage" } }), "@context": undefined, url: `${SITE_URL}/` },
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
          <p className="mt-3 leading-7 text-muted-foreground">Browse KTR's coverage of politics, government, law, policy, business, and the Texas economy.</p>
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

function ResearchSpotlight() {
  return (
    <section className="border-t bg-background" aria-labelledby="ktr-research-spotlight">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Research & public records</p>
        <h2 id="ktr-research-spotlight" className="mt-2 font-display text-3xl sm:text-4xl">Understand the Texas record</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
          Use dated explanations and practical government-record tools to examine the laws, taxes and legislative decisions behind political claims. These are not presented as today's breaking news.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {FEATURED_RESEARCH.map((item) => (
            <a key={item.href} href={item.href} className="group rounded-xl border bg-card p-6 transition hover:border-primary hover:shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">{item.label}</p>
              <h3 className="mt-3 text-xl font-semibold leading-snug group-hover:text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <span className="mt-5 block text-sm font-semibold text-primary">Explore the source-backed resource →</span>
            </a>
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
          <p className="mt-3 leading-7 text-muted-foreground">A quick guide to KTR coverage, sourcing, government resources, and corrections.</p>
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
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none tracking-tight sm:text-6xl">Keep Texas Red <span className="sr-only">(Keep TX Red)</span></h1>
            <p className="mt-3 max-w-3xl text-xl font-semibold text-white/90">Texas politics, elections, government and public affairs</p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">Keep TX Red examines Texas government decisions, legislative votes, public spending and policy. Read source-backed reporting, explore official records, and see clearly labeled conservative commentary without confusing opinion with the underlying facts.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/news" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Latest Texas News</Link>
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

      <BreakingStrip articles={valid} />
      <ElectionSeasonSpotlight />

      {latest.length === 0 && <ResearchSpotlight />}

      {latest.length > 0 ? (
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Latest coverage</p><h2 className="mt-2 font-display text-4xl">Texas political news</h2></div><Link to="/news" className="text-sm font-semibold text-primary hover:underline">View all news →</Link></div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{latest.map((article, index) => <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }} className="group block"><div className="aspect-[16/10] overflow-hidden rounded-lg bg-muted"><img src={images.get(article.slug) ?? heroFlag} alt="" width={640} height={400} loading={index === 0 ? "eager" : "lazy"} className={`size-full ${shouldContainArticleImage(images.get(article.slug) ?? heroFlag) ? "object-contain bg-white p-4" : "object-cover"} transition-transform group-hover:scale-[1.02]`} /></div><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{article.category ?? "Texas News"}</p><h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-primary">{article.title}</h3></Link>)}</div>
        <AdSlot placement="banner" />
      </section>
      ) : (
        <section className="mx-auto max-w-[1200px] px-6 pb-12 pt-4" aria-labelledby="ktr-previous-reporting">
          <div className="border-t pt-8">
            <h2 id="ktr-previous-reporting" className="font-display text-2xl">Previous verified reporting</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Read previously published news with its original dates and attributed sources. Older reports are not presented as new developments.</p>
            <Link to="/news" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Browse the dated news archive →</Link>
          </div>
        </section>
      )}

      <section className="border-y bg-muted/40"><div className="mx-auto grid max-w-[1200px] gap-5 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/texas-politics" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Texas Politics</h3><p className="mt-2 text-sm text-muted-foreground">Political reporting, public officials, policy debates, and government accountability.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <Link to="/texas-legislature" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Texas Legislature</h3><p className="mt-2 text-sm text-muted-foreground">Sessions, chambers, committees, lawmakers, and legislative resources.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Bills</h3><p className="mt-2 text-sm text-muted-foreground">Search and follow Texas legislation, actions, sponsors, and documents.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <a href="/texas-case" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">The Texas Case</h3><p className="mt-2 text-sm text-muted-foreground">Permanent KTR editorial positions backed by laws, data, and primary records.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></a>
      </div></section>

      {latest.length > 0 && <ResearchSpotlight />}
      <DiscoveryPriorityLinks />

      <section className="mx-auto grid max-w-[1200px] gap-8 px-6 py-16 md:grid-cols-[1fr_0.8fr] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Support independent coverage</p>
          <h2 className="mt-2 font-display text-4xl">Help make Texas coverage more useful</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Follow our dated reporting, share a documented tip or correction, and explore the Keep TX Red shop. Store purchases support independent reporting and platform operations.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/contact" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Send a tip or correction</Link>
            <Link to="/shop" search={EMPTY_SHOP_SEARCH} className="rounded-md border px-5 py-3 text-sm font-semibold">Visit the shop</Link>
          </div>
        </div>
        <aside className="rounded-xl border bg-muted/30 p-6">
          <h3 className="text-lg font-semibold">Our sourcing commitment</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">We identify reported sources, distinguish commentary from records, and welcome corrections with supporting evidence.</p>
          <Link to="/editorial-standards" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Read editorial standards →</Link>
        </aside>
      </section>

      <HomepageFaqs />
    </main>
  );
}
