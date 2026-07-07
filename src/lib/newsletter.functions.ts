import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SubscribeSchema = z.object({
  email: z.string().email().max(254),
  source_page: z.string().max(300).optional().nullable(),
});

/**
 * Public newsletter subscribe endpoint. Uses the publishable-key server
 * client so writes go through the RLS INSERT policy on newsletter_signups.
 * Duplicate emails succeed silently (dedupe unique index).
 */
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubscribeSchema.parse(input))
  .handler(async ({ data }) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) {
      return { ok: false, error: "Newsletter is temporarily unavailable." };
    }
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, publishableKey, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { error } = await supabase.from("newsletter_signups").insert({
      email: data.email.trim().toLowerCase(),
      source_page: data.source_page ?? null,
    });
    if (error) {
      // Duplicate on lower(email) unique index → treat as success.
      if (/duplicate|unique/i.test(error.message)) return { ok: true, alreadySubscribed: true };
      return { ok: false, error: "Could not subscribe right now. Please try again." };
    }
    return { ok: true };
  });