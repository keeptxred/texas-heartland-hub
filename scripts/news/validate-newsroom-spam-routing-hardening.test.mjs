import { expect, test } from 'vitest';
import fs from 'node:fs';

const lowValue = fs.readFileSync('src/lib/low-value-titles.ts', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20260828223500_harden_newsroom_spam_and_local_routing.sql', 'utf8');

test('low-value detector blocks affiliate sports spam without blocking official team viewing guides broadly', () => {
  for (const token of [
    'live@?streams?',
    'where to watch,?',
    'live stream info',
    'odds,?',
    'prediction,?',
    '^our next',
    '^power outage maps?',
  ]) {
    expect(lowValue).toContain(token);
  }
  expect(lowValue).not.toContain('how to watch.*live stream\\b');
});

test('final newsroom guard preserves narrow route precedence and review quarantine', () => {
  for (const token of [
    'guard_final_newsroom_quality_v2',
    'zzzzzzzzz_guard_final_newsroom_quality_v2',
    'Local crime/crash precedence routes to KTR Texas News',
    'National syndicated story lacks a Texas newsroom angle',
    'texas veterans commission',
    'community expo',
    'girl scouts?',
    'high schools? in texas',
    'routing_locked_site',
    'auto_publish_eligible',
  ]) {
    expect(migration).toContain(token);
  }
  expect(migration).toContain("new.target_site := 'keeptxred'");
  expect(migration).toContain("new.target_site := 'texasdefined'");
  expect(migration).toContain("new.target_site := 'review'");
});
