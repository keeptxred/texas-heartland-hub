// Centralized SEO/Open Graph/Twitter Card helper.
// Every shareable page should call buildSeo({...}) and spread the returned
// `meta`, `links`, and `scripts` arrays into its TanStack `head()` return.

export const SITE_URL = "https://keeptxred.com";
export const SITE_NAME = "Keep TX Red";
export const TWITTER_HANDLE = "@KeepTXRed";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.jpg`;
export const DEFAULT_OG_ALT = "Keep TX Red — Texas News, Politics & Conservative Commentary";

type SeoInput = {
  title: string;
  description: string;
  path: string;                     // e.g. "/news/foo"
  image?: string;                   // absolute or path-relative
  imageAlt?: string;
  imageWidth?: number;              // include only when known
  imageHeight?: number;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;                 // article category
  author?: string;
  keywords?: string;
  noindex?: boolean;
};

function absolute(url: string | undefined, base = SITE_URL): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
}

function clampTitle(t: string): string {
  const suffixed = t.endsWith(SITE_NAME) ? t : `${t} | ${SITE_NAME}`;
  return suffixed.length <= 60 ? suffixed : t.slice(0, 60);
}

function clampDescription(d: string): string {
  const trimmed = d.trim();
  if (trimmed.length <= 160) return trimmed;
  return trimmed.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

export function buildSeo(input: SeoInput) {
  const url = `${SITE_URL}${input.path.startsWith("/") ? input.path : `/${input.path}`}`;
  const title = clampTitle(input.title);
  const description = clampDescription(input.description);
  const image = absolute(input.image);
  const isArticle = input.type === "article";
  const imageAlt = input.imageAlt ?? input.title;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
    // Open Graph
    { property: "og:type", content: isArticle ? "article" : "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_US" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:image:type", content: image.endsWith(".png") ? "image/png" : "image/jpeg" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  if (input.imageWidth && input.imageHeight) {
    meta.push(
      { property: "og:image:width", content: String(input.imageWidth) },
      { property: "og:image:height", content: String(input.imageHeight) },
    );
  } else if (image === DEFAULT_OG_IMAGE) {
    meta.push(
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    );
  }

  if (input.keywords) meta.push({ name: "keywords", content: input.keywords });
  if (input.noindex) {
    // override robots
    const i = meta.findIndex((m) => m.name === "robots");
    if (i >= 0) meta[i] = { name: "robots", content: "noindex,nofollow" };
  }

  if (isArticle) {
    if (input.publishedTime) meta.push({ property: "article:published_time", content: input.publishedTime });
    if (input.modifiedTime) meta.push({ property: "article:modified_time", content: input.modifiedTime });
    if (input.section) meta.push({ property: "article:section", content: input.section });
    if (input.author) meta.push({ property: "article:author", content: input.author });
  }

  const links = [{ rel: "canonical", href: url }];

  return { meta, links, url, image, title, description };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    alternateName: "Keep Texas Red",
    url: `${SITE_URL}/`,
    description:
      "Keep Texas Red is a Texas-focused news and analysis outlet covering policy, elections, and issues shaping the state.",
    publishingPrinciples: `${SITE_URL}/editorial-standards`,
    diversityPolicy: `${SITE_URL}/editorial-standards`,
    ethicsPolicy: `${SITE_URL}/editorial-standards`,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    sameAs: [],
    knowsAbout: ["Texas politics", "Texas policy", "Texas elections", "Texas legislature", "Texas news"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@keeptxred.com",
      contactType: "Editorial",
    },
    areaServed: { "@type": "State", name: "Texas" },
  };
}
