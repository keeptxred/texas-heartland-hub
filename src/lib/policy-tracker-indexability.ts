import type { PolicyTracker } from "@/data/policy-trackers";

export const MIN_POLICY_TRACKER_WORDS = 700;

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function policyTrackerWordCount(tracker: PolicyTracker) {
  return words([tracker.title, tracker.description, tracker.quickAnswer, tracker.currentStatus, ...tracker.keyFacts, ...tracker.context, ...tracker.watchFor].join(" "));
}

export function isPolicyTrackerIndexable(tracker: PolicyTracker | null | undefined): tracker is PolicyTracker {
  return Boolean(tracker)
    && policyTrackerWordCount(tracker!) >= MIN_POLICY_TRACKER_WORDS
    && tracker!.sources.filter((source) => source.primary).length >= 3
    && tracker!.keyFacts.length >= 4
    && tracker!.context.length >= 2
    && tracker!.watchFor.length >= 4
    && words(tracker!.quickAnswer) >= 25
    && words(tracker!.currentStatus) >= 30;
}
