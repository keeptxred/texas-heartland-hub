import { createFileRoute, Link } from '@tanstack/react-router';
import { CitationTrustPanel } from '@/components/authority/CitationTrustPanel';

const SITE_URL = 'https://keeptxred.com';
const CANONICAL = `${SITE_URL}/laws/constitutional-amendments`;
const CURRENT_ELECTION_URL = 'https://www.sos.state.tx.us/elections/laws/2026-november-general-election.shtml';
const HISTORY_URL = 'https://www.sos.state.tx.us/elections/historical/constitutional-amendment-elections.shtml';
const LAST_BALLOT_URL = 'https://www.sos.state.tx.us/elections/forms/november-2025-ballot-language-17.pdf';
const ARTICLE_XVII_URL = 'https://statutes.capitol.texas.gov/SOTWDocs/CN/pdf/CN.17.pdf';
const LEGISLATIVE_PROCESS_URL = 'https://www.tlc.texas.gov/docs/legref/legislativeprocess.pdf';

const FAQS = [
  {
    q: 'Are there Texas constitutional amendments on the November 3, 2026 statewide ballot?',
    a: 'As of September 6, 2026, the Texas Secretary of State current-election materials do not list a statewide constitutional-amendment slate for the November 3 general election. Local political subdivisions may still have local propositions, so voters should also review their county or local sample ballot.',
  },
  {
    q: 'How does a proposed Texas constitutional amendment get on the ballot?',
    a: 'The Legislature proposes an amendment by joint resolution. Article XVII requires approval by two-thirds of all members elected to each chamber. The proposal is then submitted to Texas voters, and a majority of the votes cast on the amendment is required for adoption.',
  },
  {
    q: 'Does the Texas governor sign or veto a constitutional amendment proposal?',
    a: 'No. Joint resolutions proposing amendments to the Texas Constitution are not submitted to the governor for signature. After legislative adoption, they are filed with the secretary of state and the proposal proceeds to the voter-approval process required by Article XVII.',
  },
  {
    q: 'Is a constitutional amendment the same thing as a new Texas law?',
    a: 'No. A bill can create or amend statutory law after completing the legislative process. A constitutional amendment changes the Texas Constitution itself and requires voter approval after the Legislature adopts the proposing joint resolution.',
  },
];

export const Route = createFileRoute('/laws/constitutional-amendments')({
  head: () => ({
    meta: [
      { title: 'Texas Constitutional Amendments: 2026 Ballot Status & Process | Keep TX Red' },
      { name: 'description', content: 'Check the 2026 Texas constitutional-amendment ballot status and learn how amendments reach voters, the two-thirds legislative vote rule, and official verification sources.' },
      { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
      { property: 'og:title', content: 'Texas Constitutional Amendments: 2026 Ballot Status & Process' },
      { property: 'og:description', content: 'Current statewide amendment-ballot status, the Article XVII process, recent amendment elections and official Texas sources.' },
      { property: 'og:url', content: CANONICAL },
      { property: 'og:type', content: 'website' },
    ],
    links: [{ rel: 'canonical', href: CANONICAL }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${CANONICAL}#webpage`,
          name: 'Texas Constitutional Amendments: 2026 Ballot Status & Process',
          description: 'A source-backed reference for the current Texas constitutional-amendment ballot status and the Article XVII amendment process.',
          url: CANONICAL,
          dateModified: '2026-09-06',
          isBasedOn: [CURRENT_ELECTION_URL, ARTICLE_XVII_URL, LEGISLATIVE_PROCESS_URL, HISTORY_URL, LAST_BALLOT_URL],
          about: { '@type': 'Thing', name: 'Texas constitutional amendment elections' },
          publisher: { '@id': `${SITE_URL}/#organization` },
          mainEntity: FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }).replace(/</g, '\\u003c'),
      },
    ],
  }),
  component: ConstitutionalAmendmentsTracker,
});

function ConstitutionalAmendmentsTracker() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/laws">Texas Laws</Link> / Constitutional Amendments
      </nav>

      <header className="mt-6 border-b pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Texas constitutional amendment authority</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Texas Constitutional Amendments Tracker</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          A maintained, source-backed reference for the 2026 statewide ballot status, how the Legislature proposes constitutional amendments, what voters must approve, and where to verify official ballot language.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border bg-card p-6" aria-labelledby="current-amendment-status">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Current status · verified September 6, 2026</p>
        <h2 id="current-amendment-status" className="mt-2 text-3xl font-bold">No statewide constitutional-amendment slate is currently listed for the November 3, 2026 general election</h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          The Texas Secretary of State’s current 2026 November General Election materials include the statewide ballot certification, candidate order and sample-ballot resources. As of this verification date, those statewide materials do not publish a constitutional-amendment proposition slate. That is different from saying there are no propositions anywhere in Texas: counties, cities, school districts and other political subdivisions may place local measures before their voters.
        </p>
        <p className="mt-3 leading-7 text-muted-foreground">
          For a statewide amendment, use the Secretary of State as the controlling election source. For local propositions, check the sample ballot and election notices issued by the county or political subdivision serving your address.
        </p>
        <a href={CURRENT_ELECTION_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-semibold text-primary hover:underline">Check the official 2026 statewide election page →</a>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3" aria-label="Texas amendment quick facts">
        <div className="rounded-2xl border p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Legislative threshold</p>
          <p className="mt-2 text-3xl font-bold">Two-thirds</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Article XVII requires two-thirds of all members elected to each chamber to approve the proposing joint resolution.</p>
        </div>
        <div className="rounded-2xl border p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Final decision</p>
          <p className="mt-2 text-3xl font-bold">Texas voters</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">A majority of votes cast on the proposed amendment is required for adoption.</p>
        </div>
        <div className="rounded-2xl border p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Governor approval</p>
          <p className="mt-2 text-3xl font-bold">Not required</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">A constitutional-amendment joint resolution is not sent to the governor for signature or veto.</p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="how-amendments-work">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Article XVII</p>
        <h2 id="how-amendments-work" className="mt-2 text-3xl font-bold">How a Texas constitutional amendment reaches voters</h2>
        <div className="mt-5 space-y-5 text-base leading-7 text-muted-foreground">
          <p>
            Texas does not amend its constitution through an ordinary bill. The Legislature uses a <strong className="text-foreground">joint resolution</strong> to propose a constitutional change. Under Article XVII, Section 1, a proposal can originate during a regular legislative session or during a special session when the subject is within the governor’s call for that special session.
          </p>
          <p>
            The proposed amendment must receive a vote of <strong className="text-foreground">two-thirds of all members elected to each chamber</strong>. That is a higher threshold than the simple majority used for many ordinary legislative actions. The vote is recorded in the House and Senate journals.
          </p>
          <p>
            After the Legislature adopts the joint resolution, it is not sent to the governor for approval. Texas Legislative Council materials explain that constitutional-amendment joint resolutions are filed directly with the Secretary of State. The proposal then moves into the statewide election process required by the Constitution.
          </p>
          <p>
            Article XVII also requires public notice before the election. The Secretary of State prepares a brief explanatory statement, the election date and the ballot wording, with the explanatory statement subject to approval by the attorney general. The Constitution specifies publication and county-posting requirements before voters decide the question.
          </p>
          <p>
            At the election, voters cast ballots for or against the proposition. If a majority of the votes cast on that amendment favor it, the amendment becomes part of the Texas Constitution. The joint resolution itself specifies the election date and may contain provisions governing when the amendment takes effect.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
          <a href={ARTICLE_XVII_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Read Article XVII of the Texas Constitution →</a>
          <a href={LEGISLATIVE_PROCESS_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Texas Legislative Council legislative-process guide →</a>
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-muted/40 p-6" aria-labelledby="amendment-vs-law">
        <h2 id="amendment-vs-law" className="text-2xl font-bold">Constitutional amendment vs. ordinary Texas law</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          The distinction matters. A bill that passes the Legislature can become statutory law through the normal enactment process, which generally includes presentation to the governor. A constitutional amendment changes the state’s governing document itself. It therefore requires the special Article XVII process and a statewide vote.
        </p>
        <p className="mt-3 leading-7 text-muted-foreground">
          If you are following a regular bill rather than a proposed constitutional amendment, start with <Link to="/bills" className="font-semibold text-primary hover:underline">Texas Bill Tracker</Link> and <Link to="/texas-legislature" className="font-semibold text-primary hover:underline">Texas Legislature</Link>. For the step-by-step statutory process, read <Link to="/news/$slug" params={{ slug: 'how-a-bill-becomes-texas-law' }} className="font-semibold text-primary hover:underline">How a Bill Becomes Texas Law</Link>.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="recent-amendment-election">
        <h2 id="recent-amendment-election" className="text-3xl font-bold">The most recent statewide amendment election</h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          The most recent statewide constitutional-amendment election was held November 4, 2025. The ballot contained 17 proposed amendments referred by the 89th Texas Legislature. The Secretary of State published the official ballot language, and the state maintains a historical constitutional-amendment election archive for earlier propositions.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Official 2025 ballot language</p>
            <p className="mt-3 leading-7 text-muted-foreground">Review the exact statewide proposition wording used for all 17 proposed amendments on the November 4, 2025 ballot.</p>
            <a href={LAST_BALLOT_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-primary hover:underline">Open the official 2025 ballot language →</a>
          </div>
          <div className="rounded-2xl border p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Historical amendment archive</p>
            <p className="mt-3 leading-7 text-muted-foreground">Use the Secretary of State archive to research prior statewide constitutional-amendment election dates and official election materials.</p>
            <a href={HISTORY_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-primary hover:underline">Open the amendment-election archive →</a>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="where-amendments-fit">
        <h2 id="where-amendments-fit" className="text-3xl font-bold">Where constitutional amendments fit in Keep TX Red’s Texas government coverage</h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          Constitutional amendments sit at the intersection of the Legislature, election administration and Texas law. Use these related authority pages to follow a proposal from the Capitol to the ballot and then understand the resulting law.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link to="/elections/2026" className="rounded-xl border p-5 font-semibold hover:border-primary hover:text-primary">2026 Election Central →</Link>
          <Link to="/texas-legislature" className="rounded-xl border p-5 font-semibold hover:border-primary hover:text-primary">Texas Legislature →</Link>
          <Link to="/bills" className="rounded-xl border p-5 font-semibold hover:border-primary hover:text-primary">Texas Bill Tracker →</Link>
          <Link to="/laws" className="rounded-xl border p-5 font-semibold hover:border-primary hover:text-primary">Texas Laws Hub →</Link>
          <Link to="/news/$slug" params={{ slug: 'texas-constitutional-amendments-guide' }} className="rounded-xl border p-5 font-semibold hover:border-primary hover:text-primary">Texas Constitutional Amendments Explained →</Link>
          <Link to="/news/$slug" params={{ slug: 'texas-election-laws-explained' }} className="rounded-xl border p-5 font-semibold hover:border-primary hover:text-primary">Texas Election Laws Explained →</Link>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="amendment-faq">
        <h2 id="amendment-faq" className="text-3xl font-bold">Texas constitutional amendment FAQ</h2>
        <div className="mt-5 space-y-4">
          {FAQS.map((faq) => (
            <article key={faq.q} className="rounded-2xl border p-6">
              <h3 className="text-xl font-bold">{faq.q}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <CitationTrustPanel
        className="mt-10"
        sources={[
          { name: 'Texas Secretary of State — 2026 November General Election', url: CURRENT_ELECTION_URL },
          { name: 'Texas Constitution — Article XVII', url: ARTICLE_XVII_URL },
          { name: 'Texas Legislative Council — The Legislative Process in Texas', url: LEGISLATIVE_PROCESS_URL },
          { name: 'Texas Secretary of State — Constitutional Amendment Data', url: HISTORY_URL },
          { name: 'Texas Secretary of State — 2025 Constitutional Amendment Ballot Language', url: LAST_BALLOT_URL },
        ]}
        methodology="Keep TX Red treats the Texas Secretary of State’s current statewide election materials as the controlling public source for a currently published statewide amendment slate. Article XVII of the Texas Constitution controls the amendment process, and Texas Legislative Council materials are used to explain joint-resolution procedure. Local propositions are intentionally separated from statewide constitutional amendments."
        lastVerified="September 6, 2026"
        title="Constitutional amendment sources and methodology"
      />
    </main>
  );
}
