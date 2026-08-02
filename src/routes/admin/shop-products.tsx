import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = [
  ["", "Unassigned"],
  ["shirts", "T-Shirts"],
  ["hoodies", "Hoodies"],
  ["hats", "Hats"],
  ["drinkware", "Drinkware"],
  ["stickers", "Stickers"],
  ["tote-bags", "Tote Bags"],
  ["accessories", "Accessories"],
] as const;

const COLLECTIONS = [
  ["patriotic", "🇺🇸 Patriotic"],
  ["texas", "🤠 Texas"],
  ["floral", "🌸 Floral"],
  ["conservative", "🦅 Conservative"],
] as const;

type ProductRow = {
  id: string;
  printify_product_id: string | null;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  is_active: boolean;
  category: string | null;
  collections: string[] | null;
  is_featured: boolean;
  is_new: boolean;
  is_on_sale: boolean;
  synced_at: string;
};

export const Route = createFileRoute("/admin/shop-products")({
  head: () => ({ meta: [{ title: "Shop Products — Keep TX Red Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ShopProductsAdmin,
});

function ShopProductsAdmin() {
  const [passcode, setPasscode] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"needs-review" | "published" | "hidden" | "all">("needs-review");

  useEffect(() => {
    const saved = sessionStorage.getItem("ktr-admin-passcode") ?? "";
    if (saved) {
      setPasscode(saved);
      void loadProducts(saved);
    }
  }, []);

  async function loadProducts(token = passcode) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/shop-products", { headers: { "x-admin-passcode": token } });
      const payload = await response.json() as { ok?: boolean; products?: ProductRow[]; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to load products");
      sessionStorage.setItem("ktr-admin-passcode", token);
      setProducts(payload.products ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products");
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct(product: ProductRow) {
    setSaving(product.id);
    setError("");
    try {
      const response = await fetch("/api/admin/shop-products", {
        method: "PATCH",
        headers: { "content-type": "application/json", "x-admin-passcode": passcode },
        body: JSON.stringify({ updates: [{
          id: product.id,
          is_active: product.is_active,
          category: product.category || null,
          collections: product.collections ?? [],
          is_featured: product.is_featured,
          is_new: product.is_new,
          is_on_sale: product.is_on_sale,
        }] }),
      });
      const payload = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to save product");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product");
    } finally {
      setSaving(null);
    }
  }

  function patchLocal(id: string, changes: Partial<ProductRow>) {
    setProducts((current) => current.map((product) => product.id === id ? { ...product, ...changes } : product));
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !needle || product.title.toLowerCase().includes(needle) || product.id.toLowerCase().includes(needle);
      const needsReview = !product.is_active && !product.category;
      const matchesView = view === "all" || (view === "needs-review" && needsReview) || (view === "published" && product.is_active) || (view === "hidden" && !product.is_active && !needsReview);
      return matchesQuery && matchesView;
    });
  }, [products, query, view]);

  if (products.length === 0 && !loading) {
    return (
      <main className="mx-auto max-w-md px-6 py-20">
        <Link to="/admin" className="text-sm font-semibold text-primary hover:underline">← Admin dashboard</Link>
        <h1 className="mt-6 text-3xl font-bold">Shop Products</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the same admin passcode used for the main dashboard.</p>
        <form className="mt-6 space-y-3" onSubmit={(event) => { event.preventDefault(); void loadProducts(); }}>
          <input type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} placeholder="Admin passcode" className="h-11 w-full rounded-md border border-border px-3" />
          <button type="submit" className="h-11 w-full rounded-md bg-primary font-semibold text-primary-foreground">Open shop admin</button>
        </form>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Link to="/admin" className="text-sm font-semibold text-primary hover:underline">← Admin dashboard</Link>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="text-3xl font-bold">Shop Products</h1><p className="mt-1 text-sm text-muted-foreground">Control what appears on KeepTXRed.com. Etsy remains unchanged.</p></div>
            <button onClick={() => void loadProducts()} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold">Refresh</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="h-11 rounded-md border border-border bg-background px-3" />
          <div className="flex gap-2 overflow-x-auto">
            {(["needs-review", "published", "hidden", "all"] as const).map((option) => (
              <button key={option} onClick={() => setView(option)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${view === option ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}>
                {option === "needs-review" ? "Needs Review" : option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {error ? <div className="mt-4 border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
        <p className="mt-4 text-sm font-semibold">{loading ? "Loading…" : `${filtered.length} products`}</p>

        <div className="mt-4 grid gap-4">
          {filtered.map((product) => {
            const collections = product.collections ?? [];
            return (
              <article key={product.id} className="grid gap-4 rounded-xl border border-border bg-background p-4 lg:grid-cols-[96px_minmax(0,1fr)_220px]">
                <img src={product.image_url} alt="" className="h-24 w-24 rounded-lg bg-muted object-cover" />
                <div>
                  <h2 className="font-semibold">{product.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency || "USD" }).format(product.price)}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold">Category
                      <select value={product.category ?? ""} onChange={(event) => patchLocal(product.id, { category: event.target.value || null })} className="mt-1 h-10 w-full rounded-md border border-border bg-background px-2 font-normal">
                        {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <fieldset><legend className="text-sm font-semibold">Collections</legend><div className="mt-1 grid grid-cols-2 gap-2">
                      {COLLECTIONS.map(([value, label]) => <label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={collections.includes(value)} onChange={(event) => patchLocal(product.id, { collections: event.target.checked ? [...collections, value] : collections.filter((item) => item !== value) })} />{label}</label>)}
                    </div></fieldset>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between gap-3 text-sm font-semibold"><span>Publish on website</span><input type="checkbox" checked={product.is_active} onChange={(event) => patchLocal(product.id, { is_active: event.target.checked })} /></label>
                  <label className="flex items-center justify-between gap-3 text-sm"><span>Featured</span><input type="checkbox" checked={product.is_featured} onChange={(event) => patchLocal(product.id, { is_featured: event.target.checked })} /></label>
                  <label className="flex items-center justify-between gap-3 text-sm"><span>New Arrival</span><input type="checkbox" checked={product.is_new} onChange={(event) => patchLocal(product.id, { is_new: event.target.checked })} /></label>
                  <label className="flex items-center justify-between gap-3 text-sm"><span>On Sale</span><input type="checkbox" checked={product.is_on_sale} onChange={(event) => patchLocal(product.id, { is_on_sale: event.target.checked })} /></label>
                  <button onClick={() => void saveProduct(product)} disabled={saving === product.id} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving === product.id ? "Saving…" : "Save product"}</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
