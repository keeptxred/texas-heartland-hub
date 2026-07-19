import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function authOk(token: string): boolean {
  const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
  return token === expected;
}

const SavePkgInput = z.object({
  token: z.string().min(1),
  source_title: z.string().min(1),
  source_url: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  facebook: z.object({
    hook: z.string().default(""),
    body: z.string().default(""),
    cta: z.string().default(""),
    hashtags: z.string().default(""),
  }),
  instagram: z.object({
    hook: z.string().default(""),
    script: z.string().default(""),
    caption: z.string().default(""),
    hashtags: z.string().default(""),
  }),
  seo: z.object({
    title: z.string().default(""),
    description: z.string().default(""),
    keywords: z.string().default(""),
  }),
});

export type SavedPackage = {
  id: string;
  source_title: string;
  source_url: string | null;
  category: string | null;
  status: string;
  created_at: string;
  facebook_hook: string | null;
  facebook_body: string | null;
  facebook_cta: string | null;
  facebook_hashtags: string | null;
  instagram_hook: string | null;
  instagram_script: string | null;
  instagram_caption: string | null;
  instagram_hashtags: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
};

export const saveContentPackageFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SavePkgInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; id: string } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("content_packages")
      .insert({
        source_title: data.source_title,
        source_url: data.source_url ?? null,
        category: data.category ?? null,
        facebook_hook: data.facebook.hook,
        facebook_body: data.facebook.body,
        facebook_cta: data.facebook.cta,
        facebook_hashtags: data.facebook.hashtags,
        instagram_hook: data.instagram.hook,
        instagram_script: data.instagram.script,
        instagram_caption: data.instagram.caption,
        instagram_hashtags: data.instagram.hashtags,
        seo_title: data.seo.title,
        seo_description: data.seo.description,
        seo_keywords: data.seo.keywords,
        status: "DRAFT",
      })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: row.id as string };
  });

const TokenInput = z.object({ token: z.string().min(1) });

export const listContentPackagesFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TokenInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; rows: SavedPackage[] } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("content_packages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return { ok: false, error: error.message };
    return { ok: true, rows: (rows ?? []) as SavedPackage[] };
  });

const DeleteInput = z.object({ token: z.string().min(1), id: z.string().uuid() });

export const deleteContentPackageFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    if (!authOk(data.token)) return { ok: false, error: "Unauthorized" };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("content_packages").delete().eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  });