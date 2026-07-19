import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function authOk(token: string): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  return token === expected;
}

export type ContentSource = {
  id: string;
  platform: string;
  source_name: string;
  source_url: string | null;
  category: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const BaseFields = {
  platform: z.string().min(1).max(40),
  source_name: z.string().min(1).max(160),
  source_url: z.string().url().max(500).nullable().optional(),
  category: z.string().max(120).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
};

const AddInput = z.object({ token: z.string().min(1), ...BaseFields });
const TokenInput = z.object({ token: z.string().min(1) });
const UpdateInput = z.object({ token: z.string().min(1), id: z.string().uuid(), ...BaseFields });
const DeleteInput = z.object({ token: z.string().min(1), id: z.string().uuid() });

type Admin = {
  from: (t: string) => {
    insert: (v: Record<string, unknown>) => {
      select: (c: string) => { single: () => Promise<{ data: ContentSource | null; error: { message: string } | null }> };
    };
    select: (c: string) => {
      order: (col: string, opts: { ascending: boolean }) => Promise<{ data: ContentSource[] | null; error: { message: string } | null }>;
    };
    update: (v: Record<string, unknown>) => {
      eq: (col: string, val: string) => {
        select: (c: string) => { single: () => Promise<{ data: ContentSource | null; error: { message: string } | null }> };
      };
    };
    delete: () => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> };
  };
};

async function getAdmin(): Promise<Admin> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as Admin;
}

export const addContentSourceFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AddInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; row: ContentSource } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const client = await getAdmin();
    const { data: row, error } = await client
      .from("content_sources")
      .insert({
        platform: data.platform,
        source_name: data.source_name,
        source_url: data.source_url ?? null,
        category: data.category ?? null,
        notes: data.notes ?? null,
      })
      .select("*")
      .single();
    if (error || !row) return { ok: false, error: error?.message ?? "Insert failed" };
    return { ok: true, row };
  });

export const listContentSourcesFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TokenInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; rows: ContentSource[] } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const client = await getAdmin();
    const { data: rows, error } = await client
      .from("content_sources")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: rows ?? [] };
  });

export const updateContentSourceFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UpdateInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; row: ContentSource } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const client = await getAdmin();
    const { data: row, error } = await client
      .from("content_sources")
      .update({
        platform: data.platform,
        source_name: data.source_name,
        source_url: data.source_url ?? null,
        category: data.category ?? null,
        notes: data.notes ?? null,
      })
      .eq("id", data.id)
      .select("*")
      .single();
    if (error || !row) return { ok: false, error: error?.message ?? "Update failed" };
    return { ok: true, row };
  });

export const deleteContentSourceFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const client = await getAdmin();
    const { error } = await client.from("content_sources").delete().eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });