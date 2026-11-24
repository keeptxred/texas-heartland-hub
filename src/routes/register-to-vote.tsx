import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionCard } from "@/components/page-hero";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";

const VOTE_TEXAS_REGISTER = "https://www.votetexas.gov/register-to-vote/";
const VOTE_TEXAS_FAQ = "https://www.votetexas.gov/faq/index.html";
const SOS_ID_GUIDANCE = "https://www.sos.state.tx.us/elections/forms/acceptable-forms-Identification.pdf";
const SOS_STATUS = "https://teamrv-mvp.sos.texas.gov/MVP/mvp.do";
const ELECTION_CALENDAR = "https://www.sos.state.tx.us/elections/voter/important-election-dates.shtml";
const UPDATE_REGISTRATION = "https://www.votetexas.gov/register-to-vote/update-voter-registration.html";
const REGISTRATION_FAQ = "https://www.votetexas.gov/faq/registration";
const REGISTRATION_REVIEWED = "2026-11-24";

export const Route = createFileRoute("/register-to-vote")({
  head: () => ({
    meta: [
      { title: "Register to Vote in Texas: Eligibility, Deadlines & Status" },
      { name: "description", content: "Texas voter registration requirements, how to apply, update a registration, check your status and find official election deadlines." },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { property: "og:title", content: "Register to Vote in Texas" },
      { property: "og:description", content: "Texas registration rules, official application links, status lookup and election-specific deadlines." },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/register-to-vote" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Register to Vote in Texas",
        url: "https://keeptxred.com/register-to-vote",
        dateModified: REGISTRATION_REVIEWED,
        isBasedOn: [VOTE_TEXAS_REGISTER, VOTE_TEXAS_FAQ, SOS_ID_GUIDANCE, ELECTION_CALENDAR, UPDATE_REGISTRATION, REGISTRATION_FAQ],
        about: { "@type": "Thing", name: "Texas voter registration" },
      }),
    }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <>
      <PageHero eyebrow="Texas Elections" title="REGISTER" highlight="TO VOTE" description="Use the current Texas Secretary of State rules and official portals below to register, verify your status, and prepare to vote." />
      <main className="mx-auto max-w-5xl px-4 py-14">
        <section className="mb-8 rounded-2xl border bg-card p-6" aria-labelledby="current-deadline">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Registration deadline rule</p>
          <h2 id="current-deadline" className="mt-2 text-3xl font-bold">Register at least 30 days before the election</h2>
          <p className="mt-3 leading-7 text-muted-foreground">Texas generally requires registration by the 30th day before Election Day. The October 5, 2026 deadline for the November 3 general election is past. Check the official calendar for the next election applicable to your address, including any local runoff or special election. If mailing an application, allow enough time for a timely postmark.</p>
          <a className="mt-4 inline-block font-semibold text-primary underline underline-offset-4" href={VOTE_TEXAS_REGISTER} target="_blank" rel="noopener noreferrer">Check the official registration page →</a>
          <a className="mt-4 block font-semibold text-primary underline underline-offset-4" href={ELECTION_CALENDAR} target="_blank" rel="noopener noreferrer">Official election calendar →</a>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard title="Are You Eligible?">
            <ul className="list-disc space-y-1 pl-5">
              <li>U.S. citizen.</li>
              <li>Resident of the Texas county where you submit the application.</li>
              <li>At least 17 years and 10 months old when you apply, and 18 by Election Day.</li>
              <li>Not finally convicted of a felony, unless you have completed the punishment, including incarceration, parole, supervision or probation, or have been pardoned or otherwise released from the disability to vote.</li>
              <li>Not finally adjudged totally mentally incapacitated, or partially mentally incapacitated without the right to vote, by a court exercising probate jurisdiction.</li>
            </ul>
            <a className="mt-3 inline-block text-sm font-semibold text-primary underline" href={VOTE_TEXAS_FAQ} target="_blank" rel="noopener noreferrer">Official eligibility and registration FAQ →</a>
          </SectionCard>

          <SectionCard title="How to Register">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Start with the official Texas voter-registration application at <a className="text-primary underline" href={VOTE_TEXAS_REGISTER} target="_blank" rel="noopener noreferrer">VoteTexas.gov</a>.</li>
              <li>If you complete the standard online application form, print, sign and send the completed application to your county voter registrar. The online form by itself does not complete a new registration.</li>
              <li>You can also obtain an application from your county voter registrar and other locations identified by the Secretary of State.</li>
              <li>Eligible people may also register when renewing, replacing or updating a Texas driver license or state identification card through DPS. Check the official online options; filling out the standalone application is not the same as submitting it.</li>
              <li>Registration generally takes effect 30 days after you submit an application that the county accepts. Verify the record through the state portal.</li>
            </ol>
          </SectionCard>

          <SectionCard title="Photo ID for In-Person Voting">
            <p className="mb-3 text-sm text-muted-foreground">Registration and in-person voter identification are separate steps. Texas currently lists seven acceptable photo IDs for voters who possess one:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Texas Driver License issued by DPS.</li>
              <li>Texas Election Identification Certificate issued by DPS.</li>
              <li>Texas Personal Identification Card issued by DPS.</li>
              <li>Texas Handgun License issued by DPS.</li>
              <li>U.S. Military Identification Card containing the voter&apos;s photograph.</li>
              <li>U.S. Citizenship Certificate containing the voter&apos;s photograph.</li>
              <li>U.S. Passport, book or card.</li>
            </ul>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">A voter who does not possess and cannot reasonably obtain one of the approved photo IDs may be able to use the state&apos;s Reasonable Impediment Declaration process with supporting identification. Check the official rules before voting.</p>
            <a className="mt-3 inline-block text-sm font-semibold text-primary underline" href={SOS_ID_GUIDANCE} target="_blank" rel="noopener noreferrer">Official Texas voter-ID guidance →</a>
          </SectionCard>

          <SectionCard title="Check or Update Your Record">
            <p>Verify your registration before an election, especially after a move or name change. The Secretary of State&apos;s My Voter Portal shows your statewide registration record and election information.</p>
            <a className="mt-3 inline-block bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground" href={SOS_STATUS} target="_blank" rel="noopener noreferrer">SOS Status Lookup →</a>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Use the state&apos;s official update service after a move or name change. If you moved to a different county, your registration must be updated for your new county of residence. Check the new county and precinct in the state portal, rather than assuming a driver-license address change automatically updated your voting record.</p>
          </SectionCard>
        </div>

        <section className="mt-8 rounded-2xl border bg-card p-6" aria-labelledby="registration-next-steps">
          <h2 id="registration-next-steps" className="text-2xl font-bold">Which office can resolve a registration problem?</h2>
          <p className="mt-3 leading-7">If your record is missing, your certificate has not arrived, or your address is wrong, contact the voter registrar in your county of residence. If you are already registered and moved, use the official update instructions; if an election is close, ask the registrar which options apply to your circumstances. For ballot and polling-place questions, consult the local election office.</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-primary">
            <a href="/county-elections" className="underline">Find county election offices</a>
            <a href={UPDATE_REGISTRATION} className="underline">Official registration update options</a>
            <a href={REGISTRATION_FAQ} className="underline">Official registration FAQ</a>
          </div>
        </section>

        <CitationTrustPanel
          className="mt-8"
          sources={[
            { name: "VoteTexas — Register to Vote", url: VOTE_TEXAS_REGISTER, note: "Registration deadline rule and application guidance." },
            { name: "VoteTexas — Frequently Asked Questions", url: VOTE_TEXAS_FAQ, note: "Registration effectiveness and eligibility." },
            { name: "Texas Secretary of State — Acceptable Forms of Identification", url: SOS_ID_GUIDANCE, note: "State voter-identification reference." },
            { name: "Secretary of State — Important Election Dates", url: ELECTION_CALENDAR, note: "Check election-specific dates, including special and runoff elections." },
            { name: "VoteTexas — Update your voter registration", url: UPDATE_REGISTRATION, note: "Address and name changes and eligible DPS registration transactions." },
            { name: "VoteTexas — Registration FAQ", url: REGISTRATION_FAQ, note: "County registrar and registration status questions." },
          ]}
          methodology="Keep TX Red treats the Texas Secretary of State and VoteTexas as the controlling public sources for statewide voter-registration and voter-identification guidance. Election deadlines are date-sensitive and should be rechecked against the official election calendar before each election."
          lastVerified="November 24, 2026"
          title="Voter registration sources and verification"
        />
      </main>
    </>
  );
}
