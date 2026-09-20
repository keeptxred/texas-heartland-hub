import { expect, test } from 'vitest';
import fs from 'node:fs';

const precision = fs.readFileSync('supabase/migrations/20260827213500_refine_news_site_routing_precision.sql', 'utf8');
const followup = fs.readFileSync('supabase/migrations/20260827214200_refine_election_and_food_routing.sql', 'utf8');

test('section routing uses headline-specific election signals', () => {
  expect(precision).toContain('title_text');
  expect(followup).toContain('is_election := title_text');
  expect(followup).not.toContain("is_election := title_text ~ '(election|vot(e|er|ing)");
});

test('known food vocabulary routes lifestyle stories to Food & Drink', () => {
  for (const term of ['hteao', 'pizza', 'cuisine', 'tea shop']) {
    expect(followup).toContain(term);
  }
  expect(followup).toContain("'Food & Drink'");
});

test('economic incentives are treated as material business news', () => {
  expect(precision).toContain('economic incentives?');
  expect(precision).toContain("'Business'");
});
