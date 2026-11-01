// Source discovery and freshness safety net. Never invent or auto-verify poll numbers.
import { readFile, writeFile } from "node:fs/promises";

const reportFile = "poll-monitor-report.md";
const trackerUrl = "https://texaspolitics.utexas.edu/blog/texas-2026-u-s-senate-poll-tracker";
const universityUrl = "https://texaspolitics.utexas.edu/latest-poll";
const today = new Date(process.env.ELECTION_POLL_MONITOR_AS_OF ?? Date.now());
const polls = JSON.parse(await readFile("src/data/elections/2026/polls.json", "utf8"));
const eligible = polls.filter((poll) => poll.publicationStatus === "published" && poll.verificationStatus === "verified");
const maxDate = (rows) => rows.map((row) => row.fieldEndDate).filter(Boolean).sort().at(-1) ?? null;
const newestSenate = maxDate(eligible.filter((poll) => poll.raceId === "race-2026-us-senate"));
const newestUT = eligible.filter((poll) => poll.pollster?.slug === "ut-texas-politics-project")
  .map((poll) => poll.releaseDate).filter(Boolean).sort().at(-1) ?? null;
const notices = [];
const checks = [];
const active = today < new Date("2026-11-05T00:00:00Z");
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// Polling for the 2026 general election ends after Election Day. Preserve the archive
// without generating perpetual false freshness alarms in subsequent months.
if (!active) {
  const archived = `# Election Central polling source freshness\n\n2026 pre-election monitoring window closed as of ${today.toISOString()}. Archived poll records are preserved.\n`;
  await writeFile(reportFile, archived);
  console.log(archived);
  process.exit(0);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "KeepTXRed-Election-Source-Monitor/1.0 (+https://keeptxred.com/elections/polls)", Accept: "text/html" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.text())
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&ndash;|&mdash;/gi, "-")
    .replace(/\s+/g, " ");
}
try {
  const tracker = await fetchText(trackerUrl);
  const start = tracker.indexOf("Texas 2026 U.S. Senate Election Polling");
  const end = tracker.indexOf("Previous Updates", start);
  if (start < 0 || end <= start) throw new Error("Tracker table not found (markup/source format changed)");
  const section = tracker.slice(start, end);
  const fieldEndDates = [];
  for (const match of section.matchAll(/\b(\d{1,2})\/(\d{1,2})\s*[-–]\s*(\d{1,2})\/(\d{1,2})\b/g)) {
    const month = Number(match[3]), day = Number(match[4]);
    if (month < 1 || month > 12 || day < 1 || day > 31) continue;
    const iso = `2026-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    if (!Number.isNaN(Date.parse(iso))) fieldEndDates.push(iso);
  }
  if (!fieldEndDates.length) throw new Error("No verifiable fieldwork end dates found");
  const trackerNewest = fieldEndDates.sort().at(-1);
  checks.push(`UT public Senate tracker latest field end: ${trackerNewest}; KeepTXRed verified Senate latest: ${newestSenate ?? "none"}.`);
  if (active && (!newestSenate || trackerNewest > newestSenate)) {
    notices.push(`The UT Senate tracker lists fieldwork through ${trackerNewest}, but KeepTXRed's latest verified Senate survey ends ${newestSenate ?? "never"}. Check original pollster release(s) before importing. ${trackerUrl}`);
  }
} catch (error) {
  notices.push(`Could not verify Texas Politics Project Senate tracker: ${error.message}. ${trackerUrl}`);
}
try {
  const latest = await fetchText(universityUrl);
  const match = latest.match(new RegExp(`(${months.join("|")})\\s+(2026)\\s+University of Texas\\/Texas Politics Project Poll`, "i"));
  if (!match) throw new Error("University latest-poll date label not found");
  const releaseMonth = String(months.findIndex((month) => month.toLowerCase() === match[1].toLowerCase()) + 1).padStart(2, "0");
  const latestMonth = `2026-${releaseMonth}`;
  checks.push(`University latest survey: ${latestMonth}; latest UT poll in KeepTXRed: ${newestUT?.slice(0, 7) ?? "none"}.`);
  if (active && (!newestUT || latestMonth > newestUT.slice(0, 7))) {
    notices.push(`A newer UT statewide survey may be missing: university ${latestMonth}, imported ${newestUT?.slice(0,7) ?? "none"}. Verify original toplines, population, and question wording. ${universityUrl}`);
  }
} catch (error) {
  notices.push(`Could not verify UT latest-poll date: ${error.message}. ${universityUrl}`);
}

// The university monitor alone missed releases from independent pollsters.
// Public indexes are discovery leads; source-checked original pollster records
// remain the requirement for publication, not copied index values.
for (const { raceId, label, url } of [
  { raceId: "race-2026-us-senate", label: "U.S. Senate", url: "https://pollresults.org/races/senate/texas/" },
  { raceId: "race-2026-governor", label: "Governor", url: "https://pollresults.org/races/governor/texas/" },
]) {
  const importedFieldEnd = maxDate(eligible.filter((poll) => poll.raceId === raceId));
  try {
    const indexText = await fetchText(url);
    const match = indexText.match(/Most recent poll\s+([A-Za-z]{3,9})\s+(\d{1,2}),\s*2026/i);
    if (!match) throw new Error("Latest-poll date missing or source format changed");
    const month = months.findIndex((value) => value.toLowerCase().startsWith(match[1].toLowerCase()));
    const day = Number(match[2]);
    if (month < 0 || day < 1 || day > 31) throw new Error("Invalid index date");
    const indexedDate = "2026-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
    checks.push(label + " index field end: " + indexedDate + "; KeepTXRed: " + (importedFieldEnd || "none") + ".");
    if (!importedFieldEnd || indexedDate > importedFieldEnd) {
      notices.push("Newer " + label + " polling indexed through " + indexedDate +
        " while KeepTXRed ends " + (importedFieldEnd || "none") +
        ". Check the original pollster release before importing. " + url);
    }
  } catch (error) {
    notices.push("Could not check multi-pollster " + label + " index: " + error.message + ". " + url);
  }
}

if (active && newestSenate) {
  const days = Math.floor((today.getTime() - Date.parse(`${newestSenate}T00:00:00Z`)) / 86_400_000);
  if (days > 21) notices.push(`Most recent imported Senate poll finished ${days} days ago; current survey coverage may be out of date.`);
}
const markdown = [
  "# Election Central polling source freshness",
  `Checked: ${today.toISOString()}`,
  `2026 pre-election monitoring active: ${active}`,
  "",
  ...checks.map((entry) => `- ${entry}`),
  "",
  notices.length ? "## Action needed" : "## All monitored freshness checks passed",
  ...notices.map((entry) => `- ${entry}`),
  "",
  "Source-monitored discovery does not auto-publish unverified numbers. Import only from original pollster releases with source, field dates, sample, population, methodology, and published toplines.",
].join("\n") + "\n";
await writeFile(reportFile, markdown);
console.log(markdown);
if (notices.length) process.exitCode = 1;
