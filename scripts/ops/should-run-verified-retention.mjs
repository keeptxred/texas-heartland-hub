/**
 * Safety gate for a secondary GitHub Actions archive trigger.
 *
 * GitHub's schedule timer may be delayed or omitted under load. When the
 * trusted hourly article-hero scheduled workflow finishes, this gate runs
 * a cold-archive job ONLY if no successful archive has completed in 90m.
 *
 * The sole source of privileged archive code is checkout of default/main.
 * No files, outputs, or arguments from the triggering workflow are consumed.
 * The underlying archive runner maintains single-concurrency, private
 * Storage SHA verification, parent/child row equality and publication
 * reference checks; this gate cannot bypass any of those protections.
 */
import { appendFileSync } from 'node:fs';

export const TRUSTED_REPO = 'keeptxred/texas-heartland-hub';
export const TRUSTED_EVENT = 'schedule';
export const RECOVERY_AFTER_MS = 90 * 60 * 1000;

export function decideVerifiedRetentionFallback({
  eventName, sourceEvent, sourceBranch, sourceRepository,
  latestSuccessAt, nowMs,
}) {
  if (!Number.isFinite(nowMs)) throw new Error('Invalid current clock');
  if (eventName !== 'workflow_run') {
    if (!['schedule', 'push', 'workflow_dispatch'].includes(eventName)) {
      throw new Error('Unapproved archive launch event');
    }
    return { run: true, reason: 'Existing authorized archive trigger' };
  }
  if (sourceEvent !== TRUSTED_EVENT ||
      sourceBranch !== 'main' ||
      sourceRepository !== TRUSTED_REPO) {
    throw new Error('Untrusted workflow_run source; refusing private archive credentials');
  }
  if (latestSuccessAt === null) {
    return { run: true, reason: 'No recent successful archive found' };
  }
  const timestamp = Date.parse(latestSuccessAt);
  if (!Number.isFinite(timestamp) || timestamp > nowMs + 120_000) {
    throw new Error('Invalid or future GitHub archive completion timestamp');
  }
  const ageMs = Math.max(0, nowMs - timestamp);
  if (ageMs < RECOVERY_AFTER_MS) {
    return { run: false, reason: 'Latest certified archive too recent', ageMinutes: Math.floor(ageMs/60_000) };
  }
  return { run: true, reason: 'GitHub archive schedule is past recovery threshold',
    ageMinutes: Math.floor(ageMs/60_000) };
}

async function latestSuccessfulArchive() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('Cannot verify recent successful GitHub archives without token');
  const uri = 'https://api.github.com/repos/' + TRUSTED_REPO +
    '/actions/workflows/retire-verified-supabase-cold-records.yml/runs?status=success&per_page=10';
  const response = await fetch(uri, {
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error('Cannot verify archival run history (GitHub HTTP ' + response.status + ')');
  }
  const data = await response.json();
  if (!Array.isArray(data?.workflow_runs)) throw new Error('Invalid GitHub archive run history');
  const recent = data.workflow_runs.find(x =>
    x.conclusion === 'success' &&
    x.head_repository?.full_name === TRUSTED_REPO &&
    x.head_branch === 'main');
  return recent ? (recent.updated_at || recent.run_started_at || recent.created_at) : null;
}

async function main() {
  if (process.env.GITHUB_REPOSITORY !== TRUSTED_REPO) {
    throw new Error('Unexpected repository; archive recovery refused');
  }
  const eventName = process.env.GITHUB_EVENT_NAME;
  const sourceEvent = process.env.WORKFLOW_RUN_SOURCE_EVENT;
  const sourceBranch = process.env.WORKFLOW_RUN_SOURCE_BRANCH;
  const sourceRepository = process.env.WORKFLOW_RUN_SOURCE_REPO;
  // Reject untrusted workflow_run provenance BEFORE accessing API or secrets.
  if (eventName === 'workflow_run' &&
      (sourceEvent !== TRUSTED_EVENT || sourceBranch !== 'main' ||
       sourceRepository !== TRUSTED_REPO)) {
    throw new Error('Untrusted workflow_run origin');
  }
  const latestSuccessAt = eventName === 'workflow_run'
    ? await latestSuccessfulArchive() : null;
  const decision = decideVerifiedRetentionFallback({
    eventName, sourceEvent, sourceBranch, sourceRepository,
    latestSuccessAt, nowMs: Date.now(),
  });
  console.log(JSON.stringify({runArchive:decision.run,reason:decision.reason,
    ageMinutes:decision.ageMinutes ?? null}));
  if (!process.env.GITHUB_OUTPUT) throw new Error('Missing GitHub Actions output path');
  appendFileSync(process.env.GITHUB_OUTPUT,
    'run_archive=' + String(decision.run) + '\n', {encoding:'utf8'});
}

if (process.argv[1]?.endsWith('should-run-verified-retention.mjs')) {
  await main();
}
