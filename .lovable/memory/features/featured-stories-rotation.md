---
name: Featured Stories daily rotation
description: Homepage Featured Stories must rotate to a new lead + featured set every day (America/Chicago)
type: feature
---
The homepage "Featured Stories" section MUST present a different lineup every calendar day in America/Chicago.

Implementation (see `src/routes/index.tsx`):
- Build `featuredPool` from the newest ~20 published articles (sorted desc).
- Derive `dayKey` from today's date string in `America/Chicago` and rotate by `dayKey % pool.length`.
- `lead` = rotated[0]; `featured` = rotated[1..5].
- "Latest Updates" excludes slugs currently shown in Featured Stories to avoid duplicate cards.

Do not revert to a static `sorted[0]` lead — that breaks the daily rotation rule.
