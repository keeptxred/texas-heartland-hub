import { Link } from "@tanstack/react-router";
import { AgedFeedSection } from "@/components/aged-feed-section";
import {
  ElectionCountdown,
  ElectionLayout,
  ElectionNavigation,
  RelatedResources,
} from "@/components/elections";
import { useElectionRepositoryMode } from "@/data/elections";
import {
  useActiveElectionCycle,
  useActiveElectionResults,
  useElectionCandidates,
  useElectionPolls,
  useElectionRaces,
  useFeaturedElectionRaces,
  useFeaturedForecasts,
  useLatestElectionPolls,
} from "@/hooks/elections";
import { getArticlesByCategory } from "@/lib/articles-by-category";
import { assignUniqueImages } from "@/lib/dedupe-images";
import {
  daysUntil,
  electionTypeLabel,
  formatElectionDate,
  getNextElection,
} from "@/lib/election-calendar";
import { ELECTION_ROUTES } from "@/lib/elections";

const QUICK_LINKS = [
  { title: "Track the races", description: "See statewide, congressional, legislative, and local contests in one place.", href: ELECTION_ROUTES.races },
  { title: "Meet the candidates", description: "Compare candidate backgrounds, priorities, endorsements, and campaign details.", href: ELECTION_ROUTES.candidates },
  { title: "Follow the polls", description: "Review recent polling, sample details, field dates, and movement over time.", href: ELECTION_ROUTES.polls },
  { title: "Prepare to vote", description: "Find registration, early-voting, ballot, identification, and election-day guidance.", href: ELECTION_ROUTES.voting },
] as const;

const VERIFIED_RESOURCES = [
  { title: "How to register to vote in Texas", href: "/register-to-vote", description: "Review eligibility, registration steps, deadlines, and official Texas voter resources.", eyebrow: "Voting guide" },
  { title: "Texas election laws explained", href: "/laws", description: "Understand the Texas laws and rules that govern voting and elections.", eyebrow: "Texas laws" },
  { title: "Contact your Texas legislators", href: "/contact-legislators", description: "Find the officials who represent you and learn how to contact their offices.", eyebrow: "Civic action" },
  { title: "Texas politics coverage", href: "/texas-politics", description: "Read the latest reporting and analysis on Texas government and political races.", eyebrow: "Latest coverage" },
] as const;

function DataState({ loading, error, empty, children }: { loading: boolean; error: boolean; empty: boolean; children: React.ReactNode }) {
  if (loading) return <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">Loading election data…</div>;
  if (error) return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">Election data could not be loaded.</div>;
  if (empty) return <div className="rounded-xl border border-dashed bg-white p-6 text-sm text-slate-600">No verified records are available yet.</div>;
  return <>{children}</>;
}

export function ElectionHomePage() {
  const mode = useElectionRepositoryMode();
  const activeCycle = useActiveElectionCycle();
  const cycleId = activeCycle.cycle?.id;
  const featuredRaces = useFeaturedElectionRaces(cycleId, 6);
  const featuredRaceIds = featuredRaces.races.map((race) => race.id);
  const latestPolls = useLatestElectionPolls({ electionCycleId: cycleId, featuredRaceIds, limit: 6 });
  const featuredForecasts = useFeaturedForecasts({ electionCycleId: cycleId, featuredRaceIds, limit: 6 });
  const activeResults = useActiveElectionResults(cycleId, 6);
  const raceCount = useElectionRaces({ filters: cycleId ? { electionCycleIds: [cycleId] } : undefined, pagination: { page: 1, pageSize: 1 } });
  const candidateCount = useElectionCandidates({ filters: cycleId ? { electionCycleIds: [cycleId] } : undefined, pagination: { page: 1, pageSize: 1 } });
  const pollCount = useElectionPolls({ filters: cycleId ? { electionCycleIds: [cycleId] } : undefined, pagination: { page: 1, pageSize: 1 } });

  const electionNews = getArticlesByCategory("elections").slice(0, 6);
  const uniqueImages = assignUniqueImages(electionNews, (article) => article.slug, (article) => article.image, () => "elections");
  const nextElection = getNextElection();
  const electionDays = nextElection ? daysUntil(nextElection) : null;
  const electionDate = nextElection ? formatElectionDate(nextElection) : "To be announced";
  const electionType = nextElection ? electionTypeLabel(nextElection.type) : "Pending";

  return (
    <ElectionLayout title="Texas Election Central" description="Follow Texas races, candidates, polls, forecasts, results, and the voting information Texans need before election day." canonicalUrl="https://keeptxred.com/elections" navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.root} />} fullWidth>
      <div className="space-y-12">
        <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-sm" aria-label="Next Texas election overview">
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10 lg:py-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">2026 Texas election pulse</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Every race. Every vote. One Texas election hub.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">Repository-backed race, candidate, poll, forecast, and result data with clear source and status disclosures.</p>
              {mode === "mock" && import.meta.env.DEV ? <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-amber-300">Development mock repository</p> : null}
            </div>
            <ElectionCountdown days={electionDays} electionName={nextElection?.name} electionDate={electionDate} electionType={electionType} links={[{ label: "Register to vote", href: "/register-to-vote" }, { label: "Texas election laws", href: "/laws" }]} />
          </div>
        </section>

        <section aria-labelledby="election-summary">
          <h2 id="election-summary" className="text-2xl font-bold text-slate-950">Election Central summary</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[['Races', raceCount.totalItems], ['Candidates', candidateCount.totalItems], ['Polls', pollCount.totalItems], ['Active results', activeResults.results.length]].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border bg-white p-5 shadow-sm"><div className="text-3xl font-bold text-slate-950">{value}</div><div className="mt-1 text-sm text-slate-600">{label}</div></div>
            ))}
          </div>
        </section>

        <RelatedResources resources={VERIFIED_RESOURCES} title="Popular Texas election resources" description="Use these established guides alongside Election Central data." />

        <section aria-labelledby="election-central-start">
          <h2 id="election-central-start" className="text-2xl font-bold text-slate-950">Explore Election Central</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((item) => <a key={item.href} href={item.href} className="rounded-xl border bg-white p-5 shadow-sm"><h3 className="font-semibold text-slate-950">{item.title}</h3><p className="mt-2 text-sm text-slate-600">{item.description}</p></a>)}
          </div>
        </section>

        <section aria-labelledby="featured-races">
          <h2 id="featured-races" className="text-2xl font-bold text-slate-950">Featured Texas races</h2>
          <div className="mt-6"><DataState loading={featuredRaces.isLoading} error={featuredRaces.isError} empty={featuredRaces.isEmpty}>{<div className="grid gap-4 md:grid-cols-2">{featuredRaces.races.map((race) => <article key={race.id} className="rounded-xl border bg-white p-5 shadow-sm"><h3 className="font-semibold">{race.officeName}</h3><p className="mt-1 text-sm text-slate-600">{race.name}</p><p className="mt-3 text-sm">{race.rating.replaceAll('_', ' ')}</p></article>)}</div>}</DataState></div>
        </section>

        <section aria-labelledby="latest-polls"><h2 id="latest-polls" className="text-2xl font-bold text-slate-950">Latest polls</h2><div className="mt-6"><DataState loading={latestPolls.isLoading} error={latestPolls.isError} empty={latestPolls.isEmpty}>{<div className="grid gap-4 md:grid-cols-2">{latestPolls.polls.map((poll) => <article key={poll.id} className="rounded-xl border bg-white p-5"><h3 className="font-semibold">{poll.title}</h3><p className="mt-2 text-sm text-slate-600">{poll.pollsterName} · through {poll.fieldEndDate}</p>{['stale','expired'].includes(poll.freshnessStatus) ? <p className="mt-2 text-xs font-semibold text-amber-700">Stale polling data</p> : null}</article>)}</div>}</DataState></div></section>

        <section aria-labelledby="featured-forecasts"><h2 id="featured-forecasts" className="text-2xl font-bold text-slate-950">Featured forecasts</h2><div className="mt-6"><DataState loading={featuredForecasts.isLoading} error={featuredForecasts.isError} empty={featuredForecasts.isEmpty}>{<div className="grid gap-4 md:grid-cols-2">{featuredForecasts.forecasts.map((forecast) => <article key={forecast.id} className="rounded-xl border bg-white p-5"><h3 className="font-semibold">{forecast.race.name}</h3><p className="mt-2 text-sm text-slate-600">{forecast.rating.replaceAll('_', ' ')} · updated {forecast.updatedAt}</p></article>)}</div>}</DataState></div></section>

        <section aria-labelledby="results-preview"><h2 id="results-preview" className="text-2xl font-bold text-slate-950">Election results</h2><div className="mt-6"><DataState loading={activeResults.isLoading} error={activeResults.isError} empty={activeResults.isEmpty}>{<div className="grid gap-4 md:grid-cols-2">{activeResults.results.map((result) => <article key={result.id} className="rounded-xl border bg-white p-5"><h3 className="font-semibold">{result.race.name}</h3><p className="mt-2 text-sm text-slate-600">Unofficial · {result.reportingStatus.replaceAll('_', ' ')}</p></article>)}</div>}</DataState>{activeResults.isEmpty ? <p className="mt-3 text-sm text-slate-600">No races are actively reporting. Results will appear only when verified reporting data is available.</p> : null}</div></section>

        <section aria-labelledby="election-news"><h2 id="election-news" className="text-2xl font-bold text-slate-950">Texas election news</h2>{electionNews.length ? <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{electionNews.map((article) => <Link key={article.slug} to="/news/$slug" params={{ slug: article.slug }} className="overflow-hidden rounded-xl border bg-white shadow-sm"><img src={uniqueImages.get(article.slug) ?? article.image} alt="" className="aspect-video w-full object-cover" /><div className="p-5"><h3 className="font-semibold">{article.title}</h3></div></Link>)}</div> : null}</section>

        <AgedFeedSection section="elections" title="From the Live Feed" blurb="Election-related updates from official Texas sources, organized here after the initial breaking-news window." />
      </div>
    </ElectionLayout>
  );
}

export default ElectionHomePage;
