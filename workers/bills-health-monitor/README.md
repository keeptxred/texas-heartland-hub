# KeepTXRed Bills health monitor

Standalone Cloudflare Worker, isolated from the production site. Runs every 15 minutes.

## Provisioning required

1. Create a Cloudflare KV namespace and add binding `HEALTH_STATE` to `wrangler.jsonc`.
2. Set Worker secret `SUPABASE_PUBLISHABLE_KEY` (public publishable key).
3. Set Worker secret `ALERT_WEBHOOK_URL` to an HTTPS endpoint that accepts JSON `{text: string}` (e.g. Slack-compatible webhook).
4. Deploy from this directory with `npx wrangler deploy`.
5. Verify a scheduled invocation, and test an alert transition using a controlled failing endpoint.

The Worker checks the public Bills page and a lightweight Supabase Bills REST query. Logs each check, sends alerts only on state transitions, and sends recovery notifications. Without a configured webhook, logs still record health but no alerts are delivered.

This is an HTTP availability probe, not a PostgreSQL log monitor. Database SQLSTATE 57014 detection requires a separate log source. Do not remove the existing ChatGPT alert until this Worker is deployed and notifications are verified.
