---
name: publish-artwork
description: Publish user-approved shirt or sticker artwork using the private Heartland Publisher connection to Printify, Etsy and the KeepTXRed or TexasDefined store.
---

Use the connected Heartland Publisher tools for this workflow. Credentials belong only in the secure OAuth browser flow at keeptxred.com, never in a conversation or a tool argument. Connection instructions: https://keeptxred.com/publisher/connect.

1. Call `publisher_catalog` to inspect the actual shop channel and saved shirt/sticker defaults. When defaults are missing, select an existing user-approved template, show its enabled variants and prices, and call `configure_product` with explicit user approval. This copies prices; it does not invent provider IDs or product prices.
2. Generate/edit artwork with the conversation's image tools when requested. Obtain approval of the finished artwork. Use the exact approved PNG as `artwork` for `prepare_products`; the host resolves the file input. If the generated image cannot be handed off as a file, ask the user to attach that approved PNG. Never fabricate a download URL, scrape a conversation, or send a local path to the server.
3. Select `website` from the user's explicit destination: `keeptxred`, `texasdefined`, or `none`. Ask when the brand is ambiguous. Use one stable `job_id` for the artwork, products, metadata, and destination. Reuse it for every retry. The server rejects changed input under an existing ID.
4. Call `prepare_products` with `artwork_approved:true`. It checks PNG integrity, resolution, current provider variants and prices, and uploads artwork without creating products. Show the returned variants, prices, centered fit placement and destination. Get explicit approval of this plan before calling `publish_products` with its `approval_token` and `approved:true`.
5. Call `check_publication` while status is pending, with bounded checks and backoff. It may resume writes already authorized for this job. An uncertain create is reconciled by its marker; the server will not blindly repeat it. If manual reconciliation is needed, report the product/job identifiers and uncertainty; do not bypass the checkpoint by starting another job.
6. Report each product's verified Etsy and website links. Treat submitted, pending, blocked public checks, and channel-ineligible Etsy publication separately. Claim complete publication only when the tool returns `verified:true` for all requested destinations. Never claim a listing is live because Printify accepted a publish request.

The configured shop is fixed server-side. This workflow never places orders, changes account connections, or purchases subscriptions. If authentication expires, use the plugin's normal OAuth reconnect flow; never request Cloudflare credentials or reconnection for publishing.
