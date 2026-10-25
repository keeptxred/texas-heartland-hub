# KTR editorial approval — October 11–25, 2026 election coverage

On October 25, 2026, the publisher authorized publishing factual election-related KTR posts from the preceding two weeks. This approval is a **permission to release eligible coverage**, not proof that a claim or a source is verified.

## Automated recovery implemented

The production `Run Daily News Now` workflow attempts at most one previously GENERATED, HELD, factual election-administration draft per run *before* making a new paid newsroom AI call. The source item or cluster must have been created between 2026-10-11 00:00 UTC and 2026-10-26 00:00 UTC and the pre-approved replay expires automatically after October 30 UTC. Other editorially approved election topics remain eligible for normal verified newsroom publication rather than being unblocked blindly.

The guarded recovery:
- verifies the exact source-backed research packet again, including evidence depth and actual independent publishers;
- re-runs the same article draft validator, source uniqueness checks and duplicate-published-subject screening;
- does **not** reissue paid AI text generation or create a duplicate draft;
- publishes the current date but explicitly calls the source reporting **retrospective**, never breaking or current election results;
- generates, stores and vision-verifies the article hero **before** the article becomes public;
- updates the existing candidate/cluster/draft lifecycle and calls the normal finalization endpoint;
- retains unresolved, conflicting, unverifiable, stale or image-rejected items as HELD with a reason.

The production workflow preserves the original normal writer and verified reserve as fallbacks. Every newly published piece requires an actual live URL and a stored, validated raster image. No candidate endorsement, advocacy targeting, or unverified election result is authorized by this editorial approval.

## Verification

Check GitHub Actions `Run Daily News Now` for `approved-election-draft-recovery`, `clustered-newsroom-finalize`, and `DAILY_NEWS_PUBLISH_SUCCESS`. Independently check the new `daily_articles` row, `newsroom_generation_drafts` status, `news_publish_candidates` status, `storage.objects` JPEG, and the live article's rendered canonical URL.

This recovery is not an override of publication locks, factual conflicts, stale election forms, AI quotas or image verification. Nothing in this file instructs scripts to fabricate or backdate public content.
