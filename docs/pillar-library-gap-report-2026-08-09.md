# Keep TX Red Pillar Library Gap Report

**Baseline date:** 2026-08-09  
**Source:** production `daily_articles`, classified with the same deterministic nine-pillar taxonomy used by the pillar-aware pipeline.  
**Eligible production articles scanned:** 951  
**TexasDefined-source rows excluded:** 0  
**General Texas News / unmatched:** 167

This report was generated only after correcting a historical-classification defect in which full article-body boilerplate could over-trigger high-priority keywords. The classifier now uses headline/dek first and only the first 1,200 characters of an ambiguous article lead, with the earliest lead topic signal winning.

| Pillar | Live articles | Live evergreen / guide-like | Last 30d | Latest | Already added in PR #236 | Post-merge assessment | Next action |
|---|---:|---:|---:|---|---:|---|---|
| Politics & Government | 71 | 20 | 17 | 2026-08-09 | Existing architecture reused | Strong | Maintain cadence; refresh top performers |
| Elections | 313 | 24 | 44 | 2026-08-08 | Election Central reused | Strong | Maintain cadence and election-cycle freshness |
| Border & Immigration | 71 | 4 | 14 | 2026-08-09 | Hub plus existing context links | **Evergreen gap** | Add 4 supporting evergreen guides to reach an 8-page context library |
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

## Content decision

The next new evergreen cluster should be **Border & Immigration**. The live archive has substantial news depth (71 articles, 14 in the last 30 days) but only four evergreen/guide-like pages. Four additional supporting guides will bring the context library to the same eight-page target used for the newly strengthened Agriculture, Veterans, and Law Enforcement pillars without manufacturing unnecessary content elsewhere.
