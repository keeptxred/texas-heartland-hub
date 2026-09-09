import type { RelatedAuthorityItem } from "@/lib/authority-relationships";
import type { Bill } from "@/lib/bills";

type RepresentativeBill = Pick<
  Bill,
  "id" | "bill_identifier" | "current_status_label" | "last_action_date" | "became_law"
>;

export type RepresentativeLegislativeActivity = {
  billCount: number;
  becameLawCount: number;
  latestActionDate: string | null;
  statusCounts: { label: string; count: number }[];
};

export function summarizeRepresentativeLegislativeActivity(
  bills: RepresentativeBill[],
): RepresentativeLegislativeActivity {
  const uniqueBills = [...new Map(bills.map((bill) => [bill.id, bill])).values()];
  const statusCounts = new Map<string, number>();
  let latestActionDate: string | null = null;

  for (const bill of uniqueBills) {
    const status = bill.current_status_label?.trim() || "Status not published";
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
    if (bill.last_action_date && (!latestActionDate || bill.last_action_date > latestActionDate)) {
      latestActionDate = bill.last_action_date;
    }
  }

  return {
    billCount: uniqueBills.length,
    becameLawCount: uniqueBills.filter((bill) => bill.became_law).length,
    latestActionDate,
    statusCounts: [...statusCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
  };
}

export function RepresentativeLegislativeIntelligence({
  name,
  bills,
  relatedContent,
}: {
  name: string;
  bills: RepresentativeBill[];
  relatedContent: RelatedAuthorityItem[];
}) {
  const activity = summarizeRepresentativeLegislativeActivity(bills);
  const policyTopics = [
    ...new Map(
      relatedContent
        .filter((item) => item.type === "subject")
        .map((item) => [item.key, item]),
    ).values(),
  ].slice(0, 6);

  const latestAction = activity.latestActionDate
    ? new Date(`${activity.latestActionDate}T12:00:00`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "None recorded";

  return (
    <section id="activity" className="scroll-mt-24 rounded-xl border bg-card p-6">
      <h2 className="text-2xl font-bold">Legislative activity and policy connections</h2>
      <p className="mt-3 leading-7 text-muted-foreground">
        This section summarizes bills connected to {name} through KTR&apos;s normalized sponsor
        records and approved authority relationships. It does not describe floor votes, committee
        votes, or imply that the member supports every subject connected to a bill.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <ActivityFact label="Sponsor-linked bills" value={String(activity.billCount)} />
        <ActivityFact label="Became law" value={String(activity.becameLawCount)} />
        <ActivityFact label="Latest bill action" value={latestAction} />
      </div>

      {activity.statusCounts.length ? (
        <div className="mt-6">
          <h3 className="font-bold">Current status of connected bills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {activity.statusCounts.slice(0, 8).map((status) => (
              <span key={status.label} className="rounded-full border bg-muted/30 px-3 py-1.5 text-xs font-semibold">
                {status.label}: {status.count}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 border-t pt-5">
        <h3 className="font-bold">Policy subjects in the Government Graph</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Subject links appear only when an approved authority relationship is available. They are
          navigation and research signals, not a voting scorecard.
        </p>
        {policyTopics.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {policyTopics.map((topic) => (
              <a key={topic.key} href={topic.href} className="rounded-lg border p-4 hover:border-primary">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                  Bill subject
                </span>
                <strong className="mt-1 block">{topic.title}</strong>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            No approved policy-subject relationships are currently attached to this representative
            profile.
          </p>
        )}
      </div>
    </section>
  );
}

function ActivityFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}
