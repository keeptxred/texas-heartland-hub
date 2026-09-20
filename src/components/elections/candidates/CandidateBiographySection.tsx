import type { CandidateDetail, CandidateParty, RaceDetail } from "@/types/elections";
import {
  CANDIDATE_STATUS_LABELS,
  INCUMBENCY_TYPE_LABELS,
} from "@/types/elections/candidateClassifications";
import { getFeaturedCandidateProfile } from "@/lib/elections/featuredCandidateProfiles";

export interface CandidateBiographySectionProps {
  candidate: CandidateDetail;
  race: RaceDetail | null;
}

const PARTY_STYLES: Record<CandidateParty, string> = {
  republican: "border-red-200 bg-red-50 text-red-800",
  democratic: "border-blue-200 bg-blue-50 text-blue-800",
  libertarian: "border-amber-200 bg-amber-50 text-amber-800",
  green: "border-green-200 bg-green-50 text-green-800",
  independent: "border-violet-200 bg-violet-50 text-violet-800",
  nonpartisan: "border-border bg-muted/50 text-muted-foreground",
  other: "border-border bg-muted/50 text-muted-foreground",
};

function formatParty(value: CandidateParty) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CandidateBiographySection({ candidate, race }: CandidateBiographySectionProps) {
  const featuredProfile = getFeaturedCandidateProfile(candidate.fullName);
  const initials = candidate.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const officeName = race?.officeName ?? candidate.currentOfficeName;
  const approvedCandidateImage =
    candidate.imageUrl && candidate.imageRights?.usageStatus === "approved"
      ? candidate.imageUrl
      : null;
  const usableImage = approvedCandidateImage ?? featuredProfile?.imageUrl ?? null;
  const biography = candidate.biography ?? featuredProfile?.biography ?? null;

  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="grid gap-7 md:grid-cols-[12rem_1fr]">
        <div>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-muted text-4xl font-bold text-muted-foreground">
            {usableImage ? (
              <img
                src={usableImage}
                alt={candidate.imageAltText ?? featuredProfile?.imageAltText ?? `Portrait of ${candidate.fullName}`}
                className="size-full object-cover"
              />
            ) : (
              <span aria-label={`No published portrait for ${candidate.fullName}`}>{initials}</span>
            )}
          </div>
          {approvedCandidateImage && candidate.imageRights?.credit ? (
            <p className="mt-2 text-xs text-muted-foreground">Photo: {candidate.imageRights.credit}</p>
          ) : featuredProfile ? (
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Photo: {featuredProfile.imageCredit}. {featuredProfile.imageLicense}.{" "}
              <a className="font-semibold text-primary hover:underline" href={featuredProfile.imageSourceUrl} target="_blank" rel="noreferrer">
                Source and license
              </a>
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${PARTY_STYLES[candidate.party]}`}>
              {candidate.partyLabel ?? formatParty(candidate.party)}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {CANDIDATE_STATUS_LABELS[candidate.status]}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
            {candidate.fullName}
          </h1>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/30 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Office</dt>
              <dd className="mt-1 font-semibold text-foreground">{officeName ?? "No office assignment published"}</dd>
            </div>
            <div className="rounded-lg bg-muted/30 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Incumbency</dt>
              <dd className="mt-1 font-semibold text-foreground">{INCUMBENCY_TYPE_LABELS[candidate.incumbencyType]}</dd>
            </div>
          </dl>

          <section aria-labelledby="candidate-biography-heading" className="mt-7">
            <h2 id="candidate-biography-heading" className="text-xl font-bold text-foreground">Biography</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {biography ?? "A verified candidate biography has not been published."}
            </p>
          </section>
        </div>
      </div>

      {featuredProfile ? (
        <div className="mt-8 grid gap-6 border-t border-border pt-8 lg:grid-cols-2">
          <ProfileList title="Education" items={featuredProfile.education} />
          <ProfileList title="Career and public service" items={featuredProfile.career} />
          {featuredProfile.committees?.length ? <ProfileList title="Committee assignments" items={featuredProfile.committees} /> : null}
          <ProfileList title="Key public record" items={featuredProfile.keyRecord} />
          <section className="lg:col-span-2" aria-labelledby="candidate-sources-heading">
            <h2 id="candidate-sources-heading" className="text-lg font-bold text-foreground">Primary sources</h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {featuredProfile.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary/5">
                    {source.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}
    </article>
  );
}

function ProfileList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => <li key={item} className="rounded-lg bg-muted/30 px-4 py-3">{item}</li>)}
      </ul>
    </section>
  );
}

export default CandidateBiographySection;
