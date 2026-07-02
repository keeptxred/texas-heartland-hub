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

export const Route = createFileRoute("/shop/")({
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

function formatPrice(p: Product) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: p.currency }).format(p.price);
}

function ProductCard({ p }: { p: Product }) {
  const displayTitle = seoTitle(p);
  // Group variants by color (ignoring size suffix like "Red / S" -> "Red")
  const colorToImage = new Map<string, string>();
  for (const v of p.variants ?? []) {
    const color = (v.color || v.title?.split("/")[0] || "").trim();
    if (!color) continue;
    if (!colorToImage.has(color) && v.image) colorToImage.set(color, v.image);
  }
  const colorChips = colorToImage.size > 0
    ? Array.from(colorToImage.keys())
    : (p.colors ?? []);

  // Each card owns its own selected color/variant state.
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const displayImage =
    (selectedColor && colorToImage.get(selectedColor)) || p.image;

  return (
    <Link
      to="/shop/$productId"
      params={{ productId: p.id }}
      className="group text-left bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          key={displayImage}
          src={displayImage}
          alt={seoAlt(p, selectedColor)}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {displayTitle}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">{formatPrice(p)}</span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">View</span>
        </div>
        {colorChips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {colorChips.map((color) => {
              const isSelected = color === selectedColor;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(isSelected ? null : color);
                  }}
                  aria-pressed={isSelected}
                  className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${
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
        )}
      </div>
    </Link>
  );
}

function ShopPage() {
  const { data } = useSuspenseQuery(productsQuery);
  const products = data?.products ?? [];
  const loadError = data?.error;
  const { count, open } = useCart();

  const faqs: Array<{ q: string; a: string }> = [
    { q: "What makes Keep Texas Red apparel unique?", a: "Every design is created for proud Texans — from bold Texas flag graphics to conservative statement pieces. Orders help fund our independent Texas newsroom." },
    { q: "How long does shipping take?", a: "Most orders print and ship within 3–7 business days. U.S. delivery typically arrives 2–5 days after shipping." },
    { q: "Are products printed in the USA?", a: "Yes. Our apparel is printed on demand in U.S. print facilities to keep production close to home." },
    { q: "Are hats embroidered?", a: "Yes — our structured caps and dad hats feature embroidered Texas designs for a premium, long-lasting finish." },
    { q: "Do you offer hoodies and shirts?", a: "We stock unisex Texas patriotic tees, long sleeves, and heavyweight hoodies in a range of colors and sizes." },
    { q: "What sizes are available?", a: "Apparel is offered from S through 5XL depending on the style. Size options appear on each product page." },
    { q: "Can I securely checkout online?", a: "Yes. All payments are processed by Stripe with encrypted card checkout — we never see or store your card number." },
  ];

  const internalLinks: Array<{ to: string; label: string }> = [
    { to: "/texas-news", label: "Texas News" },
    { to: "/texas-politics", label: "Texas Politics" },
    { to: "/elections", label: "Texas Elections" },
    { to: "/tax-calculator", label: "Property Tax Calculator" },
    { to: "/houston", label: "Houston" },
    { to: "/texas-business", label: "Business" },
    { to: "/texas-sports", label: "Sports" },
    { to: "/about", label: "About" },
  ];

  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/shop/${p.id}`,
      name: seoTitle(p),
    })),
  };

  const collectionPageJson = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SHOP_OG_TITLE,
    description: SHOP_OG_DESC,
    url: `${SITE_URL}/shop`,
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Keep Texas Red" },
  };

  const organizationJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Keep Texas Red",
    url: SITE_URL,
    logo: `${SITE_URL}/red-texas-icon.png`,
  };

  const onlineStoreJson = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: "Keep Texas Red Shop",
    url: `${SITE_URL}/shop`,
    image: SHOP_OG_IMAGE,
  };

  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
    ],
  };

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-background">
      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1200px] px-6 pt-4 text-xs text-muted-foreground">
        <ol className="flex items-center gap-1">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-foreground font-medium">Shop</li>
        </ol>
      </nav>

      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">Keep TX Red — Official Shop</div>
              <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight max-w-3xl">
                Texas Patriotic Apparel, Hats & Gifts
              </h1>
              <p className="mt-4 max-w-2xl text-white/70">
                Every order helps keep our newsroom independent. Add items to your cart, review your bag, and check out securely with card.
              </p>
            </div>
            <button
              onClick={open}
              className="relative shrink-0 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
              aria-label={`Open cart, ${count} items`}
            >
              <span>🛍 Cart</span>
              {count > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-12">
        {(loadError || products.length === 0) && (
          <div className="text-center py-20">
            <h2 className="font-display text-2xl mb-2">Store is restocking</h2>
            <p className="text-muted-foreground">
              {loadError ? "We couldn't load live listings right now. Please check back soon." : "No active listings right now. Check back soon."}
            </p>
          </div>
        )}
        {products.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-[1200px] px-6 py-8 grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
          {[
            { icon: "🔒", label: "Secure Checkout" },
            { icon: "🖨️", label: "Printed On Demand" },
            { icon: "⭐", label: "Premium Materials" },
            { icon: "⚡", label: "Fast Production" },
            { icon: "🤠", label: "Designed for Proud Texans" },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl" aria-hidden>{t.icon}</span>
              <span className="font-semibold">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Evergreen SEO copy */}
      <section className="mx-auto max-w-[900px] px-6 py-14 prose prose-neutral dark:prose-invert">
        <h2>Texas Patriotic Apparel Made for Proud Texans</h2>
        <p>
          Keep Texas Red is the go-to shop for Texas patriotic apparel and
          conservative gifts that put the Lone Star State first. Every item in
          our store — from bold red tees to embroidered caps — is designed with
          the pride, grit, and independence that defines Texas. Whether you were
          born here or got here as fast as you could, our collection is built
          for Texans who want to wear their values.
        </p>

        <h3>Texas Shirts</h3>
        <p>
          Our Texas shirts range from classic Keep Texas Red graphics to Texas
          flag tees, Lone Star silhouettes, and conservative statement designs.
          Printed on soft, durable cotton blends, they hold their color wash
          after wash and hold up to real Texas summers.
        </p>

        <h3>Texas Hats</h3>
        <p>
          Every Texan needs a good hat. Our lineup includes structured caps,
          dad hats, snapbacks, and trucker hats — most featuring embroidered
          Texas stars and Keep Texas Red marks. Adjustable straps keep the fit
          right whether you're at a rally, on the ranch, or at the game.
        </p>

        <h3>Texas Hoodies</h3>
        <p>
          When the northers roll in, reach for a heavyweight Texas hoodie.
          Warm fleece linings, roomy front pockets, and clean patriotic
          graphics make our hoodies a cold-weather staple across the state.
        </p>

        <h3>Texas Gifts</h3>
        <p>
          Looking for the right gift for a fellow Texan? Our shop stocks
          Texas-themed mugs, tote bags, prints, and stickers that pair well
          with any celebration — birthdays, graduations, retirements, or a
          welcome-home present for a friend who just moved to the state.
        </p>

        <h3>Texas Stickers</h3>
        <p>
          Our durable vinyl Texas stickers are weatherproof, dishwasher-safe,
          and cut precisely for laptops, trucks, water bottles, and tool boxes.
          It's the easiest way to fly the flag without changing your outfit.
        </p>

        <h3>Why Buy From Keep Texas Red</h3>
        <p>
          We're a Texas-focused publisher first — a shop second. Every purchase
          directly funds our independent conservative newsroom covering
          statewide politics, elections, business, and sports. You get gear you
          love and help keep an independent Texas voice in the media.
        </p>

        <h3>Printed On Demand</h3>
        <p>
          Products are produced when you order, cutting down on waste and
          letting us offer more colors and sizes than a traditional storefront.
          Most orders print and ship within a few business days from U.S.
          facilities.
        </p>

        <h2>Frequently Asked Questions</h2>
        <div className="not-prose grid gap-4">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-lg border border-border bg-card p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        <h2>Related Texas Resources</h2>
        <ul className="not-prose flex flex-wrap gap-2">
          {internalLinks.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="inline-block rounded-full border border-border bg-secondary text-secondary-foreground px-3 py-1.5 text-sm font-medium hover:border-primary/60 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(onlineStoreJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />
    </div>
  );
}