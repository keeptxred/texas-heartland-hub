# Keep TX Red Pillar Library Gap Report

**Baseline date:** 2026-08-09  
**Source:** production `daily_articles`, classified with the same deterministic nine-pillar taxonomy used by the pillar-aware pipeline.  
**Eligible production articles scanned:** 951  
**TexasDefined-source rows excluded:** 0  
**General Texas News / unmatched:** 167

This report was generated only after correcting a historical-classification defect in which full article-body boilerplate could over-trigger high-priority keywords. The classifier now uses headline/dek first and only the first 1,200 characters of an ambiguous article lead, with the earliest lead topic signal winning.

| Pillar | Live articles | Live evergreen / guide-like | Last 30d | Latest | Added / reused in PR #236 | Post-merge assessment | Next action |
|---|---:|---:|---:|---|---|---|---|
| Politics & Government | 71 | 20 | 17 | 2026-08-09 | Existing architecture reused | Strong | Maintain cadence; refresh top performers |
| Elections | 313 | 24 | 44 | 2026-08-08 | Election Central reused | Strong | Maintain cadence and election-cycle freshness |
| Border & Immigration | 71 | 4 | 14 | 2026-08-09 | **4 new supporting guides added after gap scan** | Stronger evergreen depth after merge | Deploy, internally link new guides, then measure before adding more |
| Energy & Oil | 34 | 9 | 10 | 2026-08-09 | Hub plus established flagship material | Strong | Maintain cadence; refresh ERCOT/oil-and-gas explainers |
| Economy & Small Business | 96 | 22 | 22 | 2026-08-09 | Existing economy architecture reused | Strong | Maintain cadence and refresh search winners |
| Agriculture & Rural Texas | 29 | 10 | 12 | 2026-08-09 | 1 cornerstone + 7 supporting guides | Strong after merge | Do not add more yet; deploy and measure the new cluster |
| Veterans & Military | 19 | 9 | 3 | 2026-08-09 | 1 cornerstone + 7 supporting guides | Adequate after merge | Do not duplicate guides; improve fresh-news cadence after deployment |
| Law Enforcement & Public Safety | 123 | 16 | 35 | 2026-08-09 | 1 cornerstone + 7 supporting guides | Strong after merge | Maintain cadence and use new evergreen cluster as internal-link targets |
| Laws & Legislature | 29 | 18 | 4 | 2026-08-09 | Existing Laws/Legislature architecture reused | Strong evergreen depth | Maintain; one additional article will meet the 30-article depth target |

## Search-performance limitation

The production `daily_articles` archive currently reports zero stored Google Search Console impressions and clicks across the classified pillar rows. Until GSC metrics are populated into those fields, pillar prioritization should be based on library depth, evergreen depth, publishing cadence, and freshness rather than search-performance deltas.

## Classification quality notes

The corrected classifier leaves 167 articles in General Texas News rather than forcing them into an unrelated pillar. Sample unmatched material includes general Texas events, education, sports, retail openings, weather/flood accountability, and national political stories without a clear Texas-pillar fit. That is expected behavior.

A legacy metadata pattern remains in Veterans & Military: 18 of 19 classified veteran/military articles carry the broad old `Legislature` category. Their pillar assignment is coming from headline/dek/lead text rather than that legacy label. The broad category should not be treated as the authoritative pillar.

## Gap remediation completed in PR #236

The live scan identified **Border & Immigration** as the only meaningful evergreen-depth deficit after accounting for the Agriculture, Veterans, and Law Enforcement clusters already built in the branch. Four non-duplicative Border guides were therefore added:

- **Texas Border Security Funding: What the State Pays For and Who Controls It**
- **Texas National Guard at the Border: Authority, Missions and Limits**
- **Texas Border Court Fights: A Guide to the Lawsuits, Injunctions and Appeals**
- **Texas Ports of Entry and Border Trade: How People and Goods Move Through the System**

These guides complement the existing Operation Lone Star, state-vs-federal-role, border geography, and laws context rather than repeating it. They are registered in the shared guide registry, surfaced on the Border hub, and included automatically in the page sitemap through `SUPPORTING_GUIDE_SLUGS`.

## Next editorial priority after deployment

Do **not** manufacture additional evergreen pages immediately. Deploy the corrected classifier and new guide clusters, allow the historical relationship backfill to populate, and then use the Pillar Authority dashboard to identify the next real deficit. The one clear non-content issue uncovered by this scan is that stored GSC metrics are currently empty, so search-performance ingestion should be verified before using CTR or ranking movement to prioritize future pillar work.
