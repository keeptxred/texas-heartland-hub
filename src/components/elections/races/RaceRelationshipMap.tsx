import type { CandidateSummary, RaceDetail } from '@/types/elections';

function districtSlug(race: RaceDetail) {
  if (!race.districtNumber) return null;
  if (race.jurisdictionType === 'congressional_district') return `congressional-district-${race.districtNumber}`;
  if (race.jurisdictionType === 'state_house_district') return `texas-house-district-${race.districtNumber}`;
  if (race.jurisdictionType === 'state_senate_district') return `texas-senate-district-${race.districtNumber}`;
  return null;
}

export function RaceRelationshipMap({ race, candidates }: { race: RaceDetail; candidates: readonly CandidateSummary[] }) {
  const district = districtSlug(race);
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6" aria-labelledby="race-relationship-heading">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Entity relationships</p>
      <h2 id="race-relationship-heading" className="mt-2 text-2xl font-bold text-slate-950">Election → candidate → district</h2>
      <p className="mt-2 max-w-3xl leading-7 text-slate-600">This map shows only relationships attached to the verified race record. Candidate profiles and district pages stay separate canonical entities so the same candidate or district can connect to other election records without duplicating content.</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
        <RelationshipNode eyebrow="Election race" title={race.name} detail={race.districtName ?? 'Verified Texas election race'} href={`/elections/races/${race.slug}`} />
        <Arrow />
        <div className="space-y-3">
          {candidates.length ? candidates.map((candidate) => <RelationshipNode key={candidate.id} eyebrow="Candidate" title={candidate.ballotName} detail="Verified candidate profile" href={`/elections/candidates/${candidate.slug}`} />) : <RelationshipNode eyebrow="Candidate" title="No published verified candidate attached" detail="Relationship remains pending" />}
        </div>
        <Arrow />
        {district ? <RelationshipNode eyebrow="District" title={race.districtName ?? `District ${race.districtNumber}`} detail="Canonical district authority page" href={`/elections/districts/${district}`} /> : <RelationshipNode eyebrow="Jurisdiction" title={race.districtName ?? 'Statewide Texas race'} detail="No legislative district relationship required" />}
      </div>
      <p className="mt-5 text-xs leading-5 text-slate-500">District relationships are based on the race jurisdiction record, not an address lookup. Voters should use the official Texas voter or representation lookup for their specific address.</p>
    </section>
  );
}

function RelationshipNode({ eyebrow, title, detail, href }: { eyebrow: string; title: string; detail: string; href?: string }) {
  const content = <><span className="text-xs font-bold uppercase tracking-wide text-red-700">{eyebrow}</span><strong className="mt-1 block text-lg text-slate-950">{title}</strong><span className="mt-1 block text-sm text-slate-600">{detail}</span></>;
  return href ? <a href={href} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-red-300 hover:shadow-sm">{content}</a> : <div className="rounded-xl border border-slate-200 bg-white p-4">{content}</div>;
}

function Arrow() {
  return <span className="hidden text-center text-2xl font-bold text-slate-400 lg:block" aria-hidden="true">→</span>;
}

export default RaceRelationshipMap;