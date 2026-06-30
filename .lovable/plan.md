## Problem
The article at `/news/live-2026-06-30-dallas-barbecue-hotspot-sees-record-tourism-numbers-during-world-cup-xexg9e` currently shows an unrelated stock image. The user uploaded a photo of Terry Black's BBQ (bbq.jpg) that is directly relevant to the story.

## Plan
1. **Upload the BBQ photo to Lovable Assets CDN** so it has a stable, fast-loading URL.
2. **Update the `daily_articles` Supabase row** for slug `live-2026-06-30-dallas-barbecue-hotspot-sees-record-tourism-numbers-during-world-cup-xexg9e` to set `image_url` to the new CDN asset URL.
3. **Verify** the article page renders with the new image in the preview.

## Scope
- One-time fix for this single article only.
- No changes to the generation pipeline or other articles.

## Technical Detail
The article is an AI-generated evergreen stored in the `daily_articles` table. Its `image_url` column drives the hero image on the `news.$slug.tsx` route. Updating that column is sufficient to swap the image sitewide (article page, homepage cards, category listings, etc.).