#!/usr/bin/env node
import { spawn } from 'node:child_process';

const forwardedArgs = process.argv.slice(2);

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

await run('scripts/legislature/sync-texas-legislation.mjs', forwardedArgs);
await run('scripts/legislature/sync-bill-subjects.mjs', forwardedArgs);
