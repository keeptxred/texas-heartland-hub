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
  ["1865–1866", "Presidential Reconstruction under Andrew J. Hamilton", "Unionist provisional government restores civil government after the Civil War but stops short of Black suffrage."],
  ["1867", "Texas Republican Party organizes", "Unionists and newly enfranchised Black Texans form a biracial state party under congressional Reconstruction."],
  ["1868–1869", "Constitutional convention and Republican faction split", "Moderates and Radicals fight over Reconstruction policy; George T. Ruby and the Union League become important to Radical organization."],
  ["1869–1870", "Edmund J. Davis wins; Texas is readmitted", "Radical Republicans gain the governorship and legislative majorities as Texas completes congressional readmission requirements."],
  ["1870–1873", "Republican state government expands institutions", "Public education, law enforcement and state administration grow while conflict over taxation and centralized power intensifies."],
  ["1873–1874", "Richard Coke defeats Davis", "Democrats retake state government, ending the only period of Republican statewide control until the late twentieth century."],
  ["1880s–1890s", "The Cuney Era", "Norris Wright Cuney leads a Black-backed Republican organization even as Democrats dominate elections and Jim Crow restrictions expand."],
  ["1890s–1920s", "Black-and-Tan versus Lily-White struggle", "Texas Republicans fight over whether Black members will retain meaningful power in the party organization."],
] as const;

const FAQS = [
  ["When was the Republican Party organized in Texas?", "The modern state Republican organization dates to 1867, when Unionists and newly enfranchised Black Texans organized under congressional Reconstruction. Its first decades looked very different from the modern Texas GOP."],
  ["Who was the first Republican governor of Texas?", "Edmund J. Davis was the first governor elected as a Republican, serving from 1870 to 1874. His administration expanded public education and state institutions but was highly controversial, particularly over taxation, the militia and the Texas State Police."],
  ["What role did Black Texans play in the early Republican Party?", "A central one. Black voters formed a large share of Republican support after suffrage was extended during Reconstruction, and leaders including George T. Ruby, Richard Allen and Norris Wright Cuney organized voters, held office and shaped party conventions."],
  ["Is the Reconstruction Republican Party the same as today's Texas Republican Party?", "It is part of the same institutional party history, but the electorate, issues and ideological coalitions changed dramatically over more than a century. Reconstruction Republicans emphasized Union loyalty, Black citizenship, voting rights, public schools and enforcement of the postwar constitutional settlement; the modern conservative coalition developed much later."],
] as const;

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
        }).replace(/</g, "\\u003c"),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
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
        <p className="mt-5 max-w-4xl text-lg leading-8 text-muted-foreground">Texas had a Republican government a century before the modern conservative realignment. The party that formed after the Civil War was a biracial coalition of Unionists, newly enfranchised Black Texans, Northern migrants and federal officeholders. It fought over citizenship, schools, public order and the meaning of Reconstruction—and then lost statewide power for generations.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/texas-politics/how-texas-became-republican" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Modern Republican realignment</a>
          <a href="/texas-politics/figures" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Political figures</a>
          <a href="/texas-government" className="rounded-md border px-4 py-2 text-sm font-bold hover:border-primary">Texas Government</a>
        </div>
      </header>

      <section className="mt-10 rounded-2xl border bg-muted/30 p-6 md:p-8">
        <h2 className="text-2xl font-bold">The short answer</h2>
        <p className="mt-4 leading-8 text-foreground/90">The Texas Republican Party organized in 1867 under congressional Reconstruction. Black Texans made up a major share of its voters and leaders, while White Unionists supplied another important wing. Radical Republican Edmund J. Davis won the governorship in 1869 and served from 1870 through 1874. Democrats then retook state government and kept Republicans out of statewide power for decades, but the party organization survived through leaders such as Norris Wright Cuney, William Madison McDonald and R.B. Creager.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-bold">From Unionist coalition to minority party</h2>
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b bg-muted/40"><tr><th className="px-5 py-4">Period</th><th className="px-5 py-4">Milestone</th><th className="px-5 py-4">Why it mattered</th></tr></thead>
            <tbody>{MILESTONES.map(([year, event, meaning]) => <tr key={`${year}-${event}`} className="border-b last:border-0 align-top"><td className="px-5 py-4 font-bold text-primary">{year}</td><td className="px-5 py-4 font-semibold">{event}</td><td className="px-5 py-4 leading-7 text-muted-foreground">{meaning}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <article className="mt-12 space-y-10">
        <HistorySection title="1. Texas Republicanism began with Unionism and emancipation">
          <p>After the Civil War, Texas politics had to answer whether the state would accept the postwar constitutional order, how formerly enslaved people would exercise citizenship and who would control institutions still dominated by former Confederates. President Andrew Johnson appointed Unionist Andrew Jackson Hamilton provisional governor in 1865. Hamilton supported economic and legal rights for freedmen but initially stopped short of Black suffrage.</p>
          <p>Congress changed the process in 1867 by placing Texas under military Reconstruction. The Republican Party organized that year from White Unionists, Black Texans newly entering electoral politics, Northern migrants and federal officials. Elisha M. Pease chaired the first state Republican convention. Its platform backed congressional Reconstruction, public schools and a homestead policy aimed at both Black and poor White Texans.</p>
        </HistorySection>

        <HistorySection title="2. Black voters and the Union League were foundational, not secondary">
          <p>The expansion of Black male suffrage transformed the political balance. Union League chapters helped register and organize Black voters and became one of the Republican Party's strongest grassroots networks. George T. Ruby rose through that system and became president of the Texas Union League. Richard Allen helped organize Republicans in Harris County and became one of the state's first Black legislators.</p>
          <p>Black political participation was not limited to voting for White candidates. Reconstruction produced Black legislators, convention delegates, local officials, organizers and federal appointees whose agendas included education, civil rights, law enforcement, labor organization and economic opportunity.</p>
          <p><a className="font-bold text-primary" href="/texas-politics/figures/george-t-ruby-texas-reconstruction-senator">George T. Ruby profile →</a> · <a className="font-bold text-primary" href="/texas-politics/figures/richard-allen-texas-reconstruction-legislator">Richard Allen profile →</a></p>
        </HistorySection>

        <HistorySection title="3. Republicans split between moderates and Radicals before they controlled the state">
          <p>Texas Republicans quickly divided over how aggressively Reconstruction should proceed. Andrew Jackson Hamilton and allies formed a moderate wing. Edmund J. Davis led Radicals who favored stronger federal enforcement and broader restructuring of state government. The split shaped the 1868–69 constitutional convention and produced rival Republican tickets in the 1869 governor's race.</p>
          <p>Ruby and the Union League helped move Black organizational support toward Davis. President Ulysses S. Grant's administration also backed him. Military officials eventually declared Davis the winner of a close election, and Texas ratified the Fourteenth and Fifteenth Amendments and completed readmission requirements in 1870.</p>
          <p><a className="font-bold text-primary" href="/texas-politics/figures/edmund-j-davis-texas-reconstruction-governor">Edmund J. Davis profile →</a></p>
        </HistorySection>

        <HistorySection title="4. The Davis government expanded institutions—and provoked a fierce backlash">
          <p>The Davis administration and Republican Legislature expanded public education, state administration, frontier protection and law enforcement. Republicans argued that postwar violence and local resistance made stronger state authority necessary to protect the new constitutional order. The Texas State Police and militia policies became the administration's most controversial tools.</p>
          <p>Democrats and Republican critics attacked Davis for taxation, centralized government and coercive policing. Those complaints helped restore Democratic control. The history requires both sides of the institutional argument: Texas faced real postwar lawlessness and racial violence, while the new state apparatus also concentrated powers and imposed costs that generated broad opposition.</p>
        </HistorySection>

        <HistorySection title="5. Republican state power collapsed in 1874, but the party did not disappear">
          <p>Democrat Richard Coke defeated Davis decisively in the 1873 election. The disputed transfer of power ended with Democrats taking control of state government in January 1874. From that point, Democrats dominated Texas statewide politics for generations. Reconstruction-era Republican government was over, but Republican committees, conventions and federal patronage networks survived.</p>
          <p>This distinction matters to the later realignment. The modern Texas GOP did not materialize from nothing when conservative Democrats began supporting Eisenhower. A much older organization had continued operating through long periods of electoral weakness.</p>
        </HistorySection>

        <HistorySection title="6. Norris Wright Cuney led a Black-backed Republican organization after Reconstruction">
          <p>After Davis's era, Norris Wright Cuney became the most important Black Republican leader in Texas. Based in Galveston, he combined party organization with labor activism, education work, local office and federal appointments. He became Texas's Republican national committeeman in 1886 and collector of customs at Galveston in 1889. Historians commonly refer to the late nineteenth-century period of his leadership as the Cuney Era.</p>
          <p>Cuney's power increasingly collided with a Lily-White movement that sought to reduce Black influence and make the party more attractive to White voters. The resulting Black-and-Tan versus Lily-White struggle lasted for decades and concerned control of conventions, patronage and national recognition.</p>
          <p><a className="font-bold text-primary" href="/texas-politics/figures/norris-wright-cuney-texas-republican-leader">Norris Wright Cuney profile →</a></p>
        </HistorySection>

        <HistorySection title="7. The Black-and-Tan/Lily-White conflict reshaped the party before modern conservatism">
          <p>After Cuney, William Madison McDonald became an important Black-and-Tan leader. White Republican factions argued that reducing Black convention power was necessary to compete with Democrats. By the early twentieth century, Lily-White leaders gained greater control, and later organizers such as R.B. Creager built a more business-oriented party connected to national Republican administrations.</p>
          <p>The institutional party survived, but its constituency, priorities and internal power structure changed. That is why KTR separates this Reconstruction history from the twentieth-century conservative realignment.</p>
        </HistorySection>
      </article>

      <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8">
        <h2 className="text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-6">{FAQS.map(([question, answer]) => <div key={question}><h3 className="text-xl font-bold">{question}</h3><p className="mt-2 leading-7 text-muted-foreground">{answer}</p></div>)}</div>
      </section>

      <section className="mt-12 rounded-2xl border bg-card p-6 md:p-8">
        <h2 className="text-3xl font-bold">Sources and further reading</h2>
        <p className="mt-3 leading-7 text-muted-foreground">This guide uses institutional historical sources to distinguish the nineteenth-century Republican Party from later political coalitions and avoid projecting modern labels backward onto Reconstruction.</p>
        <ul className="mt-6 space-y-3">{SOURCES.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">{source.label} ↗</a></li>)}</ul>
      </section>
    </main>
  );
}

function HistorySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border bg-card p-6 md:p-8"><h2 className="text-3xl font-bold">{title}</h2><div className="mt-4 space-y-4 leading-8 text-foreground/90">{children}</div></section>;
}
