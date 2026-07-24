import { useMemo, useState } from "react";

type Answer = "" | "yes" | "no";

const GENERAL_ISD_EXEMPTION = 140_000;
const SENIOR_DISABLED_ISD_EXEMPTION = 60_000;

function Choice({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: Answer;
  onChange: (value: Answer) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as Answer)}
        className="mt-2 min-h-11 w-full border border-border bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Choose an answer</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label>
  );
}

const dollars = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export function HomesteadExemptionGuide() {
  const [ownsInterest, setOwnsInterest] = useState<Answer>("");
  const [principalResidence, setPrincipalResidence] = useState<Answer>("");
  const [otherHomestead, setOtherHomestead] = useState<Answer>("");
  const [age65, setAge65] = useState<Answer>("");
  const [disabled, setDisabled] = useState<Answer>("");
  const [disabledVeteran100, setDisabledVeteran100] = useState<Answer>("");

  const result = useMemo(() => {
    const basicComplete = Boolean(ownsInterest && principalResidence && otherHomestead);
    const likelyGeneral =
      ownsInterest === "yes" && principalResidence === "yes" && otherHomestead === "no";
    const likelySeniorDisabled = likelyGeneral && (age65 === "yes" || disabled === "yes");
    const possibleFullVeteran = likelyGeneral && disabledVeteran100 === "yes";

    return {
      basicComplete,
      likelyGeneral,
      likelySeniorDisabled,
      possibleFullVeteran,
      estimatedIsdExemption:
        (likelyGeneral ? GENERAL_ISD_EXEMPTION : 0) +
        (likelySeniorDisabled ? SENIOR_DISABLED_ISD_EXEMPTION : 0),
    };
  }, [age65, disabled, disabledVeteran100, otherHomestead, ownsInterest, principalResidence]);

  return (
    <section id="homestead-eligibility" className="mt-12 border-2 border-foreground bg-card">
      <header className="border-b-2 border-foreground bg-muted p-6 md:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Free eligibility walkthrough
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight">
          Could you qualify for a Texas homestead exemption?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Answer a few questions for general guidance. Your county appraisal district makes the
          official eligibility decision.
        </p>
      </header>

      <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
        <div className="space-y-5">
          <Choice
            id="homestead-owns"
            label="Do you have an ownership interest in the home?"
            value={ownsInterest}
            onChange={setOwnsInterest}
          />
          <Choice
            id="homestead-primary"
            label="Do you use the home as your principal residence?"
            value={principalResidence}
            onChange={setPrincipalResidence}
          />
          <Choice
            id="homestead-other"
            label="Do you claim a residence homestead exemption on another home?"
            value={otherHomestead}
            onChange={setOtherHomestead}
          />
          <Choice
            id="homestead-65"
            label="Are you age 65 or older?"
            value={age65}
            onChange={setAge65}
          />
          <Choice
            id="homestead-disabled"
            label="Do you meet Texas's disability qualification for this exemption?"
            value={disabled}
            onChange={setDisabled}
          />
          <Choice
            id="homestead-veteran"
            label="Are you a veteran rated 100% disabled or individually unemployable for a service-connected disability?"
            value={disabledVeteran100}
            onChange={setDisabledVeteran100}
          />
        </div>

        <div>
          <div className="bg-secondary p-6 text-secondary-foreground" aria-live="polite">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              General guidance
            </p>
            {!result.basicComplete ? (
              <>
                <h3 className="mt-2 font-display text-3xl text-white">
                  Answer the first three questions
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  Those answers determine whether the general residence homestead exemption may
                  apply.
                </p>
              </>
            ) : result.likelyGeneral ? (
              <>
                <h3 className="mt-2 font-display text-3xl text-white">You may qualify</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  Your answers match the basic requirements for the general Texas residence
                  homestead exemption.
                </p>
                <div className="mt-5 border-t border-white/15 pt-5">
                  <p className="text-xs uppercase tracking-widest text-white/85">
                    Possible school-district exemption
                  </p>
                  <p className="mt-1 font-display text-4xl text-primary">
                    {dollars(result.estimatedIsdExemption)}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-white/85">
                    This is an exemption from taxable value, not a cash payment. Local exemptions
                    and actual savings depend on the taxing units and rates serving the property.
                  </p>
                </div>
                {result.possibleFullVeteran && (
                  <p className="mt-4 border border-primary/60 bg-primary/10 p-3 text-sm text-white">
                    You may qualify for a total residence-homestead exemption under the
                    100%-disabled-veteran rules. Confirm the required VA documentation with your
                    appraisal district.
                  </p>
                )}
              </>
            ) : (
              <>
                <h3 className="mt-2 font-display text-3xl text-white">
                  You may not meet the basic rules
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  A qualifying applicant generally must own an interest in the property, use it as a
                  principal residence, and not claim another residence homestead. Contact the
                  appraisal district if your ownership, heir-property, military, or occupancy
                  situation is unusual.
                </p>
              </>
            )}
          </div>

          <div className="mt-5 border border-border p-5">
            <h3 className="font-display text-2xl">How to file</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Locate the appraisal district for the Texas county where the home is located.</li>
              <li>
                Complete Form 50-114 and gather the identification or supporting documents it
                requests.
              </li>
              <li>File with the appraisal district, not with the Texas Comptroller.</li>
              <li>
                The general deadline is before May 1. If that date has passed, ask the appraisal
                district whether a late application is available for your situation.
              </li>
              <li>
                Keep the approval notice and review every future appraisal notice for changes.
              </li>
            </ol>
            <div className="mt-5 grid gap-3">
              <a
                href="https://comptroller.texas.gov/forms/50-114.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-foreground px-4 py-3 text-center text-sm font-bold uppercase tracking-wider hover:bg-muted"
              >
                Download Form 50-114
              </a>
              <a
                href="https://comptroller.texas.gov/taxes/property-tax/county-directory/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary px-4 py-3 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Find your appraisal district
              </a>
              <a
                href="https://comptroller.texas.gov/taxes/property-tax/exemptions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm font-semibold text-primary underline"
              >
                Read the official Texas exemption guidance
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border p-5 text-xs leading-relaxed text-muted-foreground">
        General information only, last reviewed July 23, 2026. Eligibility, local exemptions,
        documentation, deadlines, and taxable values are determined by the applicable appraisal
        district under Texas law.
      </footer>
    </section>
  );
}
