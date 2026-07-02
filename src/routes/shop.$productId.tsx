import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SITE_URL } from "@/lib/seo";
import { getProducts, type Product } from "@/lib/products.functions";
import { buildAddPayload, parseVariantSize, useCart } from "@/lib/cart-context";
import { seoTitle, seoDescription, seoAlt } from "@/lib/shop-seo";

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
    if (!p) {
      return {
        meta: [{ title: "Product — Keep Texas Red" }],
      };
    }
    const displayTitle = seoTitle(p);
    const title = `${displayTitle} | Keep Texas Red Shop`;
    const description = seoDescription(p);
    const url = `${SITE_URL}/shop/${p.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: displayTitle },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(p.image ? [{ property: "og:image", content: p.image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: displayTitle },
        { name: "twitter:description", content: description },
        ...(p.image ? [{ name: "twitter:image", content: p.image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
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
  const { addItem } = useCart();
  const displayTitle = seoTitle(product);

  const variants = product.variants ?? [];

  // Canonical image getter — always recalculates from selectedVariant.
  const getProductImage = (
    prod: Product,
    variant: (typeof variants)[number] | null,
  ) =>
    variant?.image ||
    variant?.images?.[0] ||
    prod.image;

  const variantImage = (v: (typeof variants)[number]) =>
    v.image || v.images?.[0] || null;

  // Group variants by color. Scan ALL variants for each color (not just the
  // first) so we still find an image when the first size variant lacks one.
  const colorToImage = new Map<string, string>();
  const colorOrder: string[] = [];
  for (const v of variants) {
    if (!v.color) continue;
    if (!colorOrder.includes(v.color)) colorOrder.push(v.color);
    const img = variantImage(v);
    if (img && !colorToImage.has(v.color)) {
      colorToImage.set(v.color, img);
    }
  }
  // Ensure colors without any variant image still appear as chips.
  for (const color of colorOrder) {
    if (!colorToImage.has(color)) colorToImage.set(color, product.image);
  }

  // Sort dimension-style options (e.g. 2"×2", 3"×3") numerically for stickers.
  const isDimensionProduct = product.title.toLowerCase().includes("sticker")
    || colorOrder.every((c) => /^\d+/.test(c.trim()));

  const dimensionRank = (s: string) => {
    const m = s.trim().match(/^(\d+)/);
    return m ? parseInt(m[1], 10) : Infinity;
  };

  const sortedColorOrder = isDimensionProduct
    ? [...colorOrder].sort((a, b) => dimensionRank(a) - dimensionRank(b))
    : colorOrder;

  const colorChips = sortedColorOrder.length > 0 ? sortedColorOrder : (product.colors ?? []);
  const initialColor = colorChips[0] ?? null;
  const [selectedColor, setSelectedColor] = useState<string | null>(initialColor);

  // Sizes available for the currently selected color, in variant order.
  const sizesForColor = useMemo(() => {
    const seen: string[] = [];
    for (const v of variants) {
      if (selectedColor && v.color !== selectedColor) continue;
      const size = parseVariantSize(v.title);
      if (size && !seen.includes(size)) seen.push(size);
    }
    const ORDER = ["XXS","XS","S","M","L","XL","2XL","XXL","3XL","XXXL","4XL","XXXXL","5XL","6XL"];
    const rank = (s: string) => {
      const up = s.toUpperCase().replace(/\s+/g, "");
      const i = ORDER.indexOf(up);
      return i === -1 ? 999 : i;
    };
    return [...seen].sort((a, b) => {
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    });
  }, [variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState<string | null>(sizesForColor[0] ?? null);
  // If the color changes and current size isn't offered in that color, snap
  // to the first available size.
  useEffect(() => {
    if (sizesForColor.length === 0) {
      if (selectedSize !== null) setSelectedSize(null);
      return;
    }
    if (!selectedSize || !sizesForColor.includes(selectedSize)) {
      setSelectedSize(sizesForColor[0]);
    }
  }, [sizesForColor, selectedSize]);

  const [qty, setQty] = useState(1);

  // Match variant by color + size when possible.
  const selectedVariant =
    variants.find(
      (v) =>
        (!selectedColor || v.color === selectedColor) &&
        (!selectedSize || parseVariantSize(v.title) === selectedSize),
    ) ?? null;

  const displayImage =
    getProductImage(product, selectedVariant) ||
    (selectedColor && colorToImage.get(selectedColor)) ||
    product.image;

  const unitPrice = selectedVariant?.price ?? product.price;

  const handleAdd = () => {
    addItem(
      buildAddPayload(product, {
        color: selectedColor,
        size: selectedSize,
        image: displayImage,
        price: unitPrice,
        qty,
        variant: selectedVariant,
      }),
    );
  };

  return (
    <div className="bg-background">
      <section className="mx-auto max-w-[1200px] px-6 py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex items-center gap-1 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium line-clamp-1">{displayTitle}</li>
          </ol>
        </nav>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-16 grid gap-10 md:grid-cols-2">
        <div className="bg-muted rounded-2xl overflow-hidden aspect-square">
          <img
            key={`${selectedColor ?? "default"}-${displayImage}`}
            src={displayImage}
            alt={seoAlt(product, selectedColor)}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            Keep TX Red — Official Shop
          </div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight">{displayTitle}</h1>
          <div className="mt-3 text-2xl font-semibold text-primary">{formatPrice(product)}</div>

          {colorChips.length > 1 && (
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {product.title.toLowerCase().includes("sticker") || colorChips.every((c) => /^\d+x\d+$/.test(c.trim())) ? "Size" : "Color"}
                {selectedColor ? `: ${selectedColor}` : ""}
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

          {sizesForColor.length > 1 && (
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Size{selectedSize ? `: ${selectedSize}` : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizesForColor.map((size) => {
                  const isSelected = size === selectedSize;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={isSelected}
                      className={`min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground hover:border-primary/60"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Quantity
            </div>
            <div className="inline-flex items-center border border-border rounded-md">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 hover:bg-muted text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 hover:bg-muted text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {product.description && (
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          <button
            type="button"
            onClick={handleAdd}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold tracking-wide px-6 py-4 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Add to Cart
            <span aria-hidden>→</span>
          </button>
          <p className="mt-3 text-[11px] text-muted-foreground text-center">
            🔒 Secure checkout · Ships in 3–7 business days
          </p>
        </div>
      </section>

      {/* Structured data: Product + Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: displayTitle,
            description: seoDescription(product),
            image: displayImage,
            url: `${SITE_URL}/shop/${product.id}`,
            brand: { "@type": "Brand", name: "Keep Texas Red" },
            offers: {
              "@type": "Offer",
              price: unitPrice.toFixed(2),
              priceCurrency: product.currency || "USD",
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}/shop/${product.id}`,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
              { "@type": "ListItem", position: 3, name: displayTitle, item: `${SITE_URL}/shop/${product.id}` },
            ],
          }),
        }}
      />
    </div>
  );
}