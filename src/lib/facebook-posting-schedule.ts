import type { RecentFacebookPost } from "@/lib/facebook-editorial-selection";

const CENTRAL_TIME_ZONE = "America/Chicago";
const MAX_DAILY_FACEBOOK_POSTS = 5;
const MIN_GAP_MINUTES = 75;

const WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [7 * 60 + 15, 9 * 60 + 15],
  [10 * 60 + 15, 12 * 60 + 15],
  [13 * 60 + 15, 15 * 60 + 15],
  [16 * 60 + 15, 18 * 60 + 15],
  [19 * 60 + 15, 21 * 60 + 30],
];

type CentralClock = {
  dateKey: string;
  minutes: number;
};

export type FacebookPostingDecision = {
  shouldPost: boolean;
  reason: string;
  dateKey: string;
  postsToday: number;
  elapsedSlots: number;
  targets: number[];
  nextTargetMinute: number | null;
};

function hash32(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function centralClock(date: Date): CentralClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CENTRAL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

function centralDateKey(value: string): string | null {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return centralClock(new Date(timestamp)).dateKey;
}

export function facebookDailyTargetMinutes(dateKey: string, seed: string): number[] {
  return WINDOWS.map(([start, end], index) => {
    const span = Math.max(1, end - start + 1);
    return start + (hash32(`${seed}:${dateKey}:${index}`) % span);
  });
}

export function formatCentralMinute(minutes: number | null): string | null {
  if (minutes === null) return null;
  const hour24 = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix} CT`;
}

export function facebookPostingDecision(args: {
  now: Date;
  seed: string;
  recentPosts: RecentFacebookPost[];
  maxDailyPosts?: number;
  targetSlots?: number[];
}): FacebookPostingDecision {
  const clock = centralClock(args.now);
  const allTargets = facebookDailyTargetMinutes(clock.dateKey, args.seed);
  const targets = args.targetSlots?.length
    ? args.targetSlots
        .filter((slot) => Number.isInteger(slot) && slot >= 0 && slot < allTargets.length)
        .map((slot) => allTargets[slot])
    : allTargets;
  const maxDailyPosts = Math.max(1, args.maxDailyPosts ?? MAX_DAILY_FACEBOOK_POSTS);
  const todayPosts = args.recentPosts
    .filter((post) => Boolean(post.published_at) && centralDateKey(post.published_at as string) === clock.dateKey)
    .sort((a, b) => Date.parse(b.published_at as string) - Date.parse(a.published_at as string));

  const postsToday = todayPosts.length;
  const elapsedSlots = targets.filter((target) => target <= clock.minutes).length;
  const nextTargetMinute = targets.find((target) => target > clock.minutes) ?? null;

  if (postsToday >= maxDailyPosts) {
    return {
      shouldPost: false,
      reason: "Daily Facebook post cap reached",
      dateKey: clock.dateKey,
      postsToday,
      elapsedSlots,
      targets,
      nextTargetMinute,
    };
  }

  if (elapsedSlots <= postsToday) {
    return {
      shouldPost: false,
      reason: "Waiting for the next randomized Facebook window",
      dateKey: clock.dateKey,
      postsToday,
      elapsedSlots,
      targets,
      nextTargetMinute,
    };
  }

  const lastPublished = todayPosts[0]?.published_at ? Date.parse(todayPosts[0].published_at) : NaN;
  if (Number.isFinite(lastPublished)) {
    const gapMinutes = (args.now.getTime() - lastPublished) / 60_000;
    if (gapMinutes < MIN_GAP_MINUTES) {
      return {
        shouldPost: false,
        reason: `Last Facebook post was less than ${MIN_GAP_MINUTES} minutes ago`,
        dateKey: clock.dateKey,
        postsToday,
        elapsedSlots,
        targets,
        nextTargetMinute,
      };
    }
  }

  return {
    shouldPost: true,
    reason: "Randomized Facebook window is due",
    dateKey: clock.dateKey,
    postsToday,
    elapsedSlots,
    targets,
    nextTargetMinute,
  };
}
