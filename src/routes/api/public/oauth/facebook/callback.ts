import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

const GRAPH_VERSION = "v21.0";

function verifyState(state: string, secret: string): { ok: boolean; origin?: string } {
  const idx = state.lastIndexOf(".");
  if (idx <= 0) return { ok: false };
  const payload = state.slice(0, idx);
  const sig = state.slice(idx + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false };
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof decoded.t !== "number" || Date.now() - decoded.t > 15 * 60 * 1000) {
      return { ok: false };
    }
    return { ok: true, origin: decoded.o };
  } catch {
    return { ok: false };
  }
}

function htmlResult(title: string, message: string, ok: boolean): Response {
  const color = ok ? "#065f46" : "#7f1d1d";
  const bg = ok ? "#ecfdf5" : "#fef2f2";
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;background:${bg};color:${color};padding:2rem;">
<div style="max-width:520px;margin:2rem auto;background:white;border-radius:12px;padding:2rem;box-shadow:0 1px 3px rgba(0,0,0,.08);">
<h1 style="margin-top:0">${title}</h1>
<p>${message}</p>
<p><a href="/admin" style="color:#b91c1c;font-weight:600">Return to Admin →</a></p>
</div></body></html>`;
  return new Response(html, {
    status: ok ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/public/oauth/facebook/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        if (!appId || !appSecret) {
          return htmlResult("Facebook not configured", "FACEBOOK_APP_ID / FACEBOOK_APP_SECRET are missing.", false);
        }
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const err = url.searchParams.get("error_description") ?? url.searchParams.get("error");
        if (err) return htmlResult("Facebook connection cancelled", String(err), false);
        if (!code || !state) return htmlResult("Missing code or state", "The OAuth response was incomplete.", false);
        const verified = verifyState(state, appSecret);
        if (!verified.ok) return htmlResult("Invalid state", "The OAuth state failed verification. Try connecting again.", false);

        const origin = `${url.protocol}//${url.host}`;
        const redirectUri = `${origin}/api/public/oauth/facebook/callback`;

        // 1. Exchange code -> short-lived user token
        const tokenUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`);
        tokenUrl.searchParams.set("client_id", appId);
        tokenUrl.searchParams.set("client_secret", appSecret);
        tokenUrl.searchParams.set("redirect_uri", redirectUri);
        tokenUrl.searchParams.set("code", code);
        const tokenRes = await fetch(tokenUrl.toString());
        const tokenJson = (await tokenRes.json()) as { access_token?: string; error?: { message?: string } };
        if (!tokenRes.ok || !tokenJson.access_token) {
          return htmlResult("Token exchange failed", tokenJson.error?.message ?? "Unknown error", false);
        }

        // 2. Exchange for long-lived user token (~60 days)
        const llUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`);
        llUrl.searchParams.set("grant_type", "fb_exchange_token");
        llUrl.searchParams.set("client_id", appId);
        llUrl.searchParams.set("client_secret", appSecret);
        llUrl.searchParams.set("fb_exchange_token", tokenJson.access_token);
        const llRes = await fetch(llUrl.toString());
        const llJson = (await llRes.json()) as { access_token?: string; expires_in?: number };
        const userToken = llJson.access_token ?? tokenJson.access_token;

        // 3. Fetch pages the user manages (page tokens are long-lived when derived from long-lived user token)
        // DEBUG: inspect what the user actually granted and which pages/business assets FB returns.
        try {
          const [permsRes, meRes, businessesRes] = await Promise.all([
            fetch(`https://graph.facebook.com/${GRAPH_VERSION}/me/permissions?access_token=${encodeURIComponent(userToken)}`),
            fetch(`https://graph.facebook.com/${GRAPH_VERSION}/me?fields=id,name&access_token=${encodeURIComponent(userToken)}`),
            fetch(`https://graph.facebook.com/${GRAPH_VERSION}/me/businesses?access_token=${encodeURIComponent(userToken)}`),
          ]);
          const permsJson = await permsRes.json();
          const meJson = await meRes.json();
          const businessesJson = await businessesRes.json();
          console.log("[fb-oauth-debug] /me/permissions", JSON.stringify(permsJson));
          console.log("[fb-oauth-debug] /me", JSON.stringify(meJson));
          console.log("[fb-oauth-debug] /me/businesses", JSON.stringify(businessesJson));
        } catch (e) {
          console.error("[fb-oauth-debug] permission probe failed", e);
        }
        const pagesRes = await fetch(
          `https://graph.facebook.com/${GRAPH_VERSION}/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(userToken)}`,
        );
        const pagesJson = (await pagesRes.json()) as {
          data?: Array<{ id: string; name: string; access_token: string }>;
          error?: { message?: string };
        };
        console.log("[fb-oauth-debug] /me/accounts status", pagesRes.status, "body", JSON.stringify(pagesJson));
        if (!pagesRes.ok || !pagesJson.data) {
          return htmlResult("Could not list Facebook Pages", pagesJson.error?.message ?? "Unknown error", false);
        }
        if (pagesJson.data.length === 0) {
          return htmlResult(
            "No Facebook Pages available",
            "This account does not manage any Pages, or you did not grant Page access. Re-run the flow and select at least one Page. (Debug logs written server-side — check server function logs for [fb-oauth-debug].)",
            false,
          );
        }
        const page = pagesJson.data[0];

        // 4. Upsert connection row
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: existing } = await supabaseAdmin
          .from("social_connections")
          .select("id")
          .ilike("platform", "facebook")
          .maybeSingle();

        const row = {
          platform: "facebook",
          account_name: page.name,
          account_id: page.id,
          access_token: page.access_token,
          connection_status: "CONNECTED",
          token_expires_at: null as string | null,
          updated_at: new Date().toISOString(),
        };

        if (existing?.id) {
          await supabaseAdmin.from("social_connections").update(row).eq("id", existing.id);
        } else {
          await supabaseAdmin.from("social_connections").insert(row);
        }

        return htmlResult(
          "Facebook connected",
          `Linked Page: <strong>${page.name}</strong>. You can close this tab and return to Admin.`,
          true,
        );
      },
    },
  },
});