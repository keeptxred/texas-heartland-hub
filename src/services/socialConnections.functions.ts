import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function authOk(token: string): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  return token === expected;
}

export type SocialConnection = {
  id: string;
  platform: string;
  account_name: string;
  account_id: string | null;
  connection_status: string;
  token_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

const TokenInput = z.object({ token: z.string().min(1) });
const PlatformInput = z.object({
  token: z.string().min(1),
  platform: z.enum(["facebook", "instagram"]),
});

type Admin = {
  from: (t: string) => {
    select: (c: string) => {
      order: (
        col: string,
        opts: { ascending: boolean },
      ) => Promise<{ data: SocialConnection[] | null; error: { message: string } | null }>;
    };
  };
};

async function getAdmin(): Promise<Admin> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as Admin;
}

export const listSocialConnectionsFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TokenInput.parse(d))
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; rows: SocialConnection[] } | { ok: false; error: string }> => {
      if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
      const client = await getAdmin();
      const { data: rows, error } = await client
        .from("social_connections")
        .select("id, platform, account_name, account_id, connection_status, token_expires_at, created_at, updated_at")
        .order("created_at", { ascending: true });
      if (error) return { ok: false, error: error.message };
      return { ok: true, rows: rows ?? [] };
    },
  );

export const disconnectSocialFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlatformInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("social_connections")
      .delete()
      .ilike("platform", data.platform);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

export const testSocialConnectionFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlatformInput.parse(d))
  .handler(
    async ({ data }): Promise<{ ok: boolean; account?: string; error?: string }> => {
      if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row } = await supabaseAdmin
        .from("social_connections")
        .select("account_id, account_name, access_token, connection_status")
        .ilike("platform", data.platform)
        .maybeSingle();
      if (!row || !row.access_token) return { ok: false, error: "Not connected" };
      const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(String(row.account_id))}?fields=id,name,fan_count&access_token=${encodeURIComponent(String(row.access_token))}`;
      try {
        const res = await fetch(url);
        const json = (await res.json()) as { name?: string; error?: { message?: string } };
        if (!res.ok || json.error) {
          await supabaseAdmin
            .from("social_connections")
            .update({ connection_status: "ERROR" })
            .ilike("platform", data.platform);
          return { ok: false, error: json.error?.message ?? `HTTP ${res.status}` };
        }
        return { ok: true, account: json.name ?? row.account_name };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
  );