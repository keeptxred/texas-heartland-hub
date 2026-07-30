import type { CandidateDetail } from "@/types/elections";

export interface CandidateCampaignLinksProps {
  candidate: CandidateDetail;
}

function safeExternalUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function CandidateCampaignLinks({ candidate }: CandidateCampaignLinksProps) {
  const links = [
    { label: "Campaign website", href: safeExternalUrl(candidate.campaignUrl) },
    { label: "Candidate website", href: safeExternalUrl(candidate.websiteUrl) },
    { label: "Facebook", href: safeExternalUrl(candidate.socialLinks.facebookUrl) },
    { label: "X", href: safeExternalUrl(candidate.socialLinks.xUrl) },
    { label: "Instagram", href: safeExternalUrl(candidate.socialLinks.instagramUrl) },
    { label: "YouTube", href: safeExternalUrl(candidate.socialLinks.youtubeUrl) },
    { label: "LinkedIn", href: safeExternalUrl(candidate.socialLinks.linkedinUrl) },
    {
      label: "Campaign finance",
      href: safeExternalUrl(candidate.campaignFinanceUrl ?? candidate.fundraising?.sourceUrl),
    },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));
  const filingSourceUrl = safeExternalUrl(candidate.source.sourceUrl);

  return (
    <section
      aria-labelledby="candidate-campaign-links-heading"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
        Campaign resources
      </p>
      <h2
        id="candidate-campaign-links-heading"
        className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
      >
        Official links and filing source
      </h2>

      {links.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-3">
          {links.map((link) => (
            <li key={`${link.label}-${link.href}`}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-red-200 hover:bg-white hover:text-red-700"
              >
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          No verified campaign website or social accounts have been published.
        </p>
      )}

      <div className="mt-6 border-t border-slate-200 pt-5">
        <h3 className="text-sm font-semibold text-slate-950">Filing source</h3>
        {filingSourceUrl ? (
          <a
            href={filingSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-red-700 underline-offset-4 hover:underline"
          >
            {candidate.source.sourceName} ↗
          </a>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            No safe public filing-source URL is available.
          </p>
        )}
      </div>
    </section>
  );
}

export default CandidateCampaignLinks;
