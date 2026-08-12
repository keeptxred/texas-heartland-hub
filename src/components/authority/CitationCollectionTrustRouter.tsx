import { useLocation } from '@tanstack/react-router';
import { CitationTrustPanel, type CitationSource } from '@/components/authority/CitationTrustPanel';

type TrustConfig = {
  title: string;
  sources: CitationSource[];
  methodology: string;
  lastVerified: string;
};

const TLO = 'https://capitol.texas.gov/';

const TRUST_BY_PATH: Record<string, TrustConfig> = {
  '/bills': {
    title: 'Texas bill directory sources',
    sources: [
      { name: 'Texas Legislature Online', url: TLO, note: 'Official bill text, actions, sponsors, committees, votes and documents.' },
    ],
    methodology: 'The bill directory normalizes legislative records for search and navigation. Individual bill pages preserve their own current status, official action history, source links and synchronization context. A filter or search view does not create a separate factual record.',
    lastVerified: 'Directory source hierarchy reviewed August 11, 2026. Each bill’s official action and synchronization dates control its time-sensitive status.',
  },
  '/laws': {
    title: 'Texas law reference sources',
    sources: [
      { name: 'Texas Legislature Online', url: TLO, note: 'Official Texas codes, legislation and legislative records.' },
      { name: 'Texas Constitution and Statutes', url: 'https://statutes.capitol.texas.gov/', note: 'Official published Texas constitutional and statutory text.' },
    ],
    methodology: 'The laws hub organizes plain-English explainers and legislative references. Statutory text and legal effect come from official sources; editorial explanation is kept separate from the controlling law, and individual law/reference pages carry more specific source context.',
    lastVerified: 'Hub source hierarchy reviewed August 11, 2026. Individual statutes, effective-date records and explainers carry their own more specific verification context when available.',
  },
  '/representatives': {
    title: 'Elected-official directory sources',
    sources: [
      { name: 'Texas Legislature — Who Represents Me?', url: 'https://wrm.capitol.texas.gov/home', note: 'Official address-level Texas legislative representation lookup.' },
      { name: 'Texas House of Representatives', url: 'https://house.texas.gov/members/', note: 'Official Texas House member reference.' },
      { name: 'Texas Senate', url: 'https://senate.texas.gov/members.php', note: 'Official Texas Senate member reference.' },
    ],
    methodology: 'The directory connects statewide, federal and Texas legislative offices to canonical office and district records. Vacancies and missing records are preserved as such rather than replaced with assumed officeholders; address-specific representation should always be rechecked with the official lookup.',
    lastVerified: 'Directory source hierarchy reviewed August 11, 2026. Current officeholder and vacancy records remain subject to the verification dates and official links on the directory entries.',
  },
  '/texas-legislature/committees': {
    title: 'Legislative committee directory sources',
    sources: [
      { name: 'Texas Legislature Online', url: TLO, note: 'Official Texas legislative committees, members, meetings and bill history.' },
    ],
    methodology: 'Committee records are normalized into canonical committee pages and linked to referred bills and legislative activity. Committee names or relationships are not inferred when the source record is missing; official Legislature records control if synchronized data lags.',
    lastVerified: 'Committee directory source hierarchy reviewed August 11, 2026. Individual committee and bill records carry their own newer action or source dates when available.',
  },
  '/citation-guide': {
    title: 'Citation policy provenance',
    sources: [
      { name: 'Keep TX Red Editorial Standards', url: 'https://keeptxred.com/editorial-standards', note: 'Public sourcing, corrections and editorial accountability standards.' },
      { name: 'Machine-readable citation index', url: 'https://keeptxred.com/citation-magnets.json', note: 'Maintained canonical reference inventory and trust attributes.' },
    ],
    methodology: 'The citation guide is a policy layer, not an independent factual dataset. It describes how canonical Keep TX Red reference pages relate to their underlying official sources and when the original government record should be cited as controlling authority.',
    lastVerified: 'Citation policy and manifest relationship reviewed August 11, 2026.',
  },
};

export function CitationCollectionTrustRouter() {
  const pathname = useLocation({ select: (location) => location.pathname.replace(/\/+$/, '') || '/' });
  const config = TRUST_BY_PATH[pathname];
  if (!config) return null;

  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <CitationTrustPanel
        sources={config.sources}
        methodology={config.methodology}
        lastVerified={config.lastVerified}
        title={config.title}
      />
    </div>
  );
}

export default CitationCollectionTrustRouter;
