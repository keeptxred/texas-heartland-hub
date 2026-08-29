import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync(new URL('../../.github/workflows/live-newsroom-smoke.yml', import.meta.url), 'utf8');
const shim = readFileSync(new URL('./worker-origin-canonical-fetch.mjs', import.meta.url), 'utf8');
const start = readFileSync(new URL('../../src/start.ts', import.meta.url), 'utf8');

describe('newsroom Worker-origin canonical transport', () => {
  it('keeps the smoke workflow on the deployed Worker while presenting the canonical host', () => {
    expect(workflow).toContain('AUTOMATION_ORIGIN: https://keeptxred-site.freddy-coppola.workers.dev');
    expect(workflow).toContain("-H 'X-Forwarded-Host: keeptxred.com'");
    expect(workflow).toContain('node --import ./scripts/news/worker-origin-canonical-fetch.mjs scripts/news/smoke-live-newsroom.mjs');
  });

  it('injects the forwarded host only for the exact KeepTXRed Worker hostname', () => {
    expect(shim).toContain("const WORKER_HOST = 'keeptxred-site.freddy-coppola.workers.dev'");
    expect(shim).toContain("const CANONICAL_HOST = 'keeptxred.com'");
    expect(shim).toContain('if (url.hostname !== WORKER_HOST) return originalFetch(input, init)');
    expect(shim).toContain("headers.set('x-forwarded-host', CANONICAL_HOST)");
  });

  it('does not broaden the server canonical-host exemptions', () => {
    expect(start).toContain('const CANONICAL_ORIGIN = "https://keeptxred.com"');
    expect(start).toContain('const DIRECT_WORKER_HOST = "keeptxred-site.freddy-coppola.workers.dev"');
    expect(start).not.toContain('DIRECT_WORKER_MACHINE_PATHS');
  });
});
