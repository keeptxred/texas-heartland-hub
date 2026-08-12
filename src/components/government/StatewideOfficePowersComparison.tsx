import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';
import { GOVERNMENT_ENTITIES, GOVERNMENT_REVIEWED_AT, governmentPath } from '@/lib/texas-government';

const offices = GOVERNMENT_ENTITIES.filter((entity) => entity.entityType === 'office');

export function StatewideOfficePowersComparison() {
  return (
    <section className="mt-12" aria-labelledby="statewide-powers-comparison">
      <div className="border-b pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Statewide office comparison</p>
        <h2 id="statewide-powers-comparison" className="mt-2 text-3xl font-bold">Compare Texas statewide offices, powers and limits</h2>
        <p className="mt-3 max-w-4xl leading-7 text-muted-foreground">Texas divides executive and related statewide authority among multiple offices. This comparison uses the reviewed government authority registry and links to the complete constitutional or statutory explanation for each office.</p>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead><tr className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><th className="px-4 py-3">Office</th><th className="px-4 py-3">Current officeholder</th><th className="px-4 py-3">Selected powers</th><th className="px-4 py-3">Important limit</th><th className="px-4 py-3">Authority guide</th></tr></thead>
          <tbody className="divide-y">{offices.map((office) => <tr key={office.slug}><td className="px-4 py-4 align-top"><strong>{office.shortName}</strong><span className="mt-1 block text-xs text-muted-foreground">{office.branch}</span></td><td className="px-4 py-4 align-top">{office.currentOfficeholder}</td><td className="px-4 py-4 align-top"><ul className="space-y-2 text-muted-foreground">{office.powers.slice(0, 2).map((power) => <li key={power}>• {power}</li>)}</ul></td><td className="px-4 py-4 align-top text-muted-foreground">{office.limitations[0] ?? 'See full authority guide.'}</td><td className="px-4 py-4 align-top"><a href={governmentPath(office.slug)} className="font-semibold text-primary hover:underline">Full powers & limits →</a></td></tr>)}</tbody>
        </table>
      </div>
      <CitationTrustPanel
        className="mt-8"
        sources={offices.map((office) => ({ name: `${office.shortName} official website`, url: office.officialUrl, note: office.constitutionalBasis.join(' · ') }))}
        methodology="The comparison displays the first two reviewed power statements and first reviewed limitation from each statewide-office authority record. It is a navigation and comparison layer, not a substitute for the full constitutional and statutory basis linked from each office guide."
        lastVerified={GOVERNMENT_REVIEWED_AT}
        title="Statewide-office comparison sources"
      />
    </section>
  );
}

export default StatewideOfficePowersComparison;
