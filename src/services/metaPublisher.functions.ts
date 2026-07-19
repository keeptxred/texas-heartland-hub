import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function authOk(token: string): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  return token === expected;
}

const Input = z.object({
  token: z.string().min(1),
  package_id: z.string().uuid(),
  queue_id: z.string().uuid().optional(),
});

export type PublishResult =
  | { ok: true; posted_at: string; external_id: string | null }
  | { ok: false; error: string; requires_connection?: boolean };

async function checkConnection(platform: "facebook" | "instagram"): Promise<{ connected: boolean; reason: string }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("social_connections")
    .select("connection_status")
    .ilike("platform", platform)
    .maybeSingle();
  if (!data || data.connection_status !== "CONNECTED") {
    return { connected: false, reason: `${platform === "facebook" ? "Facebook Page" : "Instagram Business"} is not connected. Connect it in Social Connections first.` };
  }
  return { connected: true, reason: "" };
}

export const publishFacebookPostFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<PublishResult> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const c = await checkConnection("facebook");
    if (!c.connected) return { ok: false, error: c.reason, requires_connection: true };
    // Actual Meta Graph API call will be implemented once OAuth credentials are configured.
    return { ok: false, error: "Meta Graph API not enabled. Complete Facebook connection to publish.", requires_connection: true };
  });

export const publishInstagramPostFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<PublishResult> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const c = await checkConnection("instagram");
    if (!c.connected) return { ok: false, error: c.reason, requires_connection: true };
    return { ok: false, error: "Meta Graph API not enabled. Complete Instagram connection to publish.", requires_connection: true };
  });