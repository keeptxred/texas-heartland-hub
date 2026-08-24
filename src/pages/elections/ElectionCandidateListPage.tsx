import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ElectionDirectoryTrustPanel } from "@/components/elections/ElectionDirectoryTrustPanel";
import {
  ElectionEmptyState,
  ElectionErrorState,
  ElectionLayout,
  ElectionLoading,
  ElectionNavigation,
} from "@/components/elections";
import { ELECTION_ROUTES } from "@/lib/elections";

export interface ElectionCandidateListPageProps {
  children?: ReactNode;
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
}

function CandidateDirectoryPrimer() {
  const links = [
    { to: "/elections/2026", label: "2026 Election Central" },
    { to: "/elections/races", label: "Texas election races" },
    { to: "/elections/statewide", label: "Statewide races" },
    { to: "/elections/legislative", label: "Texas legislative races" },
    { to: "/elections/districts", label: "Election districts" },
    { to: "/elections/voting", label: "Texas voting information" },
  ] as const;

  return (
    <section
      className="rounded-xl border border-border bg-muted/20 p-6"
      aria-labelledby="candidate-directory-guide-heading"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
        Texas candidate directory guide
      </p>
      <h2
        id="candidate-directory-guide-heading"
        className="mt-2 text-2xl font-bold tracking-tight text-foreground"
      >
        Find verified candidates by race, office, and district
      </h2>
      <div className="mt-4 max-w-4xl space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
        <p>
          KeepTXRed Election Central organizes published Texas candidate records around the election
          races in which those candidates appear. Candidate profiles are connected to statewide,
          congressional, Texas House, Texas Senate, county, and local race pages so readers can move
          from a candidate name to the office, district, filing status, party, incumbency status, and
          related race information without relying on a search form alone.
        </p>
        <p>
          The public directory only surfaces records that have passed the site&apos;s election publication
          controls. Candidate and race information is maintained from source-backed election records and
          is presented as a reference layer, not as an endorsement. Filing status, ballot access, party,
          office, and election-cycle details can change, so each profile should be read together with the
          linked race page and the responsible election authority when a voter needs an official answer.
        </p>
        <p>
          Use the directory below to search by candidate or office and to filter by party, office level,
          status, or incumbency. For broader browsing, start with the statewide and legislative hubs or
          open the race directory to see the candidates attached to each published contest. Voting dates,
          registration guidance, identification rules, and ballot resources are maintained separately in
          the voting section so candidate discovery and voting instructions remain easy to verify.
        </p>
      </div>

      <nav aria-label="Related Texas election resources" className="mt-6 flex flex-wrap gap-2">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}

export function ElectionCandidateListPage({
  children,
  error,
  isLoading = false,
  onRetry,
}: ElectionCandidateListPageProps) {
  return (
    <ElectionLayout
      title="Texas Election Candidates"
      description="Browse verified candidate information for published Texas election races, including party, filing, incumbency, office, district, and connected race details."
      canonicalUrl="https://keeptxred.com/elections/candidates"
      navigation={<ElectionNavigation currentPath={ELECTION_ROUTES.candidates} />}
      fullWidth
    >
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            KeepTXRed Election Central
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Texas election candidates
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Review published candidate profiles with verified party, filing, incumbency, office,
            district, and race information.
          </p>
        </header>

        <CandidateDirectoryPrimer />

        <section aria-label="Texas election candidate list">
          {isLoading ? (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                The interactive candidate cards are loading. The directory guide and election links above
                remain available in the initial page response for readers and search crawlers.
              </p>
              <ElectionLoading variant="cards" count={6} label="Loading Texas election candidates" />
            </div>
          ) : error ? (
            <ElectionErrorState
              compact
              title="Texas election candidates could not be loaded"
              technicalMessage={error.message}
              retryAction={onRetry ? { label: "Try again", onClick: onRetry } : undefined}
            />
          ) : (
            (children ?? <ElectionEmptyState kind="candidates" />)
          )}
        </section>
        <ElectionDirectoryTrustPanel kind="candidates" />
      </div>
    </ElectionLayout>
  );
}

export default ElectionCandidateListPage;
