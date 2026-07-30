# Publishing safety net

The newsroom has three independent content layers:

1. Permanent static articles in `src/data/articles.ts` and `src/data/article-bodies.ts`.
2. Normal automated and manually published articles in `daily_articles`.
3. Three prewritten reserve articles in `src/data/reserve-articles.ts`.

## Permanent URL policy

The `trg_preserve_published_article_url` database trigger blocks deletion of
published database articles and blocks changes to their slug or internal URL.
Normal editorial updates to titles, copy, images, and metadata remain allowed.

An approved emergency removal requires this setting inside the same database
transaction:

```sql
SET LOCAL app.allow_published_article_mutation = 'on';
```

Use the override only when an article must legally or operationally be removed.
If a URL changes for editorial reasons, preserve the original URL or create an
explicit permanent redirect.

## Stall detection

`/api/public/hooks/publishing-safety-net` runs hourly at minute 17. It treats the
normal pipeline as stalled when the latest non-reserve article is at least 24
hours old.

On the first stalled check it:

- creates a durable open incident in `publishing_alerts`;
- marks the public health endpoint as degraded;
- displays a warning on the editorial dashboard;
- optionally posts JSON to `PUBLISHING_ALERT_WEBHOOK_URL`;
- publishes one prewritten reserve article if the entire publication stream
  has also been quiet for 24 hours.

Reserve publishing is limited to one article per 24-hour gap. When normal
publishing resumes, the incident is marked resolved and the optional webhook
receives a recovery event.

## Reserve inventory

The initial queue contains:

- How Texas County Government Works—and Who Controls What
- Texas Public Information Requests: A Practical Guide
- A Texas Household Emergency Plan That Works Year-Round

Every reserve story is source-backed and exceeds the reader visibility floor.
Publishing is recorded in `reserve_article_publications`, preventing a story
from being released twice.

Add future reserve stories to `RESERVE_ARTICLES`. Each needs a unique `key`,
stable `slugStem`, full article body, FAQs, sources, and at least 800 words of
main prose.

## Feed fallback

The newsroom displays database articles when they are available. If the
database is unavailable, empty, or has no stories for a selected category, it
automatically displays the permanent static library instead. Automated content
therefore adds to the site but is never the site's only content source.
