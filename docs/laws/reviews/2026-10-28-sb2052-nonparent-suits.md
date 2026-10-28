# Enacted 2025 SB 2052 — parent/nonparent conservatorship claims (bounded review)

**Checked:** October 28, 2026. **Guide:** `src/data/law-topic-family-custody-authority.ts` and `/laws/topic/family-custody-child-support-law`.

**Scope:** A narrow statutory source correction. This is **not** a complete independent review of the Family Law guide, its other paragraphs, FAQs, case law, or all 18 law topics. Existing on-page review date **2026-10-23** stays unchanged.

## Primary enacted/current law checked

- [2025 SB 2052, enrolled act, sections 1–5](https://capitol.texas.gov/tlodocs/89R/billtext/html/SB02052F.HTM) — enacted; effective **September 1, 2025**; applies to suits affecting the parent-child relationship **pending in a trial court on or after that date**, as well as suits filed then or later.
- [Texas Family Code Chapter 102, section 102.0031](https://tcss.legis.texas.gov/resources/FA/htm/FA.102.htm) — nonparent initial pleading or intervention in covered parent-party suits requires an accompanying fact-supported affidavit attesting to significant impairment based on personal knowledge or representations from a person with such knowledge; absent adequate allegations the court denies relief and dismisses the suit or strikes the intervention.
- [Texas Family Code Chapter 153, section 153.002(b)–(c)](https://tcss.legis.texas.gov/resources/FA/htm/FA.153.htm) — parent presumptively acts in child's best interests and custody with parent presumptively serves them; nonparent rebuts only with **clear and convincing evidence** that denying relief causes **significant impairment** to physical health or emotional development. If court grants nonparent relief, written order must give **specific supporting facts** and extent presumption overcome.
- [Texas Family Code Chapter 156, section 156.008](https://tcss.legis.texas.gov/resources/FA/htm/FA.156.htm) — where nonparent in modification must rebut the section 153.002(b) parental presumption, burden remains clear and convincing and a prior order agreed to by the parent cannot alone overcome the presumption.

## Editorial result

Previously the public guide contained generic best-interest, joint conservatorship and modification language but omitted these enacted **parent-versus-nonparent** requirements. Added one focused framework paragraph, one rule, two reader FAQs, and exact enacted/statutory source links. Clarified that the `§102.0031` **pleading-affidavit gate** differs from the `§153.002(c)` **substantive evidentiary burden**; `§156.008` has a conditional modification scope. These rules are not represented as changing all parent-versus-parent proceedings or eliminating otherwise applicable standing, jurisdiction or safety rules.

Regression: `src/data/law-topic-family-sb2052-nonparent.test.ts` validates both standards, mandatory findings, the prior-agreed-order distinction, statutory effective/applicability date, preservation of existing child-support text, the source URLs, and the original on-page date.

**Status:** Bounded source audit. Protected repository checks, merge and production release to be recorded separately; the guide remains only **partially** independently reviewed.
