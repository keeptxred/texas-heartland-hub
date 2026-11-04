import { useEffect, useState } from "react";
import { pilotResearchFor } from "@/lib/representative-quality-gates";

const ROLE_LABELS: Record<string, string> = {
  author: "Author", coauthor: "Coauthor",
  sponsor: "Sponsor in receiving chamber", cosponsor: "Cosponsor",
};

export function RepresentativePrimarySourceResearch({ slug, name }: { slug: string; name: string }) {
  const records = pilotResearchFor(slug);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  // SSR publishes useful research immediately. The search controls are only
  // interactive after hydration; expose that state for real-browser validation
  // so an early fill cannot silently race the event-handler attachment.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!records.length) return null;

  const normalized = query.trim().toLocaleLowerCase("en");
  const matches = records.filter((entry) =>
    (role === "all" || role === entry.sponsor_role) &&
    (!normalized || (entry.bill_identifier + " " + entry.caption + " " +
      entry.current_status_label).toLocaleLowerCase("en").includes(normalized)));
  const roleCounts = [...new Set(records.map((item) => item.sponsor_role))]
    .map((key) => ({ key, count: records.filter((item) => item.sponsor_role === key).length }));
  const knownOutcomes = [...new Set(records.map((item) => item.current_status_label))]
    .map((label) => ({ label, count: records.filter((item) => item.current_status_label === label).length }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const synched = records.reduce((latest, row) => row.last_synced_at > latest ? row.last_synced_at : latest, "");
  const laws = records.filter((row) => row.became_law).length;

  return (
    <section id="activity" data-research-interactive={hydrated ? "true" : "false"} className="scroll-mt-24 rounded-xl border bg-card p-6">
      <h2 className="text-2xl font-bold">89th Legislature: official bill-role research</h2>
      <p className="mt-3 leading-7">
        This searchable research sample identifies the distinct roles connected to {name} in
        official Texas Legislature Online bill histories. A House or Senate bill can involve
        authors, coauthors, sponsors in the other chamber, and cosponsors. These roles are not
        interchangeable; none of the entries establishes how this member cast a floor vote.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ResearchFact label="Role-linked sample entries" value={String(records.length)} />
        <ResearchFact label="Entries flagged became law" value={String(laws)} />
        <ResearchFact label="Recorded roles represented" value={String(roleCounts.length)} />
      </div>
      <h3 className="mt-6 font-bold">How this member appears in the source records</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {roleCounts.map(({ key, count }) => (
          <span key={key} className="rounded-full border bg-muted/30 px-3 py-1.5 text-sm">
            {ROLE_LABELS[key] ?? key}: {count} in sample
          </span>
        ))}
      </div>
      <h3 className="mt-6 font-bold">Recorded outcomes in this sample</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {knownOutcomes.map(({ label, count }) => (
          <span key={label} className="rounded-full border px-3 py-1.5 text-sm">
            {label}: {count}
          </span>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <label className="block text-sm font-semibold">
          Search bill identifier, subject or status
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Example: HB 42, schools, effective"
            className="mt-2 block w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm font-semibold">
          Recorded legislative role
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-2 block w-full rounded-md border bg-background px-3 py-2"
          >
            <option value="all">All roles</option>
            {roleCounts.map(({ key }) => <option key={key} value={key}>{ROLE_LABELS[key] ?? key}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
        Showing {matches.length} of {records.length} sampled role-linked records.
      </p>
      {matches.length ? (
        <ol className="mt-4 space-y-3">
          {matches.map((bill) => (
            <li key={bill.bill_id + "-" + bill.sponsor_role} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <strong>{bill.bill_identifier}</strong>
                <span>{ROLE_LABELS[bill.sponsor_role] ?? bill.sponsor_role}</span>
                <span className="text-muted-foreground">{bill.current_status_label}</span>
              </div>
              <p className="mt-2 leading-6">{bill.caption}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span>{String(bill.legislature_number)}th Legislature · {bill.session_code}</span>
                <a href={bill.source_url} target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-4 hover:underline">
                  Official Texas Legislature bill history
                </a>
              </div>
            </li>
          ))}
        </ol>
      ) : <p className="mt-4 text-sm">No sampled records match these filters.</p>}
      <div className="mt-6 border-t pt-5 text-sm leading-6 text-muted-foreground">
        <strong>Coverage and freshness:</strong> Historical 89th Texas Legislature only.
        This is a role-stratified research sample: up to eight most recently acted-upon bills
        per role, selected from KTR's existing official-source sponsor graph and captured on
        November 4, 2026. It is not a count of every bill sponsored, every vote, every session,
        or a member's lifetime record. The source data records its latest synchronization in this
        sample as {synched.slice(0, 10)}. The recorded bill status is historical; check each linked
        official history before relying on time-sensitive information. A missing bill is not
        evidence that no other legislative activity occurred.
      </div>
    </section>
  );
}

function ResearchFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-bold">{value}</div>
    </div>
  );
}
