# Citation Magnet Batches 2.20–2.26

Status: **implemented for validation except live benchmark 2.25**

- **2.20 — AI-readable tables / JSON-LD / exports:** adds `/citation-magnets.json`, a canonical machine-readable index of maintained election, legislative, law and government reference resources. Existing structured race, bill, law and government pages retain their JSON-LD/entity layers.
- **2.21 — Internal citation-magnet linking:** the current-session authority block now links committee vote records, 2026 law effective dates and constitutional amendments; the Texas government hub links the state-agency directory.
- **2.22 — `llms.txt` prioritization:** adds a citation-ready reference section and machine-readable manifest link, with explicit instructions to preserve factual/analytical separation and no-inference caveats.
- **2.23 — Sitemap/discovery verification:** manually governed page sitemap now includes the vote, government, agency, amendment and effective-date resources; election citation hubs remain governed by the election sitemap architecture.
- **2.24 — Answer/extraction contracts:** regression tests protect the election-date, voter-ID, district/race, committee-vote, amendment-status, effective-date, bill→law→agency-context and election→candidate→district answer layers.
- **2.25 — Live cross-engine recommendation benchmark:** intentionally runs after merge/deploy so the baseline tests the completed discovery architecture.
- **2.26 — Regression protection:** `citation-magnets.test.ts` protects the manifest, `llms.txt` coverage, visible Sources/Methodology/Last verified vocabulary, sitemap placement, internal hub links, answer layers and explicit no-inference guardrails. It runs automatically in the protected full Vitest suite.
