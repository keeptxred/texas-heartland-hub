import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SITE_URL } from "@/lib/seo";
import { getProducts, type Product } from "@/lib/products.functions";
import { useCart } from "@/lib/cart-context";
import { seoTitle, seoAlt } from "@/lib/shop-seo";

const productsQuery = queryOptions({
  queryKey: ["products", "listings"],
  queryFn: () => getProducts(),
  staleTime: 5 * 60 * 1000,
});

const SHOP_TITLE = "Texas Patriotic Shirts, Hats & Conservative Apparel | Keep Texas Red";
const SHOP_DESC = "Shop Texas patriotic shirts, conservative apparel, hats, hoodies, stickers, tote bags and gifts for proud Texans. Secure checkout with new designs added regularly.";
const SHOP_OG_TITLE = "Texas Patriotic Apparel | Keep Texas Red Shop";
const SHOP_OG_DESC = "Texas patriotic shirts, hats, hoodies and gifts designed for Texans.";
const SHOP_KEYWORDS = "Texas shirts, Texas apparel, Texas patriotic apparel, Texas conservative apparel, Texas gifts, Texas hats, Texas hoodies, Texas stickers, Keep Texas Red, Texas merchandise, Texas flag shirt, Lone Star apparel";
const SHOP_OG_IMAGE = `${SITE_URL}/og/shop.jpg`;

const SHOP_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "shirts", label: "T-Shirts" },
  { slug: "hoodies", label: "Hoodies" },
  { slug: "hats", label: "Hats" },
  { slug: "drinkware", label: "Drinkware" },
  { slug: "stickers", label: "Stickers" },
  { slug: "tote-bags", label: "Tote Bags" },
  { slug: "accessories", label: "Accessories" },
] as const;

const SHOP_COLLECTIONS = [
  { slug: "all", label: "All Collections" },
  { slug: "patriotic", label: "🇺🇸 Patriotic" },
  { slug: "texas", label: "🤠 Texas" },
  { slug: "floral", label: "🌸 Floral" },
  { slug: "conservative", label: "🦅 Conservative" },
  { slug: "new-arrivals", label: "⭐ New Arrivals" },
  { slug: "on-sale", label: "🔥 On Sale" },
] as const;

const SHOP_SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best Selling" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
] as const;

type ShopCategory = (typeof SHOP_CATEGORIES)[number]["slug"];
type ShopCollection = (typeof SHOP_COLLECTIONS)[number]["slug"];
type ShopSort = (typeof SHOP_SORT_OPTIONS)[number]["value"];

function isShopCategory(value: unknown): value is ShopCategory {
  return typeof value === "string" && SHOP_CATEGORIES.some((item) => item.slug === value);
}

function isShopCollection(value: unknown): value is ShopCollection {
  return typeof value === "string" && SHOP_COLLECTIONS.some((item) => item.slug === value);
}

function isShopSort(value: unknown): value is ShopSort {
  return typeof value === "string" && SHOP_SORT_OPTIONS.some((item) => item.value === value);
}

function productSearchText(product: Product) {
  return [product.title, product.description, ...(product.tags ?? [])].join(" ").toLowerCase();
}

function productMatchesCategory(product: Product, category: ShopCategory) {
  return category === "all" || product.category === category;
}

function productMatchesCollection(product: Product, collection: ShopCollection) {
  if (collection === "all") return true;
  if (collection === "new-arrivals") return product.isNew === true;
  if (collection === "on-sale") return product.isOnSale === true;
  return product.collections?.includes(collection) ?? false;
}

function isBestSeller(product: Product) {
  const tags = product.tags ?? [];
  return tags.some((tag) => {
    const normalized = tag.toLowerCase();
    return normalized === "best seller" || normalized === "bestseller" || normalized === "best-selling";
  });
}

export const Route = createFileRoute("/shop/")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: isShopCategory(search.category) && search.category !== "all" ? search.category : undefined,
    collection: isShopCollection(search.collection) && search.collection !== "all" ? search.collection : undefined,
    q: typeof search.q === "string" && search.q.trim() ? search.q.trim().slice(0, 80) : undefined,
    sort: isShopSort(search.sort) && search.sort !== "featured" ? search.sort : undefined,
  }),
  head: () => ({
    meta: [
      { title: SHOP_TITLE },
      { name: "description", content: SHOP_DESC },
      { name: "keywords", content: SHOP_KEYWORDS },
      { property: "og:title", content: SHOP_OG_TITLE },
      { property: "og:description", content: SHOP_OG_DESC },
      { property: "og:image", content: SHOP_OG_IMAGE },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/shop` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SHOP_OG_TITLE },
      { name: "twitter:description", content: SHOP_OG_DESC },
      { name: "twitter:image", content: SHOP_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/shop` }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: ShopPage,
});

function formatPrice(product: Product) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(product.price);
}

function ProductCard({ product }: { product: Product }) {
  const displayTitle = seoTitle(product);
  const colorToImage = new Map<string, string>();
  for (const variant of product.variants ?? []) {
    const color = (variant.color || variant.title?.split("/")[0] || "").trim();
    if (color && !colorToImage.has(color) && variant.image) colorToImage.set(color, variant.image);
  }
  const colorChips = colorToImage.size > 0 ? Array.from(colorToImage.keys()) : product.colors ?? [];
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const displayImage = (selectedColor && colorToImage.get(selectedColor)) || product.image;

  return (
    <Link
      to="/shop/$productId"
      params={{ productId: product.id }}
      className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          key={displayImage}
          src={displayImage}
          alt={seoAlt(product, selectedColor)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {product.isNew ? <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase">New</span> : null}
          {product.isOnSale ? <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Sale</span> : null}
        </div>
        <h3 className="line-clamp-2 font-display text-base leading-tight transition-colors group-hover:text-primary">
          {displayTitle}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">{formatPrice(product)}</span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">View</span>
        </div>
        {colorChips.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {colorChips.map((color) => {
              const selected = color === selectedColor;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedColor(selected ? null : color);
                  }}
                  aria-pressed={selected}
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-secondary-foreground hover:border-primary/60"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function ShopPage() {
  const { data } = useSuspenseQuery(productsQuery);
  const products = data?.products ?? [];
  const loadError = data?.error;
  const { count, open } = useCart();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const selectedCategory: ShopCategory = search.category ?? "all";
  const selectedCollection: ShopCollection = search.collection ?? "all";
  const selectedSort: ShopSort = search.sort ?? "featured";
  const searchQuery = search.q ?? "";
  const normalizedQuery = searchQuery.toLowerCase();

  const filteredProducts = products
    .map((product, originalIndex) => ({ product, originalIndex }))
    .filter(({ product }) => productMatchesCategory(product, selectedCategory))
    .filter(({ product }) => productMatchesCollection(product, selectedCollection))
    .filter(({ product }) => !normalizedQuery || productSearchText(product).includes(normalizedQuery))
    .sort((a, b) => {
      if (selectedSort === "price-low") return a.product.price - b.product.price;
      if (selectedSort === "price-high") return b.product.price - a.product.price;
      if (selectedSort === "best-selling") {
        const difference = Number(isBestSeller(b.product)) - Number(isBestSeller(a.product));
        return difference || a.originalIndex - b.originalIndex;
      }
      if (selectedSort === "featured") {
        const difference = Number(b.product.isFeatured) - Number(a.product.isFeatured);
        return difference || a.originalIndex - b.originalIndex;
      }
      return a.originalIndex - b.originalIndex;
    })
    .map(({ product }) => product);

  const selectedCategoryLabel = SHOP_CATEGORIES.find((item) => item.slug === selectedCategory)?.label;
  const selectedCollectionLabel = SHOP_COLLECTIONS.find((item) => item.slug === selectedCollection)?.label;
  const activeFilterLabel = [
    selectedCategory !== "all" ? selectedCategoryLabel : null,
    selectedCollection !== "all" ? selectedCollectionLabel : null,
  ].filter(Boolean).join(" · ");

  const updateSearch = (updates: {
    category?: ShopCategory;
    collection?: ShopCollection;
    q?: string;
    sort?: ShopSort;
  }) => {
    navigate({
      search: {
        category: updates.category === "all" ? undefined : updates.category ?? search.category,
        collection: updates.collection === "all" ? undefined : updates.collection ?? search.collection,
        q: updates.q !== undefined ? updates.q.trim() || undefined : search.q,
        sort: updates.sort !== undefined ? (updates.sort === "featured" ? undefined : updates.sort) : search.sort,
      },
      replace: true,
    });
  };

  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/shop/${product.id}`,
      name: seoTitle(product),
    })),
  };

  return (
    <div className="bg-background">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1200px] px-6 pt-4 text-xs text-muted-foreground">
        <ol className="flex items-center gap-1">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-foreground">Shop</li>
        </ol>
      </nav>

      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Keep TX Red — Official Shop</div>
              <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-tight md:text-5xl">Texas Patriotic Apparel, Hats & Gifts</h1>
              <p className="mt-4 max-w-2xl text-white/90">Every order helps keep our newsroom independent. Add items to your cart and check out securely with card.</p>
            </div>
            <button
              onClick={open}
              className="relative inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
              aria-label={`Open cart, ${count} items`}
            >
              <span>🛍 Cart</span>
              {count > 0 ? <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">{count}</span> : null}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12">
        {products.length > 0 ? (
          <div className="mb-8 border-b border-border pb-6">
            <div className="-mx-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter products by category">
              <div className="flex w-max min-w-full gap-2">
                {SHOP_CATEGORIES.map((category) => {
                  const selected = category.slug === selectedCategory;
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => updateSearch({ category: category.slug })}
                      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/60 hover:text-primary"
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Shop by collection</p>
              <div className="-mx-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter products by collection">
                <div className="flex w-max min-w-full gap-2">
                  {SHOP_COLLECTIONS.map((collection) => {
                    const selected = collection.slug === selectedCollection;
                    return (
                      <button
                        key={collection.slug}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => updateSearch({ collection: collection.slug })}
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-secondary/40 text-foreground hover:border-primary/60 hover:text-primary"
                        }`}
                      >
                        {collection.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">Search products</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => updateSearch({ q: event.target.value })}
                  placeholder="Search products"
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">Sort by</span>
                <select
                  value={selectedSort}
                  onChange={(event) => updateSearch({ sort: event.target.value as ShopSort })}
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {SHOP_SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>

            <p className="mt-3 text-sm font-semibold text-foreground" aria-live="polite">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
              {activeFilterLabel ? ` · ${activeFilterLabel}` : ""}
            </p>
          </div>
        ) : null}

        {loadError || products.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="mb-2 font-display text-2xl">Store is restocking</h2>
            <p className="text-muted-foreground">{loadError ? "We couldn't load live listings right now. Please check back soon." : "No active listings right now. Check back soon."}</p>
          </div>
        ) : null}

        {products.length > 0 && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : null}

        {products.length > 0 && filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <h2 className="font-display text-2xl">No matching products</h2>
            <p className="mt-2 text-muted-foreground">Try another search, category, collection, or sorting option.</p>
            <button
              type="button"
              onClick={() => navigate({ search: {}, replace: true })}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              View all products
            </button>
          </div>
        ) : null}
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 px-6 py-8 text-center text-sm md:grid-cols-5">
          {[
            ["🔒", "Secure Checkout"],
            ["🖨️", "Printed On Demand"],
            ["⭐", "Premium Materials"],
            ["⚡", "Fast Production"],
            ["🤠", "Designed for Proud Texans"],
          ].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl" aria-hidden>{icon}</span>
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-6 py-14 prose prose-neutral dark:prose-invert">
        <h2>Texas Patriotic Apparel Made for Proud Texans</h2>
        <p>Keep Texas Red offers shirts, hats, hoodies, drinkware, stickers, tote bags and accessories selected for the public website through our independent shop catalog.</p>
        <h2>Frequently Asked Questions</h2>
        <details className="rounded-lg border border-border bg-card p-4"><summary className="cursor-pointer font-semibold">How long does shipping take?</summary><p className="mt-2 text-sm text-muted-foreground">Most orders are produced within 3–7 business days, with delivery typically taking another 2–5 business days after shipment.</p></details>
        <details className="rounded-lg border border-border bg-card p-4"><summary className="cursor-pointer font-semibold">Is checkout secure?</summary><p className="mt-2 text-sm text-muted-foreground">Yes. Payments are processed through encrypted Stripe checkout.</p></details>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJson) }} />
    </div>
  );
}
