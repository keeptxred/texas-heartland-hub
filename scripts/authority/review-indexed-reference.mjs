import { readFile, mkdir, writeFile } from "node:fs/promises";
const { records } = JSON.parse(await readFile(new URL("./indexed-reference-review.json", import.meta.url), "utf8"));
const now = new Date();
const origin = "https://keeptxred.com";
const allowed = new Set(["www.votetexas.gov", "www.sos.state.tx.us", "capitol.texas.gov", "statutes.capitol.texas.gov", "lbb.texas.gov", "www.lrl.texas.gov"]);
const urls = new Set();
const paths = new Set();
for (const row of records) {
  if (!/^\/[a-z0-9/-]+$/.test(row.path) || paths.has(row.path) || ![30, 60, 90, 180, 365].includes(row.reviewDays)) throw Error("Invalid or duplicate review record: " + row.path);
  paths.add(row.path);
  if (row.reviewed !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(row.reviewed) || !Number.isFinite(Date.parse(row.reviewed)) || Date.parse(row.reviewed) > now.getTime())) throw Error("Invalid review date: " + row.path);
  if (!row.sources.length) throw Error("No source references: " + row.path);
  for (const url of row.sources) {
    const u = new URL(url);
    if (u.protocol !== "https:" || !allowed.has(u.hostname)) throw Error("Unexpected source host: " + u.hostname);
    urls.add(url);
  }
}
if (process.argv.includes("--validate")) {
  console.log("Review inventory validated: " + records.length + " destinations");
  process.exit(0);
}
const results = new Map();
async function probe(url) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "KTR-Reference-Source-Review/1.0" } });
      const final = new URL(response.url);
      const body = await response.text();
      const valid = response.ok && final.protocol === "https:" && body.trim().length > 100 && !/just a moment|access denied|attention required/i.test(body.slice(0, 1000));
      const result = { url, final: response.url, status: response.status, valid };
      if (valid || attempt === 1) return result;
      last = result;
    } catch (error) { last = { url, valid: false, error: String(error) }; }
  }
  return last;
}
const queue = [...urls];
while (queue.length) {
  const batch = queue.splice(0, 3);
  await Promise.all(batch.map(async url => results.set(url, await probe(url))));
}
const items = records.map(row => {
  const dueAt = row.reviewed ? new Date(Date.parse(row.reviewed) + row.reviewDays * 86400000).toISOString().slice(0,10) : null;
  return { ...row, dueAt, overdue: !dueAt || now.toISOString().slice(0,10) >= dueAt, sourceFailures: row.sources.filter(url => !results.get(url)?.valid) };
});
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/indexed-reference-review.json", JSON.stringify({ checkedAt: now.toISOString(), items, sourceResults: [...results.values()] }, null, 2) + "\n");
const actionable = items.filter(row => row.overdue || row.sourceFailures.length);
const summary = ["## Civic and legislative authority source review", "", "Network availability does not establish factual accuracy or update editorial review dates.", "", ...actionable.map(row => "- " + origin + row.path + ": " + [row.overdue ? "editorial review due" : "", row.sourceFailures.length ? row.sourceFailures.length + " source checks need investigation" : ""].filter(Boolean).join("; "))].join("\n");
await writeFile("artifacts/indexed-reference-review.md", summary + "\n");
console.log(summary);
if (process.env.GITHUB_OUTPUT) await writeFile(process.env.GITHUB_OUTPUT, "actionable=" + actionable.length + "\n", { flag: "a" });
