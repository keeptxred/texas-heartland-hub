import { Link } from "@tanstack/react-router";
import { AgedFeedSection } from "@/components/aged-feed-section";
import { ElectionLayout, ElectionNavigation } from "@/components/elections";
import { ELECTION_RACES } from "@/data/articles";
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
    description: "Find registration, early-voting, ballot, identification, and election-day guidance.",
    href: ELECTION_ROUTES.voting,
  },
] as const;

export function ElectionHomePage() {
  const electionNews = getArticlesByCategory("elections").slice(0, 6);
  const uniqueImages = assignUniqueImages(
    electionNews,
    (article) => article.slug,
    (article) => article.image,
    () => "elections",
  );
  const nextElection = getNextElection();

  const countdownValue = nextElection ? String(daysUntil(nextElection)) : "—";
  const countdownLabel = nextElection ? `Days to ${nextElection.name}` : "Next Texas election";
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
                forecasts, live results, and practical voting guidance as each part of the
                platform comes online.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={ELECTION_ROUTES.races}
                  className="rounded-md bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Explore races
                </a>
                <a
                  href={ELECTION_ROUTES.voting}
                  className="rounded-md border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Voting information
                </a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <ElectionStat value={countdownValue} label={countdownLabel} />
              <ElectionStat value={electionDate} label="Election date" compact />
              <ElectionStat value={electionType} label="Election type" compact />
            </div>
          </div>
        </section>

        <section aria-labelledby="election-central-start">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                Start here
              </p>
              <h2 id="election-central-start" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
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
                <h3 className="font-semibold text-slate-950 group-hover:text-red-700">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <span className="mt-4 block text-sm font-semibold text-red-700">Open section →</span>
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
              <h2 id="featured-races" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Featured Texas races
              </h2>
            </div>
            <a href={ELECTION_ROUTES.races} className="text-sm font-semibold text-red-700 hover:underline">
              View all races →
            </a>
          </div>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Office</th>
                    <th className="px-5 py-3 font-semibold">Incumbent</th>
                    <th className="px-5 py-3 font-semibold">Margin</th>
                    <th className="px-5 py-3 font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ELECTION_RACES.slice(0, 6).map((race) => (
                    <tr key={race.office}>
                      <td className="px-5 py-4 font-semibold text-slate-950">{race.office}</td>
                      <td className="px-5 py-4 text-slate-600">{race.incumbent}</td>
                      <td className="px-5 py-4 font-mono font-semibold text-red-700">{race.margin}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {race.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section aria-labelledby="election-news">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                Latest coverage
              </p>
              <h2 id="election-news" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
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
                    <p className="text-xs font-bold uppercase tracking-wider text-red-700">{article.category}</p>
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

function ElectionStat({
  value,
  label,
  compact = false,
}: {
  value: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-5">
      <div className={compact ? "text-xl font-bold text-white" : "text-4xl font-bold text-red-400"}>
        {value}
      </div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
        {label}
      </div>
    </div>
  );
}

export default ElectionHomePage;
