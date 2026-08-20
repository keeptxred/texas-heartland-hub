import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionCard } from "@/components/page-hero";
import { CitationTrustPanel } from "@/components/authority/CitationTrustPanel";

const VOTE_TEXAS_REGISTER = "https://www.votetexas.gov/register-to-vote/";
const VOTE_TEXAS_FAQ = "https://www.votetexas.gov/faq/index.html";
const SOS_ID_GUIDANCE = "https://www.sos.state.tx.us/elections/forms/acceptable-forms-Identification.pdf";
const SOS_STATUS = "https://teamrv-mvp.sos.texas.gov/MVP/mvp.do";

export const Route = createFileRoute("/register-to-vote")({
  head: () => ({
    meta: [
      { title: "Register to Vote in Texas — 2026 Deadline & Official Links | Keep TX Red" },
      { name: "description", content: "Texas voter-registration eligibility, the October 5, 2026 deadline for the November 3 election, official application and status links, and current voter-ID guidance." },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
      { property: "og:title", content: "Register to Vote in Texas — 2026" },
      { property: "og:description", content: "Current Texas registration deadline, eligibility rules, official application links, status lookup and voter-ID guidance." },
    ],
    links: [{ rel: "canonical", href: "https://keeptxred.com/register-to-vote" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Register to Vote in Texas",
        url: "https://keeptxred.com/register-to-vote",
        dateModified: "2026-08-20",
        isBasedOn: [VOTE_TEXAS_REGISTER, VOTE_TEXAS_FAQ, SOS_ID_GUIDANCE],
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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Current deadline · verified August 20, 2026</p>
          <h2 id="current-deadline" className="mt-2 text-3xl font-bold">November 3, 2026 election: register by October 5, 2026</h2>
          <p className="mt-3 leading-7 text-muted-foreground">VoteTexas states that eligible voters must register by the 30th day before Election Day and lists October 5, 2026 as the deadline for the November 3, 2026 Uniform Election. For a mailed application, do not assume the day you drop it in a mailbox will be the postmark date; the state recommends submitting early.</p>
          <a className="mt-4 inline-block font-semibold text-primary underline underline-offset-4" href={VOTE_TEXAS_REGISTER} target="_blank" rel="noopener noreferrer">Check the official registration page →</a>
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
              <li>After the county accepts the application, your registration generally becomes effective 30 days after submission. Verify the record in the state portal instead of relying only on receipt of a paper certificate.</li>
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
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Already registered Texans can use the state&apos;s linked Texas.gov service to update eligible registration information such as an address or name. Follow the official portal from VoteTexas rather than a third-party form.</p>
          </SectionCard>
        </div>

        <CitationTrustPanel
          className="mt-8"
          sources={[
            { name: "VoteTexas — Register to Vote", url: VOTE_TEXAS_REGISTER, note: "Current registration deadline and application guidance." },
            { name: "VoteTexas — Frequently Asked Questions", url: VOTE_TEXAS_FAQ, note: "Registration effectiveness, eligibility and 2026 election guidance." },
            { name: "Texas Secretary of State — Acceptable Forms of Identification", url: SOS_ID_GUIDANCE, note: "Current state voter-identification reference." },
          ]}
          methodology="Keep TX Red treats the Texas Secretary of State and VoteTexas as the controlling public sources for statewide voter-registration and voter-identification guidance. Election deadlines are date-sensitive and should be rechecked against the official election calendar before each election."
          lastVerified="August 20, 2026"
          title="Voter registration sources and verification"
        />
      </main>
    </>
  );
}
