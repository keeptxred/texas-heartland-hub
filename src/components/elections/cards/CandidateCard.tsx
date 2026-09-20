import { Link } from "@tanstack/react-router";
import type { CandidateParty, CandidateStatus, ElectionResourceLink } from "@/types/elections";
import { CANDIDATE_STATUS_LABELS } from "@/types/elections/candidateClassifications";

export interface CandidateCardProps {
  name: string;
  party: CandidateParty;
  partyLabel?: string;
  office?: string;
  district?: string;
  incumbent?: boolean;
  status?: CandidateStatus;
  photoUrl?: string | null;
  biography?: string | null;
  occupation?: string | null;
  hometown?: string | null;
  profileHref?: string;
  raceHref?: string;
  relatedLinks?: readonly ElectionResourceLink[];
  className?: string;
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
    <article
      className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className}`.trim()}
    >
      <div className="flex gap-4 p-5">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-xl font-bold text-muted-foreground">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`Portrait of ${name}`}
              className="size-full object-cover"
              loading="lazy"
            />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${PARTY_STYLES[party]}`}
            >
              {partyLabel ?? formatParty(party)}
            </span>
            {incumbent && (
              <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                Incumbent
              </span>
            )}
            {status !== "active" && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                {CANDIDATE_STATUS_LABELS[status]}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">
            {profileHref ? (
              <Link to={profileHref} className="hover:text-primary hover:underline">
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          {(office || district) && (
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {[office, district].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border px-5 py-4">
        {(occupation || hometown) && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {occupation && (
              <div>
                <dt className="font-semibold text-foreground">Occupation</dt>
                <dd className="mt-1 text-muted-foreground">{occupation}</dd>
              </div>
            )}
            {hometown && (
              <div>
                <dt className="font-semibold text-foreground">Hometown</dt>
                <dd className="mt-1 text-muted-foreground">{hometown}</dd>
              </div>
            )}
          </dl>
        )}

        {biography && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{biography}</p>
        )}

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          {profileHref ? (
            <Link to={profileHref} className="text-primary underline-offset-4 hover:underline">
              View candidate profile →
            </Link>
          ) : null}
          {raceHref && (
            <Link
              to={raceHref}
              className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              View race overview →
            </Link>
          )}
        </div>

        {relatedLinks.length > 0 && (
          <nav
            aria-label={`Related resources for ${name}`}
            className="mt-4 border-t border-border pt-4"
          >
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {relatedLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <a
                    href={link.href}
                    className="font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
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
