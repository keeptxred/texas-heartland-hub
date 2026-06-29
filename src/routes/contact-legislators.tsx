import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SectionCard } from "@/components/page-hero";
import { US_SENATORS, STATE_LEADERSHIP } from "@/data/representatives";
import { PageExpansion } from "@/components/page-expansion";

export const Route = createFileRoute("/contact-legislators")({
  head: () => ({
    meta: [
      { title: "Contact Your Legislators — Keep TX Red" },
      { name: "description", content: "Phone scripts, email templates, and direct numbers to reach your Texas legislators on the bills that matter." },
      { property: "og:title", content: "Contact Your Legislators" },
    ],
    links: [{ rel: "canonical", href: "/contact-legislators" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Make the Call" title="CONTACT YOUR" highlight="LEGISLATORS" description="One well-placed phone call from a constituent counts more than a thousand petitions. Here's how to make yours count." />
      <div className="mx-auto max-w-5xl px-4 py-14 space-y-6">
        <SectionCard title="The 60-Second Script">
          <p className="italic border-l-4 border-primary pl-4">
            "Hi, my name is [Name] and I'm a constituent from [City, ZIP]. I'm calling to urge [Senator/Representative Last Name] to <strong>support / oppose</strong> [Bill Number — short description]. This issue matters to my family because [one sentence]. Can I get the [Senator/Representative]'s position on this bill? Thank you."
          </p>
          <p className="text-xs text-muted-foreground">Stay polite. Get the staffer's name. Note the date in case you need to follow up.</p>
        </SectionCard>

        <SectionCard title="When to Call vs. Email">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Call</strong> when a vote is in the next 5 business days — phones get tallied.</li>
            <li><strong>Email</strong> for record. Use the official contact form, not generic addresses.</li>
            <li><strong>Show up</strong> at the Capitol committee hearings for the biggest fights — testimony cards count.</li>
          </ul>
        </SectionCard>

        <div className="border-2 border-foreground/10 bg-card p-6 md:p-7">
          <h2 className="font-display text-3xl tracking-tight mb-4">Direct Lines</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {[...US_SENATORS, ...STATE_LEADERSHIP].map((r) => (
              <div key={r.name} className="flex justify-between gap-4 border-b border-foreground/10 pb-2">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{r.office}</p>
                </div>
                <p className="font-mono text-sm whitespace-nowrap">{r.phoneDC || r.phoneTX}</p>
              </div>
            ))}
          </div>
          <Link to="/representatives" className="inline-block mt-5 text-xs font-bold uppercase tracking-widest text-primary hover:underline">Full Directory →</Link>
        </div>

        <PageExpansion
          perspectiveTitle="What Actually Moves a Texas Legislator"
          perspective={<>According to internal interviews with Capitol staffers, the call volume that changes a vote is rarely the petition with 50,000 signatures forwarded from a national group. It is 40 phone calls from constituents in the member's own district inside a 24-hour window before a committee hearing. Texas legislative offices tally constituent contacts by ZIP code, and members are briefed on those tallies before floor votes. A handful of well-timed calls from a single House district can land on a member's morning briefing sheet.</>}
          blocks={[
            { heading: "When to Call vs. When to Email", body: <>Call when a vote is within five business days — phones ring through to a staffer who logs your position in real time. Email when you want a record or are writing on a non-urgent issue. Always use the official contact form on the member's site, not a generic inbox, so your message lands in the constituent-services system rather than spam.</> },
            { heading: "Phone Script That Actually Gets Logged", body: <>Open with your name, city, and ZIP — that establishes you as a constituent. State the bill number and your position in one sentence. Add one sentence on why it matters to your family. Ask for the member's position and the name of the staffer logging the call. Keep the entire call under 90 seconds. Long calls get summarized down; short calls get quoted up.</> },
            { heading: "Showing Up at the Capitol", body: <>For the biggest fights, file a witness card before the committee hearing — even two minutes of in-person testimony from a constituent carries more weight than written comments. The Capitol is open during session; committee schedules are posted at the Texas Legislature Online site. Bring photo ID, arrive 30 minutes early, and dress like you would for jury duty.</> },
            { heading: "Working With District Staff", body: <>District offices (the Texas office, not the D.C. one) handle constituent casework — passport problems, agency runarounds, federal benefit appeals. They also brief the member on local issues. Build a relationship there. A district director who knows your name will flag your calls when a relevant bill is moving.</> },
            { heading: "What Not to Do", body: <>Do not call repeatedly in the same day from the same number — it gets you flagged, not heard. Do not threaten primary challenges in a call; staffers tune out and the member never hears it. Do not send form-letter emails copied from advocacy groups verbatim; offices filter these into bulk tallies that count for almost nothing.</> },
          ]}
          faqs={[
            { q: "Does my call really get counted?", a: <>Yes. Texas legislative offices keep daily tally sheets of constituent contacts by position and ZIP code.</> },
            { q: "Should I call the D.C. office or the Texas office?", a: <>For state bills, call the Texas Capitol office. For federal issues, call the D.C. office for U.S. senators and U.S. representatives.</> },
            { q: "What if I do not know my legislator?", a: <>Use the <a href="/find-representative" className="text-primary underline">Find Your Representative</a> tool to look up everyone who represents your address.</> },
            { q: "Will my call be public?", a: <>The content is not made public, but the position you take is logged internally and may be cited in aggregate tallies.</> },
            { q: "What is the best time to call?", a: <>Tuesday through Thursday, 9 a.m. to 4 p.m. Central. Avoid Mondays (planning) and Fridays (members travel home).</> },
          ]}
          summary={<>The most effective constituent contact is a 90-second phone call from a member's own district, made within five business days of a vote, that names the bill and the caller's ZIP code. Email for record, call for impact, show up for the biggest fights, and never use a form letter.</>}
          related={[
            { to: "/find-representative", label: "Find your Texas representative" },
            { to: "/representatives", label: "Full directory of Texas representatives" },
            { to: "/legislative-updates", label: "Latest legislative updates" },
            { to: "/register-to-vote", label: "Register to vote in Texas" },
          ]}
        />
      </div>
    </>
  );
}