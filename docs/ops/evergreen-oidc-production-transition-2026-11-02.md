# Evergreen publishing authorization and model recovery

**Incident: November 2, 2026.** Authenticated Cloudflare Worker logs recorded repeated `/api/public/hooks/generate-evergreen` HTTP500 events and the production database had no recent evergreen publications. The old generator instructed a timeless explainer to leave article fields empty without a news event (#3351 fixed that conflict). The AI adapter's former default `@cf/meta/llama-3.1-8b-instruct-fast` did not appear in the live Cloudflare Workers AI model catalog; Cloudflare's `GET /ai/models/search` and `GET /ai/models/schema` verified `@cf/meta/llama-3.1-8b-instruct-fp8` exists and accepts JSON mode and messages. No new provider or API key was created.

**Security:** The prior route accepted unauthenticated public POSTs while using `SUPABASE_SERVICE_ROLE_KEY` and paid model inference. Its two Supabase jobs (`generate-evergreen-am` at 08:30 UTC, `generate-evergreen-pm` at 18:00 UTC) submitted anonymous requests. The repaired route validates the existing GitHub Actions OIDC signature, audience `keeptxred-evergreen`, exact repository, main ref and exact workflow path *before* invoking AI or database writes. Only `schedule` and `workflow_dispatch` are accepted; missing/invalid credentials yield no-store 401/403.

The replacement workflow `.github/workflows/generate-evergreen.yml` retains those two UTC schedules and can be manually dispatched in GitHub Actions; it checks both HTTP200 and `ok:true` with a slug to certify publication. It uses GitHub-issued OIDC only, no new secrets and no GPT scheduled task.

**Production transition required:** After the signed main SHA deploys, remove the two legacy Supabase `cron.job` entries to stop anonymous 401 traffic. Verify both jobs are gone via SQL. The protected GitHub workflow's next scheduled/dispatch run must show a valid publication and newly written `daily_articles.kind='evergreen'` row before declaring the publishing incident resolved. If the AI still errors, preserve its true failure status; do not weaken fact checks, 800-word minimum, de-duplication, primary-source requirements or 2-attempt budget.

**SQL for legacy cron retirement after protected deployment** (run as project owner; do not create a new pg_cron job):
```sql
select cron.unschedule(jobid) from cron.job
where jobname in ('generate-evergreen-am','generate-evergreen-pm');
```
