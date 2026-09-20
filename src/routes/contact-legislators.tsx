import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SectionCard } from "@/components/page-hero";
import { US_SENATORS, STATE_LEADERSHIP } from "@/data/representatives";
import { PageExpansion } from "@/components/page-expansion";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";

const TLO_CONTACT = "https://capitol.texas.gov/Resources/contactText.aspx";
const TLO_COMMITTEES = "https://capitol.texas.gov/Committees/Membership.aspx";
const HOUSE_WITNESS = "https://www.house.texas.gov/committees/witness-registration";
const TLO_HOME = "https://capitol.texas.gov/Home.aspx";

export const Route = createFileRoute("/contact-legislators")({
  head: () => ({
    meta: [
      { title: "Contact Your Texas Legislators — Official Links & Practical Script | Keep TX Red" },
      { name: "description", content: "Find your Texas lawmakers, use official Legislature contact channels, prepare a concise bill-specific message, and locate House committee witness-registration guidance." },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { property: "og:title", content: "Contact Your Texas Legislators" },
      { property: "og:description", content: "Official Texas Legislature contact and committee links, member directory access, and a practical constituent message template." },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/contact-legislators" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Contact Your Texas Legislators",
        url: "https://keeptxred.com/contact-legislators",
        dateModified: "2026-08-20",
        isBasedOn: [TLO_CONTACT, TLO_COMMITTEES, HOUSE_WITNESS],
      }),
    }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Texas Legislature" title="CONTACT YOUR" highlight="LEGISLATORS" description="Find the right member or committee, identify the bill or issue, and use an official contact channel. Keep the message specific enough that an office can understand exactly what you are asking for." />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-14">
        <SectionCard title="Start With the Right Office">
          <p>Texas Legislature Online directs people who want to request legislative action or express an opinion on an issue to identify their representatives and use member contact information. For committee-specific questions, use the House or Senate committee pages.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <a href="/find-representative" className="text-primary underline underline-offset-4">Find who represents you →</a>
            <a href={TLO_CONTACT} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Official TLO contact guidance ↗</a>
            <a href={TLO_COMMITTEES} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">Official committee directory ↗</a>
          </div>
        </SectionCard>

        <SectionCard title="A Concise Constituent Script">
          <p className="border-l-4 border-primary pl-4 italic">
            "Hi, my name is [Name], and I live in [City / ZIP]. I&apos;m contacting [Senator / Representative Last Name] about [Bill Number or specific issue]. I&apos;m asking the member to <strong>support / oppose / review</strong> [specific action]. This matters to me because [one short reason]. Could you tell me the member&apos;s current position or the best place to follow up? Thank you."
          </p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">A bill number, committee name, district, and concise request make the message easier to route. Do not assume any particular contact method guarantees a response or changes a vote.</p>
        </SectionCard>

        <SectionCard title="Phone, Written Message, or Committee Hearing?">
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>Phone:</strong> useful when you want to speak with or leave a concise message for the member&apos;s office.</li>
            <li><strong>Official contact form or email:</strong> useful when you need to include a bill number, supporting details, or a written record of your message.</li>
            <li><strong>Committee:</strong> if the issue is before a committee, use the committee page for hearing notices, clerk information, membership, and related records.</li>
            <li><strong>House testimony:</strong> the Texas House uses electronic witness registration for committee hearings. Registration rules and availability are controlled by the committee process, so check the hearing information before traveling to the Capitol.</li>
          </ul>
          <a href={HOUSE_WITNESS} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4">Official House witness-registration guidance →</a>
        </SectionCard>

        <section className="border-2 border-foreground/10 bg-card p-6 md:p-7" aria-labelledby="direct-lines">
          <h2 id="direct-lines" className="mb-4 font-display text-3xl tracking-tight">Selected Direct Lines</h2>
          <p className="mb-5 text-sm leading-6 text-muted-foreground">These contacts come from KTR&apos;s maintained representative dataset. Use the full directory for your own House, Senate, and congressional delegation.</p>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            {[...US_SENATORS, ...STATE_LEADERSHIP].map((r) => (
              <div key={r.name} className="flex justify-between gap-4 border-b border-foreground/10 pb-2">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{r.office}</p>
                </div>
                <p className="whitespace-nowrap font-mono text-sm">{r.phoneDC || r.phoneTX}</p>
              </div>
            ))}
          </div>
          <Link to="/representatives" className="mt-5 inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline">Full Directory →</Link>
        </section>

        <PageExpansion
          perspectiveTitle="A Better Way to Prepare Before You Contact an Office"
          perspective={<>The most defensible way to make a legislative contact useful is to identify the correct office, name the bill or policy question, state the action you want, and verify the legislative status before you call or write. Texas Legislature Online provides the official bill, committee, calendar, member, and hearing records needed to do that preparation.</>}
          blocks={[
            { heading: "Verify the bill first", body: <>Open the bill record and confirm the bill number, chamber, author or sponsor, current status, and committee referral. A message about the wrong bill number or an old version is harder for an office to act on.</> },
            { heading: "Contact the member who represents you", body: <>Use the representative lookup or member directory to identify your own district&apos;s lawmakers. If your question concerns a committee proceeding, the official committee page also provides membership and clerk information.</> },
            { heading: "Follow committee notices", body: <>Committee hearing notices can change. Use Texas Legislature Online for the current date, time, location, agenda, and later records such as minutes or witness lists rather than relying on a copied schedule.</> },
            { heading: "Prepare testimony from the official hearing record", body: <>For Texas House committee testimony, review the House witness-registration instructions and the hearing notice. Bring the correct bill number and committee information and follow the committee clerk&apos;s registration process.</> },
            { heading: "Keep advocacy claims separate from official facts", body: <>You can make a forceful argument without presenting undocumented claims about how offices count calls, which day of the week is most persuasive, or how many contacts will change a vote. Use official records for process claims and clearly label opinion as opinion.</> },
          ]}
          faqs={[
            { q: "How do I find my Texas legislators?", a: <>Use the <a href="/find-representative" className="text-primary underline">Find Your Representative</a> tool, then verify the member&apos;s official contact information.</> },
            { q: "Where should I ask about a committee hearing?", a: <>Use the official House or Senate committee page. Texas Legislature Online specifically directs legislative-issue questions to members and relevant committees rather than its website feedback form.</> },
            { q: "How do I testify at a Texas House committee hearing?", a: <>The House uses electronic witness registration. Review the official witness-registration page and the specific hearing notice because registration is tied to the committee hearing.</> },
            { q: "Can I track a bill before contacting an office?", a: <>Yes. Use <a href="/bills" className="text-primary underline">KTR&apos;s bill search</a> for an organized record and Texas Legislature Online for the controlling official documents, calendars, and actions.</> },
          ]}
          summary={<>Identify the right legislator or committee, verify the current bill record, make one specific request, and use the official contact or hearing process. That advice is durable because it is grounded in the Legislature&apos;s published process rather than undocumented claims about office behavior.</>}
          related={[
            { to: "/find-representative", label: "Find your Texas representative" },
            { to: "/representatives", label: "Full directory of Texas representatives" },
            { to: "/bills", label: "Track Texas legislation" },
            { to: "/register-to-vote", label: "Register to vote in Texas" },
          ]}
        />

        <CitationTrustPanel
          sources={[
            { name: "Texas Legislature Online — Contact", url: TLO_CONTACT, note: "Official guidance for contacting members or committees about legislative issues." },
            { name: "Texas Legislature Online — Committees", url: TLO_COMMITTEES, note: "Official committee membership, meetings, notices and records." },
            { name: "Texas House — Witness Registration", url: HOUSE_WITNESS, note: "Official House committee witness-registration process." },
            { name: "Texas Legislature Online", url: TLO_HOME, note: "Official bills, calendars, committees, journals and legislative records." },
          ]}
          methodology="Keep TX Red uses official Legislature sources for contact, committee and witness-registration process claims. The sample script is practical editorial guidance, not a claim that any particular method, timing or volume of contacts will produce a legislative outcome."
          lastVerified="August 20, 2026"
          title="Legislator contact sources and methodology"
        />
      </main>
    </>
  );
}
