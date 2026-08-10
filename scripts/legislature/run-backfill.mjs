#!/usr/bin/env node
import { spawn } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=') || true];
}));
const session = String(args.session || args.sessions || process.env.TLO_SESSIONS || '89R').split(',')[0].trim();
const maxPasses = Math.max(1, Number(args.passes || process.env.TLO_BACKFILL_PASSES || 6));
const subjectMaxSeconds = Math.max(60, Number(args['subject-max-seconds'] || process.env.TLO_SUBJECT_MAX_SECONDS || 600));
const subjectLimit = Math.max(0, Number(args['subject-limit'] || process.env.TLO_SUBJECT_LIMIT || 0));

function run(script, childArgs = [], capture = false) {
  return new Promise((resolve, reject) => {
    const stdout = [];
    const child = spawn(process.execPath, [script, ...childArgs], {
      env: process.env,
      stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    });
    if (capture) child.stdout.on('data', (chunk) => stdout.push(chunk));
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) reject(new Error(`${script} terminated by ${signal}`));
      else if (code === 0) resolve(capture ? Buffer.concat(stdout).toString('utf8') : '');
      else reject(new Error(`${script} exited with code ${code}`));
    });
  });
}

async function status() {
  const output = await run(
    'scripts/legislature/report-backfill-status.mjs',
    [`--session=${session}`],
    true,
  );
  const start = output.indexOf('{');
  if (start < 0) throw new Error('Backfill status did not return JSON.');
  return JSON.parse(output.slice(start));
}

let report = await status();
console.log(JSON.stringify({ stage: 'before', ...report }, null, 2));

for (let pass = 1; pass <= maxPasses && !report.subjectBackfillComplete; pass += 1) {
  const subjectArgs = [
    `--sessions=${session}`,
    `--subject-max-seconds=${subjectMaxSeconds}`,
  ];
  if (subjectLimit) subjectArgs.push(`--subject-limit=${subjectLimit}`);

  console.log(`Starting official subject backfill pass ${pass}/${maxPasses}.`);
  await run('scripts/legislature/sync-bill-subjects.mjs', subjectArgs);
  report = await status();
  console.log(JSON.stringify({ stage: `subject-pass-${pass}`, ...report }, null, 2));
}

console.log('Refreshing approved bill/article relationships and authority edges.');
await run('scripts/legislature/link-bill-relationships.mjs');
report = await status();
console.log(JSON.stringify({ stage: 'final', ...report }, null, 2));

if (!report.subjectBackfillComplete) {
  console.error(
    `Subject backfill remains incomplete after ${maxPasses} passes: ` +
    `${report.pendingSubjectRecords} official records remain.`,
  );
  process.exitCode = 2;
}
