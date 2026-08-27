import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = "https://keeptxred.com";
const CANONICAL = `${SITE_URL}/texas-politics/reconstruction-republicans`;
const TITLE = "Texas Republicans During Reconstruction: Origins, Black Leaders & the Davis Era | KeepTXRed";
const DESCRIPTION = "A source-backed history of the Republican Party's origins in Reconstruction Texas, including Edmund J. Davis, Black political leadership, the Union League, public schools, the 1874 collapse of Republican state power and the later Black-and-Tan versus Lily-White struggle.";

const SOURCES = [
  { href: "https://www.tshaonline.org/handbook/entries/republican-party", label: "Handbook of Texas: Republican Party" },
  { href: "https://www.tshaonline.org/handbook/entries/reconstruction", label: "Handbook of Texas: Reconstruction" },
  { href: "https://www.tshaonline.org/handbook/entries/davis-edmund-jackson", label: "Handbook of Texas: Edmund J. Davis" },
  { href: "https://www.tshaonline.org/handbook/entries/cuney-norris-wright", label: "Handbook of Texas: Norris Wright Cuney" },
  { href: "https://www.tshaonline.org/handbook/entries/ruby-george-thompson", label: "Handbook of Texas: George T. Ruby" },
  { href: "https://www.tshaonline.org/handbook/entries/allen-richard", label: "Handbook of Texas: Richard Allen" },
  { href: "https://www.tshaonline.org/handbook/entries/pease-elisha-marshall", label: "Handbook of Texas: Elisha M. Pease" },
  { href: "https://www.tshaonline.org/handbook/entries/hamilton-andrew-jackson", label: "Handbook of Texas: Andrew Jackson Hamilton" },
  { href: "https://www.tshaonline.org/handbook/entries/mcdonald-william-madison", label: "Handbook of Texas: William Madison McDonald" },
];

const MILESTONES = [
  { year: "1865–1866", event: "Presidential Reconstruction under Andrew J. Hamilton", meaning: "Unionist provisional government restores civil government after the Civil War but stops short of Black suffrage." },
  { year: "1867", event: "Texas Republican Party organizes", meaning: "Unionists and newly enfranchised Black Texans form a biracial state party under congressional Reconstruction." },
  { year: "1868–1869", event: "Constitutional convention and Republican faction split", meaning: "Moderates and Radicals fight over Reconstruction policy; George T. Ruby and the Union League become important to Radical organization." },
  { year: "1869–1870", event: "Edmund J. Davis wins; Texas is readmitted", meaning: "Radical Republicans gain the governorship and legislative majorities as Texas completes congressional readmission requirements." },
  { year: "1870–1873", event: "Republican state government expands institutions", meaning: "Public education, law enforcement and state administrative programs grow while conflict over taxation and centralized power intensifies." },
  { year: "1873–1874", event: "Richard Coke defeats Davis", meaning: "Democrats retake state government, ending the only period of Republican statewide control until the late twentieth century." },
  { year: "1880s–1890s", event: "The Cuney Era", meaning: "Norris Wright Cuney leads a Black-backed Republican organization even as Democrats dominate elections and Jim Crow restrictions expand." },
  { year: "1890s–1920s", event: "Black-and-Tan versus Lily-White struggle", meaning: "Texas Republicans fight over whether Black members will retain meaningful power in the party organization." },
];

const FAQS = [
  {
    question: "When was the Republican Party organized in Texas?",
    answer: "The modern state Republican organization dates to 1867, when Unionists and newly enfranchised Black Texans organized under congressional Reconstruction. Its first decades looked very different from the modern Texas GOP.",
  },
  {
    question: "Who was the first Republican governor of Texas?",
    answer: "Edmund J. Davis was the first governor elected as a Republican, serving from 1870 to 1874. His Reconstruction administration expanded public education and state institutions but was highly controversial, particularly over taxation, the militia and the Texas State Police.",
  },
  {
    question: "What role did Black Texans play in the early Republican Party?",
    answer: "A central one. Black voters formed a large share of Republican support after suffrage was extended during Reconstruction, and leaders including George T. Ruby, Richard Allen and Norris Wright Cuney organized voters, held office and shaped party conventions.",
  },
  {
    question: "Is the Reconstruction Republican Party the same as today's Texas Republican Party?",
    answer: "It is part of the same institutional party history, but the electorate, issues and ideological coalitions changed dramatically over more than a century. Reconstruction Republicans emphasized Union loyalty, Black citizenship, voting rights, public schools and enforcement of the postwar constitutional settlement; the modern conservative coalition developed much later.",
  },
];

export const Route = createFileRoute("/texas-politics/reconstruction-republicans")({
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
          headline: "Texas Republicans During Reconstruction: Origins, Black Leaders and the Davis Era",
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
  component: TexasReconstructionRepublicansPage,
});

function TexasReconstructionRepublicansPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/texas-politics">Texas Politics</Link> / Reconstruction Republicans
      </nav>

      <header className="rounded-2xl border bg-card p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas political history</p>
        <h1 className="mt-4 max-w-5xl text-4xl font-bold leading-tight md:text-6xl">Texas Republicans During Reconstruction</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">
          Texas had a Republican government a century before the modern conservative realignment. The party that formed after the Civil War was a biracial coalition of Unionists, newly enfranchised Black Texans, Northern migrants and federal officeholders. It fought over citizenship, schools, public order and the meaning of Reconstruction—and then lost statewide power for generations. Understanding that first Republican era explains why modern Texas party history cannot begin in the 1950s.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/texas-politics/how-texas-became-republican" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Modern Republican realignment</a>
          <a href="/texas-politics/figures" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Political figures</a>
          <a href="/texas-government" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas Government</a>
        </div>
      </header>

      <section className="mt-10 rounded-2xl border bg-muted/30 p-6 md:p-8" aria-labelledby="short-answer">
        <h2 id="short-answer" className="text-2xl font-bold">The short answer</h2>
        <p className="mt-4 leading-8 text-foreground/90">
          The Texas Republican Party organized in 1867 under congressional Reconstruction. Black Texans made up a major share of its voters and leaders, while White Unionists supplied another important wing. Radical Republican Edmund J. Davis won the governorship in 1869 and served from 1870 through 1874. Democrats then retook state government and kept Republicans out of statewide power for decades, but the party organization survived through leaders such as Norris Wright Cuney, William Madison McDonald and R.B. Creager. That long institutional survival connects Reconstruction Republicanism to the party that later benefited from the twentieth-century conservative realignment.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="timeline">
        <h2 id="timeline" className="text-3xl font-bold">From Unionist coalition to minority party</h2>
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b bg-muted/40 text-sm">
              <tr><th className="px-5 py-4 font-bold">Period</th><th className="px-5 py-4 font-bold">Milestone</th><th className="px-5 py-4 font-bold">Why it mattered</th></tr>
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
          <h2 className="text-3xl font-bold">1. Texas Republicanism began with Unionism and emancipation</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>After the Civil War, Texas politics had to answer questions that went far beyond ordinary party competition: whether the state would accept the postwar constitutional order, how formerly enslaved people would exercise citizenship and who would control institutions still dominated by former Confederates. President Andrew Johnson appointed Unionist Andrew Jackson Hamilton provisional governor in 1865. Hamilton supported economic and legal rights for freedmen but initially stopped short of Black suffrage.</p>
            <p>Congress changed the process in 1867 by placing Texas under military Reconstruction and requiring new political participation. The Republican Party organized that year from several groups that had different backgrounds but overlapping interests: White Unionists, Black Texans newly entering electoral politics, Northern migrants and federal officials. Elisha M. Pease chaired the first state Republican convention. Its platform backed congressional Reconstruction, public schools and a homestead policy aimed at both Black and poor White Texans.</p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">2. Black voters and the Union League were foundational, not secondary</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>The expansion of Black male suffrage transformed the political balance. Union League chapters helped register and organize Black voters and became one of the Republican Party's strongest grassroots networks. George T. Ruby, a Freedmen's Bureau educator and organizer, rose through that system and became president of the Texas Union League. Richard Allen helped organize Republicans in Harris County and became one of the state's first Black legislators.</p>
            <p>Black political participation was not limited to casting ballots for White candidates. Reconstruction produced Black legislators, convention delegates, local officials, organizers and federal appointees. Their agendas included education, civil rights, law enforcement, labor organization and economic opportunity. Any account of the origins of the Texas Republican Party that treats Black Texans as a side note misses one of the defining features of the party's first generation.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/texas-politics/figures/george-t-ruby-texas-reconstruction-senator" className="font-bold text-primary underline-offset-4 hover:underline">George T. Ruby →</a>
            <a href="/texas-politics/figures/richard-allen-texas-reconstruction-legislator" className="font-bold text-primary underline-offset-4 hover:underline">Richard Allen →</a>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">3. Republicans split between moderates and Radicals before they controlled the state</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Texas Republicans quickly divided over how aggressively Reconstruction should proceed. Andrew Jackson Hamilton and allies formed a moderate wing. Edmund J. Davis led Radicals who favored stronger federal enforcement and a broader restructuring of state government. The split shaped the 1868–69 constitutional convention and produced rival Republican tickets in the 1869 governor's race.</p>
            <p>Ruby and the Union League helped move Black organizational support toward the Davis faction. President Ulysses S. Grant's administration also backed Davis. Military officials eventually declared Davis the winner of a very close election, and Radical Republicans gained legislative power. Texas then ratified the Fourteenth and Fifteenth Amendments and completed the requirements for readmission to the Union in 1870.</p>
          </div>
          <a href="/texas-politics/figures/edmund-j-davis-texas-reconstruction-governor" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">Edmund J. Davis profile →</a>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">4. The Davis government expanded public institutions—and provoked a fierce backlash</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>The Davis administration and Republican Legislature expanded public education, state administration, frontier protection and law enforcement. Republicans argued that postwar violence and local resistance made stronger state authority necessary to protect the new constitutional order. The administration's Texas State Police and militia policies became its most controversial tools.</p>
            <p>Democrats and Republican critics attacked Davis for taxation, centralized government and coercive policing. Those complaints became part of a successful campaign to restore Democratic control. The debate deserves more nuance than either a heroic or villainous summary: Texas faced real postwar lawlessness and racial violence, while the new state institutions also concentrated powers and imposed costs that generated broad opposition. The political reaction to the Davis years later influenced the limited-government structure of the 1876 Texas Constitution.</p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">5. Republican state power collapsed in 1874, but the party did not disappear</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>Democrat Richard Coke defeated Davis decisively in the 1873 election. The disputed transfer of power ended with Democrats taking control of state government in January 1874. From that point, Democrats dominated Texas statewide politics for generations. Reconstruction-era Republican government was over, but Republican committees, conventions and federal patronage networks survived.</p>
            <p>That distinction matters for understanding the later realignment. The modern Texas GOP did not materialize out of nowhere when conservative Democrats began supporting Eisenhower. A much older organization had continued operating through long periods of electoral weakness. The people controlling that organization—and the arguments over who was allowed to control it—changed dramatically between Reconstruction and the twentieth century.</p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">6. Norris Wright Cuney led a Black-backed Republican organization after Reconstruction</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>After Davis's era, Norris Wright Cuney became the most important Black Republican leader in Texas. Based in Galveston, he combined party organization with labor activism, education work, local office and federal appointments. He became Texas's Republican national committeeman in 1886 and collector of customs at Galveston in 1889. Historians commonly refer to the late nineteenth-century period of his leadership as the Cuney Era.</p>
            <p>Cuney's power shows that Black Republican influence did not end when Democrats retook the Capitol. But it increasingly collided with a Lily-White movement that sought to remove or minimize Black members in order to make the Republican Party more attractive to White voters. The result was a long internal struggle between Black-and-Tan and Lily-White factions over conventions, patronage and national recognition.</p>
          </div>
          <a href="/texas-politics/figures/norris-wright-cuney-texas-republican-leader" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">Norris Wright Cuney profile →</a>
        </section>

        <section className="rounded-xl border bg-card p-6 md:p-8">
          <h2 className="text-3xl font-bold">7. The Black-and-Tan/Lily-White conflict reshaped the party before modern conservatism</h2>
          <div className="mt-4 space-y-4 leading-8 text-foreground/90">
            <p>After Cuney, William Madison McDonald became an important Black-and-Tan leader. White Republican factions argued that reducing Black convention power was necessary to compete with Democrats. By the early twentieth century, Lily-White leaders gained greater control, and later organizers such as R.B. Creager built a more business-oriented party connected to national Republican administrations.</p>
            <p>This transition is essential context for the modern GOP. The ideological and demographic coalition associated with present-day Texas Republicanism developed long after Reconstruction. The institutional party survived, but its constituency, priorities and internal power structure changed. That is why KTR separates this Reconstruction history from the separate guide to the twentieth-century conservative realignment.</p>
          </div>
          <a href="/texas-politics/figures/rb-creager-early-texas-republican-leader" className="mt-5 inline-flex font-bold text-primary underline-offset-4 hover:underline">R.B. Creager profile →</a>
        </section>
      </article>

      <section className="mt-12" aria-labelledby="people">
        <h2 id="people" className="text-3xl font-bold">Key people in early Texas Republican history</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Edmund J. Davis", "Radical Republican governor, 1870–1874", "/texas-politics/figures/edmund-j-davis-texas-reconstruction-governor"],
            ["George T. Ruby", "Union League organizer and Reconstruction state senator", "/texas-politics/figures/george-t-ruby-texas-reconstruction-senator"],
            ["Richard Allen", "Formerly enslaved legislator and 1878 statewide candidate", "/texas-politics/figures/richard-allen-texas-reconstruction-legislator"],
            ["Norris Wright Cuney", "Post-Reconstruction national committeeman and organizer", "/texas-politics/figures/norris-wright-cuney-texas-republican-leader"],
            ["R.B. Creager", "Twentieth-century Republican organizer before modern breakthroughs", "/texas-politics/figures/rb-creager-early-texas-republican-leader"],
            ["Allan Shivers", "Conservative Democrat whose 1952 break begins the modern realignment story", "/texas-politics/figures/allan-shivers-texas-shivercrats-realignment"],
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
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">This guide uses institutional historical sources to distinguish the nineteenth-century Republican Party from later political coalitions and to avoid projecting modern labels backward onto Reconstruction.</p>
        <ul className="mt-6 space-y-3">
          {SOURCES.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary underline-offset-4 hover:underline">{source.label} ↗</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
