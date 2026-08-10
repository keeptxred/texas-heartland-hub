import { createFileRoute, Link } from "@tanstack/react-router";
import heroFlag from "@/assets/hero-flag.jpg";
import { PUBLISHER_LOGO } from "@/lib/seo";

const URL = "https://keeptxred.com/keep-texas-red";
const TITLE = "Keep Texas Red | Elections, Policy and Conservative Government";
const DESC =
  "What Keep Texas Red means in Texas politics: elections, legislation, border policy, energy, constitutional rights, education policy and government accountability.";
const EMPTY_BILLS_SEARCH = { q: "", status: "", legislature: 0, chamber: "", billType: "", page: 1 } as const;

export const Route = createFileRoute("/keep-texas-red")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: heroFlag },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroFlag },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESC,
          image: [heroFlag],
          datePublished: "2026-06-27",
          dateModified: "2026-08-04",
          author: { "@type": "Organization", name: "Keep TX Red Editorial Team" },
          publisher: {
            "@type": "NewsMediaOrganization",
            name: "Keep TX Red",
            url: "https://keeptxred.com/",
            logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": URL },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com/" },
            { "@type": "ListItem", position: 2, name: "Keep Texas Red", item: URL },
          ],
        }),
      },
    ],
  }),
  component: KeepTexasRedPage,
});

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="font-display text-3xl md:text-4xl tracking-tight border-b border-border pb-2">
        {title}
      </h2>
      <div className="mt-4 space-y-4 font-serif text-base md:text-lg leading-relaxed text-foreground">
        {children}
      </div>
    </section>
  );
}

function KeepTexasRedPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">Keep Texas Red</span>
      </nav>

      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">Pillar Guide</span>
      <h1 className="mt-2 font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
        Keep Texas Red: Elections, Policy and Conservative Government
      </h1>
      <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-snug font-serif italic">
        A guide to the elections, institutions, laws and policy debates that shape conservative government in Texas.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-border py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">By Keep TX Red Editorial Team</span>
        <span>•</span>
        <span>Updated <time dateTime="2026-08-04">August 4, 2026</time></span>
      </div>

      <div className="my-8 aspect-[16/9] overflow-hidden border-2 border-foreground/10 bg-muted">
        <img src={heroFlag} alt="Texas state flag waving against a clear sky" className="size-full object-cover" width={1280} height={720} />
      </div>

      <p className="font-serif text-base md:text-lg leading-relaxed text-foreground">
        “Keep Texas Red” is a political objective: maintain conservative governing majorities while holding elected officials accountable for the policies they campaign on. It involves more than party labels. Voters judge candidates and officeholders on border security, taxation and spending, energy reliability, education policy, constitutional rights, public safety, election administration and the proper limits of government.
      </p>

      <Section id="elections" title="Elections Are the Foundation">
        <p>
          Texas voters choose statewide officials, legislators, judges, members of Congress, county officials, school-board members and local leaders. Primary elections often decide the direction of the Republican Party because many districts are not competitive in November. Runoffs, low-turnout local elections and constitutional-amendment elections can therefore matter as much as the most visible statewide race.
        </p>
        <p>
          Keep TX Red tracks candidates, races, districts, polls and results through <Link to="/elections" className="text-primary underline">Election Central</Link>. Voters can also use the <Link to="/representatives" className="text-primary underline">representatives directory</Link> to connect campaign promises with an official’s actual record.
        </p>
      </Section>

      <Section id="legislature" title="The Legislature Turns Campaigns Into Law">
        <p>
          The Texas Legislature meets in regular session every two years, with special sessions called by the governor. The House and Senate consider thousands of bills, but committee chairs, calendars, deadlines and procedural rules determine which proposals receive a vote. The lieutenant governor exercises substantial control over the Senate, while the House speaker shapes committee assignments and floor access in the lower chamber.
        </p>
        <p>
          Readers can search legislation in the <Link to="/bills" search={EMPTY_BILLS_SEARCH} className="text-primary underline">Texas bills database</Link>, review the <Link to="/texas-legislature" className="text-primary underline">Texas Legislature guide</Link> and follow the committees that decide whether legislation advances.
        </p>
      </Section>

      <Section id="border" title="Border Policy and State Authority">
        <p>
          Texas shares more international border with Mexico than any other state. Immigration enforcement is primarily federal, but state government controls the Department of Public Safety, the Texas National Guard, criminal law, state spending and many operations affecting border counties. That division of authority creates recurring legal disputes over what Texas may do when state leaders believe federal enforcement is inadequate.
        </p>
        <p>
          Serious coverage must distinguish political claims from legal authority, appropriated spending, court orders and measurable outcomes. Keep TX Red follows those records rather than treating every announcement as a completed policy result.
        </p>
      </Section>

      <Section id="energy" title="Energy Reliability and Regulation">
        <p>
          Texas is a leading producer of oil, natural gas, wind and solar power. State policy must balance production, transmission, affordability and grid reliability. ERCOT manages most of the state’s electric grid, while the Public Utility Commission, the Railroad Commission, the Legislature and other agencies hold different regulatory responsibilities.
        </p>
        <p>
          Energy debates often turn on who pays for reliability, how dispatchable generation is encouraged, how transmission is built and how regulators measure performance. Those are government and legislative questions, not merely market stories.
        </p>
      </Section>

      <Section id="taxes" title="Taxes, Spending and Accountability">
        <p>
          Texas has no individual state income tax, but state and local government rely on sales taxes, property taxes, severance taxes, franchise taxes, fees and federal funds. Property-tax policy involves school finance, appraisal rules, exemptions, tax rates and local government budgets. The Legislature can change parts of that system, but counties, cities, school districts and special districts retain important responsibilities.
        </p>
        <p>
          Keep TX Red covers the policy choices, voting records, appropriations and official fiscal documents behind tax-relief claims. Household planning calculators and nonpolitical property-tax guidance belong on TexasDefined; Keep TX Red focuses on the government decisions that create or change the rules.
        </p>
      </Section>

      <Section id="education" title="Education Policy and Parental Authority">
        <p>
          Texas education policy includes school finance, curriculum standards, testing, teacher policy, school safety, parental rights, charter schools, education savings accounts and oversight of local districts. Authority is divided among the Legislature, governor, Texas Education Agency, State Board of Education and locally elected school boards.
        </p>
        <p>
          Because school-board and legislative elections directly affect those policies, education coverage belongs within the site’s civic and political mission when it is grounded in official actions, public records and accountable decision-makers.
        </p>
      </Section>

      <Section id="rights" title="Constitutional Rights and the Courts">
        <p>
          Gun rights, religious liberty, speech, due process, property rights and limits on administrative power remain central Texas political issues. Legislation is only one part of the story. State and federal courts determine whether laws survive constitutional challenges, while the attorney general and local governments frequently shape how disputes reach the judiciary.
        </p>
        <p>
          The <Link to="/laws" className="text-primary underline">Texas laws hub</Link> provides plain-language context, while current reporting connects legal disputes to elections, officeholders and legislative action.
        </p>
      </Section>

      <Section id="accountability" title="Keeping Red Government Accountable">
        <p>
          Supporting conservative government does not require accepting every claim from a Republican officeholder. Accountability means checking bill text, votes, budgets, contracts, agency rules, court filings, campaign-finance records and official results. It also means distinguishing proposals from enacted laws and announcements from measurable implementation.
        </p>
        <p>
          Keep TX Red exists to connect political news to the institutions and records behind it. The goal is to help Texans understand who made a decision, what authority they used, what the policy actually does and what voters can do next.
        </p>
      </Section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-2xl tracking-tight">Continue exploring</h2>
        <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <li><Link to="/news" className="text-primary hover:underline">Latest Texas news →</Link></li>
          <li><Link to="/texas-politics" className="text-primary hover:underline">Texas politics →</Link></li>
          <li><Link to="/texas-economy" className="text-primary hover:underline">Texas economic policy →</Link></li>
          <li><Link to="/elections" className="text-primary hover:underline">Election Central →</Link></li>
          <li><Link to="/bills" search={EMPTY_BILLS_SEARCH} className="text-primary hover:underline">Search Texas bills →</Link></li>
          <li><Link to="/about" className="text-primary hover:underline">About Keep TX Red →</Link></li>
        </ul>
      </section>
    </article>
  );
}
