import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { listSportsByTopic, type SportsListItem } from "@/lib/sports.functions";
import { SPORTS_TOPIC_SLUGS, type SportsTopicSlug } from "@/lib/sports-taxonomy";
import { resolveArticleImage } from "@/lib/seo-headline";
import { MIN_ARTICLES_DEFAULT, isReadyFromItems } from "@/lib/content-readiness";

const TOPIC_META: Record<SportsTopicSlug, { name: string; title: string; desc: string }> = {
  latest: { name: "Latest", title: "Latest Texas Sports News", desc: "The newest Texas sports reporting across pro teams, colleges, motorsports and sports policy." },
  trending: { name: "Trending", title: "Trending Texas Sports", desc: "Texas sports stories with the strongest current Viral Radar signals, ranked by score and trend velocity." },
  football: { name: "Football", title: "Texas Football News", desc: "Cowboys, Texans, major college programs and the football stories shaping Texas." },
  baseball: { name: "Baseball", title: "Texas Baseball News", desc: "Astros, Rangers, college baseball and the biggest baseball stories across Texas." },
  basketball: { name: "Basketball", title: "Texas Basketball News", desc: "Spurs, Rockets, Mavericks, Wings and college basketball coverage from across Texas." },
  hockey: { name: "Hockey", title: "Texas Hockey News", desc: "Dallas Stars and hockey coverage with a Texas focus." },
  soccer: { name: "Soccer", title: "Texas Soccer News", desc: "Austin FC, FC Dallas, Houston Dynamo, Houston Dash and major soccer events in Texas." },
  college: { name: "College Sports", title: "Texas College Sports News", desc: "Major Texas athletic programs, football, basketball, baseball, recruiting, conferences and college sports business." },
  recruiting: { name: "Recruiting", title: "Texas College Recruiting News", desc: "Recruiting, commitments, signing periods and prospects affecting major Texas college programs." },
  nil: { name: "NIL", title: "Texas NIL & College Athlete Compensation", desc: "Texas coverage of NIL, revenue sharing, collectives and the rules shaping college athlete compensation." },
  "business-policy": { name: "Sports Business & Policy", title: "Texas Sports Business & Policy", desc: "Stadium finance, sports betting, taxpayer funding, university athletic spending and policy decisions shaping Texas sports." },
  stadiums: { name: "Stadiums", title: "Texas Stadium Finance & Development", desc: "Stadium and arena finance, public funding, tax incentives and major sports facility developments in Texas." },
  motorsports: { name: "Motorsports", title: "Texas Motorsports News", desc: "Formula 1 at COTA, NASCAR, Texas Motor Speedway and major motorsports developments in Texas." },
  postseason: { name: "Postseason", title: "Texas Playoffs & Postseason", desc: "Playoff, bowl, championship and postseason coverage for Texas teams and programs." },
  transactions: { name: "Transactions", title: "Texas Sports Trades, Signings & Transfers", desc: "Trades, free agency, roster moves and college transfer-portal developments affecting Texas teams." },
  injuries: { name: "Injuries", title: "Texas Sports Injury News", desc: "Significant injury developments affecting Texas professional and college teams." },
  rivalries: { name: "Rivalries", title: "Texas Sports Rivalries", desc: "The rivalries connecting Texas teams and programs, from pro leagues to college competition." },
};

function isTopic(value: string): value is SportsTopicSlug {
  return (SPORTS_TOPIC_SLUGS as readonly string[]).includes(value);
}

export const Route = createFileRoute("/texas-sports/topic/$topic")({
  loader: async ({ params }) => {
    const topic = params.topic.toLowerCase();
    if (!isTopic(topic)) throw notFound();
    const { items } = await listSportsByTopic({ data: { topic, limit: 36 } });
    return { topic, items };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const meta = TOPIC_META[loaderData.topic];
    const url = `https://keeptxred.com/texas-sports/topic/${loaderData.topic}`;
    const thin = !isReadyFromItems(loaderData.items, MIN_ARTICLES_DEFAULT);
    return {
      meta: [
        { title: `${meta.title} | Keep TX Red` },
        { name: "description", content: meta.desc },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        ...(thin ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: meta.title, description: meta.desc, url }) }],
    };
  },
  component: TopicPage,
});

function StoryCard({ article }: { article: SportsListItem }) {
  return <Link to="/news/$slug" params={{ slug: article.slug }} className="group overflow-hidden rounded-lg border border-border bg-card hover:shadow-md transition-shadow"><img src={resolveArticleImage(article)} alt={article.image_alt_text || article.title} loading="lazy" className="h-44 w-full object-cover"/><div className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{article.category}</p><h2 className="mt-2 text-lg font-semibold leading-snug group-hover:text-primary">{article.title}</h2>{article.dek && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{article.dek}</p>}<p className="mt-3 text-xs text-muted-foreground">{new Date(article.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div></Link>;
}

function TopicPage() {
  const { topic, items } = Route.useLoaderData();
  const meta = TOPIC_META[topic];
  return <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 sm:py-14">
    <nav className="mb-4 text-xs text-muted-foreground"><Link to="/texas-sports" className="hover:underline">Texas Sports</Link><span className="mx-2">/</span><span>{meta.name}</span></nav>
    <header className="border-b border-border pb-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Texas Sports · {meta.name}</p><h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{meta.title}</h1><p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{meta.desc}</p></header>
    <section className="py-10">{items.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((article) => <StoryCard key={article.slug} article={article} />)}</div> : <div className="rounded-lg border border-dashed p-8"><h2 className="font-semibold">Coverage is being built</h2><p className="mt-2 text-sm text-muted-foreground">This topic page remains out of the index until enough qualifying coverage has published.</p></div>}</section>
    <section className="border-t border-border pt-8"><h2 className="text-xl font-semibold">Explore Texas Sports</h2><div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">{SPORTS_TOPIC_SLUGS.filter((other) => other !== topic).slice(0, 10).map((other) => <Link key={other} to="/texas-sports/topic/$topic" params={{ topic: other }} className="text-primary hover:underline">{TOPIC_META[other].name} →</Link>)}<Link to="/texas-sports" className="text-primary hover:underline">Sports home →</Link></div></section>
  </main>;
}
