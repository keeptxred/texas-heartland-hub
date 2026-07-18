import { createFileRoute, Link } from "@tanstack/react-router";

const URL_SELF = "https://keeptxred.com/about-keep-texas-red";
const TITLE = "About Keep Texas Red | Texas Relocation Tools & Resources";
const DESC =
  "Learn about Keep Texas Red (KeepTXRed) — an independent hub of Texas relocation tools, calculators, and resources for Texans and people moving to Texas.";

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
            "@type": "Organization",
            name: "Keep Texas Red",
            alternateName: ["Keep TX Red", "KeepTXRed"],
            url: "https://keeptxred.com/",
            logo: "https://keeptxred.com/favicon.ico",
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
                text: "Keep Texas Red (KeepTXRed) is an independent Texas resource site offering relocation tools, calculators, and daily news covering Texas politics, economy, and culture.",
              },
            },
            {
              "@type": "Question",
              name: "What resources does Keep Texas Red provide?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Keep Texas Red publishes Texas relocation resources, a property-tax relief calculator, DMV and school-district finders, representative and legislator lookups, voter guides, and daily Texas news.",
              },
            },
            {
              "@type": "Question",
              name: "Who is Keep Texas Red designed for?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Keep Texas Red is built for current Texans, new residents relocating to Texas, and anyone researching Texas taxes, elections, government, and cost of living.",
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
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>About Keep Texas Red</span>
      </nav>

      <h1 className="font-sans text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] text-foreground">
        About Keep Texas Red
      </h1>
      <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
        <strong>Keep Texas Red</strong> (also known as <strong>KeepTXRed</strong>) is an independent
        Texas resource site. We build and maintain <Link to="/" className="text-primary hover:underline">Texas relocation resources</Link>,
        calculators, and everyday reference tools for Texans and people moving to Texas — alongside
        daily reporting on the news, politics, and policy shaping the state.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-foreground">What Keep Texas Red is</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Keep Texas Red is a single, independent hub that combines practical Texas tools with
          straightforward Texas news. Instead of scattering answers across dozens of state and
          county websites, we bring the most useful Texas-specific resources together in one place
          — searchable, mobile-friendly, and free to use.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Our mission</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          To make it easier to live in, move to, and understand Texas. Keep Texas Red exists to help
          Texans and new residents make informed decisions about taxes, voting, government, and
          daily life — with accurate tools and clear reporting.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Texas relocation resources</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Moving to Texas involves new tax rules, new agencies, and new districts. Our relocation
          resources help you get oriented quickly:
        </p>
        <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-6">
          <li><Link to="/find-my-dmv" className="text-primary hover:underline">Find My DMV</Link> — locate your Texas county tax office and DPS driver license center.</li>
          <li><Link to="/find-my-school-district" className="text-primary hover:underline">Find My School District</Link> — look up your Texas public school district by address.</li>
          <li><Link to="/find-representative" className="text-primary hover:underline">Find My Representative</Link> — identify your Texas state and federal representatives.</li>
          <li><Link to="/register-to-vote" className="text-primary hover:underline">Register to Vote in Texas</Link> — Texas voter registration steps and deadlines.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">Texas calculators and tool library</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Our Texas calculators are built to answer real questions Texans ask about cost of living,
          taxes, and elections:
        </p>
        <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-6">
          <li><Link to="/tax-calculator" className="text-primary hover:underline">Texas Property Tax Relief Calculator</Link> — estimate your Texas property tax bill and savings.</li>
          <li><Link to="/county-elections" className="text-primary hover:underline">County Elections</Link> — county-level Texas election information.</li>
          <li><Link to="/candidate-guides" className="text-primary hover:underline">Candidate Guides</Link> — plain-language guides to Texas candidates and races.</li>
          <li><Link to="/laws-to-know" className="text-primary hover:underline">Texas Laws to Know</Link> — key Texas laws that affect daily life.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-foreground">More about Keep Texas Red</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Read our <Link to="/about" className="text-primary hover:underline">full About page</Link> for
          our masthead and editorial approach, our <Link to="/editorial-standards" className="text-primary hover:underline">editorial standards</Link>,
          or the essay on <Link to="/keep-texas-red" className="text-primary hover:underline">what "Keep Texas Red" means</Link>.
          For questions, visit <Link to="/contact" className="text-primary hover:underline">Contact</Link>.
        </p>
      </section>
    </main>
  );
}