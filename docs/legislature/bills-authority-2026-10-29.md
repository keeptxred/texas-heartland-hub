# KeepTXRed Texas Bills — 2026-10-29 authority repair checkpoint

## Verified database baseline
- Active bills database for the 89th Legislature: 89(R) 11,503, 89(1) 591, 89(2) 692; exact combined total 12,786.
- Public index previously relied on PostgreSQL **planned** counts; the 13,244 estimate was not an actual count.
- 119 concurrent resolutions were incorrectly marked `became_law=true`. Direct Supabase DML on 2026-10-29 corrected these plus adoption/proposed-amendment statuses using bill_actions evidence (679 records changed).
- Official action evidence: 89(2) SR 2 has "Read & adopted" on 2025-09-04; 89(2) HCR 13 signed by Governor on 2025-09-17 but is a concurrent resolution, not a statute.
- Do not adjust `last_synced_at` for editorial/database reclassification; it represents source synchronization, not manual review.

## Repository implementation in branch `fix/bills-authority-status-20261029`
- `scripts/legislature/status-normalization.mjs` handles statutes, simple/concurrent resolutions and proposed constitutional amendments with distinct legal statuses; importer consumes the shared normalizer. `--reclassify-all` is available to re-evaluate unchanged source files intentionally (costly; run in bounded batches).
- Fallback TLO backfill function uses instrument-aware status handling.
- `src/lib/bills.ts` uses exact database counts rather than planner estimates, preserving index-first deep page hydration, and supports a category split between substantive bills and resolutions.
- `src/routes/bills/index.tsx` defaults to substantive House/Senate bills, offers all measures and resolutions, shows official action dates distinctly from sync timestamps, and keeps canonical search/SEO behavior.
- Guards prevent nonstatutory resolutions displaying a “Became law” badge; public relationships no longer display numeric internal ranking scores.
- Daily action now chooses the current regular Legislature automatically. Quarterly action discovers actual official FTP sessions and also falls back to known 89(R), 89(1), and 89(2). It runs Jan/Apr/Jul/Oct and is manually dispatchable.
- Existing 15-minute bills-health monitor checks that no resolutions are flagged as enacted laws.

## Test and deployment sequence
1. Run `node --test scripts/legislature/status-normalization.check.mjs scripts/legislature/plan-sessions.check.mjs`.
2. Run `bun run test -- src/lib/bills-indexed-pagination.test.ts src/lib/bills-search-intent.test.ts` and `bun run legislature:validate`; run build/typecheck and review CI. Watch PostgREST count-timeouts: exact count is necessary for correctness but the endpoint must remain performant.
3. Original authority PR #3255 was merged in commit `7a6081ea1b83aa4278296a1c36beed6c002368bf`; separately verify the latest production Cloudflare deployment and any subsequent recovery PR. Do **not** confuse Cloudflare OAuth user/token verification 401 with an integration problem.
4. Deploy the changed Supabase `tlo-missing-bill-backfill` Edge Function if it is deployed separately from GitHub CI.
5. On production verify `/bills`, `?status=sent-to-governor`, actual last pagination page, and `/bills/texas/89/2/sr/2` and `/bills/texas/89/2/hcr/13`.
6. Manually dispatch the quarterly workflow to reconcile any called sessions not covered by the daily regular-session job. Confirm workflow runs **completed** and inspect `legislative_sync_runs` for errors. GitHub schedules run only on the default branch after merge.

## Guardrails
- No invented legislative status, source date or total; official TLO history is the authority.
- Do not call a concurrent/simple/joint resolution a statute, and do not conflate legislative passage with voter approval.
- Do not mark a run successful if it was interrupted or completed with warnings.
- Avoid heavy site-wide or bulk reprocessing on each ordinary content update; incremental hash checkpoints remain in place.

## Confirmed subject-attribution defect and repair (same date)
- Audited `bill_subject_relationships`: 1,972 approved subject links were all attached to only six HB records (HB 1, 100, 200, 300, 500, 700). Every link had source `official-tlo-subject-record-v1` and `is_manual=false`. The source filenames showed why: e.g. `.../HB00001_HB00099/HB%2010.xml` was incorrectly parsed as HB **1**, not HB **10**.
- **Production DML completed:** removed the 1,972 untrustworthy automated links (no manual links present) to prevent fabricated topical associations. Public subject-link coverage is therefore temporarily zero until the corrected backfill runs. Never report subject pages as complete until independently verified.
- `scripts/legislature/session-identity.mjs` now parses official XML basename only and splits `89R`, `891`, `892` into the correct Legislature/session ID. Both history and subject importers consume it; regression fixtures cover folder-range corruption and called sessions.
- Subject importer `IMPORT_VERSION=3` deliberately invalidates version-2 checkpoints and repopulates correct subject links over subsequent GitHub runs. Source records missing a corresponding bill are retried rather than incorrectly marked completed.
- Main bill sync now retains subject checkpoint metadata for unchanged file hashes; changed source files still invalidate prior metadata and are reprocessed. This avoids endlessly reimporting unchanged subjects.
- Monitor recovery: after merge/deployment, inspect `select count(*), count(distinct bill_id) from bill_subject_relationships where source='official-tlo-subject-record-v1';` and compare known source filenames to linked bill identity. Do not re-add prior 1,972 links wholesale or reset their source identity.

## Continuation: verified blockers and recovery workflow (2026-10-29)
- The most recent completed TLO bulk run recorded in `legislative_sync_runs` before this repair was **failed**, 2026-10-28 19:38 UTC, at cursor **1,022/11,503** for 89R. Only 1,022 official `legislative_source_records` existed on 2026-10-29; none had version-3 subject attribution metadata and `bill_subject_relationships` remained zero after deleting 1,972 false links. Hourly RSS syncs (10 records) are **not** evidence of full FTP session completion.
- Oct 28 GitHub `Sync Texas legislation` runner reached the 480-second history checkpoint and imported subjects, then failed because the standalone **global `refresh_bill_relationships`** query hit a Postgres statement timeout. This was not a Cloudflare auth failure.
- Both existing daily and quarterly jobs now pass `--skip-relationships` to keep the separate expensive global refresh from blocking accurate bill/action/subject imports. **Global relationship rebuild remains an open, isolated operation**: do not claim every relationship edge is fresh.
- All three TLO update workflows share `concurrency.group=texas-legislation-imports` to prevent competing bill/subject checkpoint edits. Quarterly runs permit 2300 seconds for history and 1800 for subjects, bounded by a 90-minute job. These runs can still be partial and are labeled as such.
- New `recover-texas-bill-subjects.yml` runs twice daily (06:45/18:45 UTC) and on its own importer changes, plus manual dispatch. It uses the existing *first-party GitHub-token authenticated proxy* (not a GitHub-stored Supabase service-role secret). It restores official subject links from corrected XML basenames, logs COMPLETE/PARTIAL/FAILED with remaining counts and fails on actual download/write errors. Check public data coverage before claiming done.
- Bill detail editorial layer now explicitly distinguishes nonstatutory resolutions, never titles them as enacted laws, and hides statute effective-date/tracker links for resolutions.
- Production deployment remains a separate verified release gate. Check that the new measure-category selector appears on `/bills`, and verify HCR 13 no longer has the old bill-law relationship caption.
