import { createFileRoute, Link } from "@tanstack/react-router";
import { getArticlesByCategory } from "@/lib/category-feed.functions";
import { buildSeo, SITE_URL } from "@/lib/seo";

const URL = `${SITE_URL}/houston`;
const TITLE = "Houston News, Government & Public Records";
const DESCRIPTION =
  "Follow Houston and Harris County government, budgets, elections and port decisions through official public records and local reporting.";

export function houstonHead() {
  const seo = buildSeo({
    title: TITLE,
    description: DESCRIPTION,
    path: "/houston",
    type: "website",
    imageAlt: "Keep TX Red Houston news coverage",
  });

  return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Houston News, Government & Public Records | Keep TX Red",
          description: DESCRIPTION,
          url: URL,
          about: [
            { "@type": "City", name: "Houston" },
            { "@type": "AdministrativeArea", name: "Harris County" },
          ],
          isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: `${SITE_URL}/` },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Houston", item: URL },
          ],
        }),
      },
    ],
  };
}

export const Route = createFileRoute("/houston")({
  loader: () =>
    getArticlesByCategory({
      data: { region: "houston", limit: 18, order: "newest" },
    }),
  head: houstonHead,
  component: HoustonPage,
});

function HoustonPage() {
  const articles = Route.useLoaderData();

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-14">
      <header className="border-b border-border pb-8 mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Houston &amp; Gulf Coast</p>
        <h1 className="mt-2 font-display text-4xl md:text-6xl tracking-tight">Houston News, Government &amp; Public Records</h1>
        <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
          Local government, elections, courts, public safety, energy, business, and state-policy decisions affecting Houston, Harris County, and the Gulf Coast.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/county-elections" className="text-primary hover:underline">County election offices →</Link>
          <Link to="/texas-economy" className="text-primary hover:underline">Texas economy →</Link>
          <Link to="/texas-government" className="text-primary hover:underline">Texas government →</Link>
          <Link to="/laws" className="text-primary hover:underline">Texas Laws →</Link>
        </div>
      </header>

      <section aria-labelledby="houston-government" className="mb-12 space-y-5">
        <h2 id="houston-government" className="font-display text-3xl">Who makes decisions affecting Houston?</h2>
        <p className="leading-relaxed">The City of Houston and Harris County are different governments. A city ordinance, a county road project, a school district tax rate and a Port Commission contract may affect the same household, but each belongs to a different governing body. Begin with the jurisdiction responsible for the decision rather than assuming every Houston-area issue is handled at City Hall.</p>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="border border-border p-5 rounded-md">
            <h3 className="font-bold text-xl">City Council and municipal spending</h3>
            <p className="mt-2 leading-relaxed">For city ordinances, municipal contracts and council votes, start with the City Secretary's agenda and archived minutes. Compare a proposed item with the recorded action before treating it as approved. The city's adopted operating budget and raw budget data help distinguish appropriations from actual expenditures.</p>
            <p className="mt-3"><a className="text-primary underline" href="https://www.houstontx.gov/citysec">City Secretary and council records</a> · <a className="text-primary underline" href="https://www.houstontx.gov/budget/">City operating budgets</a></p>
          </article>
          <article className="border border-border p-5 rounded-md">
            <h3 className="font-bold text-xl">Harris County Commissioners Court</h3>
            <p className="mt-2 leading-relaxed">The county publishes meeting agendas and supporting materials. Look for the item number, requested action, department and any attached contract or cost estimate. Check the minutes or meeting record afterward. County budget documents are maintained separately from Houston's municipal budget.</p>
            <p className="mt-3"><a className="text-primary underline" href="https://agenda.harriscountytx.gov/">Commissioners Court agendas</a> · <a className="text-primary underline" href="https://budget.harriscountytx.gov/budget.aspx">County budget documents</a></p>
          </article>
          <article className="border border-border p-5 rounded-md">
            <h3 className="font-bold text-xl">Elections and representation</h3>
            <p className="mt-2 leading-relaxed">Houston's regional population extends beyond a single election jurisdiction. Use the county where you are registered to check the current election, sample ballot, polling arrangements and applicable deadlines. Your municipal district, county precinct and state legislative district are distinct boundaries.</p>
            <p className="mt-3"><a className="text-primary underline" href="https://www.harrisvotes.com/Voter/Election-Information">Harris County election information</a> · <Link className="text-primary underline" to="/find-representative">Find your representatives</Link></p>
          </article>
          <article className="border border-border p-5 rounded-md">
            <h3 className="font-bold text-xl">Port Houston and Gulf Coast business</h3>
            <p className="mt-2 leading-relaxed">Port Commission agendas, minutes and public meeting documents identify proposed contracts and infrastructure decisions. Check the recorded approval and the contract's scope separately; an authorization amount is not proof that the full sum has already been paid.</p>
            <p className="mt-3"><a className="text-primary underline" href="https://porthouston.com/about/public-meetings/agendas-minutes/">Port Commission records</a> · <Link className="text-primary underline" to="/texas-economy">State economic context</Link></p>
          </article>
        </div>
        <h3 className="font-bold text-xl">How to verify a Houston government story</h3>
        <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
          <li>Identify the governing body, meeting date and agenda item or document number.</li>
          <li>Read the supporting documents; separate a recommendation, proposed budget or staff estimate from an adopted action.</li>
          <li>Check the vote, minutes and any final ordinance or contract. Note whether implementation requires further approvals.</li>
          <li>For money claims, compare the same fiscal year and distinguish operating expenses, capital projects, and actual payments.</li>
          <li>When a record is missing, request the specific document from the agency that holds it. A records request is different from asking an agency to create an explanation.</li>
        </ol>
        <p className="leading-relaxed"><a href="https://www.houstontx.gov/pia" className="text-primary underline">Houston public information requests</a> · <Link to="/news/$slug" params={{ slug: "texas-open-meetings-public-info" }} className="text-primary underline">Texas open meetings and public information law</Link> · <Link to="/news/$slug" params={{ slug: "what-local-governments-control" }} className="text-primary underline">What local governments control</Link></p>
        <p className="text-xs text-muted-foreground">Official resource links reviewed November 24, 2026. The reporting feed below retains original publication dates; this reference section does not imply that a new local story has been published today.</p>
      </section>

      <section aria-labelledby="latest-houston-news">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Latest coverage</p>
            <h2 id="latest-houston-news" className="mt-1 font-display text-3xl">Houston-area reporting</h2>
          </div>
          <Link to="/news" className="text-sm text-primary hover:underline">All Texas news →</Link>
        </div>

        {articles.length === 0 ? (
          <div className="py-12 text-sm text-muted-foreground">
            No Houston-area stories are available in the current feed. Browse the <Link to="/news" className="text-primary underline">Texas newsroom</Link> for the latest statewide coverage.
          </div>
        ) : (
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const image = article.featured_image_url || article.image_url;
              const headline = article.seo_headline?.trim() || article.title;
              return (
                <article key={article.slug} className="group">
                  <Link to="/news/$slug" params={{ slug: article.slug }} className="block">
                    {image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-muted mb-3">
                        <img
                          src={image}
                          alt={article.image_alt_text?.trim() || headline}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : null}
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{article.category}</p>
                    <h3 className="mt-1 font-serif text-xl font-bold leading-snug group-hover:underline underline-offset-4">{headline}</h3>
                    {article.dek ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{article.dek}</p> : null}
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
