import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const IGNORE_FLAG = "chatgpt-admin-ignored";

export const ignoreChatGptArticle = createServerFn({ method: "POST" })
  .validator((d) =>
    z
      .object({
        id: z.string().uuid(),
        token: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSCODE ?? "keeptxred";
    if (data.token !== expected) {
      return { ok: false as const, error: "Unauthorized" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: article, error: readError } = await supabaseAdmin
      .from("daily_articles")
      .select("quality_flags")
      .eq("id", data.id)
      .eq("author", "Keep TX Red Newsroom")
      .maybeSingle();

    if (readError) {
      return { ok: false as const, error: readError.message };
    }
    if (!article) {
      return { ok: false as const, error: "Article not found" };
    }

    const qualityFlags = article.quality_flags ?? [];
    if (qualityFlags.includes(IGNORE_FLAG)) {
      return { ok: true as const };
    }

    const { error: updateError } = await supabaseAdmin
      .from("daily_articles")
      .update({ quality_flags: [...qualityFlags, IGNORE_FLAG] })
      .eq("id", data.id)
      .eq("author", "Keep TX Red Newsroom");

    if (updateError) {
      return { ok: false as const, error: updateError.message };
    }

    return { ok: true as const };
  });
