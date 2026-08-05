import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { getDailyArticles, type DailyArticle } from "@/lib/daily-news.functions";
import { assignUniqueImages } from "@/lib/dedupe-images";
import { AdSlot } from "@/components/ad-slot";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ELECTION_FEATURE_FLAGS } from "@/lib/elections";
import { ElectionRepositoryProvider } from "@/lib/elections/repositories";
import { ElectionHomePage } from "@/pages/elections";
import { buildSeo, organizationJsonLd, SITE_URL, webPageJsonLd, websiteJsonLd } from "@/lib/seo";

const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;
const EMPTY_SHOP_SEARCH = { category: undefined, collection: undefined, q: undefined, sort: undefined } as const;

function homepageHead() {
  const electionTakeover = ELECTION_FEATURE_FLAGS.homepagePromotion;
  const title = electionTakeover
    ? "Texas Election Central 2026 | Races, Candidates, Polls & Voting"
    : "Keep TX Red | Texas Politics, Elections, Bills & News";
  const description = electionTakeover
    ? "Follow verified Texas 2026 election races, candidates, polling, forecasts, results, and voting information from Keep TX Red Election Central."
    : "Independent Texas political news, election coverage, legislative tracking, government accountability, statewide reporting, and civic resources.";
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
        ],
      }),
    }],
  };
}

export const Route = createFileRoute("/")({ head: homepageHead, loader: () => getDailyArticles(), component: Index });

function Index() {
  return ELECTION_FEATURE_FLAGS.homepagePromotion ? (
    <ElectionRepositoryProvider><ElectionHomePage /></ElectionRepositoryProvider>
  ) : <PoliticalHomepage />;
}

function PoliticalHomepage() {
  const { articles } = Route.useLoaderData() as { articles: DailyArticle[] };
  const valid = articles.filter((article) => article.slug && article.title);
  const breaking = valid.filter((article) => article.is_breaking).slice(0, 3);
  const latest = valid.slice(0, 9);
  const images = assignUniqueImages(latest, (article) => article.slug, (article) => article.featured_image_url ?? article.image_url ?? heroFlag, (article) => article.category);

  return (
    <main className="bg-background">
      <section className="border-b bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Texas politics. Verified facts. Clear context.</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-none tracking-tight sm:text-6xl">Follow the decisions shaping Texas</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">Keep TX Red covers elections, bills, the Legislature, public officials, government accountability, statewide breaking news, and the policy debates that affect Texans.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/elections/2026" className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Election Central</Link>
              <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold">Track Texas bills</Link>
              <Link to="/texas-politics" className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold">Texas politics</Link>
            </div>
          </div>
          <aside className="rounded-xl border border-white/15 bg-white/5 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Start here</p>
            <nav className="mt-4 grid gap-3">
              {[["Find your representatives", "/find-representative"], ["Read legislative updates", "/legislative-updates"], ["Register to vote", "/register-to-vote"], ["Contact Texas legislators", "/contact-legislators"], ["Browse Texas laws", "/texas-laws"]].map(([label, to]) => <Link key={to} to={to} className="flex justify-between border-b border-white/10 py-2 text-sm font-semibold hover:text-primary"><span>{label}</span><span aria-hidden>→</span></Link>)}
            </nav>
          </aside>
        </div>
      </section>

      {breaking.length > 0 && <section className="border-b bg-primary text-primary-foreground"><div className="mx-auto max-w-[1200px] px-6 py-6"><p className="text-xs font-bold uppercase tracking-[0.2em]">Breaking</p><div className="mt-3 grid gap-4 md:grid-cols-3">{breaking.map((article) => <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }} className="font-semibold hover:underline">{article.title}</Link>)}</div></div></section>}

      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Latest coverage</p><h2 className="mt-2 font-display text-4xl">Texas News</h2></div><Link to="/news" className="text-sm font-semibold text-primary hover:underline">View all news →</Link></div>
        {latest.length === 0 ? <p className="mt-8 text-muted-foreground">New coverage is being prepared.</p> : <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{latest.map((article, index) => <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }} className="group block"><div className="aspect-[16/10] overflow-hidden rounded-lg bg-muted"><img src={images.get(article.slug) ?? heroFlag} alt="" width={640} height={400} loading={index === 0 ? "eager" : "lazy"} className="size-full object-cover transition-transform group-hover:scale-[1.02]" /></div><p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{article.category ?? "Texas News"}</p><h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-primary">{article.title}</h3></Link>)}</div>}
        <AdSlot placement="banner" />
      </section>

      <section className="border-y bg-muted/40"><div className="mx-auto grid max-w-[1200px] gap-5 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/elections/2026" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Elections</h3><p className="mt-2 text-sm text-muted-foreground">Candidates, races, polling, forecasts, voting information, and results.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <Link to="/texas-legislature" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Texas Legislature</h3><p className="mt-2 text-sm text-muted-foreground">Sessions, chambers, committees, lawmakers, and legislative resources.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Bills</h3><p className="mt-2 text-sm text-muted-foreground">Search and follow Texas legislation, actions, sponsors, and documents.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
        <Link to="/texas-politics" className="rounded-xl border bg-card p-5 hover:shadow-md"><h3 className="font-semibold">Government accountability</h3><p className="mt-2 text-sm text-muted-foreground">Reporting and analysis of public officials, agencies, ethics, and policy.</p><span className="mt-4 block text-sm font-semibold text-primary">Open →</span></Link>
      </div></section>

      <section className="mx-auto grid max-w-[1200px] gap-8 px-6 py-16 md:grid-cols-[1fr_0.8fr] md:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Support independent coverage</p><h2 className="mt-2 font-display text-4xl">Stay informed and support the newsroom</h2><p className="mt-4 max-w-2xl text-muted-foreground">Subscribe for important Texas updates and visit the Keep TX Red shop. Store purchases support independent reporting and platform operations.</p><div className="mt-6"><Link to="/shop" search={EMPTY_SHOP_SEARCH} className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Visit the shop</Link></div></div><NewsletterSignup /></section>
    </main>
  );
}
