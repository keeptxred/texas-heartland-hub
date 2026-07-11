# Fix AI Featured Image Generator — Subject-Accurate Prompts + Validation

The current `buildImagePrompt` in `src/lib/featured-image.functions.ts` leans on `category` and generic "editorial photography" language, so stories like *"Australian Spotted Jellyfish Migration Reaches Texas Coast"* get generic newsroom scenes. Fix the prompt to lock onto the article's actual subject and add a validator that rejects off-topic images before we save them.

## 1. Subject extraction (new)

Add a helper `extractImageSubject(article)` in `src/lib/featured-image.functions.ts` that returns a structured subject the prompt builder can use:

- **Title** (primary anchor)
- **First paragraph** — pulled from `body_json.intro` or the first section's paragraph, truncated to ~400 chars
- **Named entities** — reuse `extractEntities` from `src/lib/nlp.ts`
- **Locations** — from `affected_regions` + entities that match places
- **Animals / species / objects / events** — via a lightweight keyword pass (jellyfish, hurricane, oil rig, flood, etc.) plus a small LLM-assisted extraction fallback using `google/gemini-3.1-flash-lite` for one JSON call when the keyword pass finds nothing concrete
- **Domain hint** — wildlife / weather / infrastructure / politics / sports / business (derived, not the DB `category`)

The DB `category` field is used only as a *tiebreaker*, never as the main subject.

## 2. Rewrite `buildImagePrompt`

New prompt structure:

1. Lead with the concrete subject: *"Photograph of Australian spotted jellyfish (Phyllorhiza punctata) drifting in shallow Gulf of Mexico coastal water near Galveston, Texas."*
2. Include location + environmental context when present.
3. Editorial style line stays, but is demoted below the subject.
4. Expanded **hard-avoid list** (always on unless the article is literally about them):
   - newspapers, stacks of paper, printing presses
   - reporters, microphones, press conferences, news anchors, TV studios
   - laptops / computers / generic office scenes / desks
   - stock "breaking news" graphics
   - Texas Capitol dome / flags (existing rule kept)
5. Domain-specific steering:
   - **wildlife/environment** → depict the species in habitat, correct anatomy, natural lighting
   - **weather** → the phenomenon + affected landscape
   - **infrastructure/energy** → the actual asset (rig, grid, pipeline)
   - **policy/legislative** → allow capitol/officials only when title mentions them

## 3. AI validation step (new)

Add `validateImageMatchesArticle(imageBytes, article)`:

- Calls `google/gemini-2.5-flash` (vision) via the Lovable AI Gateway chat endpoint with the image (base64) + a short question: *"Does this image clearly depict the main subject of an article titled '<title>' about <subject summary>? Reply strict JSON: {\"matches\": boolean, \"reason\": string}."*
- If `matches === false`, regenerate **once** with a strengthened prompt that appends the validator's `reason` as an explicit "must depict / must not depict" instruction.
- After one retry, save the best attempt and set `image_generation_status = "ready"` but log the validator verdict in a new nullable `image_validation_note` text column (added via migration) so admins can spot weak matches.

Validation is skipped only if the gateway validator call itself errors (fail-open, don't block the pipeline).

## 4. Migration

One migration adds `image_validation_note text` to `daily_articles`. No other schema changes; existing `featured_image_url`, `image_prompt`, `image_generation_status`, `image_alt_text` are reused.

## 5. Regeneration / backfill

- `regenerateFeaturedImage` (admin) and `backfillBatch` both go through the new pipeline automatically — no route or admin UI changes needed.
- Existing generic images stay until an admin clicks "Regenerate Featured Image" on that article, or backfill is re-run with an `?overwrite=1` flag (small addition to the backfill route).

## What is NOT changing

- No changes to article slugs, URLs, sitemap, existing SEO fields, article body, or the storage bucket / public passthrough route.
- Model stays **Nano Banana 2** (`google/gemini-3.1-flash-image`); only the *prompt* and a *validator call* change.
- Admin auth stays on the existing `/admin` passcode gate.

## Files touched

- `src/lib/featured-image.functions.ts` — new `extractImageSubject`, rewritten `buildImagePrompt`, new `validateImageMatchesArticle`, updated `generateAndStore` to run validate → retry once → save note.
- `src/routes/api/public/hooks/backfill-featured-images.ts` — accept `?overwrite=1`.
- New migration: `add image_validation_note to daily_articles`.
