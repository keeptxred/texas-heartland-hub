import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const MANIFEST_PATH = new URL("../../src/data/google-job-posting-urls.json", import.meta.url);
const ALLOWED_ORIGIN = "https://keeptxred.com";
const ALLOWED_TYPES = new Set(["URL_UPDATED", "URL_DELETED"]);
const MAX_URLS = 200;

function parseArguments(argv) {
  const args = [...argv];
  const dryRunIndex = args.indexOf("--dry-run");
  const dryRun = dryRunIndex !== -1;

  if (dryRun) args.splice(dryRunIndex, 1);

  const [type = "URL_UPDATED"] = args;
  if (!ALLOWED_TYPES.has(type)) {
    throw new Error(`Unsupported notification type: ${type}`);
  }

  return { type, dryRun };
}

function validateManifest(manifest) {
  if (
    manifest.siteUrl !== ALLOWED_ORIGIN ||
    manifest.type !== "JobPosting" ||
    manifest.maxUrls !== MAX_URLS ||
    !Array.isArray(manifest.urls)
  ) {
    throw new Error("Invalid JobPosting URL manifest");
  }
  if (manifest.urls.length > MAX_URLS) {
    throw new Error(`The manifest cannot exceed ${MAX_URLS} URLs`);
  }

  const uniqueUrls = [...new Set(manifest.urls)];
  if (uniqueUrls.length !== manifest.urls.length) {
    throw new Error("The manifest contains duplicate URLs");
  }

  return uniqueUrls.map((url) => {
    const parsed = new URL(url);
    if (parsed.origin !== ALLOWED_ORIGIN || parsed.username || parsed.password || parsed.hash) {
      throw new Error(`Invalid KeepTXRed JobPosting URL: ${url}`);
    }
    return parsed.href;
  });
}

function runSubmission(url, type, dryRun) {
  const args = ["scripts/seo/submit-google-job-url.mjs", url, type];
  if (dryRun) args.push("--dry-run");

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: "inherit",
      env: process.env,
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Submission failed for ${url}`));
    });
  });
}

const options = parseArguments(process.argv.slice(2));
const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
const urls = validateManifest(manifest);

if (urls.length === 0) {
  console.log(
    JSON.stringify({
      submitted: 0,
      message: "No JobPosting URLs are configured in the manifest",
    }),
  );
  process.exit(0);
}

for (const url of urls) {
  await runSubmission(url, options.type, options.dryRun);

  if (!options.dryRun) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

console.log(
  JSON.stringify({
    submitted: options.dryRun ? 0 : urls.length,
    dryRunValidated: options.dryRun ? urls.length : 0,
    type: options.type,
  }),
);
