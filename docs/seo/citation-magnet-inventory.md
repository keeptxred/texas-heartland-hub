# Citation Magnet Inventory — Batch 2.1

Status: **frozen input set for Batch 2.2**

This inventory identifies existing Keep TX Red resources that are plausible candidates for becoming high-value AI/search citation magnets. It does **not** authorize creation of new public routes. Programmatic route families are counted once as a resource system rather than treating every generated URL as a separate candidate.

Keep TX Red should prioritize maintained election, legislature, bill, law and government-reference systems over commodity breaking-news recaps. The durable advantage is the relationship graph: **bill → legislature → legislator → election → candidate → district → voting → law → explainer**.

## Selection rules

A candidate must already exist in the repository and should satisfy most of these conditions:

- serves recurring election, legislative, legal, officeholder or civic-information intent;
- can be maintained from authoritative/primary sources;
- can support structured facts, relationships, comparisons or status tracking;
- can answer a question directly enough for search/answer-engine extraction;
- has evergreen or continuously maintained value beyond a single news cycle;
- does not need a competing new route for the same intent.

Batch 2.2 must score **this exact candidate ID set** before candidates are added, removed, merged, or promoted.

## Tier A — strongest existing systems

| ID | Existing route/resource | Asset type | Topic cluster | Why it can become a citation magnet | Main upgrade gap |
|---|---|---|---|---|---|
| KTR-CM-01 | `/elections` | Authority hub | Elections | Existing front door to races, candidates, voting, polling and results | Make relationships, freshness and source provenance explicit across the hub |
| KTR-CM-02 | `/elections/2026` | Election-cycle reference | Elections | Can become the definitive maintained index for the 2026 Texas cycle | Complete statewide/legislative coverage and last-verified status treatment |
| KTR-CM-03 | `/elections/statewide` | Statewide-race directory | Elections | Direct answer surface for statewide offices and candidate/race status | Add complete comparable fields, filing/status sources and update timestamps |
| KTR-CM-04 | `/elections/races` | Race directory | Elections | Strong discovery and comparison layer across election contests | Improve filters, status normalization and primary-source provenance |
| KTR-CM-05 | `/elections/races/:raceSlug` | Race reference family | Elections | Individual races can connect candidates, district, polling, forecast and results | Enforce complete sourced fields and avoid thin race shells |
| KTR-CM-06 | `/elections/candidates` | Candidate directory | Elections | Natural entity directory for recurring candidate research | Add normalized office/race/status fields and stronger official-source attribution |
| KTR-CM-07 | `/elections/candidates/:candidateSlug` | Candidate reference family | Elections | Candidate entities can aggregate filings, race context, positions and related coverage | Maintain neutral factual core, source dates and clear distinction from commentary |
| KTR-CM-08 | `/elections/districts` | District directory | Elections | Connects geographic representation to races and candidates | Add authoritative boundary/source metadata and practical lookup pathways |
| KTR-CM-09 | `/elections/districts/:districtSlug` | District reference family | Elections | Durable entity layer connecting district, incumbents, candidates and results | Strengthen district facts, boundary provenance and historical context |
| KTR-CM-10 | `/elections/voting` | Voting reference | Elections | High-intent evergreen destination for dates, eligibility, ID and voting methods | Add authoritative date/versioning treatment and concise answer blocks |
| KTR-CM-11 | `/elections/polls` | Poll directory | Elections | Structured poll index can answer current comparison questions | Methodology normalization, source transparency and stale-poll handling |
| KTR-CM-12 | `/elections/polls/:pollSlug` | Poll detail family | Elections | Individual poll pages can expose field dates, sample, sponsor, method and toplines | Require full methodology/source fields before indexation/promotion |
| KTR-CM-13 | `/elections/results` | Results hub | Elections | Natural authoritative-style surface for election outcomes and status | Formalize source hierarchy, timestamps and unofficial/final distinctions |
| KTR-CM-14 | `/elections/forecast` | Forecast hub | Elections | Can be cited for transparent race-rating methodology if rigorously maintained | Separate observed facts from model/editorial judgment and expose methodology |
| KTR-CM-15 | `/texas-legislature` | Legislature authority hub | Legislature | Existing hub can connect chambers, sessions, committees, bills and lawmakers | Increase cross-entity summaries and primary-source status/freshness signals |
| KTR-CM-16 | `/texas-legislature/current-session` | Session reference | Legislature | High-value current-session orientation and bill-status entry point | Add session calendar, milestones and sourced current-state summaries |
| KTR-CM-17 | `/texas-legislature/committees` + detail family | Committee directory/reference | Legislature | Committees are durable entities connecting bills, members and jurisdiction | Complete membership/jurisdiction provenance and committee-to-bill relationships |
| KTR-CM-18 | `/bills` | Bill directory | Legislature | Statewide bill discovery is a strong structured-data advantage | Improve search facets, freshness, source attribution and canonical bill relationships |
| KTR-CM-19 | `/bills/texas/:legislature/:billType/:billNumber` | Bill detail family | Legislature | Bill pages can answer status, sponsor, actions, votes and related-law questions | Enforce complete official-source data and prevent invalid/thin bill URLs |
| KTR-CM-20 | `/laws` | Law/reference hub | Laws/government | Durable bridge from legislation to enacted law and plain-English explainers | Add stronger statute/source mapping, effective dates and relationship to bills/agencies |

## Tier B/supporting resources — valuable but outside the fixed 20 for Batch 2.2

These should support the 20 candidates above or be reconsidered after the first scoring pass rather than expanding the fixed set now:

- `/texas-government`
- `/texas-energy`
- `/texas-law-policy`
- `/texas-laws`
- `/laws-to-know`
- `/texas-legislature/sessions` and session detail family
- `/elections/methodology`
- `/elections/corrections`
- `/elections/legislative`
- election result/forecast detail families
- evergreen news explainers such as voting/property-tax/government-power guides when they overlap a stronger maintained authority route

## Supporting machine/discovery assets — not standalone citation-magnet candidates

- `/llms.txt`
- election, bill and page sitemaps
- election methodology/corrections infrastructure
- internal authority/entity path helpers
- validation scripts and admin enrichment tooling

## Consolidation / do-not-duplicate rules

1. Do not create a second election hub while `KTR-CM-01`/`KTR-CM-02` exist.
2. Do not create separate article-style candidate or race guides that compete with the structured candidate/race reference families.
3. Treat all candidate, race, district, poll and bill detail URLs as route-family systems for prioritization, not hundreds of separate citation magnets.
4. Do not create a second Texas bill directory while `KTR-CM-18` exists.
5. Prefer strengthening `/laws` as the maintained law-reference hub rather than multiplying overlapping `/texas-laws`/`/laws-to-know` intents without a consolidation plan.
6. Breaking-news stories can supply context and internal links, but should not replace the maintained factual authority resources above.
7. Forecast content must keep factual source data visibly separate from model/editorial interpretation.

## Handoff to Batch 2.2

Batch 2.2 will score `KTR-CM-01` through `KTR-CM-20` for:

- uniqueness / proprietary value;
- structured data or relationship value;
- primary-source quality;
- answer extractability;
- freshness/maintainability;
- internal authority and knowledge-graph value;
- current thinness/template risk.

No candidate should be promoted for implementation solely because it is Tier A here; the quantitative/qualitative prioritization belongs to Batch 2.2.
