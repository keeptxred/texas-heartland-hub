import { Link } from "@tanstack/react-router";

export type LegislaturePageKey = "hub" | "house" | "senate" | "current" | "past";

const pages = {
  hub: {
    eyebrow: "Texas government",
    title: "Texas Legislature",
    intro: "Follow the Texas Legislature, understand how the House and Senate work, and move quickly between the current session, past sessions, lawmakers, elections, and major policy coverage.",
    sections: [
      ["Texas House of Representatives", "The 150-member chamber where state representatives introduce, debate, and vote on legislation.", "/texas-legislature/house"],
      ["Texas Senate", "The 31-member chamber that considers legislation, confirmations, and statewide policy priorities.", "/texas-legislature/senate"],
      ["Current legislative session", "See the active session hub, key dates, session status, and links to current legislative coverage.", "/texas-legislature/current-session"],
      ["Past legislative sessions", "Browse prior regular and special sessions and connect historical legislation to current debates.", "/texas-legislature/sessions"],
    ],
  },
  house: {
    eyebrow: "Texas Legislature",
    title: "Texas House of Representatives",
    intro: "A practical guide to the Texas House, its 150 districts, leadership, committees, elections, and role in the state lawmaking process.",
    sections: [
      ["Find your representative", "Search for the state representative serving your Texas address.", "/find-representative"],
      ["Texas House elections", "Browse Texas House races and candidate coverage in Election Central.", "/elections/races?browse=state_house_district"],
      ["Contact legislators", "Find official contact options for Texas lawmakers.", "/contact-legislators"],
      ["Current session", "Track the session in which House bills, resolutions, and committee work are moving.", "/texas-legislature/current-session"],
    ],
  },
  senate: {
    eyebrow: "Texas Legislature",
    title: "Texas Senate",
    intro: "A practical guide to the Texas Senate, its 31 districts, leadership, committees, elections, confirmations, and role in passing state law.",
    sections: [
      ["Find your senator", "Use the representative lookup to identify the Texas senator serving your address.", "/find-representative"],
      ["Texas Senate elections", "Browse Texas Senate races and candidate coverage in Election Central.", "/elections/races?browse=state_senate_district"],
      ["Contact legislators", "Find official contact options for Texas senators and representatives.", "/contact-legislators"],
      ["Current session", "Track the active legislative calendar and session coverage.", "/texas-legislature/current-session"],
    ],
  },
  current: {
    eyebrow: "Texas Legislature",
    title: "Current Texas Legislative Session",
    intro: "Use this page as the starting point for current Texas legislative activity, including session status, House and Senate coverage, lawmakers, bills, laws, and election context.",
    sections: [
      ["Legislative updates", "Read the latest KeepTXRed coverage of Texas legislative activity and policy developments.", "/legislative-updates"],
      ["Texas laws hub", "Review major Texas laws, new-law explainers, and policy guides.", "/laws"],
      ["Texas House", "Understand the chamber, districts, elections, and representative resources.", "/texas-legislature/house"],
      ["Texas Senate", "Understand the chamber, districts, elections, and senator resources.", "/texas-legislature/senate"],
    ],
  },
  past: {
    eyebrow: "Texas Legislature",
    title: "Past Texas Legislative Sessions",
    intro: "Browse the Texas Legislature by session and use prior regular and special sessions to understand when laws were debated, passed, amended, or revisited.",
    sections: [
      ["Current session", "Return to the active Texas legislative session hub.", "/texas-legislature/current-session"],
      ["Texas laws", "Connect legislation from prior sessions with current Texas law explainers.", "/texas-laws"],
      ["Legislative updates", "Review KeepTXRed legislative and policy coverage.", "/legislative-updates"],
      ["Election Central", "See the elections that determine the membership of the Texas House and Senate.", "/elections/legislative"],
    ],
  },
} as const;

export default function TexasLegislaturePage({ page }: { page: LegislaturePageKey }) {
  const content = pages[page];
  return (
    <main>
      <header className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{content.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{content.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/85">{content.intro}</p>
          <nav aria-label="Texas Legislature" className="mt-7 flex flex-wrap gap-3 text-sm font-semibold">
            <Link to="/texas-legislature" className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">Legislature</Link>
            <Link to="/texas-legislature/house" className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">House</Link>
            <Link to="/texas-legislature/senate" className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">Senate</Link>
            <Link to="/texas-legislature/current-session" className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">Current Session</Link>
            <Link to="/texas-legislature/sessions" className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">Past Sessions</Link>
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-12">
        {page === "hub" ? (
          <>
            <section className="rounded-xl border bg-card p-6">
              <h2 className="text-2xl font-bold">How the Texas Legislature works</h2>
              <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">
                The Texas Legislature is the state’s lawmaking branch. Its 150-member House and
                31-member Senate must pass the same bill text before legislation can go to the
                governor. Regular sessions begin in January of odd-numbered years and may last
                no more than 140 days; only the governor may call a special session.
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                {[["150", "Texas House members"], ["31", "Texas senators"], ["140 days", "Maximum regular session"]].map(([value, label]) => (
                  <div key={label} className="rounded-lg bg-muted p-4">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="mt-1 text-2xl font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-2xl font-bold">How a Texas bill becomes law</h2>
                <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-muted-foreground">
                  <li>A House member or senator files a bill.</li>
                  <li>The presiding officer refers it to a committee for public consideration.</li>
                  <li>The originating chamber debates and votes on the measure.</li>
                  <li>The second chamber repeats the committee and floor process.</li>
                  <li>Both chambers approve identical text and send it to the governor.</li>
                </ol>
                <a href="https://capitol.texas.gov/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-primary hover:underline">Verify bills with Texas Legislature Online →</a>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h2 className="text-2xl font-bold">Frequently asked questions</h2>
                <div className="mt-4 space-y-5">
                  <div><h3 className="font-semibold">How many Texas legislators are there?</h3><p className="mt-1 text-muted-foreground">Texas has 181 legislators: 150 representatives and 31 senators.</p></div>
                  <div><h3 className="font-semibold">Who calls a special session?</h3><p className="mt-1 text-muted-foreground">Only the governor can call a special session and determine its subjects.</p></div>
                  <div><h3 className="font-semibold">Where are official bill actions published?</h3><p className="mt-1 text-muted-foreground">Texas Legislature Online is the authoritative source for bill text, actions, votes and committee records.</p></div>
                </div>
              </div>
            </section>
          </>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2">
          {content.sections.map(([title, description, href]) => (
            <a key={href} href={href} className="rounded-xl border bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md">
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
              <span className="mt-4 inline-block font-semibold text-primary">Explore →</span>
            </a>
          ))}
        </div>
        <aside className="mt-10 rounded-xl border-l-4 border-primary bg-muted p-6">
          <h2 className="text-xl font-bold">Texas Legislature resources</h2>
          <p className="mt-2 leading-7 text-muted-foreground">KeepTXRed connects legislative information with Texas lawmakers, elections, laws, policy coverage, and practical voter resources.</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-semibold text-primary">
            <Link to="/representatives">Representatives</Link><Link to="/elections/legislative">Legislative elections</Link><Link to="/texas-law-policy">Texas law and policy</Link><Link to="/get-involved">Get involved</Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
