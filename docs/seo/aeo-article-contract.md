# Keep TX Red article AEO contract

Canonical news articles under `/news/$slug` must preserve the following answer-engine and search signals:

- one self-canonical article URL
- `NewsArticle` JSON-LD with headline, image, `datePublished`, `dateModified`, author, publisher, `mainEntityOfPage`, article section, and entity relationships when available
- `BreadcrumbList` JSON-LD
- FAQ schema only for substantive article-specific questions
- a concise answer-first opening summary generated from verified source facts
- visible official/primary source links when source data is available
- visible key takeaways when provided by the editorial pipeline
- author identity and editorial-standard links

The shared editorial validator enforces an answer-first summary for newly generated coverage. The route-level regression test protects the structured-data and source-display contract from accidental removal.
