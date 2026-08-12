import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';

export function LegislatureHubTrustPanel() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12">
      <CitationTrustPanel
        sources={[
          { name: 'Texas Legislature Online', url: 'https://capitol.texas.gov/', note: 'Official source for bill text, actions, votes, committees, members and session records.' },
          { name: 'Texas Constitution — Legislative Department', url: 'https://statutes.capitol.texas.gov/Docs/CN/htm/CN.3.htm', note: 'Constitutional structure, sessions and legislative powers.' },
        ]}
        methodology="This hub is an orientation layer over the House, Senate, current-session, bill, committee and law records. Structural facts are stated from the Texas Constitution and official Legislature sources; time-sensitive bill, vote and member facts remain attached to their individual records rather than being inferred at the hub level."
        lastVerified="Legislative structure and source hierarchy reviewed August 11, 2026. Individual bill, committee, vote and member records carry their own newer verification or action dates when applicable."
        title="Texas Legislature hub sources"
      />
    </div>
  );
}

export default LegislatureHubTrustPanel;
