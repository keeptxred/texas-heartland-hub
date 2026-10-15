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
