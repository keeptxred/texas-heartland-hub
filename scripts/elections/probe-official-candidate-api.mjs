import { writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const SOURCE_URL =
  process.env.ELECTION_CANDIDATE_LIST_URL ??
  "https://goelect.txelections.civixapps.com/ivis-cbp-ui/candidate-information";
const OUTPUT = process.env.ELECTION_CANDIDATE_API_OUTPUT ?? "/tmp/official-candidate-api-payload.json";
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

  const frame = page.frames().find((candidate) =>
    candidate.locator('mat-select[formcontrolname="electionYear"]').count(),
  );
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
  await writeFile(
    OUTPUT,
    `${JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        request: {
          url: request.url(),
          method: request.method(),
          headers: redactHeaders(request.headers()),
          postData: request.postDataJSON?.() ?? request.postData(),
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
  console.log(`Captured official candidate API request and response to ${OUTPUT}.`);
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
