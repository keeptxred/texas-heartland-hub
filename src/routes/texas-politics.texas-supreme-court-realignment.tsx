import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-politics/texas-supreme-court-realignment`;
const TITLE = "How the Texas Supreme Court Became Republican | KeepTXRed";
const DESCRIPTION = "A source-backed history of the Texas Supreme Court's partisan and institutional transformation, from the contested judicial politics of the 1980s through Thomas Phillips, Nathan Hecht, Wallace Jefferson and the modern Republican court.";

const SOURCES = [
  { href: "https://www.txcourts.gov/supreme/about-the-court/", label: "Supreme Court of Texas: About the Court" },
  { href: "https://texascourthistory.org/", label: "Texas Supreme Court Historical Society" },
  { href: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.5.htm", label: "Texas Constitution, Article V" },
  { href: "https://www.tshaonline.org/handbook/entries/supreme-court", label: "Handbook of Texas: Supreme Court" },
];

const MILESTONES = [
  { period: "1980s", event: "Judicial elections become a major statewide political fight", significance: "Campaign finance, tort litigation and criticism of the court's perceived alliances make Supreme Court races unusually visible." },
  { period: "1988", event: "Thomas R. Phillips and Nathan Hecht join the court", significance: "Republican Governor Bill Clements appoints Phillips as chief justice and Hecht as a justice during the breakthrough period for Republican statewide judicial candidates." },
  { period: "1990s", event: "Republicans consolidate control", significance: "The court's partisan turnover tracks the broader Texas realignment while debates over tort law, business litigation and judicial selection intensify." },
  { period: "1994", event: "Priscilla Owen wins election", significance: "Owen becomes part of the Republican generation whose Texas records later figure prominently in national judicial-confirmation politics." },
  { period: "2001–2004", event: "Wallace B. Jefferson breaks historic barriers", significance: "Jefferson becomes the court's first Black justice and later its first Black chief justice, while also leading administrative and access-to-justice reforms." },
  { period: "2005–2009", event: "Don Willett and Eva Guzman join", significance: "The court adds jurists who later become prominent beyond the court; Guzman becomes the first Hispanic woman to serve on it." },
  { period: "2013–2024", event: "Nathan Hecht serves as chief justice", significance: "Hecht's tenure emphasizes judicial administration, technology and access to justice while Republican control is already deeply established." },
  { period: "2025", event: "James D. Blacklock becomes chief justice", significance: "Blacklock succeeds Hecht and represents the post-realignment generation of Republican judicial leadership." },
];

const FAQS = [
  {
    question: "Is the Texas Supreme Court the state's highest criminal court?",
    answer: "No. The Supreme Court of Texas is the state's highest court for civil matters and juvenile cases. The Texas Court of Criminal Appeals is the court of last resort for criminal cases.",
  },
  {
    question: "How are Texas Supreme Court justices selected?",
    answer: "The chief justice and eight justices are elected statewide. Vacancies can be filled by gubernatorial appointment, after which the seat returns to the electoral process required by Texas law.",
  },
  {
    question: "When did Republicans take over the Texas Supreme Court?",
    answer: "The transformation accelerated in the late 1980s and continued through the 1990s as Republican candidates won statewide judicial races during Texas's larger partisan realignment. It was a multi-election transition rather than a single-day takeover.",
  },
  {
    question: "Does party affiliation tell you how a justice will decide a case?",
    answer: "Not reliably. Party labels matter to elections and judicial-selection history, but the court's work is expressed through written opinions applying statutes, precedent and constitutional rules. Many cases concern technical civil-law questions that do not divide neatly along partisan lines.",
  },
];

const PEOPLE = [
  ["Thomas R. Phillips", "Chief justice during the court's late-1980s and 1990s partisan transformation", "/texas-politics/figures/thomas-phillips-texas-supreme-court-chief-justice"],
  ["Nathan Hecht", "Justice from 1988 through 2024 and chief justice from 2013 through 2024", "/texas-politics/figures/nathan-hecht-texas-supreme-court-chief-justice"],
  ["Wallace B. Jefferson", "First Black justice and first Black chief justice of the Supreme Court of Texas", "/texas-politics/figures/wallace-jefferson-texas-supreme-court-chief-justice"],
  ["Priscilla Owen", "Texas justice whose record later became central to a national Fifth Circuit confirmation fight", "/texas-politics/figures/priscilla-owen-texas-supreme-court-fifth-circuit"],
  ["Don Willett", "Former Texas justice who later joined the U.S. Court of Appeals for the Fifth Circuit", "/texas-politics/figures/don-willett-texas-supreme-court-fifth-circuit"],
  ["Eva Guzman", "First Hispanic woman on the Texas Supreme Court", "/texas-politics/figures/eva-guzman-texas-supreme-court-justice"],
  ["James Blacklock", "Chief justice beginning in 2025 and a leader of the post-Hecht court", "/texas-politics/figures/james-blacklock-texas-supreme-court-chief-justice"],
] as const;

export const Route = createFileRoute("/texas-politics/texas-supreme-court-realignment")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: "Keep TX Red" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How the Texas Supreme Court Became Republican",
          description: DESCRIPTION,
          url: CANONICAL,
          dateModified: "2026-08-26",
          author: { "@type": "Organization", name: "Keep TX Red Editorial Desk", url: `${SITE_URL}/about` },
          publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL },
          citation: SOURCES.map((source) => ({ "@type": "CreativeWork", name: source.label, url: source.href })),
          isPartOf: { "@type": "WebSite", name: "KeepTXRed", url: SITE_URL },
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }).replace(/</g, "\\u003c"),
      },
    ],
  }),
  component: TexasSupremeCourtRealignmentPage,
});

function TexasSupremeCourtRealignmentPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-politics">Texas Politics</Link> / Texas Supreme Court Realignment
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas judicial history</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">How the Texas Supreme Court Became Republican</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
          Texas's highest civil court changed before Republicans completed their takeover of the rest of state government. Beginning in the late 1980s, judicial elections, appointments, tort-law politics and the state's broader partisan realignment transformed a court long associated with Democratic rule into a durable Republican institution. That political history matters—but it is not a substitute for reading the court's opinions or understanding what the court actually does.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/texas-politics/how-texas-became-republican" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Texas Republican realignment</a>
          <a href="/texas-politics/figures" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Political figures</a>
          <a href="/texas-government" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas Government</a>
          <a href="/texas-law-policy" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas law & policy</a>
        </div>
      </header>

      <section className="mt-10 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <h2 className="text-2xl font-bold">First: what the Texas Supreme Court actually does</h2>
        <div className="mt-4 space-y-4 leading-8 text-foreground/90">
          <p>The Supreme Court of Texas is the state's court of last resort for civil matters and juvenile cases. Criminal cases ultimately go to the separate Texas Court of Criminal Appeals. The Supreme Court also has major administrative responsibilities for the Texas judiciary, including rules, court operations and the broader administration of justice.</p>
          <p>The court consists of a chief justice and eight justices. Texas uses statewide elections for these offices, while governors can fill vacancies by appointment subject to the state's election system. That combination means judicial careers can involve both appointment politics and statewide partisan campaigning.</p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="timeline">
        <h2 id="timeline" className="text-3xl font-bold">The realignment timeline</h2>
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b bg-muted/40 text-sm"><tr><th className="px-5 py-4 font-bold">Period</th><th className="px-5 py-4 font-bold">What changed</th><th className="px-5 py-4 font-bold">Why it mattered</th></tr></thead>
            <tbody>
              {MILESTONES.map((item) => (
                <tr key={`${item.period}-${item.event}`} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4 font-bold text-primary">{item.period}</td>
                  <td className="px-5 py-4 font-semibold">{item.event}</td>
                  <td className="px-5 py-4 leading-7 text-muted-foreground">{item.significance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <article className="mt-12 space-y-10">
        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">1. The court became a political battleground before Texas became reliably Republican</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>For much of the twentieth century, Democratic dominance in Texas elections extended to the judiciary. By the 1980s, however, Supreme Court races were receiving unusually intense scrutiny. Large campaign contributions, disputes over plaintiff and defense interests, and arguments over tort law and judicial ethics made the court a visible target for reform campaigns.</p>
            <p>Republicans were already demonstrating that they could win selected statewide offices even while Democrats retained major institutional power. Judicial races became one of the places where that transition accelerated. The shift was therefore both legal and electoral: voters were choosing judges while organized interests were fighting over the rules governing civil liability, business disputes and the financing of judicial campaigns.</p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">2. Thomas Phillips and Nathan Hecht became anchors of the transition</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Republican Governor Bill Clements appointed Thomas R. Phillips chief justice in 1988. Phillips then won statewide election and remained chief justice until 2004. His tenure covered the period when Republican judicial candidates moved from breakthrough victories to durable control of the court.</p>
            <p>Nathan Hecht also joined the court in 1988 and eventually became its longest-serving member. He became chief justice in 2013 and served through the end of 2024. Their careers give the realignment an unusually long institutional through-line: Phillips led during the transition itself, while Hecht remained through the period when Republican control had become the court's normal political environment.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/texas-politics/figures/thomas-phillips-texas-supreme-court-chief-justice" className="font-bold text-primary underline-offset-4 hover:underline">Thomas R. Phillips →</a>
            <a href="/texas-politics/figures/nathan-hecht-texas-supreme-court-chief-justice" className="font-bold text-primary underline-offset-4 hover:underline">Nathan Hecht →</a>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">3. Tort reform and business law were part of the political context—but not the whole docket</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>The court's partisan transformation overlapped a broader Texas fight over civil liability, damages, medical-malpractice claims, business regulation and the influence of trial lawyers and business groups. Those disputes helped make judicial philosophy and Supreme Court elections central to the emerging Republican coalition.</p>
            <p>But reducing the court to a tort-reform scoreboard is misleading. The court hears disputes involving contracts, statutory interpretation, governmental immunity, property, procedure, family law, administrative power and constitutional structure. A party label explains part of how a justice reaches the ballot; it does not by itself explain the reasoning or outcome of every civil case.</p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">4. Republican control did not eliminate institutional reform or historic firsts</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Wallace B. Jefferson joined the court in 2001 and became chief justice in 2004, breaking racial barriers as the court's first Black justice and first Black chief justice. His tenure also emphasized court administration, legal aid, indigent-defense issues and access to justice.</p>
            <p>Eva Guzman's 2009 appointment made her the first Hispanic woman to serve on the court. These milestones are part of the same Republican-era institutional history as tort reform and conservative jurisprudence. They also show why the court cannot be understood only as a collection of ideological votes; chief justices and justices shape the administration and public accessibility of the judicial system as well.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/texas-politics/figures/wallace-jefferson-texas-supreme-court-chief-justice" className="font-bold text-primary underline-offset-4 hover:underline">Wallace B. Jefferson →</a>
            <a href="/texas-politics/figures/eva-guzman-texas-supreme-court-justice" className="font-bold text-primary underline-offset-4 hover:underline">Eva Guzman →</a>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">5. Texas became a pipeline into the federal conservative judiciary</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Priscilla Owen and Don Willett both moved from the Texas Supreme Court to the U.S. Court of Appeals for the Fifth Circuit. Owen's federal confirmation became a national fight over judicial nominations and ideology; Willett became nationally known for opinions and public writing before his federal appointment.</p>
            <p>Their careers illustrate how the Texas court became connected to a larger conservative legal network. State judicial service can develop records on textual interpretation, regulatory power and constitutional questions that later become relevant in federal nominations. At the same time, Texas civil law remains a distinct body of state law, so the state court should not be treated merely as a feeder institution for Washington.</p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">6. The post-Hecht court is the second generation of the Republican era</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Hecht retired at the end of 2024 after serving on the court since 1988. James D. Blacklock, who had joined the court in 2018, became chief justice in January 2025. That succession matters historically because it closes a direct personnel link to the breakthrough year of the late-1980s judicial realignment.</p>
            <p>The modern court operates after Republican control has been established for decades. The useful questions therefore shift from whether Republicans can capture the institution to how individual justices interpret law, how the court administers the statewide judicial system, how competitive partisan elections remain, and whether Texas's judicial-selection system produces the accountability and independence voters expect.</p>
          </div>
          <a href="/texas-politics/figures/james-blacklock-texas-supreme-court-chief-justice" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">James Blacklock →</a>
        </section>
      </article>

      <section className="mt-12" aria-labelledby="people">
        <h2 id="people" className="text-3xl font-bold">Key figures in the modern Texas Supreme Court</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PEOPLE.map(([name, role, href]) => (
            <a key={href} href={href} className="rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm">
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{role}</p>
              <span className="mt-4 inline-flex text-sm font-bold text-primary">Profile →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8" aria-labelledby="faq">
        <h2 id="faq" className="text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question}><h3 className="text-xl font-bold">{faq.question}</h3><p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p></div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8" aria-labelledby="sources">
        <h2 id="sources" className="text-3xl font-bold">Sources and further reading</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">This page treats partisan control as electoral and institutional history, not as a shortcut for predicting individual judicial decisions. Court structure and authority should be checked against official Texas judicial and constitutional sources.</p>
        <ul className="mt-6 space-y-3">
          {SOURCES.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.label} ↗</a></li>)}
        </ul>
      </section>
    </main>
  );
}
