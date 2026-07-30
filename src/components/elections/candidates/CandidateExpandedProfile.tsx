import { Link } from "@tanstack/react-router";
import type { CandidateDetail } from "@/types/elections";
import { safeCandidateExternalUrl } from "./candidateUrls";

type AuthorityCandidate = CandidateDetail & {
  education?: readonly { institution: string; degree?: string | null; field?: string | null; year?: number | null }[];
  committeeAssignments?: readonly { name: string; role?: string | null; session?: string | null; url?: string | null }[];
  sponsoredLegislation?: readonly { billNumber: string; title: string; status?: string | null; slug?: string | null; session?: string | null }[];
  relatedNews?: readonly { slug: string; title: string; publishedAt?: string | null; excerpt?: string | null }[];
};

export function CandidateExpandedProfile({ candidate }: { candidate: CandidateDetail }) {
  if (candidate.profileDepth !== "expanded") return null;

  const authorityCandidate = candidate as AuthorityCandidate;
  const education = authorityCandidate.education ?? [];
  const committees = authorityCandidate.committeeAssignments ?? [];
  const sponsoredLegislation = authorityCandidate.sponsoredLegislation ?? [];
  const relatedNews = authorityCandidate.relatedNews ?? [];
  const districtName = candidate.currentOffice?.districtName ?? candidate.races.find((race) => race.districtName)?.districtName ?? null;
  const sectionLinks = [
    candidate.officeHistory.length > 0 ? { id: "career", label: "Career" } : null,
    education.length > 0 ? { id: "education", label: "Education" } : null,
    committees.length > 0 ? { id: "committees", label: "Committees" } : null,
    candidate.races.length > 0 ? { id: "elections", label: "Elections" } : null,
    sponsoredLegislation.length > 0 ? { id: "legislation", label: "Legislation" } : null,
    candidate.fundraising ? { id: "finance", label: "Campaign finance" } : null,
    districtName ? { id: "district", label: "District" } : null,
    relatedNews.length > 0 ? { id: "news", label: "News" } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <section aria-labelledby="candidate-expanded-profile-heading" className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Representative authority profile</p>
        <h2 id="candidate-expanded-profile-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Public service record
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Verified career, election, finance, district, committee, legislation, and news records are shown when sourced data is available.
        </p>
      </div>

      {sectionLinks.length > 1 ? (
        <nav aria-label="Representative profile sections" className="flex flex-wrap gap-2 border-y border-slate-200 py-3">
          {sectionLinks.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-red-700">
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}

      {candidate.officeHistory.length > 0 ? (
        <AuthoritySection id="career" title="Career and public service">
          <ol className="space-y-3">
            {candidate.officeHistory.map((office) => (
              <li key={`${office.officeName}-${office.serviceStartDate ?? "unknown"}`} className="rounded-lg bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-950">{office.officeName}</p>
                    {office.districtName ? <p className="mt-1 text-sm text-slate-600">{office.districtName}</p> : null}
                  </div>
                  {office.current ? <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">Current</span> : null}
                </div>
                {(office.serviceStartDate || office.serviceEndDate) ? (
                  <p className="mt-2 text-xs text-slate-500">
                    {office.serviceStartDate ? formatDate(office.serviceStartDate) : "Start date unavailable"} — {office.current ? "Present" : office.serviceEndDate ? formatDate(office.serviceEndDate) : "End date unavailable"}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </AuthoritySection>
      ) : null}

      {education.length > 0 ? (
        <AuthoritySection id="education" title="Education">
          <ul className="grid gap-3 sm:grid-cols-2">
            {education.map((item) => (
              <li key={`${item.institution}-${item.degree ?? ""}`} className="rounded-lg bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{item.institution}</p>
                {(item.degree || item.field) ? <p className="mt-1 text-sm text-slate-600">{[item.degree, item.field].filter(Boolean).join(", ")}</p> : null}
                {item.year ? <p className="mt-1 text-xs text-slate-500">{item.year}</p> : null}
              </li>
            ))}
          </ul>
        </AuthoritySection>
      ) : null}

      {committees.length > 0 ? (
        <AuthoritySection id="committees" title="Committee assignments">
          <ul className="grid gap-3 sm:grid-cols-2">
            {committees.map((committee) => {
              const url = safeCandidateExternalUrl(committee.url);
              return (
                <li key={`${committee.name}-${committee.session ?? "current"}`} className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold text-slate-950">{committee.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{[committee.role, committee.session].filter(Boolean).join(" • ")}</p>
                  {url ? <a href={url} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-semibold text-red-700 hover:underline">Official committee page</a> : null}
                </li>
              );
            })}
          </ul>
        </AuthoritySection>
      ) : null}

      {candidate.races.length > 0 ? (
        <AuthoritySection id="elections" title="Election history">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th className="py-3 pr-4">Election</th><th className="py-3 pr-4">District</th><th className="py-3 pr-4">Date</th><th className="py-3 pr-4">Status</th><th className="py-3">Result</th></tr></thead>
              <tbody>
                {candidate.races.map((race) => (
                  <tr key={race.id} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-4 font-semibold text-slate-950"><Link to="/elections/races/$raceSlug" params={{ raceSlug: race.slug }} className="hover:text-red-700 hover:underline">{race.name}</Link></td>
                    <td className="py-3 pr-4 text-slate-600">{race.districtName ?? "Statewide"}</td>
                    <td className="py-3 pr-4 text-slate-600">{formatDate(race.electionDate)}</td>
                    <td className="py-3 pr-4 text-slate-600">{humanize(race.status)}</td>
                    <td className="py-3 font-semibold text-slate-800">{race.isWinner ? "Won" : race.status === "completed" ? "Did not win" : "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AuthoritySection>
      ) : null}

      {sponsoredLegislation.length > 0 ? (
        <AuthoritySection id="legislation" title="Sponsored legislation">
          <ul className="space-y-3">
            {sponsoredLegislation.map((bill) => (
              <li key={`${bill.billNumber}-${bill.session ?? ""}`} className="rounded-lg bg-slate-50 p-4">
                <div className="flex flex-wrap gap-2"><span className="font-bold text-red-700">{bill.billNumber}</span>{bill.status ? <span className="text-xs font-semibold text-slate-500">{bill.status}</span> : null}</div>
                <p className="mt-1 font-semibold text-slate-950">{bill.title}</p>
                {bill.slug ? <Link to="/bills/$billSlug" params={{ billSlug: bill.slug }} className="mt-2 inline-flex text-xs font-semibold text-red-700 hover:underline">View bill details</Link> : null}
              </li>
            ))}
          </ul>
        </AuthoritySection>
      ) : null}

      {candidate.fundraising ? (
        <AuthoritySection id="finance" title="Campaign finance">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Total raised" value={formatMoney(candidate.fundraising.totalRaised)} />
            <Metric label="Total spent" value={formatMoney(candidate.fundraising.totalSpent)} />
            <Metric label="Cash on hand" value={formatMoney(candidate.fundraising.cashOnHand)} />
            <Metric label="Debts owed" value={formatMoney(candidate.fundraising.debtsOwed)} />
          </dl>
          {(candidate.fundraising.reportingPeriodEnd || candidate.fundraising.updatedAt) ? <p className="mt-3 text-xs text-slate-500">Reporting period through {candidate.fundraising.reportingPeriodEnd ? formatDate(candidate.fundraising.reportingPeriodEnd) : formatDateTime(candidate.fundraising.updatedAt!)}</p> : null}
          {safeCandidateExternalUrl(candidate.campaignFinanceUrl ?? candidate.fundraising.sourceUrl) ? <a href={safeCandidateExternalUrl(candidate.campaignFinanceUrl ?? candidate.fundraising.sourceUrl)!} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-red-700 hover:underline">View official campaign-finance source</a> : null}
        </AuthoritySection>
      ) : null}

      {districtName ? (
        <AuthoritySection id="district" title="District information">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">{districtName}</p>
            {candidate.currentOffice ? <p className="mt-1 text-sm text-slate-600">{candidate.currentOffice.name}</p> : null}
            {candidate.races.find((race) => race.districtName === districtName) ? (
              <Link to="/elections/districts/$districtSlug" params={{ districtSlug: slugifyDistrict(districtName) }} className="mt-3 inline-flex text-xs font-semibold text-red-700 hover:underline">View district elections</Link>
            ) : null}
          </div>
        </AuthoritySection>
      ) : null}

      {relatedNews.length > 0 ? (
        <AuthoritySection id="news" title="Related news">
          <ul className="grid gap-4 md:grid-cols-2">
            {relatedNews.map((article) => (
              <li key={article.slug} className="rounded-lg border border-slate-200 p-4">
                <Link to="/news/$slug" params={{ slug: article.slug }} className="font-semibold text-slate-950 hover:text-red-700 hover:underline">{article.title}</Link>
                {article.excerpt ? <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p> : null}
                {article.publishedAt ? <p className="mt-2 text-xs text-slate-500">{formatDateTime(article.publishedAt)}</p> : null}
              </li>
            ))}
          </ul>
        </AuthoritySection>
      ) : null}

      {candidate.endorsements.length > 0 ? (
        <AuthoritySection id="endorsements" title="Published endorsements">
          <ul className="grid gap-3 sm:grid-cols-2">
            {candidate.endorsements.map((endorsement) => {
              const sourceUrl = safeCandidateExternalUrl(endorsement.sourceUrl);
              return <li key={`${endorsement.organizationName}-${endorsement.endorsementDate ?? ""}`} className="rounded-lg bg-slate-50 p-4"><p className="font-semibold text-slate-950">{endorsement.organizationName}</p>{endorsement.endorsementDate ? <p className="mt-1 text-xs text-slate-500">{formatDate(endorsement.endorsementDate)}</p> : null}{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-semibold text-red-700 hover:underline">Endorsement source</a> : null}</li>;
            })}
          </ul>
        </AuthoritySection>
      ) : null}
    </section>
  );
}

function AuthoritySection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <div id={id} className="scroll-mt-28 border-t border-slate-200 pt-6"><h3 className="text-lg font-bold text-slate-950">{title}</h3><div className="mt-4">{children}</div></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-lg font-bold text-slate-950">{value}</dd></div>;
}

function formatMoney(value: number | null) {
  if (value == null) return "Not reported";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
}

function humanize(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function slugifyDistrict(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export default CandidateExpandedProfile;
