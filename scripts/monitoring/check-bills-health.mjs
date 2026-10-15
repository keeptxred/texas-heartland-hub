const base = process.env.KTR_BASE_URL || "https://keeptxred.com";
const supabase = process.env.SUPABASE_URL || "https://ftkznprjljkhymknvhye.supabase.co";
const key = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_J6-Lke5yaaGA5N5agMsltQ_rCG2MVYo";
const checks = [
  ["bills-page", base + "/texas-bills", false],
  ["bills-api", supabase + "/rest/v1/bills?select=id&limit=1", true],
  ["bills-filters", supabase + "/rest/v1/rpc/list_active_bill_filter_options", true],
];
let failures = 0;
const failedChecks = [];
const injectedFailure = process.env.BILLS_MONITOR_TEST_FAILURE;
for (const [name, url, api] of checks) {
  const started = Date.now();
  if (injectedFailure === name) {
    failures++;
    failedChecks.push(name);
    console.error(name + ": simulated HTTP 500 (test only)");
    continue;
  }
  if (injectedFailure === name + ":timeout") {
    failures++;
    failedChecks.push(name);
    console.error(name + ": simulated timeout (test only)");
    continue;
  }
  try {
    const response = await fetch(url, {
      method: name === "bills-filters" ? "POST" : "GET",
      body: name === "bills-filters" ? "{}" : undefined,
      headers: api ? { apikey: key, "Content-Type": "application/json" } : {},
      signal: AbortSignal.timeout(10000),
    });
    const body = await response.text();
    let valid = response.ok && body.length > 2;
    if (api && valid) {
      try { JSON.parse(body); } catch { valid = false; }
    }
    console.log(JSON.stringify({ name, status: response.status, valid, durationMs: Date.now() - started }));
    if (!valid) { failures++; failedChecks.push(name); }
  } catch (error) {
    failures++;
    failedChecks.push(name);
    console.error(name + ": " + String(error));
  }
}
if (process.env.GITHUB_OUTPUT) {
  const fs = await import("node:fs");
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `healthy=${failures === 0}\nfailed_checks=${failedChecks.join(",")}\n`);
}
if (failures) process.exitCode = 1;
