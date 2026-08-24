import { createFileRoute } from "@tanstack/react-router";

const ALLOWED_CATEGORIES = ["shirts", "hoodies", "hats", "drinkware", "stickers", "tote-bags", "accessories"] as const;
const ALLOWED_COLLECTIONS = ["patriotic", "texas", "floral", "conservative", "texas-pride", "outdoors", "home", "gifts", "texas-wildlife", "hill-country", "gulf-coast", "bbq", "state-parks", "small-town-texas", "texas-christmas", "holiday"] as const;

type Category = (typeof ALLOWED_CATEGORIES)[number];
type Collection = (typeof ALLOWED_COLLECTIONS)[number];

type ProductUpdate = {
  id: string;
  publish_keeptxred?: boolean;
  publish_texasdefined?: boolean;
  keeptxred_title?: string | null;
  texasdefined_title?: string | null;
  keeptxred_description?: string | null;
  texasdefined_description?: string | null;
  keeptxred_image_url?: string | null;
  texasdefined_image_url?: string | null;
  keeptxred_category?: Category | null;
  texasdefined_category?: Category | null;
  keeptxred_collections?: Collection[];
  texasdefined_collections?: Collection[];
  keeptxred_featured?: boolean;
  texasdefined_featured?: boolean;
  keeptxred_display_order?: number;
  texasdefined_display_order?: number;
  is_new?: boolean;
  is_on_sale?: boolean;
};

function isAuthorized(request: Request) {
  const supplied = request.headers.get("x-admin-passcode") ?? "";
  const expected = process.env.ADMIN_PASSCODE ?? process.env.VITE_ADMIN_PASSCODE ?? "keeptxred";
  return supplied.length > 0 && supplied === expected;
}

function validCategory(value: unknown) {
  return value === undefined || value === null || (typeof value === "string" && ALLOWED_CATEGORIES.includes(value as Category));
}

function validCollections(value: unknown) {
  return value === undefined || (Array.isArray(value) && value.every((item) => typeof item === "string" && ALLOWED_COLLECTIONS.includes(item as Collection)));
}

function validNullableText(value: unknown, max: number) {
  return value === undefined || value === null || (typeof value === "string" && value.length <= max);
}

function validNullableUrl(value: unknown) {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value !== "string" || value.length > 2000) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function validUpdate(value: unknown): value is ProductUpdate {
  if (!value || typeof value !== "object") return false;
  const input = value as Record<string, unknown>;
  if (typeof input.id !== "string" || !input.id) return false;
  if (!validCategory(input.keeptxred_category) || !validCategory(input.texasdefined_category)) return false;
  if (!validCollections(input.keeptxred_collections) || !validCollections(input.texasdefined_collections)) return false;
  if (!validNullableText(input.keeptxred_title, 180) || !validNullableText(input.texasdefined_title, 180)) return false;
  if (!validNullableText(input.keeptxred_description, 5000) || !validNullableText(input.texasdefined_description, 5000)) return false;
  if (!validNullableUrl(input.keeptxred_image_url) || !validNullableUrl(input.texasdefined_image_url)) return false;
  for (const key of ["publish_keeptxred", "publish_texasdefined", "keeptxred_featured", "texasdefined_featured", "is_new", "is_on_sale"] as const) {
    if (input[key] !== undefined && typeof input[key] !== "boolean") return false;
  }
  for (const key of ["keeptxred_display_order", "texasdefined_display_order"] as const) {
    if (input[key] !== undefined && (!Number.isInteger(input[key]) || Number(input[key]) < 0 || Number(input[key]) > 9999)) return false;
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
          .select("id,printify_product_id,title,description,price,currency,image_url,synced_at,publish_keeptxred,publish_texasdefined,keeptxred_title,texasdefined_title,keeptxred_description,texasdefined_description,keeptxred_image_url,texasdefined_image_url,keeptxred_category,texasdefined_category,keeptxred_collections,texasdefined_collections,keeptxred_featured,texasdefined_featured,keeptxred_display_order,texasdefined_display_order,is_new,is_on_sale")
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
          const normalized = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value === "" ? null : value]));
          const compatibilityFields = {
            ...normalized,
            ...(fields.publish_keeptxred !== undefined ? { is_active: fields.publish_keeptxred } : {}),
            ...(fields.keeptxred_category !== undefined ? { category: fields.keeptxred_category } : {}),
            ...(fields.keeptxred_collections !== undefined ? { collections: fields.keeptxred_collections } : {}),
            ...(fields.keeptxred_featured !== undefined ? { is_featured: fields.keeptxred_featured } : {}),
          };
          const { error } = await supabaseAdmin.from("products").update(compatibilityFields).eq("id", id).eq("source", "printify");
          if (error) failures.push({ id, error: error.message });
        }
        if (failures.length > 0) return Response.json({ ok: false, error: "Some updates failed", failures }, { status: 500 });
        return Response.json({ ok: true, updated: updates.length });
      },
    },
  },
});
