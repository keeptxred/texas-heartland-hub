import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { LawGuideTopicGrid } from "@/components/laws/law-guide-topic-grid";
import { ARTICLES, isPublished } from "@/data/articles";
import { isStaticArticleIndexable } from "@/lib/static-article-indexability";
import { SITE_URL } from "@/lib/seo";

const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;

export const Route = createFileRoute("/laws/")({
  head: () => ({
    meta: [
      { title: "Texas Laws Explained: Important Texas Laws, Rights & Legislative Updates" },
      {
        name: "description",
        content:
          "The Keep TX Red guide to Texas laws — how statutes are made, what every resident should know about carry, elections, property tax, and the major bills that took effect in 2026.",
      },
      { property: "og:title", content: "Texas Laws Explained: Rights, Statutes & Legislative Updates" },
      { property: "og:description", content: "Plain-English breakdowns of the Texas statutes that shape daily life — carry, elections, property tax, and every major 2026 law." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/laws` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Texas Laws Explained",
          url: `${SITE_URL}/laws`,
          description: "Evergreen guide to Texas statutes, everyday laws, and legislative updates.",
          isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: `${SITE_URL}/` },
          about: [
            { "@type": "Thing", name: "Texas gun laws" },
            { "@type": "Thing", name: "Texas property tax laws" },
            { "@type": "Thing", name: "Texas election laws" },
            { "@type": "Thing", name: "Texas legislative updates" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Texas Laws", item: `${SITE_URL}/laws` },
          ],
        }),
      },
    ],
  }),
  component: LawsHubPage,
});

type LinkedArticle = { slug: string; title: string; blurb: string };

function articleLink(slug: string): LinkedArticle | null {
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a || !isPublished(a) || !isStaticArticleIndexable(a)) return null;
  return { slug: a.slug, title: a.title, blurb: a.dek };
}

const SECTIONS: {
  key: string;
  eyebrow: string;
  heading: string;
  intent: string;
  description: string;
  hubHref?: string;
  articleSlugs: string[];
}[] = [
  {
    key: "explained",
    eyebrow: "Section 1",
    heading: "Texas Laws Explained",
    intent: "For residents who want to understand the major statutes.",
    description:
      "The bills that decide how Texans carry, how homeowners pay, how voters cast a ballot, and what the state can do at the border. Each guide is written in plain English with citations to the actual code.",
    hubHref: "/laws/topics",
    articleSlugs: [
      "texas-gun-laws-explained",
      "texas-property-tax-laws-explained",
      "texas-election-laws-explained",
      "constitutional-carry-one-year-later",
      "how-a-bill-becomes-texas-law",
    ],
  },
  {
    key: "know",
    eyebrow: "Section 2",
    heading: "Laws You Should Know",
    intent: "For anyone who lives in Texas and just wants to stay out of trouble.",
    description:
      "Open-records rights, voting rules, school-board authority, and carry law — durable legal explainers for Texans who want the governing rules without mixing in homeowner tax-service content.",
    articleSlugs: [
      "texas-open-meetings-public-info",
      "texas-voter-registration-guide",
      "texas-school-board-powers",
      "constitutional-carry-one-year-later",
    ],
  },
  {
    key: "updates",
    eyebrow: "Section 3",
    heading: "Legislative Updates",
    intent: "For readers tracking what's changing in Austin right now.",
    description:
      "Enacted Texas laws, verified effective dates, legislative proposals, and constitutional amendments scheduled through the official election process.",
    hubHref: "/bills",
    articleSlugs: [
      "texas-new-laws-2026",
      "property-tax-relief-package",
      "speaker-special-session",
      "texas-constitutional-amendments-guide",
    ],
  },
];

const INTRO_FAQ = [
  {
    q: "How are laws actually created in Texas?",
    a: "The Texas Legislature meets in regular session for 140 days every odd-numbered year. A bill generally must pass both chambers in identical form, then be signed, allowed to become law without signature, or enacted over a veto. Each enacted law's effective-date provision controls.",
  },
  {
    q: "What is the difference between a Texas statute, a regulation, and a local rule?",
    a: "A statute is a law passed by the Legislature. A regulation is a rule adopted by a state agency to implement a statute, published in the Texas Register. A local rule is a city, county, ISD, or special-district ordinance that operates within the space state law allows.",
  },
  {
    q: "How can Texans stay informed about legal changes?",
    a: "Check official Secretary of State notices for amendment elections and actual ballot measures, follow bill trackers during legislative sessions, and review appraisal and tax notices when issued.",
  },
  {
    q: "Do federal laws override Texas laws?",
    a: "Where federal and state law directly conflict on a matter within federal authority, federal law controls under the Supremacy Clause. Many areas — property, criminal law, elections administration, family law — are primarily state responsibilities where Texas law is the operative rule.",
  },
];

function LawsHubPage() {
  const sections = SECTIONS.map((s) => ({
    ...s,
    articles: s.articleSlugs.map(articleLink).filter((x): x is LinkedArticle => Boolean(x)),
  }));

  return (
    <>
      <PageHero
        eyebrow="Know Your Rights"
        title="Texas Laws Explained:"
        highlight="Rights, Statutes & Updates"
        description="Important Texas laws, everyday rights, and legislative updates — written in plain English for residents, homeowners, and voters."
      />

      <nav aria-label="Find Texas law by category" className="mx-auto max-w-6xl px-4 pt-10">
        <h2 className="font-display text-3xl tracking-tight">Find Texas laws by topic</h2>
        <p className="mt-2 text-muted-foreground">Start with an everyday legal question, browse the complete law library, or consult the controlling code.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Driving & Traffic", "/laws/topic/driving-traffic-insurance-law"],
            ["Landlord & Tenant", "/laws/topic/landlord-tenant-rentals-law"],
            ["Firearms & Self-Defense", "/laws/topic/self-defense-use-of-force"],
            ["Family & Child Support", "/laws/topics"],
            ["Employment", "/laws/topics"],
            ["Consumer Rights", "/laws/topics"],
            ["Elections", "/laws/topic/election-law"],
            ["Criminal Law", "/laws/topics"],
          ].map(([label, href]) => <a key={href} href={href} className="border-2 border-border bg-card px-4 py-4 text-sm font-bold hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{label} →</a>)}
        </div>
        <div className="mt-5 flex flex-wrap gap-5 text-sm">
          <Link to="/laws/topics" className="font-semibold text-primary underline underline-offset-4">Browse full Texas law-topic library →</Link>
          <Link to="/laws/topic/property-tax-law" className="font-semibold text-primary underline underline-offset-4">Texas property tax law →</Link>
          <a href="https://statutes.capitol.texas.gov/" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">Official Texas statutes ↗</a>
          <a href="https://www.sos.state.tx.us/elections/" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">Official elections and ballot notices ↗</a>
        </div>
      </nav>



      <LawGuideTopicGrid topic="driving" />

      <article className="mx-auto max-w-4xl px-4 py-10 space-y-6 text-base leading-relaxed">
        <p className="text-lg font-serif text-muted-foreground">
          Texas law is one of the most consequential things about living in Texas, and one of the least
          taught. Between the Texas Constitution, the biennial statutes passed by the Legislature, the
          rules adopted by state agencies, and the ordinances of 254 counties and thousands of cities and
          special districts, most residents encounter a piece of Texas law every day without recognizing
          it as such — the property tax bill, the driver's license renewal, the ballot in March, the
          restaurant that posts a 30.06 sign on the front door. This page is the Keep TX Red index of the
          Texas statutes that matter most, organized so a homeowner, a new resident, a voter, or a small
          business owner can find what they need in one place.
        </p>

        <h2 className="font-display text-2xl md:text-3xl tracking-tight pt-6 border-b-2 border-foreground pb-2">
          How Texas Laws Are Created
        </h2>
        <p>
          The Texas Legislature is a bicameral body of 31 state senators and 150 state representatives
          that meets in regular session for 140 days every odd-numbered year. In the usual process, a legislator files a bill, the bill is referred to a committee,
          and it may receive a hearing, a committee vote, floor consideration, amendments, and a chamber vote.
          The other chamber considers the bill under its own rules. Differences may be resolved through
          concurrence or a conference committee. A bill approved in identical form is sent to the governor. The governor may sign, may
          veto, or may allow the bill to become law without signature. September 1 is a common effective date, but each act's effective-date provision controls;
          some measures take effect immediately with the constitutionally required vote, and others take effect later.
        </p>
        <p>
          Between sessions, the governor may call a special session limited to topics the governor
          designates. That mechanism has been used repeatedly in recent years to address property tax
          relief, border security, and school choice. For the full walkthrough, see our guide to{" "}
          <Link to="/news/$slug" params={{ slug: "how-a-bill-becomes-texas-law" }} className="text-primary underline underline-offset-4">
            How a Bill Becomes Texas Law
          </Link>
          .
        </p>

        <h2 className="font-display text-2xl md:text-3xl tracking-tight pt-6 border-b-2 border-foreground pb-2">
          Statutes, Regulations, and Local Rules — The Three Levels of Texas Law
        </h2>
        <p>
          A Texas statute is a law enacted through the legislative process. Bills can also become law
          over a veto when the Legislature overrides it. Statutes are collected in the Texas codes — Penal, Property, Tax, Election, Family,
          Government, Health & Safety, Labor, Transportation, and dozens more — each searchable through
          Texas Legislature Online.
        </p>
        <p>
          A regulation is a rule adopted by a state agency to implement a statute. Regulations are proposed
          in the Texas Register, receive public comment, and are adopted through an administrative process
          that carries the force of law within the statutory grant. Property tax administration rules from
          the Comptroller, election forms from the Secretary of State, and firearm license rules from the
          Department of Public Safety all live at the regulation layer.
        </p>
        <p>
          Local rules — ordinances, resolutions, orders, and policies adopted by city councils,
          commissioners courts, school boards, MUD boards, and other local bodies — operate within the
          space state law allows. Texas is a Dillon's Rule state modified by a home-rule provision for
          larger cities, which gives municipalities broad authority over local matters unless preempted by
          state statute. Preemption is a live debate in areas including short-term rental rules,
          firearms regulations, and employment law.
        </p>

        <h2 className="font-display text-2xl md:text-3xl tracking-tight pt-6 border-b-2 border-foreground pb-2">
          Who Texas Law Actually Affects
        </h2>
        <p>
          Residents encounter Texas law most directly through the Penal Code (criminal offenses), the
          Transportation Code (driving, licensing, insurance), and the Family Code (marriage, divorce,
          custody). Homeowners are governed by the Property Tax Code and the Property Code, which set
          out everything from residence homestead protections to landlord-tenant obligations. Families
          rely on the Education Code and the Family Code for the schools their children attend and the
          protections they receive. Voters operate under the Election Code, one of the most detailed
          election statutes in the country. Businesses navigate the Business Organizations Code, the Tax
          Code (franchise tax), the Occupations Code (licensing), and the Labor Code.
        </p>
        <p>
          Two structural features distinguish Texas from most other states. First, the state has no
          personal income tax, subject to a constitutional prohibition on individual income tax adopted in 2019; funding shifts onto
          property and sales tax, which is why the Property Tax Code is the statute most Texas households
          feel most acutely. Second, Texas leaves an unusual amount of authority to counties and school
          districts — 254 counties, more than 1,000 ISDs, plus municipal utility and emergency-services
          districts. What your neighbors ten miles away actually pay, and how their schools operate, can
          look nothing like what you pay and how yours does.
        </p>

        <h2 className="font-display text-2xl md:text-3xl tracking-tight pt-6 border-b-2 border-foreground pb-2">
          How Texans Stay Informed About Legal Changes
        </h2>
        <p>
          The Legislative Reference Library, Texas Legislature Online, and the Texas Register are the
          primary official sources. Every filed bill is tracked online with committee history, roll-call
          votes, and the final enrolled text. A proposed constitutional amendment appears on the ballot only when submitted to voters
          under the process in Article XVII of the Texas Constitution; check the Secretary of State
          for the actual election date and certified ballot measures. Annual property tax notices provide truth-in-taxation figures for every taxing
          entity that reaches your parcel.
        </p>
        <p>
          For a working reader, three habits cover most of it: check the Secretary of State's official constitutional-amendment election calendar,
          review your appraisal notice when issued, and follow ongoing coverage from a
          state-focused newsroom during session. Keep TX Red maintains the{" "}
          <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="text-primary underline underline-offset-4">
            Texas bill tracker
          </Link>{" "}
          during and after each session and maintains the evergreen guides below.
        </p>
      </article>

      {sections.map((section) => (
        <section key={section.key} className="border-t-4 border-foreground/10 bg-secondary/5">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">★ {section.eyebrow}</span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-2">{section.heading}</h2>
            <p className="mt-3 max-w-3xl font-serif text-lg text-muted-foreground">{section.description}</p>
            <p className="mt-1 max-w-3xl text-sm uppercase tracking-wide text-primary/80">{section.intent}</p>

            <div className="grid md:grid-cols-2 gap-5 mt-8">
              {section.articles.map((a) => (
                <Link
                  key={a.slug}
                  to="/news/$slug"
                  params={{ slug: a.slug }}
                  className="block border-2 border-foreground/10 bg-card p-6 hover:border-primary transition-colors"
                >
                  <h3 className="font-display text-xl tracking-tight leading-snug group-hover:underline">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.blurb}</p>
                  <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-primary">Read the guide →</span>
                </Link>
              ))}
            </div>

            {section.hubHref === "/bills" ? (
              <Link
                to="/bills"
                search={EMPTY_BILLS_SEARCH}
                className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline"
              >
                Full {section.heading} hub →
              </Link>
            ) : section.hubHref ? (
              <Link
                to={section.hubHref}
                className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline"
              >
                Full {section.heading} hub →
              </Link>
            ) : null}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="font-display text-3xl tracking-tight border-b-2 border-foreground pb-2">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-6">
          {INTRO_FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="font-display text-lg tracking-tight">{f.q}</h3>
              <p className="mt-1 text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: INTRO_FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
