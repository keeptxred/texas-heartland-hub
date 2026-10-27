# Texas Laws Authority — primary-source claim-review ledger

**Ledger opened:** 2026-10-27. **Master tracker:** [#2938](https://github.com/keeptxred/texas-heartland-hub/issues/2938).

## Scope and sign-off rule

This ledger records individual claims and their verifying primary authorities. **It is not a certification that all 18 guides have been substantively audited.** The master tracker documents earlier focused corrections and their protected merges; those are not blanket proof that every paragraph, key rule and FAQ was reviewed against current law. A guide can be marked **fully reviewed** only after its introduction, quick answer, every framework paragraph, key rule, FAQ, exception, threshold, effective date, pending-litigation reference and official source link have each been checked against authoritative sources. Keep existing on-page review dates unchanged until that is done.

## Guide inventory (full audit still outstanding)

| Guide | Module | Full paragraph/FAQ claim audit |
|---|---|---|
| Property tax | `src/data/law-topic-property-tax-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Gun carry | `src/data/law-topic-gun-carry-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Self-defense and use of force | `src/data/law-topic-self-defense-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Election law | `src/data/law-topic-election-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Parental rights and education | `src/data/law-topic-parental-rights-education-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Open records and public information | `src/data/law-topic-open-records-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Eminent domain | `src/data/law-topic-eminent-domain-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Abortion law | `src/data/law-topic-abortion-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Administrative rulemaking | `src/data/law-topic-administrative-rulemaking-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Local-government authority | `src/data/law-topic-local-government-authority.ts` | **Partial** — county powers claim below checked; remainder outstanding |
| Driving, traffic and insurance | `src/data/law-topic-driving-traffic-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Landlord-tenant and rentals | `src/data/law-topic-landlord-tenant-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Employment and workplace rights | `src/data/law-topic-employment-workplace-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Consumer protection | `src/data/law-topic-consumer-protection-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Family custody and child support | `src/data/law-topic-family-custody-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Wills, probate and inheritance | `src/data/law-topic-wills-probate-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Criminal offenses and penalties | `src/data/law-topic-criminal-offenses-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |
| Business formation and LLCs | `src/data/law-topic-business-formation-authority.ts` | Outstanding — no exhaustive review evidenced in this ledger |

## Individually verified claim

| Date | Guide / location | Claim checked | Current primary authority | Finding | Correction / verification | Status |
|---|---|---|---|---|---|---|
| 2026-10-27 | Local-government authority: county powers framework, rule, FAQ; `/laws` overview | Whether all Texas counties have general ordinance-making power, and whether county exceptions exist | [Texas AG Opinion KP-0491 (June 25, 2025), pp. 1–3](https://www.texasattorneygeneral.gov/sites/default/files/opinion-files/opinion/2025/kp-0491.pdf); Tex. Const. art. V §18(b); [Local Government Code §51.001](https://tcss.legis.texas.gov/resources/LG/htm/LG.51.htm); Health & Safety Code §826.014 | **Correction necessary.** The overview suggested ordinances of all 254 counties as though county and municipal authority were equivalent. Commissioners courts have no general police/ordinance authority, but specific statutes allow narrowly defined county rules/ordinances (including rabies-control programs). The 2025 AG opinion rejects using the rabies-control statute to invent an excessive-barking public nuisance offense. | Replace hub phrasing with municipal ordinances, legally authorized county orders and special-district rules. Add county-specific statutory exception and AG explanation to existing legal authority module and strengthen FAQ/key rule. Add regression asserting distinction. Do **not** change review date. | Claim checked; branch/PR pending protected checks and production release |

## Completion criteria for this ledger

A completed source-check record must include (1) the exact affected guide and claim, (2) primary authority and section, (3) finding including exceptions and applicability, (4) link to a precise correction or unchanged verification, and (5) protected validation and live release evidence. Update each topic row only after checking all its material claims. Real ad delivery, field performance and Google indexing are separate verification tasks and are not inferred from legal-source accuracy.
