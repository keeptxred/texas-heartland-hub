# Printify approved-artwork publisher (initial implementation)

Endpoint: `POST /api/admin/printify-publish`

This feature accepts **approved, print-ready PNG artwork** (base64), creates separate Printify products, and submits each product to the channel connected to the configured Printify shop. It does **not** yet transfer an in-chat generated image automatically, verify an Etsy listing, or publish to KeepTXRed.com. Those must be completed before the one-sentence chat experience works.

## Security
- Configure a new secret `PRODUCT_PUBLISH_SECRET` (at least 32 characters) in the Cloudflare Worker. Never expose it in a browser or ChatGPT transcript.
- Uses existing `PRINTIFY_API_TOKEN` and `PRINTIFY_SHOP_ID`.
- Configure **server-side** JSON secrets `PRINTIFY_SHIRT_CONFIG` and `PRINTIFY_STICKER_CONFIG`; verify available blueprint, provider and variant IDs through the current Printify catalog first.
- Endpoint is mutating **only** with authenticated bearer token and `publish: true`; otherwise returns a dry-run plan.
- `job_id` should be stable for all retries; per-product marker tags prevent most duplicate creations. Concurrent invocations are not yet transactionally locked.
- Confirm the configured Printify shop is connected to Etsy before using `publish: true`. API acceptance is not the same as live listing verification.

## Example (placeholder values)
```json
{
  "job_id": "approved-design-001",
  "artwork_base64": "<base64 PNG data, no data URL prefix>",
  "title": "Keep Texas Red Rebel",
  "description": "Approved original artwork design.",
  "tags": ["texas", "western"],
  "products": ["shirt", "sticker"],
  "website": "keeptxred",
  "publish": false
}
```
After dry-run validation, set `publish: true` and send the same job ID.

## Remaining integration work
1. Secure image handoff from ChatGPT: an authenticated connector/action must be able to retrieve the approved image from its conversation and send the PNG bytes. Simply creating an endpoint does not make it invokable in every chat.
2. Finalize and verify provider/variant defaults and print-area placement for shirt and sticker. A distinct sticker-specific design crop may be necessary.
3. Add persistent idempotency/locking, artwork quality checks and test coverage; verify Printify response against draft product.
4. Connect successful product IDs to the existing `sync-printify` backend; route `publish_keeptxred`/`publish_texasdefined` merchandising flags based on an explicit, server-side website policy.
5. Poll/report Printify channel publish status and actual Etsy listing link; verify website link.
6. Add an end-to-end test and production deploy once configured.

**Warning:** Do not send real publish requests until the above product config and channel have been verified.
