# Keep TX Red index-quality contract

Keep TX Red should expose one indexable URL for each editorial intent.

## Indexable

A page may be advertised in a primary sitemap only when it is the canonical destination, contains substantial user-facing content, and owns a distinct search intent.

## Redirect aliases

Legacy, duplicate, renamed, or migrated routes should use a permanent redirect to the canonical destination and must not appear in primary sitemaps or Search Console priority URL sets.

## Noindex

Temporary, filtered, thin, incomplete, or utility views may remain crawlable for discovery and navigation, but must use `noindex,follow` and stay out of primary sitemaps.

## Gone

URLs with no replacement and no ongoing user value should return 404/410 and must not be linked internally or advertised in sitemaps.

## Current consolidations

- `/texas-news` -> `/news`: the old culture/lifestyle framing no longer owns a distinct Keep TX Red intent after the TexasDefined split.
- `/texas-law-policy` -> `/laws`: the former broad law-policy hub overlaps the canonical Laws & Legislature pillar.
- `/texas-laws` -> `/laws`: legacy duplicate law hub.
- `/laws-to-know` -> `/laws`.
- `/legislative-updates` -> `/bills`.
- `/elections` -> `/elections/2026`.

## Guardrail

Redirect/noindex aliases must never be restored to primary sitemaps or priority submission lists. Internal links should point directly to canonical destinations rather than relying on redirects.
