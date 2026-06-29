---
name: No duplicate images per page
description: Hard rule — every page must render visually distinct images across all article cards, previews, and blocks. Enforced via assignUniqueImages helper.
type: constraint
---
No page on keeptxred.com may display the same image twice. This covers the
homepage, Happening Now, category pages, evergreen lists, related-article
sections, and any component that renders multiple article cards.

## How to apply (credit-cheap)

1. Use `assignUniqueImages` from `src/lib/dedupe-images.ts`. It takes the list
   of items, the slug accessor, the candidate image accessor, and an optional
   asset pool. Returns a `Map<slug, uniqueImageUrl>` — collisions get swapped
   for the next unused asset from `DEFAULT_IMAGE_POOL`.
2. Render every `<img src>` via `imageMap.get(slug) ?? fallback`.
3. Never regenerate the article body or layout to fix a duplicate image —
   swap the image only. Keep regeneration scope to the image block.
4. Per-route IMAGE_OVERRIDES maps (see `src/routes/texas-business.tsx`) remain
   valid for hand-curated assignments; pass them in via `getImage`.

## Why

Repeated images on the same page look templated and hurt CTR/Discover signals.
Dedupe runs at render time so it survives daily content rotation and live RSS
ingestion without DB rewrites.

## Storage layer (CMS)

`daily_articles.image_hash` (text, indexed) holds an md5 fingerprint of the
normalized `image_url`. A `BEFORE INSERT OR UPDATE OF image_url` trigger
(`daily_articles_set_image_hash`) keeps it in sync — no app code needs to
compute it. `getDailyArticles` selects `image_hash` so the render-time scanner
can dedupe by hash as well as URL (catches the case where two different URLs
resolve to the same underlying file).

Pass `getHash` to `assignUniqueImages` whenever the source has a stored hash;
omit it for purely client-side asset lists (the helper falls back to URL
fingerprinting automatically).
