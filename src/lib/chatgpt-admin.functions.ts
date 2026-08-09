import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

type DailyArticleUpdate = Database["public"]["Tables"]["daily_articles"]["Update"] & {
  chatgpt_admin_ignored?: boolean;
};

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
    const update: DailyArticleUpdate = { chatgpt_admin_ignored: true };
    const { error } = await supabaseAdmin
      .from("daily_articles")
      .update(update)
      .eq("id", data.id)
      .eq("author", "Keep TX Red Newsroom");

    if (error) {
      return { ok: false as const, error: error.message };
    }

    return { ok: true as const };
  });
