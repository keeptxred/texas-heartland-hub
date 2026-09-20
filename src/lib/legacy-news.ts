const LEGACY_NEWS_REDIRECTS: Record<string, string> = {
  "live-2026-07-19-voter-registration-countdown-begins-for-texas-2026-midterm-elections-yx9ejb":
    "/news/texas-voting-guide-2026",
  "live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng":
    "/news/2026-08-09-houston-flock-camera-backlash",
};

export function legacyNewsRedirect(slug: string): string | null {
  return LEGACY_NEWS_REDIRECTS[slug] ?? null;
}

export function isLegacyLiveNewsSlug(slug: string): boolean {
  return /^live-\d{4}-\d{2}-\d{2}-/.test(slug);
}
