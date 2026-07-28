import { Link } from "@tanstack/react-router";
import { AgedFeedSection } from "@/components/aged-feed-section";
import {
  ElectionCountdown,
  ElectionEmptyState,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
  FeaturedRaceCard,
  PollCard,
  RelatedResources,
} from "@/components/elections";
import {
  useActiveElectionCycle,
  useActiveElectionResults,
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
import {
  FORECAST_CONFIDENCE_LEVEL_LABELS,
  FORECAST_RATING_LABELS,
} from "@/types/elections/forecastClassifications";

const QUICK_LINKS = [
  {
    title: "Track the races",
    description: "See statewide, congressional, legislative, and local contests in one place.",
    href: ELECTION_ROUTES.races,
  },
  {
    title: "Meet the candidates",
    description: "Compare candidate backgrounds, priorities, endorsements, and campaign details.",
    href: ELECTION_ROUTES.candidates,
  },
  {
    title: "Follow the polls",
    description: "Review recent polling, sample details, field dates, and movement over time.",
    href: ELECTION_ROUTES.polls,
  },
  {
    title: "Prepare to vote",
    description:
      "Find registration, early-voting, ballot, identification, and election-day guidance.",
    href: ELECTION_ROUTES.voting,
  },
] as const;

const VERIFIED_RESOURCES = [
  {
    title: "How to register to vote in Texas",
    href: "/register-to-vote",
    description:
      "Review eligibility, registration steps, deadlines, and official Texas voter resources.",
    eyebrow: "Voting guide",
  },
  {
    title: "Texas election laws explained",
    href: "/laws",
    description: "Understand the Texas laws and rules that govern voting and elections.",
    eyebrow: "Texas laws",
  },
  {
    title: "Contact your Texas legislators",
    href: "/contact-legislators",
    description: "Find the officials who represent you and learn how to contact their offices.",
    eyebrow: "Civic action",
  },
  {
    title: "Texas politics coverage",
    href: "/texas-politics",
    description: "Read the latest reporting and analysis on Texas government and political races.",
    eyebrow: "Latest coverage",
  },
] as const;

export function ElectionHomePage() {
  const activeCycle = useActiveElectionCycle();
  const activeResults = useActiveElectionResults(activeCycle.data?.id, 4);
  const featuredRaces = useFeaturedElectionRaces(activeCycle.data?.id, 6);
  const latestPolls = useLatestElectionPolls(activeCycle.data?.id, 3);
  const featuredForecasts = useFeaturedForecasts(activeCycle.data?.id, 3);
  const electionNews = getArticlesByCategory("elections").slice(0, 6);
  const uniqueImages = assignUniqueImages(
    electionNews,
    (article) => article.slug,
    (article) => article.image,
    () => "elections",
  );
  const nextElection = getNextElection();
  const electionDays = nextElection ? daysUntil(nextElection) : null;
  const electionDate = nextElection ? formatElectionDate(nextElection) : "To be announced";
  const electionType = nextElection ? electionTypeLabel(nextElection.type) : "Pending";

  return (
    <ElectionLayout
      title="Texas Election Central"
      description="Follow Texas races, candidates, polls, forecasts, results, and the voting information Texans need before election day."
      canonicalUrl="https://keeptxred.com/elections"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.root} />}
      fullWidth
    >
      <div className="space-y-12">
        <section
          aria-label="Next Texas election overview"
          className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-sm"
        >
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-10 lg:py-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
                2026 Texas election pulse
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Every race. Every vote. One Texas election hub.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Election Central brings together race ratings, candidate profiles, polling,
                forecasts, live results, and practical voting guidance as each part of the platform
                comes online.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={ELECTION_ROUTES.races}
                  className="rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Explore races
                </a>
                <a
                  href="/register-to-vote"
                  className="rounded-md border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Register to vote
                </a>
              </div>
            </div>

            <ElectionCountdown
              days={electionDays}
              electionName={nextElection?.name}
              electionDate={electionDate}
              electionType={electionType}
              links={[
                { label: "Register to vote", href: "/register-to-vote" },
                { label: "Texas election laws", href: "/laws" },
              ]}
            />
          </div>
        </section>

        <RelatedResources
          resources={VERIFIED_RESOURCES}
          title="Popular Texas election resources"
          description="Start with these existing KeepTXRed guides and hubs while the full Election Central platform is being built."
        />

        <section aria-labelledby="election-central-start">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                Start here
              </p>
              <h2
                id="election-central-start"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              >
                Explore Election Central
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-950 group-hover:text-red-700">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <span className="mt-4 block text-sm font-semibold text-red-700">
                  Open section →
                </span>
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="featured-races">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                Race watch
              </p>
              <h2
                id="featured-races"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              >
                Featured Texas races
              </h2>
            </div>
            <a
              href={ELECTION_ROUTES.races}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              View all races →
            </a>
          </div>
          <div className="mt-6">
            {activeCycle.isPending || (activeCycle.data && featuredRaces.isPending) ? (
              <ElectionLoading variant="cards" count={3} label="Loading featured election races" />
            ) : activeCycle.isError || featuredRaces.isError ? (
              <ElectionErrorState
                compact
                title="Featured races could not be loaded"
                retryAction={{
                  label: "Try again",
                  onClick: () => {
                    void activeCycle.refetch();
                    void featuredRaces.refetch();
                  },
                }}
                secondaryActions={[]}
              />
            ) : !activeCycle.data || featuredRaces.isEmpty ? (
              <ElectionEmptyState kind="races" />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featuredRaces.data?.map((race) => (
                  <FeaturedRaceCard
                    key={race.id}
                    office={race.officeName}
                    district={race.districtName ?? undefined}
                    electionDate={race.electionDate}
                    electionType={race.electionType}
                    rating={race.rating}
                    candidates={race.candidates.map((candidate) => ({
                      name: candidate.fullName,
                      party: candidate.partyLabel ?? candidate.party,
                      incumbent: candidate.incumbent,
                    }))}
                    raceHref={ELECTION_ROUTES.races}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="latest-polls">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Polling</p>
              <h2
                id="latest-polls"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              >
                Latest election polls
              </h2>
            </div>
            <a
              href={ELECTION_ROUTES.polls}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              View all polls â†’
            </a>
          </div>

          <div className="mt-6">
            {activeCycle.isPending || (activeCycle.data && latestPolls.isPending) ? (
              <ElectionLoading variant="cards" count={3} label="Loading latest election polls" />
            ) : activeCycle.isError || latestPolls.isError ? (
              <ElectionErrorState
                compact
                title="Latest polls could not be loaded"
                retryAction={{
                  label: "Try again",
                  onClick: () => {
                    void activeCycle.refetch();
                    void latestPolls.refetch();
                  },
                }}
                secondaryActions={[]}
              />
            ) : !activeCycle.data || latestPolls.isEmpty ? (
              <ElectionEmptyState kind="polls" />
            ) : (
              <>
                {latestPolls.data?.some(
                  (poll) => poll.freshnessStatus === "stale" || poll.freshnessStatus === "expired",
                ) ? (
                  <p
                    role="status"
                    className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
                  >
                    One or more polls are older than the configured freshness window. Review each
                    pollâ€™s field dates before drawing conclusions.
                  </p>
                ) : null}
                <div className="grid gap-5 xl:grid-cols-3">
                  {latestPolls.data?.map((poll) => (
                    <PollCard
                      key={poll.id}
                      pollster={poll.pollsterName}
                      raceName={poll.race?.name ?? poll.title}
                      raceHref={ELECTION_ROUTES.races}
                      fieldDates={`${poll.fieldStartDate}â€“${poll.fieldEndDate}`}
                      publishedDate={poll.releaseDate ?? undefined}
                      sampleSize={poll.methodology.sampleSize}
                      populationLabel={poll.methodology.population.replaceAll("_", " ")}
                      methodologyLabel={poll.methodology.mode.replaceAll("_", " ")}
                      marginOfError={poll.methodology.marginOfError}
                      grade={poll.pollsterGrade}
                      sponsor={poll.sponsors[0]?.name}
                      results={
                        poll.primaryQuestion?.responses
                          .filter((response) => response.percentage !== null)
                          .map((response) => ({
                            candidateId: response.candidateId ?? response.id,
                            candidateName: response.candidateName ?? response.label,
                            partyLabel: response.partyLabel ?? undefined,
                            percentage: response.percentage ?? 0,
                          })) ?? []
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section aria-labelledby="featured-forecasts">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Forecasts</p>
              <h2
                id="featured-forecasts"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              >
                Featured race forecasts
              </h2>
            </div>
            <a
              href={ELECTION_ROUTES.methodology}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Review forecast methodology â†’
            </a>
          </div>

          <div className="mt-6">
            {activeCycle.isPending || (activeCycle.data && featuredForecasts.isPending) ? (
              <ElectionLoading
                variant="cards"
                count={3}
                label="Loading featured election forecasts"
              />
            ) : activeCycle.isError || featuredForecasts.isError ? (
              <ElectionErrorState
                compact
                title="Featured forecasts could not be loaded"
                retryAction={{
                  label: "Try again",
                  onClick: () => {
                    void activeCycle.refetch();
                    void featuredForecasts.refetch();
                  },
                }}
                secondaryActions={[
                  {
                    label: "Forecast methodology",
                    href: ELECTION_ROUTES.methodology,
                  },
                ]}
              />
            ) : !activeCycle.data || featuredForecasts.isEmpty ? (
              <ElectionEmptyState kind="forecasts" />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featuredForecasts.data?.map((forecast) => (
                  <article
                    key={forecast.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                      {forecast.sourceName}
                    </p>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                      {forecast.race.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">Updated {forecast.updatedAt}</p>

                    <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Rating
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-950">
                          {FORECAST_RATING_LABELS[forecast.rating]}
                        </dd>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Confidence
                        </dt>
                        <dd className="mt-1 font-semibold text-slate-950">
                          {FORECAST_CONFIDENCE_LEVEL_LABELS[forecast.confidenceLevel]}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 space-y-2">
                      {forecast.candidates
                        .slice()
                        .sort((left, right) => right.winProbability - left.winProbability)
                        .slice(0, 3)
                        .map((candidate) => (
                          <div
                            key={candidate.candidateId}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <span className="font-semibold text-slate-800">
                              {candidate.candidateName}
                            </span>
                            <span className="font-mono font-bold text-slate-950">
                              {candidate.winProbability.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-4">
                      <a
                        href={ELECTION_ROUTES.methodology}
                        className="text-sm font-semibold text-red-700 hover:underline"
                      >
                        How this forecast works â†’
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="results-preview">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Results</p>
              <h2
                id="results-preview"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              >
                Election results preview
              </h2>
            </div>
            <a
              href={ELECTION_ROUTES.results}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              View election results â†’
            </a>
          </div>

          <div className="mt-6">
            {activeCycle.isPending || (activeCycle.data && activeResults.isPending) ? (
              <ElectionLoading variant="cards" count={4} label="Loading active election results" />
            ) : activeCycle.isError || activeResults.isError ? (
              <ElectionErrorState
                compact
                title="Election results are temporarily unavailable"
                message="Election Central will not substitute estimated or unverified totals while the official result source is unavailable."
                retryAction={{
                  label: "Try again",
                  onClick: () => {
                    void activeCycle.refetch();
                    void activeResults.refetch();
                  },
                }}
                secondaryActions={[]}
              />
            ) : !activeCycle.data || activeResults.isEmpty ? (
              <ElectionEmptyState
                kind="results"
                message="No races are actively reporting. Results will appear after official reporting begins; no placeholder vote totals are displayed."
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {activeResults.data?.map((result) => (
                  <article
                    key={result.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
                          Unofficial results
                        </p>
                        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                          {result.race.name}
                        </h3>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {result.reporting.reportingPercentage == null
                          ? "Reporting percentage unavailable"
                          : `${result.reporting.reportingPercentage.toFixed(1)}% reporting`}
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {result.candidates
                        .slice()
                        .sort(
                          (left, right) =>
                            right.votes - left.votes ||
                            left.candidateName.localeCompare(right.candidateName),
                        )
                        .slice(0, 4)
                        .map((candidate) => (
                          <div
                            key={candidate.candidateId}
                            className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0"
                          >
                            <span className="font-semibold text-slate-800">
                              {candidate.candidateName}
                            </span>
                            <span className="text-right font-mono font-bold text-slate-950">
                              {candidate.votes.toLocaleString("en-US")}
                              {candidate.voteShare == null
                                ? ""
                                : ` (${candidate.voteShare.toFixed(1)}%)`}
                            </span>
                          </div>
                        ))}
                    </div>

                    <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-600">
                      Last updated {result.lastVoteUpdateAt ?? result.updatedAt}. Totals remain
                      unofficial until certified.
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="election-news">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                Latest coverage
              </p>
              <h2
                id="election-news"
                className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              >
                Texas election news
              </h2>
            </div>
            <Link to="/texas-news" className="text-sm font-semibold text-red-700 hover:underline">
              More Texas news →
            </Link>
          </div>

          {electionNews.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {electionNews.map((article) => (
                <Link
                  key={article.slug}
                  to="/news/$slug"
                  params={{ slug: article.slug }}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={uniqueImages.get(article.slug) ?? article.image}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                      {article.category}
                    </p>
                    <h3 className="mt-2 font-semibold leading-snug text-slate-950 group-hover:text-red-700">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-xs text-slate-500">{article.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              Election coverage will appear here as new stories are published.
            </div>
          )}
        </section>

        <AgedFeedSection
          section="elections"
          title="From the Live Feed"
          blurb="Election-related updates from official Texas sources, organized here after the initial breaking-news window."
        />
      </div>
    </ElectionLayout>
  );
}

export default ElectionHomePage;
