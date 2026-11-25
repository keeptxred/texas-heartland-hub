import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions } from "@tanstack/react-query";
import { SITE_URL } from "@/lib/seo";
import { getProducts, type Product } from "@/lib/products.functions";
import { buildAddPayload, useCart } from "@/lib/cart-context";
import { availableProductVariants, initialProductVariant, variantPrice, variantOptions, chooseVariant, productOfferImage } from "@/lib/shop-product-offers";
import { seoTitle, seoDescription, seoAlt } from "@/lib/shop-seo";

const productsQuery = queryOptions({
  queryKey: ["products", "listings"],
  queryFn: () => getProducts(),
  staleTime: 5 * 60 * 1000,
});

/**
 * Printify stores every mockup against a variant.  Keep the complete, unique
 * set here so the page, structured data, and merchant crawlers all receive
 * the same product gallery rather than only the selected variant's hero.
 */
function productImageUrls(product: Product): string[] {
  return Array.from(
    new Set(
      [
        product.image,
        ...availableProductVariants(product).flatMap((variant) => [
          variant.image,
          ...(variant.images ?? []),
        ]),
      ].filter((image): image is string => Boolean(image?.trim())),
    ),
  ).slice(0, 10);
}

export const Route = createFileRoute("/shop/$productId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productsQuery);
    if (data.isFallback) throw new Error("Product catalog temporarily unavailable.");
    const product = data.products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) {
      return {
        meta: [
          { title: "Product not found — Keep Texas Red" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }
    const displayTitle = seoTitle(p);
    const title = `${displayTitle} | Keep Texas Red Shop`;
    const description = seoDescription(p);
    const url = `${SITE_URL}/shop/${p.id}`;
    const images = productImageUrls(p);
    const initial = initialProductVariant(p);
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: displayTitle,
      description,
      image: images,
      url,
      brand: { "@type": "Brand", name: "Keep Texas Red" },
      ...(initial ? { offers: {
        "@type": "Offer",
        price: variantPrice(p, initial).toFixed(2),
        priceCurrency: p.currency || "USD",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url,
      } } : {}),
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: displayTitle },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...images.map((image) => ({ property: "og:image", content: image })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: displayTitle },
        { name: "twitter:description", content: description },
        ...(p.image ? [{ name: "twitter:image", content: p.image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: initial ? [{ type: "application/ld+json", children: JSON.stringify(productSchema) }] : [],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-3">Product not found</h1>
      <p className="text-muted-foreground mb-6">This item may be sold out or no longer available.</p>
      <Link to="/shop" search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }} className="text-primary font-semibold hover:underline">← Back to shop</Link>
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

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD" }).format(price);
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  return <ProductDetails key={product.id} product={product} />;
}

function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart();
  const displayTitle = seoTitle(product);
  const variants = availableProductVariants(product);
  const initial = initialProductVariant(product);
  const [variantId, setVariantId] = useState<number | null>(initial?.id ?? null);
  const [qty, setQty] = useState(1);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const selectedVariant = variants.find(v => v.id === variantId) ?? initial;
  const { color: selectedColor, size: selectedSize } = selectedVariant ? variantOptions(selectedVariant) : { color: null, size: null };
  const colorChips = [...new Set(variants.map(v => variantOptions(v).color).filter((v): v is string => Boolean(v)))];
  const sizesForColor = [...new Set(variants.filter(v => variantOptions(v).color === selectedColor).map(v => variantOptions(v).size).filter((v): v is string => Boolean(v)))].sort((a,b) => {
    const order = ["XXS","XS","S","M","L","XL","2XL","XXL","3XL","XXXL","4XL","XXXXL","5XL","6XL"];
    const rank = (s: string) => { const i = order.indexOf(s.toUpperCase()); return i < 0 ? 999 : i; };
    return rank(a) - rank(b) || a.localeCompare(b, "en", { numeric: true });
  });
  const choose = (color: string | null, size: string | null) => {
    const next = chooseVariant(product, color, size);
    if (!next) return;
    setVariantId(next.id);
    setSelectedGalleryImage(null);
  };
  const displayImage = selectedVariant ? productOfferImage(product, selectedVariant) : product.image;
  const galleryImages = Array.from(new Set([displayImage, ...(selectedVariant?.images ?? [])].filter(Boolean)));
  const activeImage = selectedGalleryImage && galleryImages.includes(selectedGalleryImage) ? selectedGalleryImage : displayImage;
  const unitPrice = selectedVariant ? variantPrice(product, selectedVariant) : null;

  const handleAdd = () => {
    if (!selectedVariant || unitPrice === null) return;
    addItem(buildAddPayload(product, {
      color: selectedColor, size: selectedSize, image: displayImage,
      price: unitPrice, qty, variant: selectedVariant,
    }));
  };

  return (
    <div className="bg-background">
      <section className="mx-auto max-w-[1200px] px-6 py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex items-center gap-1 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link to="/shop" search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }} className="hover:text-primary">Shop</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium line-clamp-1">{displayTitle}</li>
          </ol>
        </nav>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-16 grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="bg-muted rounded-2xl overflow-hidden aspect-square">
            <img
              key={`${selectedColor ?? "default"}-${activeImage}`}
              src={activeImage}
              alt={seoAlt(product, selectedColor)}
              className="h-full w-full object-cover"
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2" aria-label="Product image gallery">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedGalleryImage(image)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={activeImage === image}
                  className={`aspect-square overflow-hidden rounded-lg border-2 bg-muted ${activeImage === image ? "border-primary" : "border-transparent hover:border-primary/50"}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
            Keep TX Red — Official Shop
          </div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight">{displayTitle}</h1>
          <div className="mt-3 text-2xl font-semibold text-primary" aria-live="polite">{unitPrice !== null ? formatPrice(unitPrice, product.currency) : "Currently unavailable"}</div>

          {colorChips.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Color
                {selectedColor ? `: ${selectedColor}` : ""}
              </div>
              <div className="flex flex-wrap gap-2">
                {colorChips.map((color) => {
                  const isSelected = color === selectedColor;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => choose(color, selectedSize)}
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

          {sizesForColor.length > 0 && (
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
                      onClick={() => choose(selectedColor, size)}
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

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {seoDescription(product)}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedVariant}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold tracking-wide px-6 py-4 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedVariant ? "Add to Cart" : "Unavailable"}
            <span aria-hidden>→</span>
          </button>
          {selectedVariant && <p className="mt-3 text-sm text-muted-foreground">Selected option: {[selectedColor, selectedSize].filter(Boolean).join(" / ") || selectedVariant.title}</p>}
          <p className="mt-3 text-[11px] text-muted-foreground text-center">
            🔒 Secure checkout · Free U.S. shipping on orders over $35 · Production in 3–7 business days
          </p>
          <div className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            <p>Made to order. Review the selected color and size before checkout. Delivery normally takes another 2–5 business days after production.</p>
            <p className="mt-2">See our <Link to="/shipping-policy" className="underline">shipping policy</Link>, <Link to="/return-refund-policy" className="underline">return and refund policy</Link>, or <Link to="/contact" className="underline">contact customer support</Link>.</p>
          </div>
        </div>
      </section>

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
