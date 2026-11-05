const LEGACY_NEWS_REDIRECTS: Record<string, string> = {
  "live-2026-07-19-voter-registration-countdown-begins-for-texas-2026-midterm-elections-yx9ejb":
    "/news/texas-voting-guide-2026",
};

export function legacyNewsRedirect(slug: string): string | null {
  return LEGACY_NEWS_REDIRECTS[slug] ?? null;
}

export function isLegacyLiveNewsSlug(slug: string): boolean {
  return /^live-\d{4}-\d{2}-\d{2}-/.test(slug);
}
