# Private Heartland Publisher

MCP endpoint: https://keeptxred.com/api/publisher/mcp
Connection guide: https://keeptxred.com/publisher/connect
Plugin source: `plugins/heartland-publisher/` (portable manifest and Codex compatibility overlay).

## Deployment and connection

Reuse `keeptxred-site`, its existing Printify credentials/shop and Supabase service key. Apply the service-only `publisher_state` migration before deploying. Ship through the existing verified-main GitHub Actions deployment, including its production concurrency lock; do not deploy manually or purge caches.

The owner connects the private MCP server in ChatGPT using OAuth with CIMD. Issuer: `https://keeptxred.com/publisher/oauth`; scope: `products:publish`. The server accepts the pinned ChatGPT client metadata URL and its registered callback. This connection is for ChatGPT; arbitrary third-party OAuth clients and local Codex callback URLs are deliberately not accepted.

The consent page uses the existing server-side `ADMIN_PASSCODE`, which must be at least 16 characters. Credentials are entered only at KeepTXRed.com, never in chat. If the existing passcode is shorter, the connection fails closed and the owner must configure a sufficiently strong passcode through the existing secure administration mechanism. Do not weaken this check to get a passing demo.

Install the private package or register its MCP endpoint using the private-plugin controls available to the owner's account. A ZIP is a distributable artifact, not proof that ChatGPT has installed or authenticated the plugin. A signed-out browser cannot finish this account step. Confirm tool discovery in a fresh ordinary conversation after connection.

## One-time product defaults

Call `publisher_catalog` after authenticating. It reads the actual shop sales channel, current configurations, and existing product templates. With owner approval, call `configure_product` for shirt and sticker using an existing approved template product ID. The server copies enabled variants/prices and validates blueprint kind, provider and print position against the live Printify catalog. No hardcoded provider IDs, automatically guessed prices, or new provider subscriptions are introduced.

## Publication flow

1. Generate and approve the artwork in the conversation. `prepare_products` accepts a complete ChatGPT file-param object containing `download_url` and `file_id` (optional `mime_type`, `file_name`). If a generated image cannot be selected as a file, attach its approved PNG. The server cannot scrape or access arbitrary conversation images.
2. Supply a stable `job_id`, metadata, shirt/sticker choices and an explicit website (`keeptxred`, `texasdefined`, `none`). PNG integrity, byte size (20MB), dimensions (40 million pixels), live variants and minimum effective 150-DPI resolution are checked. Signed URLs are restricted to HTTPS OpenAI file hosts and redirects are refused. File URLs and original image bytes are not persisted in Supabase.
3. Preparation uploads the PNG to Printify and records its ID/hash and immutable plan. It creates no products. The user reviews exact variant prices, centered fit placement and destination, then approves `publish_products` with the returned plan token.
4. Publication checkpoints creation before each external POST. A lost response is reconciled using a deterministic product marker. Unknown outcomes are never blindly retried; unmatched or duplicate markers require administrator reconciliation. Jobs are bound to their original shop and input fingerprint. A versioned compare-and-swap lease prevents concurrent job execution.
5. Only an Etsy-connected shop receives channel publication. Submission is not live verification. The server re-reads the product and checks the external Etsy listing URL, public response and product status. Challenges, errors and unavailable pages remain pending.
6. Products with generated mockups are upserted through the shared Printify product mapping. The selected website receives its explicit merchandising flag and category, and the other site's flag is cleared. Durable route intents are also consulted by the established bulk sync. Website URLs use `/shop/{id}` for KTR and `/shop/product/{id}` for TexasDefined. Public page checks must pass before a website result is verified.
7. `check_publication` resumes previously approved work and returns per-product evidence. Claim complete only when `verified:true`; report skipped/ineligible Etsy destinations explicitly.

## Security and operations

OAuth authorization codes use S256 PKCE, pinned client metadata, exact redirects/resource, state and issuer identification. Consent nonces/codes are one-use and expire. One-hour access tokens and rotating refresh tokens are stored only as SHA-256 indexes. Revoking either token invalidates its connection family; changing the admin passcode invalidates existing credentials. Owner login is rate limited to five attempts per IP per fifteen minutes; consent initialization is also bounded. Expired transient records are removed during connection initialization. Job checkpoints persist for ten years to preserve duplicate protection; administrators should archive them only after deciding retries are no longer possible.

The new table has RLS and no anon/authenticated grants or policies. Only the server service role accesses it. Public product data continues through the existing products table and public store APIs. The initial `/api/admin/printify-publish` shared-token endpoint returns 410 to prevent bypassing this workflow.

Publication does not use background fire-and-forget requests. After interruption, timeout or a pending channel response, resume the same job. If a creation marker is absent after an ambiguous request, inspect Printify before changing any checkpoint. Never change `job_id` to bypass uncertainty. Printify uploads may be duplicated on simultaneous preparations, but product mutations require the unique persisted job.

No recurring subscription, automation, queue, worker or database project is created. Normal existing platform usage and Etsy listing fees still apply when the owner authorizes real publication. Automated tests use mocked providers and never create paid listings or place orders.

## Validation and release evidence

Run repository lint, route generation/typecheck, full Vitest suite, production build, and `scripts/database/validate-data-api-grants.mjs` plus `scripts/database/test-data-api-grants.mjs`. The publishing suite covers both product kinds, concurrent requests, changed inputs/shop, uncertain creates/publications, stock changes, unsafe files, public checks, website routing, OAuth and MCP transport. Apply and verify the migration's RLS/grants, inspect security advisors, and verify the existing live Printify health endpoint. After merge, verify the exact production deployment through GitHub Actions, public OAuth/MCP checks, and supported Cloudflare deployment reads.

A completed software deployment is separate from owner-account installation, template approval and the first real approved-artwork publish. Record those as pending until actually exercised; do not claim end-to-end live success from mocks or an HTTP 200 alone.
