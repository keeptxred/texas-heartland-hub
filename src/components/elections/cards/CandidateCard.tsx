import type { CandidateParty } from "@/types/elections";

export interface CandidateCardLink {
  label: string;
  href: string;
}

export interface CandidateCardProps {
  name: string;
  party: CandidateParty;
  partyLabel?: string;
  office?: string;
  district?: string;
  incumbent?: boolean;
  status?: "active" | "withdrawn" | "disqualified" | "write_in";
  photoUrl?: string | null;
  biography?: string | null;
  occupation?: string | null;
  hometown?: string | null;
  profileHref: string;
  raceHref?: string;
  relatedLinks?: readonly CandidateCardLink[];
  className?: string;
}

const PARTY_STYLES: Record<CandidateParty, string> = {
  republican: "border-red-200 bg-red-50 text-red-800",
  democratic: "border-blue-200 bg-blue-50 text-blue-800",
  libertarian: "border-amber-200 bg-amber-50 text-amber-800",
  green: "border-green-200 bg-green-50 text-green-800",
  independent: "border-violet-200 bg-violet-50 text-violet-800",
  nonpartisan: "border-slate-200 bg-slate-50 text-slate-700",
  other: "border-slate-200 bg-slate-50 text-slate-700",
};

const STATUS_LABELS: Record<NonNullable<CandidateCardProps["status"]>, string> = {
  active: "Active candidate",
  withdrawn: "Withdrawn",
  disqualified: "Disqualified",
  write_in: "Write-in candidate",
};

export function CandidateCard({
  name,
  party,
  partyLabel,
  office,
  district,
  incumbent = false,
  status = "active",
  photoUrl,
  biography,
  occupation,
  hometown,
  profileHref,
  raceHref,
  relatedLinks = [],
  className = "",
}: CandidateCardProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <article className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`.trim()}>
      <div className="flex gap-4 p-5">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xl font-bold text-slate-500">
          {photoUrl ? <img src={photoUrl} alt={`Portrait of ${name}`} className="size-full object-cover" loading="lazy" /> : initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${PARTY_STYLES[party]}`}>
              {partyLabel ?? formatParty(party)}
            </span>
            {incumbent && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                Incumbent
              </span>
            )}
            {status !== "active" && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                {STATUS_LABELS[status]}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
            <a href={profileHref} className="hover:text-red-700 hover:underline">
              {name}
            </a>
          </h3>
          {(office || district) && (
            <p className="mt-1 text-sm font-medium text-slate-600">
              {[office, district].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        {(occupation || hometown) && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {occupation && (
              <div>
                <dt className="font-semibold text-slate-950">Occupation</dt>
                <dd className="mt-1 text-slate-600">{occupation}</dd>
              </div>
            )}
            {hometown && (
              <div>
                <dt className="font-semibold text-slate-950">Hometown</dt>
                <dd className="mt-1 text-slate-600">{hometown}</dd>
              </div>
            )}
          </dl>
        )}

        {biography && <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{biography}</p>}

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          <a href={profileHref} className="text-red-700 underline-offset-4 hover:underline">
            View candidate profile →
          </a>
          {raceHref && (
            <a href={raceHref} className="text-slate-700 underline-offset-4 hover:text-red-700 hover:underline">
              View race overview →
            </a>
          )}
        </div>

        {relatedLinks.length > 0 && (
          <nav aria-label={`Related resources for ${name}`} className="mt-4 border-t border-slate-100 pt-4">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {relatedLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <a href={link.href} className="font-medium text-slate-600 underline-offset-4 hover:text-red-700 hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}

function formatParty(party: CandidateParty) {
  return party
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default CandidateCard;
