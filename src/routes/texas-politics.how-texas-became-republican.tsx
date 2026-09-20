import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-politics/how-texas-became-republican`;
const TITLE = "How Texas Became Republican: The Political Realignment Explained | KeepTXRed";
const DESCRIPTION = "A source-backed history of how Texas moved from one-party Democratic rule to Republican dominance, from the Shivercrats and John Tower through Bill Clements, George W. Bush, the 1998 statewide sweep and the 2002 Texas House takeover.";

const MILESTONES = [
  { year: "1952", event: "Allan Shivers backs Dwight Eisenhower", meaning: "The Shivercrat break showed conservative Texas Democrats could defect from the national Democratic ticket over major policy disputes, especially the Tidelands fight." },
  { year: "1961", event: "John Tower wins a U.S. Senate seat", meaning: "Tower became the first Republican U.S. senator from Texas since Reconstruction and gave the modern GOP a durable statewide foothold." },
  { year: "1976", event: "Ronald Reagan sweeps the Texas GOP primary", meaning: "Texas Republicans strongly backed movement conservatism even though Gerald Ford ultimately won the national nomination." },
  { year: "1978", event: "Bill Clements wins the governorship", meaning: "Clements became the first Republican elected governor of Texas since Reconstruction and proved the GOP could win the state's top executive office." },
  { year: "1983–1984", event: "Phil Gramm changes parties and wins Tower's Senate seat", meaning: "Gramm's switch illustrated the migration of conservative Democratic officeholders and voters into the Republican coalition." },
  { year: "1993", event: "Kay Bailey Hutchison wins the second Senate seat", meaning: "For the first time in the modern era, Republicans held both Texas U.S. Senate seats." },
  { year: "1994", event: "George W. Bush defeats Ann Richards", meaning: "Bush's gubernatorial victory accelerated Republican statewide strength and created a governing model with national reach." },
  { year: "1996", event: "Republicans win the Texas Senate", meaning: "The GOP moved from statewide candidate success into control of a legislative chamber." },
  { year: "1998", event: "Republicans sweep statewide offices", meaning: "Republicans won all 27 statewide contests, a major institutional turning point in the state's partisan alignment." },
  { year: "2002–2003", event: "Republicans win the Texas House; Tom Craddick becomes Speaker", meaning: "Republican control reached the final legislative chamber, completing the transition from opposition party to the dominant statewide governing party." },
];

const SOURCES = [
  { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas: Republican Party" },
  { href: "https://www.tshaonline.org/handbook/entries/political-parties", label: "Handbook of Texas: Political Parties" },
  { href: "https://www.tshaonline.org/handbook/entries/texas-post-world-war-ii", label: "Handbook of Texas: Texas Post World War II" },
  { href: "https://texaspolitics.utexas.edu/archive/html/part/features/0402_03/reprising.html", label: "University of Texas Texas Politics Project: Republicans Rising" },
  { href: "https://texaspolitics.utexas.edu/archive/html/part/features/0702_01/PID.html", label: "University of Texas Texas Politics Project: Party Identification in Texas" },
  { href: "https://www.tsl.texas.gov/ref/abouttx/governors", label: "Texas State Library: Governors of Texas" },
  { href: "https://www.senate.gov/states/TX/timeline.htm", label: "U.S. Senate: Texas Senate timeline" },
];

const FAQS = [
  {
    question: "When did Texas become a Republican state?",
    answer: "There was no single switch. Republican presidential strength emerged in the 1950s, John Tower won a Senate seat in 1961, Bill Clements won the governorship in 1978, Republicans captured both U.S. Senate seats by 1993, swept statewide offices in 1998 and won the Texas House in 2002. Different levels of government realigned at different times.",
  },
  {
    question: "Was Texas always Republican?",
    answer: "No. After Reconstruction, Texas was dominated by the Democratic Party for generations. The modern Republican rise developed gradually after World War II and accelerated from the 1970s through the early 2000s.",
  },
  {
    question: "Why was John Tower's 1961 election important?",
    answer: "Tower was the first Republican U.S. senator from Texas since Reconstruction. His victory showed that Republican presidential gains could translate into a major statewide federal office and gave the developing Texas GOP a long-serving statewide leader.",
  },
  {
    question: "What was the significance of the 1998 Texas election?",
    answer: "Republicans won all 27 statewide contests in 1998. The sweep demonstrated that Republican strength had moved beyond individual breakthrough candidates into broad control of statewide elective offices.",
  },
];

export const Route = createFileRoute("/texas-politics/how-texas-became-republican")({
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
          headline: "How Texas Became Republican: The Political Realignment Explained",
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
  component: TexasRepublicanRealignmentPage,
});

function TexasRepublicanRealignmentPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-politics">Texas Politics</Link> / How Texas Became Republican
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas political history</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">How Texas Became Republican</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
          Texas did not turn Republican in one election. The change took roughly half a century: conservative Democrats first broke with their national party in presidential contests, Republicans then won isolated statewide offices, voter identification shifted, and finally the GOP accumulated enough strength to control statewide offices and both chambers of the Legislature. This guide separates those stages so the realignment is easier to understand than a simple “red state” label.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/texas-politics/figures" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Political figure profiles</a>
          <a href="/texas-government" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas Government</a>
          <a href="/elections/2026" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Current elections</a>
        </div>
      </header>

      <section className="mt-10 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby="short-answer">
        <h2 id="short-answer" className="text-2xl font-bold">The short answer</h2>
        <p className="mt-4 leading-8 text-foreground/90">
          The modern Texas Republican realignment began visibly in the 1950s but did not become full institutional control until the early 2000s. The Handbook of Texas describes 1950–1978 as a transitional era in which Republican presidential strength grew faster than party identification or local officeholding. John Tower's 1961 Senate win and Bill Clements's 1978 gubernatorial victory were major breakthroughs. The pace accelerated in the 1980s and 1990s, when Republican primary participation, legislative representation and statewide victories rose together. By 1998 Republicans had swept all statewide contests, and after the 2002 election they controlled the Texas House as well as the Senate and statewide executive offices.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="timeline">
        <h2 id="timeline" className="text-3xl font-bold">The realignment timeline</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">These milestones mark changes in voter behavior or institutional control. They should not be read as a claim that every Texas voter or every region changed parties at the same time.</p>
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b bg-muted/40 text-sm">
              <tr><th className="px-5 py-4 font-bold">Year</th><th className="px-5 py-4 font-bold">Milestone</th><th className="px-5 py-4 font-bold">Why it mattered</th></tr>
            </thead>
            <tbody>
              {MILESTONES.map((item) => (
                <tr key={`${item.year}-${item.event}`} className="border-b last:border-b-0 align-top">
                  <td className="px-5 py-4 font-bold text-primary">{item.year}</td>
                  <td className="px-5 py-4 font-semibold">{item.event}</td>
                  <td className="px-5 py-4 leading-7 text-muted-foreground">{item.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <article className="mt-12 space-y-10">
        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">1. Texas began as a Democratic one-party system, not a Republican state</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>After Reconstruction, the Democratic Party dominated Texas politics for generations. That label can mislead modern readers because the state Democratic coalition included many conservative voters and officeholders whose views on federal power, business, agriculture and social questions differed sharply from later national Democratic coalitions. The lack of a competitive second party also meant many ideological fights occurred inside Democratic primaries rather than between Democrats and Republicans.</p>
            <p>The Handbook of Texas divides the state's Democratic history around 1952: before that presidential election, Democrats were effectively the only viable statewide party; afterward, Republicans became an increasingly serious challenger. That is why the story of modern Republican Texas begins with voter defection before it begins with Republican control of state institutions.</p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">2. The Shivercrats and Tidelands dispute opened the presidential break</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Governor Allan Shivers remained a Democrat but endorsed Republican Dwight Eisenhower in 1952. The immediate policy dispute was the Tidelands controversy over ownership of oil-rich submerged lands off the Texas coast. Eisenhower supported the Texas position, while the Truman administration and Democratic nominee Adlai Stevenson did not accept the state's claim in the same way. Shivers and other conservative Democrats who crossed the presidential party line became known as Shivercrats.</p>
            <p>Eisenhower carried Texas in 1952 and again in 1956. Those victories did not create a Republican state government: Texans could vote Republican for president while continuing to choose Democrats for many state and local offices. But the elections weakened straight-party loyalty and demonstrated that conservative Texans would cross party lines when they believed national Democratic policy diverged from Texas priorities.</p>
          </div>
          <a href="/texas-politics/figures/allan-shivers-texas-shivercrats-realignment" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">Read the Allan Shivers profile →</a>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">3. John Tower proved a Republican could hold major statewide office</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>When Lyndon B. Johnson left the Senate to become vice president, the resulting 1961 special election produced a breakthrough. Republican John Tower won the seat and became the first Republican U.S. senator from Texas since Reconstruction. More important than the novelty was what happened next: Tower kept winning and served until 1985.</p>
            <p>Tower's longevity gave the Republican Party a statewide leader, a donor and activist network, and proof that Republican success in Texas did not have to be limited to presidential races. Yet the pace remained uneven. Republican gubernatorial nominees became more competitive, urban congressional districts elected Republicans, and legislative seats increased gradually, while Democrats still dominated many county offices, legislative leadership posts and primary participation.</p>
          </div>
          <a href="/texas-politics/figures/john-tower-texas-senator-republican-breakthrough" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">Read the John Tower profile →</a>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">4. Suburban growth and movement conservatism widened the Republican base</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Demography helped change the electoral map. The Handbook of Texas notes that Texas became increasingly urban after World War II and that the growth of Dallas, Houston, Fort Worth, San Antonio and Austin expanded metropolitan areas where Republicans could compete. North Texas defense industries, professional workers, business communities and fast-growing suburbs became especially important parts of the developing coalition.</p>
            <p>Ideology also mattered. The Texas GOP emphasized limits on federal power, anti-communism, business regulation, taxes and conservative social values. Ronald Reagan's sweep of the 1976 Texas Republican presidential primary showed the strength of movement conservatism inside the party. At the same time, the national parties were changing on civil rights, federal policy and cultural issues. The result was not merely that Texans became “more conservative”; many conservative voters who had once operated within the Democratic coalition increasingly found the Republican label aligned with their national voting behavior.</p>
          </div>
          <a href="/texas-politics/figures/ronald-reagan-texas-conservative-legacy" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">Read Ronald Reagan's Texas conservative legacy →</a>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">5. Bill Clements moved the breakthrough into the governor's office</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Bill Clements's 1978 victory was another watershed. The Dallas businessman and former deputy secretary of defense became the first Republican elected governor of Texas since Reconstruction. The win mattered because the governorship was the clearest symbol of state political power, yet it also showed how incomplete the transition remained: Democrats continued to control the Legislature and many local offices.</p>
            <p>Clements lost reelection in 1982 and returned to win again in 1986. That defeat-and-comeback sequence is a useful guardrail against treating realignment as inevitable or linear. Republicans were becoming a permanent statewide force, but candidates, economic conditions and regional coalitions still determined individual elections.</p>
          </div>
          <a href="/texas-politics/figures/bill-clements-texas-republican-governor" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">Read the Bill Clements profile →</a>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">6. The 1980s made party switching and Republican identification more durable</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Republican presidential strength had been visible for decades by the Reagan era. The institutional shift became clearer when conservative officeholders themselves changed parties. Phil Gramm, elected to Congress as a Democrat, switched to the Republican Party in 1983, resigned his seat, won it back as a Republican and then won John Tower's Senate seat in 1984. Rick Perry, then a Democratic state representative, changed parties in 1989 before winning statewide office as a Republican.</p>
            <p>University of Texas political data show the broader direction: Democratic party identification fell sharply over the second half of the twentieth century while Republican identification increased and the independent share grew. That movement helps explain why party-switching politicians were not acting in isolation; the electorate itself was becoming less tied to the old Democratic system.</p>
          </div>
          <a href="/texas-politics/figures/phil-gramm-texas-senator-fiscal-conservative" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">Read the Phil Gramm profile →</a>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">7. The 1990s turned competitiveness into statewide dominance</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Kay Bailey Hutchison's 1993 special-election victory gave Republicans both Texas U.S. Senate seats. In 1994 George W. Bush defeated Democratic Governor Ann Richards. Republicans continued gaining legislative seats and captured a Texas Senate majority in the 1996 election.</p>
            <p>The clearest statewide marker came in 1998. Historical accounts from the Handbook of Texas and the Texas Politics Project record Republicans winning all 27 statewide contests that year. The sweep mattered because it was no longer one charismatic governor or one Senate seat succeeding against a Democratic establishment; the entire statewide ballot had shifted.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/texas-politics/figures/kay-bailey-hutchison-texas-senator" className="font-bold text-primary underline-offset-4 hover:underline">Kay Bailey Hutchison →</a>
            <a href="/texas-politics/figures/george-w-bush-texas-governor-president" className="font-bold text-primary underline-offset-4 hover:underline">George W. Bush →</a>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">8. The Texas House takeover completed the institutional transition</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Even after the statewide sweep, Democrats still competed for and controlled important legislative and local offices. Republicans won the Texas House in the 2002 election, and Tom Craddick became Speaker in January 2003—the first Republican speaker since Reconstruction. The Texas Politics Project's historical series captures the scale of the change: Republicans went from 16 of 150 Texas House seats in 1974 to 88 in 2002, while their county and district officeholding also expanded dramatically.</p>
            <p>That is the point at which “Texas became Republican” becomes a reasonable shorthand for statewide governing control rather than presidential preference. Republicans held statewide executive offices, both U.S. Senate seats, the Texas Senate and the Texas House. The political argument then shifted increasingly from whether Republicans could win Texas institutions to which Republican factions would control priorities inside them.</p>
          </div>
          <a href="/texas-politics/figures/tom-craddick-texas-house-speaker" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">Read the Tom Craddick profile →</a>
        </section>
      </article>

      <section className="mt-12 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby="why-it-happened">
        <h2 id="why-it-happened" className="text-3xl font-bold">Why did the Texas realignment happen?</h2>
        <p className="mt-4 leading-8 text-foreground/90">No single explanation is sufficient. The historical record points to several overlapping forces:</p>
        <ul className="mt-5 space-y-4 leading-7 text-foreground/90">
          <li><strong>National party change:</strong> conservative Texas voters increasingly diverged from national Democrats on federal power, economic policy, foreign policy and social questions.</li>
          <li><strong>Civil-rights-era realignment:</strong> race and federal civil-rights policy were also part of the mid-century partisan transformation and should not be erased from an accurate history of Southern and Texas politics.</li>
          <li><strong>Urban and suburban growth:</strong> rapidly growing metropolitan regions expanded constituencies that were more receptive to Republican candidates, especially in Dallas–Fort Worth and Houston suburbs.</li>
          <li><strong>Business and energy politics:</strong> oil, finance, development and professional communities often preferred Republican positions on taxation, regulation and federal economic policy.</li>
          <li><strong>Candidate and party organization:</strong> Tower, Clements, Reagan-aligned activists, Gramm, Hutchison and the Bush organization converted ideological sympathy into durable fundraising, turnout and officeholding.</li>
          <li><strong>Primary participation:</strong> as more conservatives chose the Republican primary, the party gained the local candidates and organizational depth needed to compete below the presidential level.</li>
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8" aria-labelledby="different-clocks">
        <h2 id="different-clocks" className="text-3xl font-bold">Texas changed on several political clocks</h2>
        <p className="mt-4 leading-8 text-foreground/90">Calling Texas “red” can hide the most useful part of the story. Presidential voting shifted first. A U.S. Senate seat followed. The governorship came later. Both Senate seats, the Texas Senate, every statewide office and the Texas House each moved on separate timetables. County offices and urban areas changed at still different speeds. Realignment was therefore a layered transfer of voter loyalty and institutional control, not a single election-night conversion.</p>
        <p className="mt-4 leading-8 text-foreground/90">That layered history also explains modern intraparty fights. Once Republicans became the statewide majority, political competition increasingly moved into Republican primaries and leadership contests over taxes, school choice, social policy, spending, business regulation and the balance between institutional and movement conservatism.</p>
      </section>

      <section className="mt-12" aria-labelledby="people">
        <h2 id="people" className="text-3xl font-bold">Key figures in the realignment</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Allan Shivers", "1952 presidential defection and the Shivercrats", "/texas-politics/figures/allan-shivers-texas-shivercrats-realignment"],
            ["John Tower", "1961 Senate breakthrough", "/texas-politics/figures/john-tower-texas-senator-republican-breakthrough"],
            ["Bill Clements", "1978 gubernatorial breakthrough", "/texas-politics/figures/bill-clements-texas-republican-governor"],
            ["Phil Gramm", "Party switch and 1984 Senate succession", "/texas-politics/figures/phil-gramm-texas-senator-fiscal-conservative"],
            ["Kay Bailey Hutchison", "1993 second Republican Senate seat", "/texas-politics/figures/kay-bailey-hutchison-texas-senator"],
            ["George W. Bush", "1994 governorship and 1998 statewide consolidation", "/texas-politics/figures/george-w-bush-texas-governor-president"],
            ["Tom Craddick", "2003 Republican Texas House speakership", "/texas-politics/figures/tom-craddick-texas-house-speaker"],
            ["Dick Armey", "North Texas growth and national House leadership", "/texas-politics/figures/dick-armey-texas-house-majority-leader"],
            ["Tom DeLay", "Party organization and 2003 congressional redistricting", "/texas-politics/figures/tom-delay-texas-house-majority-leader"],
          ].map(([name, role, href]) => (
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
            <div key={faq.question}>
              <h3 className="text-xl font-bold">{faq.question}</h3>
              <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8" aria-labelledby="sources">
        <h2 id="sources" className="text-3xl font-bold">Sources and further reading</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">This guide treats the uploaded political-fact list as research prompts, not as a source of record. The chronology and quantitative claims above are grounded in institutional and historical sources.</p>
        <ul className="mt-6 space-y-3">
          {SOURCES.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.label} ↗</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <h2 className="text-2xl font-bold">Continue through KTR's Texas politics authority layer</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/texas-politics/figures" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Political figures</a>
          <a href="/texas-political-reference" className="rounded-md border bg-card px-4 py-2 text-sm font-bold hover:border-primary">Political reference</a>
          <a href="/policy" className="rounded-md border bg-card px-4 py-2 text-sm font-bold hover:border-primary">Policy trackers</a>
          <a href="/laws" className="rounded-md border bg-card px-4 py-2 text-sm font-bold hover:border-primary">Texas Law Library</a>
        </div>
      </section>
    </main>
  );
}
