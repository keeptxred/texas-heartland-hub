import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionCard } from "@/components/page-hero";

export const Route = createFileRoute("/register-to-vote")({
  head: () => ({
    meta: [
      { title: "Register to Vote in Texas — Keep TX Red" },
      { name: "description", content: "Step-by-step instructions to register to vote in Texas, including ID requirements, deadlines, and how to check your registration status." },
      { property: "og:title", content: "Register to Vote in Texas" },
    ],
    links: [{ rel: "canonical", href: "/register-to-vote" }],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <>
      <PageHero eyebrow="Civic Action" title="REGISTER" highlight="TO VOTE" description="Texas requires registration 30 days before any election. It takes five minutes — do it once, do it right." />
      <div className="mx-auto max-w-5xl px-4 py-14 grid md:grid-cols-2 gap-6">
        <SectionCard title="Are You Eligible?">
          <ul className="list-disc pl-5 space-y-1">
            <li>U.S. citizen</li>
            <li>Resident of the Texas county where you register</li>
            <li>At least 17 years and 10 months old (must be 18 by Election Day)</li>
            <li>Not a convicted felon (unless sentence and parole are complete)</li>
            <li>Not declared mentally incapacitated by a court</li>
          </ul>
        </SectionCard>
        <SectionCard title="How to Register">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Download the Texas Voter Registration Application (English/Spanish) from <a className="text-primary underline" href="https://www.votetexas.gov/register-to-vote/" target="_blank" rel="noopener noreferrer">VoteTexas.gov</a>.</li>
            <li>Complete it by hand — Texas does not currently offer fully online voter registration.</li>
            <li>Mail it to your county Voter Registrar (postage required), or drop it off in person.</li>
            <li>Wait for your orange voter registration card to arrive — usually within 30 days.</li>
          </ol>
        </SectionCard>
        <SectionCard title="Accepted Photo IDs">
          <ul className="list-disc pl-5 space-y-1">
            <li>Texas Driver License (DPS)</li>
            <li>Texas Election Identification Certificate (EIC)</li>
            <li>Texas Handgun License</li>
            <li>U.S. Military ID with photo</li>
            <li>U.S. Citizenship Certificate with photo</li>
            <li>U.S. Passport (book or card)</li>
          </ul>
        </SectionCard>
        <SectionCard title="Check Your Status">
          <p>If you've moved, married, or skipped a few cycles, verify before Election Day:</p>
          <a className="inline-block mt-2 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest" href="https://teamrv-mvp.sos.texas.gov/MVP/mvp.do" target="_blank" rel="noopener noreferrer">SOS Status Lookup →</a>
        </SectionCard>
      </div>
    </>
  );
}