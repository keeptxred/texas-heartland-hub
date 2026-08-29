import { expect, test } from 'vitest';
import fs from 'node:fs';

const probe = fs.readFileSync('supabase/functions/ktr-rotating-source-probe/index.ts', 'utf8');

test('rotating source probe is relay-only and capture-compatible', () => {
  expect(probe).toContain('const RELAY_BASE = "https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay"');
  expect(probe).toContain('const MAX_FEEDS = 12');
  expect(probe).toContain('sourceCount: keys.length');
  expect(probe).toContain('diag,');
  expect(probe).toContain('unknown feed key');
  expect(probe).not.toContain('searchParams.get("url")');
});

test('probe covers every configured rotating Google source family used for health recovery', () => {
  for (const key of [
    'google-region-south-texas',
    'google-airports-travel',
    'google-dps-wanted',
    'google-higher-education',
    'google-police-fire',
    'google-primary-workforce',
    'google-pro-sports',
    'google-primary-txdot',
  ]) {
    expect(probe).toContain(`"${key}"`);
  }
});
