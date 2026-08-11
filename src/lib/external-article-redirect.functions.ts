import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const ALLOWED_EXTERNAL_ARTICLE_HOSTS = new Set(["texasdefined.com", "www.texasdefined.com"]);

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function safeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return null;
    if (!ALLOWED_EXTERNAL_ARTICLE_HOSTS.has(parsed.hostname.toLowerCase())) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export const resolveExternalArticleRedirect = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string().min(1).max(240) }).parse(d))
  .handler(async ({ data }): Promise<{ url: string | null }> => {
    const supabase = client();
    if (!supabase) return { url: null };
    const { data: row, error } = await supabase
      .from("article_external_redirects")
      .select("target_url")
      .eq("old_slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error || !row) return { url: null };
    return { url: safeExternalUrl((row as { target_url?: string | null }).target_url) };
  });
