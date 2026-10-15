# KeepTXRed production newsroom integrity repair — 2026-10-14

## Scope and provenance

The following **one-time, guarded data-only repairs** were executed directly against
production Supabase project `ftkznprjljkhymknvhye` during the October 14 publication
handoff. They did not create replacement prose or new publication events.
They were not a backdated release migration. Their outcomes were verified independently
with read-only SQL. This record documents the executed changes for later audit.

1. **Gold/silver legal tender (Civics Desk)**, slug
   `texas-gold-silver-legal-tender-hb-1056`: the legacy article already had a
   complete `body_json.intro`, `sections`, and other structured text, but its plain
   `body` was empty. The guarded update matched only this slug, author,
   `kind=news` and blank plain text; concatenated existing structured prose
   in its original order; and required at least 200 output characters. It produced
   a 9,954-character plain-text body. Its original
   `published_at=2026-09-01T00:03:54.820329Z` and all quality flags remained unchanged.
2. **Voter-registration lawsuit**, slug
   `2026-10-14-texas-sued-for-failing-to-process-over-500-000-voter-registrations`:
   the exact same 463-character paragraph occurred twice in both `body` and
   `body_json.sections`. After checking exactly two occurrences in each representation,
   a guarded update removed the **later** copy (section 6, paragraph 2; one-based).
   The resulting plain-text body measured 11,676 characters.
3. **Henry Cuellar ad-reservation article**, slug
   `2026-10-14-house-republicans-pull-3-million-reserved-for-ads-against-henry-cuellar`:
   after the same exactly-two-occurrences guard, the 420-character repeated paragraph's
   **later** copy was removed (section 8, paragraph 2; one-based).
   The resulting plain-text body measured 10,111 characters.

Both duplicate repairs used `jsonb_set` on the existing sections array and removed only
the corresponding second plain-text occurrence. Their `published_at` values and quality
flags were returned unchanged by the update. No editorial review or indexability flag was
added or removed.

## Post-update verification

- Blank `daily_articles` rows of `kind='news'`: **0**.
- Blank news rows with `author='Keep TX Red Newsroom'`: **0**.
- Exact repeated paragraphs of at least 100 characters in the five October 14
  published newsroom articles' structured sections: **0**.
- New unaccounted-for URLs in the October 14 URL-integrity baseline: **0**.
- Recently created blank news bodies: **0**.
- Recently created newsroom articles without required section structure: **0**.
- Ten *older August 8* thin articles still have no sections, but remain
  `seo_noindex` and `chatgpt-admin-ignored`; these were **not** approved,
  indexed, or inflated with fabricated sections.

The separate migration
`supabase/migrations/20261014225500_hydrate_keep_tx_red_newsroom_plain_body.sql`
is the permanent guard for new Keep TX Red Newsroom plain-text hydration.
The Civics Desk restoration above was a one-time content repair, **not** an
expansion or replacement of that production trigger.

## Operating constraints upheld

No slug, canonical URL, source citation, attribution, historical publication date,
editorial quarantine, image selection, AI budget or protected release control was
intentionally changed by these data repairs. The repairs do not count as new news.


## Addendum — historical paragraph reconciliation (October 15 follow-through)

An independent September–October newsroom scan identified ten additional unquarantined
historical articles with one or two exact repeat occurrences of substantive
section paragraphs. Each affected section was patched **only** where its
paragraph and exact-occurrence guards matched the existing source text.
The original article's source citation objects, title, slug, canonical URL,
publication date, quality flags, and existing editorial disposition were
not rewritten. No historical record was recounted as new October news.

The affected slugs were:

- `2026-10-08-san-antonio-water-bills-could-climb-as-city-council-considers-four-years-of-saws`
- `2026-10-08-we-have-to-suck-it-up-ken-paxton-privately-suggests-cutting-federal-benefit-prog`
- `2026-10-03-trump-to-visit-san-antonio-next-week-for-rally-with-paxton-de-la-cruz`
- `2026-10-02-ken-paxton-says-trump-s-midterm-convention-in-dallas-hurt-his-senate-campaign`
- `2026-09-25-austin-ice-shooting-raises-questions-about-medical-standards-for-detainees`
- `2026-09-22-austin-man-shot-by-ice-will-not-face-immediate-deportation-judge-rules`
- `2026-09-22-ice-officer-shoots-man-in-north-austin`
- `2026-09-21-man-injured-in-shooting-by-ice-officer-in-north-austin`
- `2026-09-18-top-texas-republicans-knew-bo-french-s-history-of-racist-comments-they-supported`
- `2026-09-04-texas-dps-to-continue-using-vast-surveillance-network-despite-abbott-s-order-lim`

The subsequently performed read-only scan confirmed **zero** surviving articles
with one or two exact repeated section paragraphs (120-character floor) in
the September–October cohort. Twenty-five other older articles have more
extensive repetition; those were **not** indiscriminately approved,
republished or cleared of preexisting quarantine flags.

A second audit found that some rows' plain-text `body` no longer matched
their corrected structured `body_json`. The existing production
`trg_hydrate_keep_tx_red_newsroom_plain_body` trigger was used for a
**guarded, one-time reconstruction** of these same ten authorship-verified
newsroom rows from their own corrected sections/intro/FAQ/takeaways.
Each resulted in a nonblank canonical body of 10,053–12,077 characters
(with one at 10,275 and others in that range), retaining the original
`published_at` and unchanged `quality_flags`.
This operation neither generated new reporting nor altered source records.

**Important distinction:** A section-paragraph audit cannot prove every
phrase is unique across introductions, summaries, FAQ or other fields.
Subsequent plain-text checks still found some long passages repeated
across text fields or embedded passages; these should not be described as
fully de-duplicated. There is no justification to delete these further
without an editorial review of the overlapping source text. The new
prepublication guard in PR #2804 prevents even one exact repeated
substantive **section paragraph** in future newsroom drafts.

The above direct production changes are documented here rather than
misrepresented as a deployed SQL migration. SQL guards required matching
slugs, newsroom authorship, news kind, adequate existing content, and
preservation of the rows' quality-gate disposition.


## Addendum — government clipping mistaken for a primary record (Oct 15)

The new prison-air-conditioning appeal article
`2026-10-15-texas-appeals-order-requiring-prison-air-conditioning`
was published at 2026-10-15 04:42:21.567 UTC (late **Oct 14 Central**).
A Texas Legislative Reference Library *Daily News Clips* URL
`http://www.lrl.state.tx.us/cl.cfm?id=454959` was mistakenly counted as a
primary or official record and made the lead source. The Library explicitly
describes that service as an index of newspaper articles; being hosted by
the government does not turn the newspapers' reporting into a court filing.

A **single guarded production Supabase transaction** corrected this evidence
classification without inventing material or changing the article's slug,
canonical, published_at, source links, or editorial flags:

- Changed the lead citation to the **existing** Texas Standard published report
  already in the article's source list.
- Preserved the Library clipping URL in the six-item citation list, but changed
  its displayed role to `newspaper clipping index (secondary discovery)`.
- Corrected the article's authority count to **0 primary** and **6 total
  references**, including **5 published reporting sources and one clipping
  index**, and revised the matching “How This Story Was Built” paragraph in
  both the structured body and its plain-text counterpart.
- Corrected the matching cluster membership from primary to supporting and
  synchronized its research-packet and cluster primary-source counts to zero.

The transaction returned **1 article, 1 membership, 1 packet, 1 cluster**
updated. No extra article was generated and no paid AI was called. The
code change in PR #2810 prevents future `/cl.cfm` and
`/currentIssues/clips/*` URLs from being awarded primary-record or
independent-publisher credit, while genuine Texas Legislative Reference
Library legislative records remain eligible. Re-running the data correction
is not necessary; the guarded match will no longer select the repaired row.
