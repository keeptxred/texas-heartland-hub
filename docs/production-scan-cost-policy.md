# Production scan cost policy — KeepTXRed

As of October 15, 2026, routine code updates and Cloudflare deployments must **not** trigger comprehensive sitewide crawls. A full audit is **not** a deployment smoke test. Broad production requests consume Cloudflare Worker CPU and can repeatedly scan unchanged pages.

- A pull request validates changed code, targeted routes, static internal links, and deterministic contracts. It must not fetch every live sitemap URL.
- Production deployments retain lightweight bounded health/route/version checks, including newsroom and other safety-critical signals.
- The complete sitemap/indexability crawler runs once a week (Monday) or when explicitly dispatched, without an automatic deployment or branch-push subscription. It fails closed above 15,000 HTTP requests (including retries).
- The full broken-link audit runs once a week or on explicit dispatch, failing closed above 15,000 live HTTP attempts. Source changes receive static-only broken-link validation in pull requests, with no repeat on merge.
- Article image-readiness repairs remain hourly for their own bounded queue. They no longer carry an unrelated sitemap crawl or restart after every deployment. Manual repair remains available.
- Political-figure end-to-end Chrome acceptance is manually invoked when its particular content changes, not on every unrelated push.

Never reintroduce `workflow_run` deployment subscriptions, unscoped `push: main` triggers, or hourly jobs that execute the complete sitemap/link/image crawl. Reuse a named weekly/manual audit. Full-site reports must identify their URL/request counts and **fail**, not silently truncate, when a budget is exhausted.

This policy does not disable publishing, image recovery, article ingestion, Facebook distribution, canonical pre-merge validation, or core deployment rollback/health safeguards. For a changed page, test the actual affected route and its canonical/robots/links instead of crawling unrelated pages.
