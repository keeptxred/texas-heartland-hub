import { writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const SOURCE_URL =
  process.env.ELECTION_CANDIDATE_LIST_URL ??
  "https://goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information";
const OUTPUT = process.env.ELECTION_CANDIDATE_API_OUTPUT ?? "/tmp/official-candidate-api-payload.json";
const SUMMARY_OUTPUT =
  process.env.ELECTION_CANDIDATE_API_SUMMARY_OUTPUT ??
  "src/data/elections/2026/candidate-api-schema.json";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "en-US",
  timezoneId: "America/Chicago",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36",
});
const page = await context.newPage();

try {
  await page.goto(SOURCE_URL, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(8_000);

  let frame = null;
  for (const candidate of page.frames()) {
    if (await candidate.locator('mat-select[formcontrolname="electionYear"]').count()) {
      frame = candidate;
      break;
    }
  }
  if (!frame) throw new Error("Candidate portal election controls were not found.");

  await selectMatOption(frame, 'mat-select[formcontrolname="electionYear"]', /^2026$/i);
  await waitForEnabled(frame.locator('mat-select[formcontrolname="electionId"]').first());
  await selectMatOption(
    frame,
    'mat-select[formcontrolname="electionId"]',
    /(?:2026.*general|general.*2026|nov(?:ember)?\s*3.*2026)/i,
  );

  const responsePromise = page.waitForResponse(
    (response) => /\/findQualifiedCandidates(?:\?|$)/i.test(response.url()),
    { timeout: 120_000 },
  );
  const button = frame.getByRole("button", { name: /qualified candidates information/i }).first();
  await waitForButtonEnabled(button);
  await button.click({ timeout: 10_000 });

  const response = await responsePromise;
  const request = response.request();
  const payload = await response.json();
  const requestBody = request.postDataJSON?.() ?? request.postData();
  const capturedAt = new Date().toISOString();

  await writeFile(
    OUTPUT,
    `${JSON.stringify(
      {
        capturedAt,
        request: {
          url: request.url(),
          method: request.method(),
          headers: redactHeaders(request.headers()),
          postData: requestBody,
        },
        response: {
          status: response.status(),
          headers: response.headers(),
          payload,
        },
      },
      null,
      2,
    )}\n`,
  );

  await writeFile(
    SUMMARY_OUTPUT,
    `${JSON.stringify(
      {
        capturedAt,
        conclusion: "success",
        sourceUrl: SOURCE_URL,
        endpoint: request.url(),
        method: request.method(),
        responseStatus: response.status(),
        requestSchema: describeSchema(requestBody),
        responseSchema: describeSchema(payload),
      },
      null,
      2,
    )}\n`,
  );
  console.log(`Captured official candidate API response and safe schema summary.`);
} catch (error) {
  await writeFile(
    SUMMARY_OUTPUT,
    `${JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        conclusion: "failure",
        sourceUrl: SOURCE_URL,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    )}\n`,
  );
  throw error;
} finally {
  await browser.close();
}

async function selectMatOption(frame, selector, pattern) {
  const control = frame.locator(selector).first();
  await waitForEnabled(control);
  await control.click({ timeout: 10_000 });
  const options = frame.locator('mat-option, [role="option"]');
  await options.first().waitFor({ state: "visible", timeout: 10_000 });
  const texts = await options.allTextContents();
  const index = texts.findIndex((text) => pattern.test(clean(text)));
  if (index < 0) throw new Error(`No matching option found. Options: ${texts.map(clean).join(" | ")}`);
  await options.nth(index).click({ timeout: 10_000 });
  await frame.waitForTimeout(1_500);
}

async function waitForEnabled(locator, timeoutMs = 20_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if ((await locator.count()) && (await locator.getAttribute("aria-disabled")) !== "true") return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("A required candidate portal control remained disabled.");
}

async function waitForButtonEnabled(button, timeoutMs = 20_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await button.isEnabled()) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error("The candidate portal search button remained disabled.");
}

function describeSchema(value, depth = 0, seen = new WeakSet()) {
  if (value == null) return { type: "null" };
  if (Array.isArray(value)) {
    const types = [...new Set(value.slice(0, 25).map(typeName))];
    return {
      type: "array",
      length: value.length,
      itemTypes: types,
      itemSchema:
        depth < 7 && value.length
          ? mergeSchemas(value.slice(0, 25).map((item) => describeSchema(item, depth + 1, seen)))
          : null,
    };
  }
  if (typeof value !== "object") return { type: typeof value };
  if (seen.has(value)) return { type: "object", circular: true };
  seen.add(value);
  const properties = {};
  if (depth < 7) {
    for (const [key, child] of Object.entries(value)) {
      properties[key] = describeSchema(child, depth + 1, seen);
    }
  }
  return { type: "object", properties };
}

function mergeSchemas(schemas) {
  const meaningful = schemas.filter(Boolean);
  if (!meaningful.length) return null;
  const types = [...new Set(meaningful.map((schema) => schema.type))];
  if (types.length !== 1) return { types };
  if (types[0] !== "object") return meaningful[0];
  const keys = [...new Set(meaningful.flatMap((schema) => Object.keys(schema.properties ?? {})))];
  return {
    type: "object",
    properties: Object.fromEntries(
      keys.map((key) => [
        key,
        mergeSchemas(meaningful.map((schema) => schema.properties?.[key]).filter(Boolean)),
      ]),
    ),
  };
}

function typeName(value) {
  if (value == null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function redactHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      /authorization|cookie|token|secret/i.test(key) ? "[redacted]" : value,
    ]),
  );
}

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}
