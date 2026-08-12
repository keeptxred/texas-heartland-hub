import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';

const VOTER_ID_URL = 'https://www.votetexas.gov/voting/need-id.html?lv=true';

const ACCEPTABLE_PHOTO_IDS = [
  'Texas Driver License issued by DPS',
  'Texas Election Identification Certificate issued by DPS',
  'Texas Personal Identification Card issued by DPS',
  'Texas Handgun License issued by DPS',
  'U.S. Military Identification Card containing the voter’s photograph',
  'U.S. Citizenship Certificate containing the voter’s photograph',
  'U.S. Passport book or card',
] as const;

const SUPPORTING_IDS = [
  'Government document showing the voter’s name and an address, including a voter registration certificate',
  'Current utility bill',
  'Bank statement',
  'Government check',
  'Paycheck',
  'Certified domestic birth certificate or another qualifying document confirming birth',
] as const;

export function TexasVoterIdReference() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="texas-voter-id-heading">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">In-person voting ID</p>
      <h2 id="texas-voter-id-heading" className="mt-2 text-2xl font-bold text-slate-950">Texas voter identification reference</h2>
      <p className="mt-3 max-w-4xl leading-7 text-slate-600">Texas voters who possess one of the seven acceptable forms of photo identification are asked to present it when voting in person. A voter who does not possess an acceptable photo ID and cannot reasonably obtain one may use a qualifying supporting document and complete a Reasonable Impediment Declaration.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-bold text-slate-950">Seven acceptable photo IDs</h3>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {ACCEPTABLE_PHOTO_IDS.map((id, index) => <li key={id} className="flex gap-3"><span className="font-bold text-red-700">{index + 1}.</span><span>{id}</span></li>)}
          </ol>
        </div>
        <div>
          <h3 className="font-bold text-slate-950">Supporting ID route when a photo ID cannot reasonably be obtained</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {SUPPORTING_IDS.map((id) => <li key={id} className="flex gap-2"><span aria-hidden="true">•</span><span>{id}</span></li>)}
          </ul>
          <p className="mt-4 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-950">The supporting-document route requires a Reasonable Impediment Declaration. Other exceptions and provisional-ballot procedures can apply, so use the official VoteTexas guidance for your circumstances.</p>
        </div>
      </div>

      <CitationTrustPanel
        className="mt-8"
        sources={[{ name: 'VoteTexas — Identification Requirements for Voting', url: VOTER_ID_URL, note: 'Official Texas Secretary of State voter-ID guidance.' }]}
        methodology="KeepTXRed reproduces the current high-level ID categories from VoteTexas for orientation and deliberately sends exception, expiration, disability-exemption and provisional-ballot questions back to the official guidance rather than shortening those rules into voter-specific legal advice."
        lastVerified="August 11, 2026"
        title="Voter-ID source and verification"
      />
    </section>
  );
}

export default TexasVoterIdReference;
