# KeepTXRed historical news: freshness and URL disposition

**Editorial decision:** October 14, 2026 · Applies to KeepTXRed (not TexasDefined)

## What changed

Historically published `/news/live-*` addresses were rediscovered in July Google Search Console data after the original database records were lost. The existence of a legacy URL is **not** evidence that an original, substantial article survived or that its topic is still newsworthy. The original bodies cannot be recovered from the existing archive.

A verified October 14 audit found 46 unserved, unredirected historical `live-*` URLs, all with **zero clicks** during the July GSC recovery window. This batch was resolved into:

- **32 intentionally retired from KeepTXRed recovery:** old lifestyle, culture, sport, entertainment, non-material or ambiguous event headlines. These are `article_url_registry.recovery_status='retired_low_value'` with explicit reasons. They are not silently dropped from the historical ledger, rewritten as politics, sent to Facebook, or redirected to loosely similar pages. TexasDefined may cover the underlying *topic* as a **new** original guide if worthwhile, but these lost articles are not automatically transferred.
- **14 held as possible current public-affairs leads:** government oversight, elections, public safety, infrastructure, education/workforce, and economic policy. They remain `pending` with `EDITORIAL_TRIAGE_2026_10_14` annotations. This is a **research queue**, not a mandate to publish or restore their June/July headline. Some claims or political race framing may be inaccurate and require independent verification before any use.

The SQL migration `20261014215500_historical_news_editorial_triage.sql` is exact-slug scoped. It does not delete articles, create redirects, reset publication dates, or classify newly discovered future URLs. A later source record or legal obligation can justify manually revisiting an editorial retirement.

## Current-news policy (enforced in application code)

1. **Latest coverage** and current-news cards include only articles first published in the preceding **7 days**, with a one-hour future-time clock tolerance. They exclude historical restorations even if their date were changed. Archived original coverage remains reachable at its original URL and in archive/author views where supported.
2. **Automatic Facebook posting** is limited to stories dated within **5 days** and rejects `legacy_url_restored` / historical archive flags. Manual contextual sharing is a distinct editorial decision. The engine must not fill quotas by recycling old news.
3. **New news demands a new material development:** a verified order, vote, filing, government dataset, measured project milestone, legal outcome, or major public-safety update, with a clear **event date**, primary source and consequences. A months-old press release alone is insufficient.
4. **No false freshness:** do not change `published_at` on a June/July article merely because its metadata, sourcing, image, or context was improved. Disclose the reconstruction date and retain the historic event date; publish an actual October development as a separately dated new article.
5. **No keyword-only redirects:** redirect only where independently proven to be the **same event**, with a credible surviving canonical article. Do not redirect retired lifestyle pages to unrelated generic feeds to make 404s disappear.
6. **No unverifiable claims:** headlines from broken links are untrusted leads, not facts, especially candidate/district claims, criminal accusations or contested enforcement incidents. Use official records and corroborated reporting before approving a new article.
7. **Do not mark media ready without real visual matching.** No generic substitute image is proof of the actual story.

## Priority among 14 held leads

**Priority A — official-source verification and current consequences**
- Hill Country flood **legislative oversight**: obtain the actual inquiry and resulting recommendations/implementation
- Texas semiconductor innovation **grant**: recipient, contractual obligations and fresh economic milestones
- Federal/Houston officer-involved shooting and related **Mexico legal action**: identify official investigation or court filings; do not combine separate incidents
- **Election and voter-record allegations**: verify candidate/district/race details and primary government records before making any claim

**Priority B — publish only if a new development exists**
- Immigration enforcement or birthright-citizenship **court actions**
- Community colleges/workforce **funding and enrollment outcomes**
- Fort Worth lobbying **disclosures, records and official actions**
- Austin robotics **investment, actual operations or hiring**
- Texas film association **agreement/incentive terms**
- State–federal relations/job-training **specific policy actions**
- Convicted con artist/interview claim: public court records and genuinely new public-interest consequence

These priority rankings are investigative filters; none is preapproved for publication.

## Verification

- Database ledger: `article_url_registry` stores origin, GSC metrics, disposition, retired reason and the triage marker.
- Article immutability and deletion archiving remain intact; private daily article/URL snapshots continue.
- CI tests for `isCurrentNewsCandidate`, Facebook ranking and date/legacy-story quarantine must pass before deployment.
- A green PR **is not** a live deployment. Confirm Cloudflare deploy and actual public latest-news/social behavior before considering the gate operational.

This policy prioritizes current, source-verified Texas public-affairs reporting over artificial expansion of old news URLs.
