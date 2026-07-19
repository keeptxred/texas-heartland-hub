import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function authOk(token: string): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  return token === expected;
}

export type ReelCandidate = {
  id: string;
  source_platform: string;
  source_account: string;
  source_url: string;
  title: string | null;
  topic: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const AddInput = z.object({
  token: z.string().min(1),
  source_platform: z.string().min(1).max(40),
  source_account: z.string().min(1).max(120),
  source_url: z.string().url(),
  title: z.string().max(300).nullable().optional(),
  topic: z.string().max(120).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const addReelCandidateFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AddInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; row: ReelCandidate } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin as unknown as {
      from: (t: string) => {
        insert: (v: Record<string, unknown>) => {
          select: (c: string) => { single: () => Promise<{ data: ReelCandidate | null; error: { message: string } | null }> };
        };
      };
    };
    const { data: row, error } = await client
      .from("reel_candidates")
      .insert({
        source_platform: data.source_platform,
        source_account: data.source_account,
        source_url: data.source_url,
        title: data.title ?? null,
        topic: data.topic ?? null,
        notes: data.notes ?? null,
        status: "NEW",
      })
      .select("*")
      .single();
    if (error || !row) return { ok: false, error: error?.message ?? "Insert failed" };
    return { ok: true, row };
  });

const TokenInput = z.object({ token: z.string().min(1) });

export const listReelCandidatesFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TokenInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; rows: ReelCandidate[] } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin as unknown as {
      from: (t: string) => {
        select: (c: string) => {
          order: (col: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: ReelCandidate[] | null; error: { message: string } | null }>;
          };
        };
      };
    };
    const { data: rows, error } = await client
      .from("reel_candidates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: rows ?? [] };
  });

const StatusInput = z.object({
  token: z.string().min(1),
  id: z.string().uuid(),
  status: z.enum(["NEW", "APPROVED", "SKIPPED"]),
});

export const updateReelCandidateStatusFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => StatusInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin as unknown as {
      from: (t: string) => {
        update: (v: Record<string, unknown>) => {
          eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
        };
      };
    };
    const { error } = await client
      .from("reel_candidates")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

const DeleteInput = z.object({ token: z.string().min(1), id: z.string().uuid() });

export const deleteReelCandidateFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const client = supabaseAdmin as unknown as {
      from: (t: string) => {
        delete: () => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> };
      };
    };
    const { error } = await client.from("reel_candidates").delete().eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });