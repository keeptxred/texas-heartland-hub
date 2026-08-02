import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_CATEGORIES = [
  "shirts",
  "hoodies",
  "hats",
  "drinkware",
  "stickers",
  "tote-bags",
  "accessories",
] as const;

const ALLOWED_COLLECTIONS = [
  "patriotic",
  "texas",
  "floral",
  "conservative",
] as const;

type Category = (typeof ALLOWED_CATEGORIES)[number];
type Collection = (typeof ALLOWED_COLLECTIONS)[number];

type ProductUpdate = {
  id: string;
  is_active?: boolean;
  category?: Category | null;
  collections?: Collection[];
  is_featured?: boolean;
  is_new?: boolean;
  is_on_sale?: boolean;
};

function isAuthorized(request: Request) {
  const supplied = request.headers.get("x-admin-passcode") ?? "";
  const expected = process.env.ADMIN_PASSCODE ?? process.env.VITE_ADMIN_PASSCODE ?? "keeptxred";
  return supplied.length > 0 && supplied === expected;
}

function validUpdate(value: unknown): value is ProductUpdate {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  if (typeof input.id !== "string" || !input.id) return false;
  if (input.category !== undefined && input.category !== null && !ALLOWED_CATEGORIES.includes(input.category as Category)) return false;
  if (input.collections !== undefined) {
    if (!Array.isArray(input.collections)) return false;
    if (!input.collections.every((item) => typeof item === "string" && ALLOWED_COLLECTIONS.includes(item as Collection))) return false;
  }
  for (const key of ["is_active", "is_featured", "is_new", "is_on_sale"] as const) {
    if (input[key] !== undefined && typeof input[key] !== "boolean") return false;
  }
  return true;
}

export const Route = createFileRoute("/api/admin/shop-products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAuthorized(request)) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("products")
          .select("id,printify_product_id,title,price,currency,image_url,is_active,category,collections,is_featured,is_new,is_on_sale,synced_at")
          .eq("source", "printify")
          .order("synced_at", { ascending: false })
          .limit(500);
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        return Response.json({ ok: true, products: data ?? [] });
      },
      PATCH: async ({ request }) => {
        if (!isAuthorized(request)) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
        const body = await request.json().catch(() => null) as { updates?: unknown[] } | null;
        const updates = body?.updates;
        if (!Array.isArray(updates) || updates.length === 0 || updates.length > 100 || !updates.every(validUpdate)) {
          return Response.json({ ok: false, error: "Invalid product updates" }, { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const failures: Array<{ id: string; error: string }> = [];
        for (const update of updates as ProductUpdate[]) {
          const { id, ...fields } = update;
          const { error } = await supabaseAdmin.from("products").update(fields).eq("id", id).eq("source", "printify");
          if (error) failures.push({ id, error: error.message });
        }
        if (failures.length > 0) return Response.json({ ok: false, error: "Some updates failed", failures }, { status: 500 });
        return Response.json({ ok: true, updated: updates.length });
      },
    },
  },
});
