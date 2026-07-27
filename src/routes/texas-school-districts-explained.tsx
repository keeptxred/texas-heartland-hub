import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";

const responsibilities = [
  { title: "School boards", body: "Trustees adopt district policy, approve the budget and tax rate, hire and evaluate the superintendent, call bond elections, and oversee long-range priorities. Individual trustees do not run campuses or direct employees outside formal board action." },
  { title: "Superintendents", body: "The superintendent manages day-to-day operations, recommends staffing and policy, implements board decisions, prepares the budget, and supervises district administration." },
  { title: "Campuses", body: "Principals and campus teams handle instruction, discipline, staffing assignments, safety procedures, and parent communication within district policy and state law." },
  { title: "The state", body: "The Legislature writes the Education Code and school-finance rules, while the Texas Education Agency administers accountability, data reporting, certifications, interventions, and many compliance requirements." },
];

const faqs = [
  { question: "Who controls a Texas public school district?", answer: "Voters elect the board of trustees. The board sets policy and hires the superintendent, while the superintendent manages daily operations." },
  { question: "Can a school board raise property taxes by itself?", answer: "A board adopts a tax rate within state law, but rates above certain voter-approval thresholds require an election. Bond debt also requires voter approval." },
  { question: "What is an ISD?", answer: "An independent school district is a local governmental entity created under Texas law to operate public schools within defined boundaries. ISD boundaries often do not match city or county lines." },
  { question: "How can parents influence district decisions?", answer: "Parents can vote in trustee and bond elections, attend meetings, submit public comments, serve on committees, review posted agendas and budgets, and use district complaint and appeal procedures." },
];

export const Route = createFileRoute("/texas-school-districts-explained")({
  head: () => {
    const seo = buildSeo({
      title: "Texas School Districts Explained | Boards, Taxes, Funding & Parent Rights",
      description: "Understand how Texas independent school districts work, including school boards, superintendents, property taxes, bonds, funding, accountability, and parent participation.",
      path: "/texas-school-districts-explained",
      type: "article",
      keywords: "Texas school districts, Texas ISD, school boards Texas, Texas school taxes, school district bonds, parent rights Texas schools",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: TexasSchoolDistrictsExplained,
});

function TexasSchoolDistrictsExplained() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Texas School Districts Explained: Boards, Taxes, Funding and Parent Rights",
    description: "A practical guide to how Texas independent school districts are governed and funded.",
    image: "https://keeptxred.com/images/texas-school-districts-guide.svg",
    datePublished: "2026-07-26",
    dateModified: "2026-07-26",
    author: { "@type": "Organization", name: "Keep TX Red" },
    publisher: { "@type": "Organization", name: "Keep TX Red" },
    mainEntityOfPage: "https://keeptxred.com/texas-school-districts-explained",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Texas education policy</p>
          <h1 className="mt-3 max-w-5xl font-display text-5xl leading-none md:text-7xl">Texas School Districts Explained</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">Texas public schools are local institutions operating under dense state rules. Understanding who controls the district, who sets taxes, and how parents participate makes school politics far easier to follow.</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <img src="/images/texas-school-districts-guide.svg" alt="Texas school district governance diagram showing voters, school board, superintendent, campuses, taxes, and state oversight" className="w-full rounded-xl border" width="1600" height="900" />
        <article className="mx-auto max-w-4xl space-y-12 font-serif text-lg leading-8">
          <section>
            <h2 className="font-display text-4xl">What an independent school district is</h2>
            <p className="mt-5">An independent school district, or ISD, is a local government created under Texas law to operate public schools within a defined territory. Its boundaries frequently cross city limits and sometimes county lines, which is why two families living in the same city can attend different districts and pay different school tax rates.</p>
            <p className="mt-4">Texas has more than 1,000 school districts, each with an elected board, an appointed superintendent, its own budget, and local policies. Yet districts do not operate independently of Austin. The Legislature controls the school-finance framework, graduation requirements, testing system, teacher certification rules, accountability structure, and many parental and student rights.</p>
          </section>
          <section>
            <h2 className="font-display text-4xl">Who does what</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {responsibilities.map((item) => <div key={item.title} className="rounded-xl border bg-muted/20 p-6"><h3 className="font-display text-2xl">{item.title}</h3><p className="mt-3 text-base leading-7 text-muted-foreground">{item.body}</p></div>)}
            </div>
          </section>
          <section>
            <h2 className="font-display text-4xl">How school boards work</h2>
            <p className="mt-5">Trustees act collectively in posted public meetings. They adopt policy, approve contracts, set the district calendar, authorize major purchases, approve curriculum materials within state requirements, and evaluate the superintendent. A single trustee generally cannot order a principal to change a grade, direct a teacher, or hire and fire employees.</p>
            <p className="mt-4">Board meetings are governed by the Texas Open Meetings Act. Agendas must be posted in advance, deliberation must occur in public unless a lawful closed-session exception applies, and final action must be taken in open session. Our guide to <Link to="/news/$slug" params={{ slug: "texas-open-meetings-public-info" }} className="font-semibold text-primary hover:underline">Texas open meetings and public information</Link> explains how residents can inspect records and follow local decisions.</p>
          </section>
          <section>
            <h2 className="font-display text-4xl">Property taxes, bonds, and school funding</h2>
            <p className="mt-5">A district tax bill normally includes a maintenance-and-operations rate for current expenses and an interest-and-sinking rate for voter-approved debt. State law limits tax-rate decisions, and certain increases require voter approval. Bond elections authorize debt for projects such as new schools, renovations, buses, technology, safety upgrades, and athletic facilities.</p>
            <p className="mt-4">Local property taxes do not tell the whole funding story. Texas uses formulas that combine local revenue and state aid, with adjustments for enrollment, student needs, district characteristics, and property wealth. Recapture can require property-wealthy districts to send revenue back through the state system. For the household side, use the <Link to="/tax-calculator" className="font-semibold text-primary hover:underline">Texas property tax calculator</Link> and read the <Link to="/news/$slug" params={{ slug: "texas-school-finance-explained" }} className="font-semibold text-primary hover:underline">Texas school finance guide</Link>.</p>
          </section>
          <section>
            <h2 className="font-display text-4xl">Accountability and state intervention</h2>
            <p className="mt-5">The Texas Education Agency collects performance, attendance, staffing, financial, and enrollment data. Districts and campuses receive accountability ratings under state law, although the exact formulas and litigation around them can change. Persistent academic or governance failures can trigger monitors, conservators, management teams, or replacement of an elected board with a board of managers.</p>
            <p className="mt-4">That intervention power is why local control in Texas is real but limited. Districts control many operational choices, while the state retains authority over standards, accountability, finance, and remedies for noncompliance.</p>
          </section>
          <section>
            <h2 className="font-display text-4xl">Parent rights and participation</h2>
            <p className="mt-5">Parents influence districts first through elections. Trustee races, tax-ratification elections, and bond propositions can shape policy and spending for years. Outside elections, parents can attend meetings, submit comments, serve on site-based committees, request records, review instructional materials, and use formal grievance procedures.</p>
            <p className="mt-4">District policy usually establishes multiple appeal levels, beginning with the campus and moving through administration to the board. Deadlines can be short, so parents should document concerns, identify the applicable policy, and file on time. For a broader view of governance, see <Link to="/news/$slug" params={{ slug: "texas-school-board-powers" }} className="font-semibold text-primary hover:underline">what Texas school boards can and cannot do</Link> and the <Link to="/texas-law-policy" className="font-semibold text-primary hover:underline">Texas Law & Policy hub</Link>.</p>
          </section>
          <section>
            <h2 className="font-display text-4xl">What to review before voting in a school election</h2>
            <ul className="mt-5 list-disc space-y-3 pl-6">
              <li>Current enrollment, projections, and campus capacity.</li>
              <li>The district budget, fund balance, debt schedule, and tax rate history.</li>
              <li>Academic outcomes and whether ratings reflect long-term trends.</li>
              <li>Teacher turnover, staffing vacancies, and compensation plans.</li>
              <li>Bond project lists, cost assumptions, and repayment timelines.</li>
              <li>Board meeting attendance, voting records, and superintendent goals.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-4xl">Frequently asked questions</h2>
            <div className="mt-6 space-y-5">{faqs.map((faq) => <div key={faq.question} className="rounded-xl border p-6"><h3 className="font-display text-2xl">{faq.question}</h3><p className="mt-3 text-base leading-7 text-muted-foreground">{faq.answer}</p></div>)}</div>
          </section>
        </article>
      </div>
    </main>
  );
}
