import { CalendarDays, Vote } from 'lucide-react';

type CommitteeActivity = {
  id: string;
  committee_name?: string | null;
  action_description?: string | null;
  action_type?: string | null;
  hearing_date?: string | null;
  vote_date?: string | null;
  source_url?: string | null;
  legislative_committees?: {
    committee_name?: string | null;
    committee_slug?: string | null;
  } | null;
};

const formatDate = (value?: string | null) =>
  value
    ? new Date(`${value}T12:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

export function BillHearingsAndVotes({ activities }: { activities: CommitteeActivity[] }) {
  const hearings = activities.filter((item) => item.hearing_date);
  const votes = activities.filter((item) => item.vote_date);

  if (!hearings.length && !votes.length) return null;

  return (
    <section className="scroll-mt-24 rounded-xl border bg-card p-6" id="hearings-votes">
      <h2 className="text-2xl font-bold">Hearings and committee votes</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Dates below come from official committee-history records. A listed vote date confirms recorded committee activity, not a specific vote margin unless the official record supplies one.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {hearings.length ? (
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Hearings</h3>
            </div>
            <ol className="mt-4 space-y-3">
              {hearings.map((item) => {
                const committee = item.committee_name || item.legislative_committees?.committee_name || 'Legislative committee';
                const slug = item.legislative_committees?.committee_slug;
                return (
                  <li key={`hearing-${item.id}`} className="rounded-lg border p-4">
                    <p className="font-semibold">{formatDate(item.hearing_date)}</p>
                    {slug ? (
                      <a href={`/texas-legislature/committees/${slug}`} className="mt-1 block text-sm font-medium hover:text-primary hover:underline">
                        {committee}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium">{committee}</p>
                    )}
                    {(item.action_description || item.action_type) && (
                      <p className="mt-2 text-sm text-muted-foreground">{item.action_description || item.action_type}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}

        {votes.length ? (
          <div>
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Committee votes</h3>
            </div>
            <ol className="mt-4 space-y-3">
              {votes.map((item) => {
                const committee = item.committee_name || item.legislative_committees?.committee_name || 'Legislative committee';
                const slug = item.legislative_committees?.committee_slug;
                return (
                  <li key={`vote-${item.id}`} className="rounded-lg border p-4">
                    <p className="font-semibold">{formatDate(item.vote_date)}</p>
                    {slug ? (
                      <a href={`/texas-legislature/committees/${slug}`} className="mt-1 block text-sm font-medium hover:text-primary hover:underline">
                        {committee}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium">{committee}</p>
                    )}
                    {(item.action_description || item.action_type) && (
                      <p className="mt-2 text-sm text-muted-foreground">{item.action_description || item.action_type}</p>
                    )}
                    {item.source_url ? (
                      <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                        Official committee record
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}
      </div>
    </section>
  );
}
