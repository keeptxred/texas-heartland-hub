import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SITE_URL } from "@/lib/seo";
import { getProducts, type Product, type ProductVariant } from "@/lib/products.functions";
import { CartProvider, buildAddPayload, parseVariantSize, useCart } from "@/lib/cart-context";
import { seoAlt, seoDescription, seoTitle } from "@/lib/shop-seo";

const productsQuery = queryOptions({
  queryKey: ["products", "listings"],
  queryFn: () => getProducts(),
  staleTime: 5 * 60 * 1000,
});

function offerId(product: Product, variant: ProductVariant): string {
  return `${product.id}-${variant.id}`;
}

function offerUrl(product: Product, variant: ProductVariant): string {
  return `${SITE_URL}/product-offer/${encodeURIComponent(product.id)}/${encodeURIComponent(String(variant.id))}`;
}

function offerImage(product: Product, variant: ProductVariant): string {
  return variant.image || variant.images?.[0] || product.image;
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(price);
}

export const Route = createFileRoute("/product-offer/$productId/$variantId")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productsQuery);
    if (data.isFallback) throw new Error("Product catalog temporarily unavailable.");

    const product = data.products.find((item) => item.id === params.productId);
    if (!product) throw notFound();

    const variant = (product.variants ?? []).find(
      (item) => item.is_enabled !== false && String(item.id) === params.variantId,
    );
    if (!variant) throw notFound();

    return { product, variant };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const variant = loaderData?.variant;
    if (!product || !variant) {
      return {
        meta: [
          { title: "Product offer not found — Keep Texas Red" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }

    const baseTitle = seoTitle(product);
    const title = `${baseTitle} - ${variant.title} | Keep Texas Red Shop`;
    const description = seoDescription(product);
    const url = offerUrl(product, variant);
    const image = offerImage(product, variant);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: `${baseTitle} - ${variant.title}` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${baseTitle} - ${variant.title}` },
        { name: "twitter:description", content: description },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/shop/${product.id}` }],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-3">Product option not found</h1>
      <p className="text-muted-foreground mb-6">This option may no longer be available.</p>
      <Link
        to="/shop"
        search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }}
        className="text-primary font-semibold hover:underline"
      >
        ← Back to shop
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl mb-3">Product temporarily unavailable</h1>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <button onClick={reset} className="text-primary font-semibold hover:underline">Try again</button>
    </div>
  ),
  component: ProductOfferRoute,
});

function ProductOfferRoute() {
  return (
    <CartProvider>
      <ProductOfferPage />
    </CartProvider>
  );
}

function ProductOfferPage() {
  const { productId, variantId } = Route.useParams();
  const { data } = useSuspenseQuery(productsQuery);
  const product = data.products.find((item) => item.id === productId)!;
  const variant = (product.variants ?? []).find(
    (item) => item.is_enabled !== false && String(item.id) === variantId,
  )!;
  const { addItem } = useCart();
  const title = seoTitle(product);
  const description = seoDescription(product);
  const image = offerImage(product, variant);
  const price = Number(variant.price || product.price);
  const currency = product.currency || "USD";
  const size = parseVariantSize(variant.title);
  const color = variant.color?.trim() || null;
  const sku = offerId(product, variant);
  const url = offerUrl(product, variant);

  const handleAdd = () => {
    addItem(buildAddPayload(product, {
      color,
      size,
      image,
      price,
      qty: 1,
      variant,
    }));
  };

  return (
    <div className="bg-background">
      <section className="mx-auto max-w-[1200px] px-6 py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex items-center gap-1 flex-wrap">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li>
              <Link
                to="/shop"
                search={{ category: undefined, collection: undefined, q: undefined, sort: undefined }}
                className="hover:text-primary"
              >
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium line-clamp-1">{title}</li>
          </ol>
        </nav>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-16 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
          <img
            src={image}
            alt={seoAlt(product, color)}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Keep TX Red — Official Shop
          </div>
          <h1 className="font-display text-3xl leading-tight md:text-4xl">{title}</h1>
          <div className="mt-3 text-2xl font-semibold text-primary">{formatPrice(price, currency)}</div>

          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selected option</div>
            <div className="mt-1 font-medium">{variant.title}</div>
            <div className="mt-2 text-sm text-muted-foreground">In stock · SKU {sku}</div>
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-display font-semibold tracking-wide text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          >
            Add to Cart
            <span aria-hidden>→</span>
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            🔒 Secure checkout · Free U.S. shipping on orders over $35 · Production in 3–7 business days
          </p>

          <Link
            to="/shop/$productId"
            params={{ productId: product.id }}
            className="mt-5 text-center text-sm font-semibold text-primary hover:underline"
          >
            View all colors and sizes
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${title} - ${variant.title}`,
            description,
            image,
            url,
            sku,
            mpn: sku,
            ...(color ? { color } : {}),
            ...(size ? { size } : {}),
            brand: { "@type": "Brand", name: "Keep TX Red" },
            offers: {
              "@type": "Offer",
              price: price.toFixed(2),
              priceCurrency: currency,
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              url,
            },
          }),
        }}
      />
    </div>
  );
}
