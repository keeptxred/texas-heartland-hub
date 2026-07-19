import { createFileRoute } from "@tanstack/react-router";
import { createHmac, randomBytes } from "crypto";

const GRAPH_VERSION = "v21.0";
const SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "public_profile",
].join(",");

function signState(payload: string, secret: string): string {
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export const Route = createFileRoute("/api/public/oauth/facebook/start")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        if (!appId || !appSecret) {
          return new Response("Facebook OAuth not configured", { status: 500 });
        }
        const url = new URL(request.url);
        const passcode = url.searchParams.get("t") ?? "";
        const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
        if (passcode !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        const origin = `${url.protocol}//${url.host}`;
        const redirectUri = `${origin}/api/public/oauth/facebook/callback`;
        const nonce = randomBytes(16).toString("hex");
        const payload = Buffer.from(
          JSON.stringify({ n: nonce, o: origin, t: Date.now() }),
        ).toString("base64url");
        const state = signState(payload, appSecret);
        const authorize = new URL(`https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`);
        authorize.searchParams.set("client_id", appId);
        authorize.searchParams.set("redirect_uri", redirectUri);
        authorize.searchParams.set("state", state);
        authorize.searchParams.set("scope", SCOPES);
        authorize.searchParams.set("response_type", "code");
        return Response.redirect(authorize.toString(), 302);
      },
    },
  },
});