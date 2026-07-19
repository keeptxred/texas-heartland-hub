import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function authOk(token: string): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  return token === expected;
}

export type QueueStatus = "DRAFT" | "READY" | "PUBLISHED" | "ARCHIVED";

export type QueueEntry = {
  id: string;
  content_package_id: string;
  platform: string;
  status: QueueStatus;
  scheduled_time: string | null;
  published_time: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  source_title: string | null;
  category: string | null;
};

const AddInput = z.object({
  token: z.string().min(1),
  content_package_id: z.string().uuid(),
  platform: z.string().min(1).max(40),
  notes: z.string().max(2000).nullable().optional(),
});
const TokenInput = z.object({ token: z.string().min(1) });
const StatusInput = z.object({
  token: z.string().min(1),
  id: z.string().uuid(),
  status: z.enum(["DRAFT", "READY", "PUBLISHED", "ARCHIVED"]),
});
const DeleteInput = z.object({ token: z.string().min(1), id: z.string().uuid() });

type QueueRow = Omit<QueueEntry, "source_title" | "category"> & {
  content_packages: { source_title: string | null; category: string | null } | null;
};

type Admin = {
  from: (t: string) => {
    insert: (v: Record<string, unknown>) => {
      select: (c: string) => { single: () => Promise<{ data: QueueRow | null; error: { message: string } | null }> };
    };
    select: (c: string) => {
      order: (col: string, opts: { ascending: boolean }) => Promise<{ data: QueueRow[] | null; error: { message: string } | null }>;
    };
    update: (v: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
    };
    delete: () => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> };
  };
};

async function getAdmin(): Promise<Admin> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as Admin;
}

function flatten(row: QueueRow): QueueEntry {
  const { content_packages, ...rest } = row;
  return {
    ...rest,
    source_title: content_packages?.source_title ?? null,
    category: content_packages?.category ?? null,
  };
}

const SELECT = "*, content_packages(source_title, category)";

export const addQueueEntryFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AddInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; row: QueueEntry } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const client = await getAdmin();
    const { data: row, error } = await client
      .from("publishing_queue")
      .insert({
        content_package_id: data.content_package_id,
        platform: data.platform,
        status: "DRAFT",
        notes: data.notes ?? null,
      })
      .select(SELECT)
      .single();
    if (error || !row) return { ok: false, error: error?.message ?? "Insert failed" };
    return { ok: true, row: flatten(row) };
  });

export const listQueueEntriesFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TokenInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; rows: QueueEntry[] } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const client = await getAdmin();
    const { data: rows, error } = await client
      .from("publishing_queue")
      .select(SELECT)
      .order("created_at", { ascending: false });
    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: (rows ?? []).map(flatten) };
  });

export const updateQueueStatusFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => StatusInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const client = await getAdmin();
    const patch: Record<string, unknown> = { status: data.status };
    if (data.status === "PUBLISHED") patch.published_time = new Date().toISOString();
    const { error } = await client.from("publishing_queue").update(patch).eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });

export const deleteQueueEntryFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const client = await getAdmin();
    const { error } = await client.from("publishing_queue").delete().eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });