import { describe, expect, it } from "vitest";
import { ALL_POLICY_TRACKERS } from "@/data/policy-trackers-all";

const MIN_WORDS = 700;
const MIN_PRIMARY_SOURCES = 3;
const MIN_KEY_FACTS = 4;
const MIN_CONTEXT_PARAGRAPHS = 2;
const MIN_WATCH_ITEMS = 4;
const MIN_QUICK_ANSWER_WORDS = 25;
const MIN_STATUS_WORDS = 30;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function trackerWordCount(tracker: (typeof ALL_POLICY_TRACKERS)[number]) {
  return [
    tracker.title,
    tracker.description,
    tracker.quickAnswer,
    tracker.currentStatus,
    ...tracker.keyFacts,
    ...tracker.context,
    ...tracker.watchFor,
  ].join(" ").trim().split(/\s+/).filter(Boolean).length;
}

describe("AdSense policy tracker readiness inventory", () => {
  it("keeps every sitemap-advertised policy tracker substantive and source-backed", () => {
    const violations = ALL_POLICY_TRACKERS.flatMap((tracker) => {
      const blockers: string[] = [];
      const count = trackerWordCount(tracker);
      const primarySources = tracker.sources.filter((source) => source.primary).length;
      if (count < MIN_WORDS) blockers.push(`words=${count}<${MIN_WORDS}`);
      if (primarySources < MIN_PRIMARY_SOURCES) blockers.push(`primarySources=${primarySources}<${MIN_PRIMARY_SOURCES}`);
      if (tracker.keyFacts.length < MIN_KEY_FACTS) blockers.push(`keyFacts=${tracker.keyFacts.length}<${MIN_KEY_FACTS}`);
      if (tracker.context.length < MIN_CONTEXT_PARAGRAPHS) blockers.push(`context=${tracker.context.length}<${MIN_CONTEXT_PARAGRAPHS}`);
      if (tracker.watchFor.length < MIN_WATCH_ITEMS) blockers.push(`watch=${tracker.watchFor.length}<${MIN_WATCH_ITEMS}`);
      if (words(tracker.quickAnswer) < MIN_QUICK_ANSWER_WORDS) blockers.push(`quickAnswer=${words(tracker.quickAnswer)}<${MIN_QUICK_ANSWER_WORDS}`);
      if (words(tracker.currentStatus) < MIN_STATUS_WORDS) blockers.push(`currentStatus=${words(tracker.currentStatus)}<${MIN_STATUS_WORDS}`);
      return blockers.length ? [`${tracker.slug}: ${blockers.join(", ")}`] : [];
    });

    expect(violations, violations.join("\n")).toEqual([]);
  });
});
