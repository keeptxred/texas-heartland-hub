import sourceStatus from "@/data/lobbying-2026-source-status.json";

/** Source-first, date-bound 2026 lobbying reference tools.
 * Sample entries are from TEC's 2026 client-sorted list; not a complete register.
 * No estimate of pay, influence, or total 2026 annual expenditure is inferred.
 */
const original = "https://www.ethics.state.tx.us";
const registrationList = original + "/search/lobby/loblistsREG2026-2030.php";
const reportPdf = original + "/data/search/lobby/2026/2026LobbyGroupByClient.pdf";

const resources = [
  { label: "Search by lobbyist or client", description: "Name, filer ID, subject, location or compensation", href: original + "/search/lobby/LobbySimpleSearch.php" },
  { label: "2026 client-sorted registry (PDF)", description: "Client–registrant relationships, report dates and filing codes", href: reportPdf },
  { label: "2026 client-sorted registry (Excel)", description: "Download the current full TEC list and filter in a spreadsheet", href: original + "/data/search/lobby/2026/2026LobbyGroupByClient.xlsx" },
  { label: "2026 lobbyist-sorted and other lists", description: "Registrant-sorted records and subject matter lists", href: registrationList },
  { label: "2026 activity filings", description: "Registrants and activity-report PDFs, with current-year updates", href: original + "/search/lobby/2026/LAReportsByYear2026.html" },
  { label: "Quarterly expenditure report (PDF)", description: "Transportation, food, entertainment, gifts, events and media", href: original + "/data/search/lobby/LobbyExpendituresByCategory.pdf" },
];

const sample = [
  { client: "1A Smart Start LLC", lobbyist: "Coffey, Debra", filer: "65598", classification: "PAID", code: "LOBBCOMP01", start: "Jan. 1, 2026" },
  { client: "A LifeSafer of Texas Interlock, Inc.", lobbyist: "Cantella, Richard C.", filer: "54009", classification: "PROSPECT", code: "LOBBCOMP03", start: "Feb. 16, 2026" },
  { client: "1AU Technologies, Inc.", lobbyist: "Hughs, Ruth R.", filer: "70972", classification: "PROSPECT", code: "LOBBCOMP04", start: "May 5, 2026" },
] as const;

/** These bands are the TEC 2026 values, NOT the stale key in the 2026 registration PDF. */
export const TEXAS_2026_LOBBY_COMPENSATION_CODES = [
  ["LOBBCOMPEQZERO", "$0"],
  ["LOBBCOMP01", "Less than $22,890"],
  ["LOBBCOMP02", "$22,890–$57,219.99"],
  ["LOBBCOMP03", "$57,220–$114,429.99"],
  ["LOBBCOMP04", "$114,430–$228,869.99"],
  ["LOBBCOMP05", "$228,870–$343,299.99"],
  ["LOBBCOMP06", "$343,300–$457,729.99"],
  ["LOBBCOMP07", "$457,730–$572,159.99"],
  ["LOBBCOMP08", "$572,160–$686,599.99"],
  ["LOBBCOMP09", "$686,600–$801,029.99"],
  ["LOBBCOMP10", "$801,030–$915,459.99"],
  ["LOBBCOMP11", "$915,460–$1,029,889.99"],
  ["LOBBCOMP12", "$1,029,890–$1,144,329.99"],
  ["LOBBCOMP13", "$1,144,330 or more"],
  ["LOBBCOMPEXACTAMT", "Exact amount — inspect original registration"],
] as const;

export function Lobbying2026Panel() {
  const sourceCheckedAt: string | null = sourceStatus.checkedAt;
  return (
    <section className="mt-10 space-y-8" aria-labelledby="lobbying-2026-resources">
      <div>
        <h2 id="lobbying-2026-resources" className="text-2xl font-bold">Explore the official 2026 lobbying records</h2>
        <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
          Open the current Texas Ethics Commission registries, original activity reports and expenditure summaries.
          These source files can change after a client's registration, amendment or termination.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {sourceCheckedAt
            ? `Automated source availability last checked ${new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(sourceCheckedAt))}. This is not a guarantee every filing is current.`
            : "Automated weekly source checking is configured; first successful check pending."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {resources.map((source) => (
            <a key={source.href} href={source.href} rel="noopener noreferrer"
              className="rounded-xl border bg-card p-4 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <span className="block font-semibold text-primary underline underline-offset-2">{source.label} ↗</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">{source.description}</span>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Example client–lobbyist registrations</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          Three examples from the 2026 TEC client-sorted registry reviewed October 29, 2026.
          These are illustrative records, not a complete or ranked directory. PROSPECT is not proof money was paid.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[680px] text-left text-sm">
            <caption className="sr-only">Examples from 2026 TEC lobbying registrations, including client, lobbyist, filer ID and disclosed compensation classification</caption>
            <thead className="bg-muted/70">
              <tr>{["Client", "Registered lobbyist / ID", "Classification", "2026 code", "Relationship start"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {sample.map((row) => (
                <tr key={row.filer} className="border-t align-top">
                  <td className="px-4 py-3 font-medium">{row.client}</td>
                  <td className="px-4 py-3">{row.lobbyist}<span className="block text-muted-foreground">Filer {row.filer}</span></td>
                  <td className="px-4 py-3">{row.classification}</td>
                  <td className="px-4 py-3 font-mono text-xs">{row.code}</td>
                  <td className="px-4 py-3">{row.start}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          <a href={reportPdf} className="font-semibold text-primary underline underline-offset-2">Verify every entry in the TEC source PDF</a>.
          Check the current registry for later changes.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold">2026 client compensation codes, decoded</h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          A client compensation band is not an exact payment, reportable activity expenditure or campaign contribution.
          The highest tier is open-ended; summing band upper bounds cannot produce a valid exact total.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[350px] text-left text-sm">
            <caption className="sr-only">Texas Ethics Commission 2026 lobby registration compensation code ranges</caption>
            <thead className="bg-muted/70"><tr><th scope="col" className="px-4 py-3">2026 TEC code</th><th scope="col" className="px-4 py-3">Disclosed range</th></tr></thead>
            <tbody>{TEXAS_2026_LOBBY_COMPENSATION_CODES.map(([code, range]) => (
              <tr key={code} className="border-t"><th scope="row" className="px-4 py-2 font-mono text-xs font-medium">{code}</th><td className="px-4 py-2">{range}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Source: <a href={original + "/search/lobby/"} className="font-semibold text-primary underline underline-offset-2">TEC 2026 compensation table</a>.
          A key embedded in the TEC's 2026 client-sorted PDF displays older band figures; this table follows TEC's explicitly labeled 2026 schedule.
        </p>
      </div>
    </section>
  );
}
