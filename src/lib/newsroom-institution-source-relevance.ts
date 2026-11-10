/**
 * A source-local university/research lead can be materially Texan even when
 * its title says only "UTEP" or "TLU". The general relevance scorer has no
 * reliable abbreviated-institution map. This is NOT a publisher-reputation or
 * article-publication bypass: match exact first-party origins + dated article
 * permalink shapes only; independent authority and fact gates still apply.
 */
const TEXAS_INSTITUTION_ORIGINALS: Record<string, { host: string; articlePath: RegExp }> = {
  "UTEP — Official University News": {
    host: "www.utep.edu",
    articlePath: /^\/newsfeed\/20\d{2}\/[a-z]+\/[a-z0-9-]+\.html$/i,
  },
  "Texas Lutheran Football — Official Athletics": {
    host: "tlubulldogs.com",
    articlePath: /^\/news\/20\d{2}\/\d{1,2}\/\d{1,2}\/football-[a-z0-9-]+\.aspx$/i,
  },
};

export function isVerifiedTexasInstitutionalDiscovery(sourceName: string, rawArticleUrl: string): boolean {
  const expected = TEXAS_INSTITUTION_ORIGINALS[sourceName];
  if (!expected) return false;
  try {
    const parsed = new URL(rawArticleUrl);
    return parsed.protocol === "https:"
      && parsed.hostname.toLowerCase() === expected.host
      && expected.articlePath.test(parsed.pathname);
  } catch {
    return false;
  }
}
