import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import {
  facebookPlatformForPage,
  facebookPlatformForTarget,
  type FacebookOAuthTarget,
} from "@/lib/facebook-page-platform";

const GRAPH_VERSION = "v21.0";

type FacebookPage = { id: string; name: string; access_token?: string };

type VerifiedState = {
  ok: boolean;
  origin?: string;
  target?: FacebookOAuthTarget;
};

function verifyState(state: string, secret: string): VerifiedState {
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
    const target: FacebookOAuthTarget | undefined =
      decoded.target === "texasdefined"
        ? "texasdefined"
        : decoded.target === "keeptxred"
          ? "keeptxred"
          : undefined;
    return { ok: true, origin: decoded.o, target };
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

function safePageSummary(pages: FacebookPage[] | undefined) {
  return (pages ?? []).map((page) => ({
    id: page.id,
    name: page.name,
    platform: facebookPlatformForPage(page),
    has_access_token: Boolean(page.access_token),
  }));
}

export const Route = createFileRoute("/api/public/oauth/facebook/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        if (!appId || !appSecret) {
          return htmlResult(
            "Facebook not configured",
            "FACEBOOK_APP_ID / FACEBOOK_APP_SECRET are missing.",
            false,
          );
        }

        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const err = url.searchParams.get("error_description") ?? url.searchParams.get("error");
        if (err) return htmlResult("Facebook connection cancelled", String(err), false);
        if (!code || !state) {
          return htmlResult("Missing code or state", "The OAuth response was incomplete.", false);
        }

        const verified = verifyState(state, appSecret);
        if (!verified.ok) {
          return htmlResult(
            "Invalid state",
            "The OAuth state failed verification. Try connecting again.",
            false,
          );
        }

        // Legacy state values created before target-specific OAuth default to Keep TX Red.
        const target: FacebookOAuthTarget = verified.target ?? "keeptxred";
        const expectedPlatform = facebookPlatformForTarget(target);
        const targetLabel = target === "texasdefined" ? "Texas Defined" : "Keep TX Red";

        const origin = `${url.protocol}//${url.host}`;
        const redirectUri = `${origin}/api/public/oauth/facebook/callback`;

        const tokenUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`);
        tokenUrl.searchParams.set("client_id", appId);
        tokenUrl.searchParams.set("client_secret", appSecret);
        tokenUrl.searchParams.set("redirect_uri", redirectUri);
        tokenUrl.searchParams.set("code", code);
        const tokenRes = await fetch(tokenUrl.toString());
        const tokenJson = (await tokenRes.json()) as {
          access_token?: string;
          error?: { message?: string };
        };
        if (!tokenRes.ok || !tokenJson.access_token) {
          return htmlResult(
            "Token exchange failed",
            tokenJson.error?.message ?? "Unknown error",
            false,
          );
        }

        const llUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`);
        llUrl.searchParams.set("grant_type", "fb_exchange_token");
        llUrl.searchParams.set("client_id", appId);
        llUrl.searchParams.set("client_secret", appSecret);
        llUrl.searchParams.set("fb_exchange_token", tokenJson.access_token);
        const llRes = await fetch(llUrl.toString());
        const llJson = (await llRes.json()) as { access_token?: string; expires_in?: number };
        const userToken = llJson.access_token ?? tokenJson.access_token;

        const pagesRes = await fetch(
          `https://graph.facebook.com/${GRAPH_VERSION}/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(userToken)}`,
        );
        const pagesJson = (await pagesRes.json()) as {
          data?: FacebookPage[];
          error?: { message?: string };
        };
        console.log("[fb-oauth] /me/accounts", {
          target,
          status: pagesRes.status,
          page_count: pagesJson.data?.length ?? 0,
          pages: safePageSummary(pagesJson.data),
          error: pagesJson.error?.message ?? null,
        });

        if (!pagesRes.ok || !pagesJson.data) {
          return htmlResult(
            "Could not list Facebook Pages",
            pagesJson.error?.message ?? "Unknown error",
            false,
          );
        }
        if (pagesJson.data.length === 0) {
          return htmlResult(
            "No Facebook Pages available",
            `Facebook did not return the ${targetLabel} Page. Reconnect that Page and select its own business portfolio in Meta.`,
            false,
          );
        }

        const managedPages = pagesJson.data
          .map((page) => ({ page, platform: facebookPlatformForPage(page) }))
          .filter(
            (
              item,
            ): item is {
              page: FacebookPage & { access_token: string };
              platform: NonNullable<ReturnType<typeof facebookPlatformForPage>>;
            } => Boolean(item.platform && item.page.access_token),
          );

        const targetPages = managedPages.filter((item) => item.platform === expectedPlatform);
        if (targetPages.length === 0) {
          return htmlResult(
            `${targetLabel} Page not available`,
            `Facebook did not return a usable token for ${targetLabel}. In the Meta chooser, select the ${targetLabel} business portfolio and Page, then continue.`,
            false,
          );
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const savedNames: string[] = [];
        for (const { page, platform } of targetPages) {
          const { data: existing, error: lookupError } = await supabaseAdmin
            .from("social_connections")
            .select("id")
            .ilike("platform", platform)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (lookupError) {
            console.error("[fb-oauth] connection lookup failed", {
              platform,
              page_id: page.id,
              error: lookupError.message,
            });
            return htmlResult(
              "Could not save Facebook connection",
              `Database lookup failed for ${page.name}.`,
              false,
            );
          }

          const row = {
            platform,
            account_name: page.name,
            account_id: page.id,
            access_token: page.access_token,
            connection_status: "CONNECTED",
            token_expires_at: null as string | null,
            updated_at: new Date().toISOString(),
          };

          const write = existing?.id
            ? await supabaseAdmin.from("social_connections").update(row).eq("id", existing.id)
            : await supabaseAdmin.from("social_connections").insert(row);

          if (write.error) {
            console.error("[fb-oauth] connection write failed", {
              platform,
              page_id: page.id,
              error: write.error.message,
            });
            return htmlResult(
              "Could not save Facebook connection",
              `Database update failed for ${page.name}.`,
              false,
            );
          }

          savedNames.push(page.name);
          console.log("[fb-oauth] stored Facebook Page", {
            target,
            platform,
            page_id: page.id,
            page_name: page.name,
            has_page_access_token: true,
          });
        }

        return htmlResult(
          "Facebook connected",
          `Linked Page: <strong>${savedNames.join(", ")}</strong>. You can close this tab and return to Admin.`,
          true,
        );
      },
    },
  },
});
