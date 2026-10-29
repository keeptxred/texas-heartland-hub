# Texas Estates Code Chapter 205 — small-estate affidavits (bounded legal review)

**Reviewed:** October 28, 2026. **Guide:** `src/data/law-topic-wills-probate-authority.ts` / `/laws/topic/wills-probate-inheritance-law`.

## Primary law and state guidance

- [Texas Estates Code Chapter 205, current consolidated statutory text](https://tcss.legis.texas.gov/resources/ES/htm/ES.205.htm).
  - **§205.001:** Intestacy only; **30 days** after death; no pending or granted personal-representative petition; total estate assets *excluding eligible homestead and exempt property* **≤ $75,000** on the affidavit date; applicable nonexempt assets exceed known nonexempt liabilities; required sworn affidavit filed with court and approved by the judge; statutory certified-copy process.
  - **§205.002:** Affidavit of **two disinterested witnesses**, each legally capable distributee, plus appropriate representation for certain minors/incapacitated distributees; list of assets/debts, heir names and addresses, and heirship family-history facts. Claim exempt property on the list.
  - **§§205.003–205.004:** Court approval required, then distributees supply the clerk-certified affidavit to covered parties holding assets or owing money.
  - **§205.006, §205.008:** A qualifying **homestead that is the estate's only real property** may transfer using the approved affidavit recorded in that property's county deed records. Otherwise Chapter 205 **does not transfer title to real property**, and does not affect dispositions by a will or other testamentary document.
  - **§205.007:** Parties who execute the affidavit may have liability for losses resulting from third-party reliance; the instrument is not a zero-risk self-help substitute.
- [Texas State Law Library, informal probate methods](https://guides.sll.texas.gov/probate/informal-methods): state-authored explanation of no-will eligibility, net asset limitations, the homestead exception, and county-specific filing requirements.

## Finding and bounded correction

Existing authority guide correctly distinguished wills, probate, administration, intestacy, and nonprobate transfers but lacked any usable statutory explanation for the **small-estate affidavit** referenced by readers seeking alternatives. An unqualified statement that an estate worth less than $75,000 always avoids probate would be wrong. Added **one framework paragraph, one scoped key rule, three reader FAQs, and two official-source references** explaining precisely when Chapter 205 can and cannot apply. Neither generic real estate nor an estate disposing of property by will is presented as eligible; preserved the distinction between initial filing, court approval, recording and third-party delivery.

Added `src/data/law-topic-wills-small-estates.test.ts` with four focused contract tests protecting these caveats. No change to canonical/page ownership, other Probate Code topics, or current on-page **2026-10-23** update/publication dates.

**Not a full guide sign-off.** Other probate rules, available court interpretations, competing claims, tax questions and remaining guide FAQs are still only partially source-reviewed. PR validation and protected current-main production evidence must be recorded separately.
