## Cleanup Plan

### 1. Remove duplicate Printify cron

Unschedule `sync-printify-6h`, keep `sync-printify-hourly` (`0 * * * *`).

Via `supabase--insert`:
```sql
SELECT cron.unschedule('sync-printify-6h');
```

### 2. Add health endpoint

Create `src/routes/api/public/hooks/health.ts` — a GET server route that returns JSON:

```json
{
  "status": "ok",
  "timestamp": "<now ISO>",
  "database": "ok" | "error",
  "articles_last_24h": <count>,
  "latest_published_at": "<ISO or null>"
}
```

Implementation notes:
- Use the server publishable Supabase client (`SUPABASE_URL` + `SUPABASE_PUBLISHABLE_KEY`) inside the handler — no service role, no secrets exposed.
- Query `daily_articles` with `count: 'exact', head: true` filtered by `published_at >= now-24h`, and a single-row `select('published_at').order(...).limit(1)` for the latest timestamp.
- On DB error, return `database: "error"` and HTTP 200 with `status: "degraded"` so uptime checkers get a clear signal without leaking error details.
- No cache headers; response is small.

### Files touched
- **Created:** `src/routes/api/public/hooks/health.ts`
- **DB change (via insert tool):** unschedule `sync-printify-6h`
- Nothing else — no changes to generation, SEO, schema, or sitemap logic.
