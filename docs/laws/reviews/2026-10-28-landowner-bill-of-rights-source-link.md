# Eminent-domain source-link repair — Landowner’s Bill of Rights

**Checked:** October 28, 2026. **Guide:** `src/data/law-topic-eminent-domain-authority.ts` / `/laws/topic/eminent-domain-property-rights`.

## Observed evidence

The first *actual* network-backed Texas legal citation audit on the protected source-check PR, [GitHub Actions #40811289196](https://github.com/keeptxred/texas-heartland-hub/actions/runs/40811289196), inspected **143 unique source URLs** across **18 authority guides**: **129 reachable**, **1 confirmed HTTP 404**, **13 inconclusive (403/429 agency restrictions)**. It retained artifact `texas-laws-pr-source-link-evidence` (ID `12869828613`).

The single proven broken source was the OAG landing page `https://www.texasattorneygeneral.gov/landowners-bill-rights` cited by the eminent-domain topic. This is a **web-reference outage**, not evidence of a change in the condemnation statute or repeal of landowners' rights.

## Verified stable official replacement

- [Texas Department of Transportation — Landowner's Bill of Rights and resources](https://www.txdot.gov/business/right-of-way/landowner-bill-of-rights.html) — publicly reachable 200 HTML official Texas agency listing of OAG English and Spanish Landowner's Bill of Rights documents and complementary right-of-way guidance.
- [Office of the Attorney General — November 2025 Landowner's Bill of Rights PDF](https://www.texasattorneygeneral.gov/sites/default/files/files/divisions/general-oag/landowners-bill-of-rights-25.pdf) — already separately cited in the guide; **retained unchanged** as the primary official notice.
- [Texas Property Code Chapter 21](https://tcss.legis.texas.gov/docs/PR/htm/PR.21.htm) — already cited governing condemnation procedure; unchanged.

## Exact correction

Replace only the dead secondary OAG *landing-page* link with the working TxDOT official resource index. Update its source label/note honestly to identify the agency, not misrepresent TxDOT as the Attorney General's own page. Keep the direct OAG document, current Property Code sources, content paragraphs, canonical slug, and original **2026-09-06** reviewed date intact. Three focused regression assertions protect those distinctions.

**Scope:** One real dead-citation fix. Not a claim-by-claim re-review of the full eminent-domain topic, not an assertion that all 13 inconclusive agency URLs are broken, and not a complete source-monitoring monthly-run certification. Protected merge, deploy and live verification must be recorded separately.
