const base = process.env.KTR_BASE_URL || "https://keeptxred.com";
const supabase = process.env.SUPABASE_URL || "https://ftkznprjljkhymknvhye.supabase.co";
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
const checks = [
  ["bills-page", base + "/texas-bills", false],
  ["bills-api", supabase + "/rest/v1/bills?select=id&limit=1", true],
  ["bills-filters", supabase + "/rest/v1/rpc/list_active_bill_filter_options", true],
];
let failures = 0;
for (const [name, url, api] of checks) {
  if (api && !key) {
    console.log(name + ": SKIPPED (SUPABASE_PUBLISHABLE_KEY not configured)");
    continue;
  }
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method: name === "bills-filters" ? "POST" : "GET",
      body: name === "bills-filters" ? "{}" : undefined,
      headers: api ? { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" } : {},
      signal: AbortSignal.timeout(10000),
    });
    const body = await response.text();
    let valid = response.ok && body.length > 2;
    if (api && valid) {
      try { JSON.parse(body); } catch { valid = false; }
    }
    console.log(JSON.stringify({ name, status: response.status, valid, durationMs: Date.now() - started }));
    if (!valid) failures++;
  } catch (error) {
    failures++;
    console.error(name + ": " + String(error));
  }
}
if (failures) process.exitCode = 1;
