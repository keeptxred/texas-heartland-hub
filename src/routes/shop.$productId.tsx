import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SITE_URL } from "@/lib/seo";
import { getProducts, type Product } from "@/lib/products.functions";

const productsQuery = queryOptions({
  queryKey: ["products", "listings"],
  queryFn: () => getProducts(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/shop/$productId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productsQuery);
    const product = data.products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.title} — Keep Texas Red Shop` : "Product — Keep Texas Red";
    const description = p?.description?.slice(0, 155) ?? "Texas-made apparel and accessories from Keep Texas Red.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(p?.image ? [{ property: "og:image", content: p.image }] : []),
      ],
      links: p ? [{ rel: "canonical", href: `${SITE_URL}/shop/${p.id}` }] : [],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-3">Product not found</h1>
      <p className="text-muted-foreground mb-6">This item may be sold out or no longer available.</p>
      <Link to="/shop" className="text-primary font-semibold hover:underline">← Back to shop</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-3">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <button onClick={reset} className="text-primary font-semibold hover:underline">Try again</button>
    </div>
  ),
  component: ProductPage,
});

function formatPrice(p: Product) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.price);
}

function ProductPage() {
  const { productId } = Route.useParams();
  const { data } = useSuspenseQuery(productsQuery);
  const product = data.products.find((p) => p.id === productId)!;

  const variants = product.variants ?? [];
  // Group variants by color, keeping the first variant that has an image per color.
  const colorToImage = new Map<string, string>();
  for (const v of variants) {
    if (!v.color) continue;
    if (!colorToImage.has(v.color) && v.image) {
      colorToImage.set(v.color, v.image);
    }
  }
  // Ensure colors without a variant image still appear as chips.
  for (const v of variants) {
    if (v.color && !colorToImage.has(v.color)) colorToImage.set(v.color, product.image);
  }
  const colorChips = colorToImage.size > 0
    ? Array.from(colorToImage.keys())
    : (product.colors ?? []);
  const initialColor = colorChips[0] ?? null;
  const [selectedColor, setSelectedColor] = useState<string | null>(initialColor);

  const displayImage =
    (selectedColor && colorToImage.get(selectedColor)) || product.image;

  return (
    <div className="bg-background">
      <section className="mx-auto max-w-[1200px] px-6 py-8">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to shop
        </Link>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-16 grid gap-10 md:grid-cols-2">
        <div className="bg-muted rounded-2xl overflow-hidden aspect-square">
          <img
            key={displayImage}
            src={displayImage}
            alt={selectedColor ? `${product.title} in ${selectedColor}` : product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            Keep TX Red — Official Shop
          </div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight">{product.title}</h1>
          <div className="mt-3 text-2xl font-semibold text-primary">{formatPrice(product)}</div>

          {colorChips.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Color{selectedColor ? `: ${selectedColor}` : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                {colorChips.map((color) => {
                  const isSelected = color === selectedColor;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      aria-pressed={isSelected}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground hover:border-primary/60"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {product.description && (
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold tracking-wide px-6 py-4 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Proceed to Secure Checkout
            <span aria-hidden>→</span>
          </a>
          <p className="mt-3 text-[11px] text-muted-foreground text-center">
            🔒 Secure checkout • Free returns within 30 days
          </p>
        </div>
      </section>
    </div>
  );
}