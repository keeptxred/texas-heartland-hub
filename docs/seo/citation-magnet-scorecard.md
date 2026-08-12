# Citation Magnet Scorecard — Batch 2.2

Status: **final scoring pass for the frozen Batch 2.1 candidate set**

This scorecard evaluates only `KTR-CM-01` through `KTR-CM-20` from `citation-magnet-inventory.md`. It does not add or remove candidates.

## Rubric

Each dimension is scored 1–5. Maximum score: 35.

- **U — Uniqueness / proprietary value:** 5 = materially differentiated maintained reference utility; 1 = commodity content.
- **D — Structured data / relationship value:** 5 = strong entities, status, comparisons or relationship graph; 1 = mostly prose/navigation.
- **S — Primary-source quality:** 5 = direct authoritative provenance; 1 = weak/secondary sourcing.
- **A — Answer extractability:** 5 = concise facts/answers can be lifted safely by answer engines; 1 = answers are buried or ambiguous.
- **F — Freshness / maintainability:** 5 = clear repeatable update path; 1 = likely to stale without manual intervention.
- **I — Internal authority / knowledge-graph value:** 5 = central node in bill/election/government graph; 1 = isolated page.
- **R — Readiness against thin/template risk:** 5 = strong unique substance; 1 = high risk of thin or repetitive output.

Priority bands: **P1 = 29–35**, **P2 = 24–28**, **P3 = 19–23**, **Hold = 18 or lower**.

| ID | Resource | U | D | S | A | F | I | R | Total | Priority | Decision |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| KTR-CM-01 | `/elections` | 4 | 4 | 5 | 4 | 5 | 5 | 4 | 31 | P1 | Promote as election authority front door |
| KTR-CM-02 | `/elections/2026` | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 33 | P1 | Primary cycle reference surface |
| KTR-CM-03 | `/elections/statewide` | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 33 | P1 | High-value statewide race comparison surface |
| KTR-CM-04 | `/elections/races` | 4 | 5 | 5 | 4 | 5 | 5 | 4 | 32 | P1 | Promote with normalized filters/status provenance |
| KTR-CM-05 | `/elections/races/:raceSlug` | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 34 | P1 | Highest-priority election citation family |
| KTR-CM-06 | `/elections/candidates` | 4 | 5 | 4 | 4 | 5 | 5 | 4 | 31 | P1 | Promote as neutral candidate entity directory |
| KTR-CM-07 | `/elections/candidates/:candidateSlug` | 5 | 5 | 4 | 5 | 4 | 5 | 3 | 31 | P1 | Promote with strict factual/commentary separation |
| KTR-CM-08 | `/elections/districts` | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 30 | P1 | Promote as geographic election authority layer |
| KTR-CM-09 | `/elections/districts/:districtSlug` | 5 | 5 | 5 | 5 | 4 | 5 | 3 | 32 | P1 | Strong durable district entity family |
| KTR-CM-10 | `/elections/voting` | 3 | 3 | 5 | 5 | 5 | 5 | 5 | 31 | P1 | Canonical concise voting-reference surface |
| KTR-CM-11 | `/elections/polls` | 4 | 5 | 4 | 5 | 5 | 5 | 4 | 32 | P1 | Promote with stale-poll and methodology rules |
| KTR-CM-12 | `/elections/polls/:pollSlug` | 5 | 5 | 4 | 5 | 5 | 5 | 3 | 32 | P1 | Require complete poll methodology before promotion |
| KTR-CM-13 | `/elections/results` | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 33 | P1 | Promote with unofficial/final status distinction |
| KTR-CM-14 | `/elections/forecast` | 5 | 5 | 3 | 5 | 5 | 5 | 4 | 32 | P1 | Promote only with facts/model judgment visibly separated |
| KTR-CM-15 | `/texas-legislature` | 4 | 5 | 5 | 4 | 5 | 5 | 4 | 32 | P1 | Promote as legislature authority hub |
| KTR-CM-16 | `/texas-legislature/current-session` | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 33 | P1 | Primary current-session reference |
| KTR-CM-17 | `/texas-legislature/committees` + detail | 5 | 5 | 5 | 5 | 4 | 5 | 4 | 33 | P1 | Strong durable committee entity system |
| KTR-CM-18 | `/bills` | 4 | 5 | 5 | 4 | 5 | 5 | 4 | 32 | P1 | Promote as canonical bill discovery surface |
| KTR-CM-19 | `/bills/texas/:legislature/:billType/:billNumber` | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 34 | P1 | Highest-priority legislative citation family |
| KTR-CM-20 | `/laws` | 4 | 4 | 5 | 5 | 4 | 5 | 4 | 31 | P1 | Promote as law/reference bridge, not duplicate news content |

## P1 implementation order

1. `KTR-CM-19` bill detail family.
2. `KTR-CM-05` race detail family.
3. `KTR-CM-13` results hub.
4. `KTR-CM-16` current-session reference.
5. `KTR-CM-17` committee system.
6. `KTR-CM-02` 2026 election-cycle reference.
7. `KTR-CM-03` statewide races.
8. Remaining P1 systems in graph-dependency order.

## Guardrails carried into Batch 2.3

- P1 means strengthen the existing canonical authority resource, not publish parallel article routes.
- Candidate/race/district/poll/bill families remain one system each for prioritization.
- Primary-source facts must remain visibly distinct from forecasts, analysis and editorial explanation.
- A visible source/methodology/freshness treatment is required before a P1 resource is considered citation-ready.
