import { createFileRoute, Link } from "@tanstack/react-router";

const URL_SELF = "https://keeptxred.com/about-keep-texas-red";
const TITLE = "About Keep Texas Red | Texas Politics, Elections & News";
const DESC =
  "Learn about Keep Texas Red (KeepTXRed), an independent Texas publication covering politics, elections, legislation, public officials, statewide news, business, and civic life.";

export const Route = createFileRoute("/about-keep-texas-red")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL_SELF },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL_SELF }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: TITLE,
          url: URL_SELF,
          about: {
            "@type": "NewsMediaOrganization",
            name: "Keep Texas Red",
            alternateName: ["Keep TX Red", "KeepTXRed"],
            url: "https://keeptxred.com/",
            logo: "https://keeptxred.com/__l5e/assets-v1/44ccd7e8-589f-48c9-b255-0b52bb83c041/red-texas-icon.png",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com/" },
            { "@type": "ListItem", position: 2, name: "About Keep Texas Red", item: URL_SELF },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is Keep Texas Red?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Keep Texas Red is an independent Texas publication covering state politics, elections, legislation, public officials, statewide news, business, and civic affairs.",
              },
            },
            {
              "@type": "Question",
              name: "What resources does Keep Texas Red provide?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Keep Texas Red provides election coverage, candidate and race pages, bill and legislative tracking, representative profiles, voter resources, political analysis, and daily Texas news.",
              },
            },
            {
              "@type": "Question",
              name: "Is Keep Texas Red affiliated with a campaign?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Keep Texas Red is independently operated and is not authorized by any candidate or candidate committee.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: AboutKeepTexasRed,
});

function AboutKeepTexasRed() {
  return (
    <main className="mx-auto max-w-[820px] px-6 py-16">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>About Keep Texas Red</span>
      </nav>

      <h1 className="font-sans text-4xl font-semibold leading-[1.15] tracking-tight text-foreground md:text-5xl">
        About Keep Texas Red
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        <strong>Keep Texas Red</strong>, also known as <strong>Keep TX Red</strong> and <strong>KeepTXRed</strong>,
        is an independent publication focused on the decisions, elections, officials, legislation, and
        public debates shaping Texas.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-foreground">What we cover</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Our reporting and reference pages help readers follow Texas government from campaigns and
          election results through legislative action and implementation. We also cover statewide news,
          the Texas economy, major businesses, regional developments, and Texas sports when those stories
          matter to readers across the state.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas politics</Link> and government accountability.</li>
          <li><Link to="/elections/2026" className="text-primary hover:underline">Election Central</Link>, including candidates, races, polls, forecasts, and results.</li>
          <li><Link to="/bills" className="text-primary hover:underline">Texas bill tracking</Link> and legislative documents.</li>
          <li><Link to="/texas-legislature" className="text-primary hover:underline">Texas Legislature</Link> coverage and session information.</li>
          <li><Link to="/representatives" className="text-primary hover:underline">Public-official profiles</Link> and representative lookup resources.</li>
          <li><Link to="/texas-news" className="text-primary hover:underline">Texas news</Link>, business, regional coverage, and major statewide developments.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Our mission</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Our goal is to make Texas public affairs easier to follow. That means connecting news stories
          to the candidates, districts, offices, bills, committees, elections, and laws behind them instead
          of treating each headline as an isolated event.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Voter and civic resources</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Keep Texas Red maintains practical civic resources alongside its reporting:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
          <li><Link to="/find-representative" className="text-primary hover:underline">Find My Representative</Link>.</li>
          <li><Link to="/register-to-vote" className="text-primary hover:underline">Register to Vote in Texas</Link>.</li>
          <li><Link to="/county-elections" className="text-primary hover:underline">County Elections</Link>.</li>
          <li><Link to="/candidate-guides" className="text-primary hover:underline">Candidate Guides</Link>.</li>
          <li><Link to="/voting-locations" className="text-primary hover:underline">Voting Locations</Link>.</li>
          <li><Link to="/contact-legislators" className="text-primary hover:underline">Contact Texas Legislators</Link>.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Independent operation</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Keep Texas Red is independently operated and is not authorized by any candidate or candidate&apos;s
          committee. Read our <Link to="/editorial-standards" className="text-primary hover:underline">editorial standards</Link>,
          visit the <Link to="/about" className="text-primary hover:underline">main About page</Link>, or
          use our <Link to="/contact" className="text-primary hover:underline">contact page</Link> for questions.
        </p>
      </section>
    </main>
  );
}