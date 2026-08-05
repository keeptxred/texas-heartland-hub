#!/usr/bin/env node
import { spawn } from 'node:child_process';

const forwardedArgs = process.argv.slice(2);
const skipRelationships = forwardedArgs.includes('--skip-relationships');
const childArgs = forwardedArgs.filter((arg) => arg !== '--skip-relationships');

function run(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) reject(new Error(`${script} terminated by ${signal}`));
      else if (code === 0) resolve();
      else reject(new Error(`${script} exited with code ${code}`));
    });
  });
}

await run('scripts/legislature/sync-texas-legislation.mjs', childArgs);
await run('scripts/legislature/sync-bill-subjects.mjs', childArgs);
if (!skipRelationships) {
  await run('scripts/legislature/link-bill-relationships.mjs', childArgs);
}
