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