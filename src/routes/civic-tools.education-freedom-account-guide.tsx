import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { buildSeo } from "@/lib/seo";

const PROGRAM_URL = "https://educationfreedom.texas.gov/families/";
const COMPTROLLER_UPDATE = "https://comptroller.texas.gov/about/media-center/news/20260630-nearly-73000-texas-education-freedom-accounts-to-receive-initial-funding-july-1-1782833580152";

type IncomeTier = "under200" | "200to500" | "over500";
type Setting = "private" | "homeschool" | "other";

export const Route = createFileRoute("/civic-tools/education-freedom-account-guide")({
  head: () => {
    const seo = buildSeo({
      title: "Texas Education Freedom Account Guide | TEFA Eligibility, Priority & Funding",
      description: "Use KTR's educational guide to understand Texas Education Freedom Account basic eligibility, 2026-27 priority tiers, and published award amounts, then verify with the official TEFA program.",
      path: "/civic-tools/education-freedom-account-guide",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: EducationFreedomAccountGuide,
});

function EducationFreedomAccountGuide() {
  const [texasResident, setTexasResident] = useState(true);
  const [lawfulPresence, setLawfulPresence] = useState(true);
  const [schoolEligible, setSchoolEligible] = useState(true);
  const [incomeTier, setIncomeTier] = useState<IncomeTier>("200to500");
  const [disability, setDisability] = useState(false);
  const [iep, setIep] = useState(false);
  const [setting, setSetting] = useState<Setting>("private");

  const result = useMemo(() => {
    const basicallyEligible = texasResident && lawfulPresence && schoolEligible;
    const priority = disability && incomeTier !== "over500"
      ? "Tier 1 — disability and household income at or below 500% FPL"
      : incomeTier === "under200"
        ? "Tier 2 — household income at or below 200% FPL"
        : incomeTier === "200to500"
          ? "Tier 3 — household income above 200% and below 500% FPL"
          : "Tier 4 — household income at or above 500% FPL";

    let funding = "$2,000 annually for homeschool/other students";
    if (setting === "private") funding = "$10,474 for an approved private-school student in 2026–27";
    if (setting === "private" && disability && iep) funding = "Up to $30,000 for a qualifying private-school student with an IEP on file; the actual amount depends on the services in the IEP";

    return { basicallyEligible, priority, funding };
  }, [texasResident, lawfulPresence, schoolEligible, incomeTier, disability, iep, setting]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-4xl border-b pb-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary">Texas civic tool</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">Texas Education Freedom Account Guide</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">Check the program's basic statutory eligibility factors, see the published first-year priority group that best matches your answers, and view the 2026–27 funding amount for the selected education setting.</p>
      </header>

      <aside className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>2026–27 applications are closed.</strong> This tool cannot apply, change an award, determine official eligibility, or move a student on the waitlist. It is an educational explanation of published program rules.
      </aside>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-display text-2xl">Your situation</h2>
          <div className="mt-5 space-y-5">
            <YesNo label="Parent/guardian is a Texas resident" value={texasResident} onChange={setTexasResident} />
            <YesNo label="Child is a U.S. citizen/national or lawfully admitted" value={lawfulPresence} onChange={setLawfulPresence} />
            <YesNo label="Child is eligible to attend a Texas public or open-enrollment charter school (including qualifying pre-K/K)" value={schoolEligible} onChange={setSchoolEligible} />
            <label className="block text-sm font-semibold">Household income priority band
              <select className="mt-2 block w-full rounded-lg border bg-background px-3 py-2" value={incomeTier} onChange={(event) => setIncomeTier(event.target.value as IncomeTier)}>
                <option value="under200">At or below 200% of federal poverty level</option>
                <option value="200to500">Above 200% and below 500% of federal poverty level</option>
                <option value="over500">At or above 500% of federal poverty level</option>
              </select>
            </label>
            <YesNo label="Child has a qualifying disability" value={disability} onChange={setDisability} />
            {disability ? <YesNo label="Child has an IEP on file for the funding calculation" value={iep} onChange={setIep} /> : null}
            <label className="block text-sm font-semibold">Education setting
              <select className="mt-2 block w-full rounded-lg border bg-background px-3 py-2" value={setting} onChange={(event) => setSetting(event.target.value as Setting)}>
                <option value="private">Participating private school / qualifying private pre-K or kindergarten</option>
                <option value="homeschool">Homeschool</option>
                <option value="other">Other eligible nonpublic setting</option>
              </select>
            </label>
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border bg-muted/20 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Basic eligibility screen</p>
            <p className="mt-2 text-2xl font-bold">{result.basicallyEligible ? "Basic factors appear satisfied" : "One or more basic factors is not satisfied"}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">The official program performs document verification and applies additional rules, including narrower pre-K requirements.</p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Published Year 1 priority</p>
            <p className="mt-2 text-lg font-semibold">{result.priority}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Awards are not first-come, first-served. Official program rules govern lotteries, waitlists, sibling priority, disability proof, and the special Tier 4 public-school priority.</p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">2026–27 published funding</p>
            <p className="mt-2 text-lg font-semibold">{result.funding}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Funding shown is program guidance for 2026–27, not a promise of an award or future-year amount.</p>
          </section>
        </div>
      </section>

      <section className="mt-8 rounded-xl border p-6">
        <h2 className="font-display text-2xl">Verify with the official program</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">The official TEFA site says the 2026–27 family application period is closed. It also publishes current priority rules, award amounts, participating-provider information, appeals guidance, and future application updates.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={PROGRAM_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Official TEFA family page ↗</a>
          <a href={COMPTROLLER_UPDATE} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-4 py-2 text-sm font-bold">Comptroller funding update ↗</a>
          <a href="/policy/school-choice" className="rounded-lg border px-4 py-2 text-sm font-bold">School Choice policy tracker</a>
        </div>
      </section>
    </main>
  );
}

function YesNo({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="mt-2 flex gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="radio" checked={value} onChange={() => onChange(true)} /> Yes</label>
        <label className="flex items-center gap-2"><input type="radio" checked={!value} onChange={() => onChange(false)} /> No</label>
      </div>
    </fieldset>
  );
}
