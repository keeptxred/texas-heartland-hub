// Centralized SEO/Open Graph/Twitter Card helper.
// Every shareable page should call buildSeo({...}) and spread the returned
// `meta`, `links`, and `scripts` arrays into its TanStack `head()` return.

import { getAuthor } from "@/data/authors";
import { getCavernSeoOverride } from "@/lib/explore/cavern-seo";
import { isRetiredStaticNewsPath } from "@/lib/static-article-indexability";

export const SITE_URL = "https://keeptxred.com";
export const SITE_NAME = "Keep TX Red";
export const SITE_ALTERNATE_NAMES = ["Keep Texas Red", "KeepTXRed.com"] as const;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.jpg`;
export const DEFAULT_OG_ALT = "Keep TX Red — Texas News, Politics & Conservative Commentary";
export const PUBLISHER_LOGO = `${SITE_URL}/keep-tx-red-icon.svg`;
export const PUBLISHER_LOGO_ALT = "Keep TX Red red Texas logo";
export const OFFICIAL_PROFILE_URLS = [
  "https://www.facebook.com/profile.php?id=61591363654407",
  "https://www.instagram.com/keeptxreddotcom/",
  "https://github.com/keeptxred",
] as const;

const INVALID_IMAGE_PATTERN =
  /(?:placeholder|spacer|blank(?:[-_.]?image)?|transparent(?:[-_.]?pixel)?|pixel\.gif|1x1)/i;

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  author?: string;
  keywords?: string;
  noindex?: boolean;
};

type ImageObjectInput = {
  url?: string;
  width?: number;
  height?: number;
  caption?: string;
  alt?: string;
  representativeOfPage?: boolean;
};

type PersonJsonLdInput = {
  name: string;
  url?: string;
  id?: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
};

type WebPageJsonLdInput = {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  image?: ImageObjectInput;
  datePublished?: string;
  dateModified?: string;
};

function absolute(url: string | undefined, base = SITE_URL): string {
  if (!url) return base;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
}

export function isUsableSeoImage(url: string | null | undefined): url is string {
  if (!url) return false;
  const value = url.trim();
  if (!value || value.startsWith("data:") || value.startsWith("blob:")) return false;
  if (INVALID_IMAGE_PATTERN.test(value)) return false;
  try {
    const parsed = new URL(value, SITE_URL);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function absoluteSeoImage(url: string | null | undefined): string {
  return isUsableSeoImage(url) ? absolute(url) : DEFAULT_OG_IMAGE;
}

function normalizePath(path: string): string {
  const raw = path.startsWith("/") ? path : `/${path}`;
  const [pathname] = raw.split(/[?#]/, 1);
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function truncateAtWordBoundary(value: string, maxLength: number): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized;
  const clipped = normalized.slice(0, maxLength + 1);
  const boundary = clipped.lastIndexOf(" ");
  const safe = boundary >= Math.floor(maxLength * 0.65)
    ? clipped.slice(0, boundary)
    : normalized.slice(0, maxLength);
  return safe.replace(/[\s|—–,:;-]+$/, "").trim();
}

function clampTitle(value: string): string {
  const title = value.trim();
  const separator = " | ";
  const suffix = `${separator}${SITE_NAME}`;
  if (title.endsWith(SITE_NAME)) return truncateAtWordBoundary(title, 60);
  if (`${title}${suffix}`.length <= 60) return `${title}${suffix}`;
  const available = 60 - suffix.length;
  const shortened = truncateAtWordBoundary(title, available);
  return shortened ? `${shortened}${suffix}` : truncateAtWordBoundary(title, 60);
}

function clampDescription(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 160) return trimmed;
  return `${truncateAtWordBoundary(trimmed, 157)}…`;
}

export function buildSeo(input: SeoInput) {
  const cavernOverride = getCavernSeoOverride(input.path);
  const effectiveInput = cavernOverride
    ? {
        ...input,
        title: cavernOverride.title,
        description: cavernOverride.description,
        keywords: cavernOverride.keywords,
      }
    : input;
  const path = normalizePath(effectiveInput.path);
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const title = clampTitle(effectiveInput.title);
  const description = clampDescription(effectiveInput.description);
  const image = absoluteSeoImage(effectiveInput.image);
  const isArticle = effectiveInput.type === "article";
  const imageAlt = effectiveInput.imageAlt?.trim() || effectiveInput.title;
  const effectiveNoindex = effectiveInput.noindex ?? isRetiredStaticNewsPath(path);

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    {
      name: "robots",
      content: effectiveNoindex
        ? "noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    },
    { property: "og:type", content: isArticle ? "article" : "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_US" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:image:type", content: image.endsWith(".png") ? "image/png" : image.endsWith(".webp") ? "image/webp" : "image/jpeg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  if (effectiveInput.imageWidth && effectiveInput.imageHeight && image !== DEFAULT_OG_IMAGE) {
    meta.push(
      { property: "og:image:width", content: String(effectiveInput.imageWidth) },
      { property: "og:image:height", content: String(effectiveInput.imageHeight) },
    );
  } else if (image === DEFAULT_OG_IMAGE) {
    meta.push(
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    );
  }

  if (isArticle) {
    if (effectiveInput.publishedTime) meta.push({ property: "article:published_time", content: effectiveInput.publishedTime });
    if (effectiveInput.modifiedTime) meta.push({ property: "article:modified_time", content: effectiveInput.modifiedTime });
    if (effectiveInput.section) meta.push({ property: "article:section", content: effectiveInput.section });
    if (effectiveInput.author) meta.push({ property: "article:author", content: effectiveInput.author });
  }

  const links = [{ rel: "canonical", href: url }];
  return { meta, links, url, image, title, description };
}

export function imageObjectJsonLd(input: ImageObjectInput = {}) {
  const url = absoluteSeoImage(input.url ?? PUBLISHER_LOGO);
  return {
    "@type": "ImageObject",
    url,
    contentUrl: url,
    ...(input.width ? { width: input.width } : {}),
    ...(input.height ? { height: input.height } : {}),
    ...(input.caption ? { caption: input.caption } : {}),
    ...(input.alt ? { description: input.alt } : {}),
    ...(input.representativeOfPage != null
      ? { representativeOfPage: input.representativeOfPage }
      : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: [...SITE_ALTERNATE_NAMES],
    url: `${SITE_URL}/`,
    description:
      "Keep TX Red is a Texas-focused news and analysis outlet covering policy, elections, and issues shaping the state.",
    publishingPrinciples: `${SITE_URL}/editorial-standards`,
    diversityPolicy: `${SITE_URL}/editorial-standards`,
    ethicsPolicy: `${SITE_URL}/editorial-standards`,
    logo: imageObjectJsonLd({
      url: PUBLISHER_LOGO,
      caption: SITE_NAME,
      alt: PUBLISHER_LOGO_ALT,
    }),
    image: imageObjectJsonLd({
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      caption: SITE_NAME,
      alt: DEFAULT_OG_ALT,
    }),
    sameAs: [...OFFICIAL_PROFILE_URLS],
    knowsAbout: ["Texas politics", "Texas policy", "Texas elections", "Texas legislature", "Texas news"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "admin@keeptxred.com",
      contactType: "Editorial",
    },
    areaServed: { "@type": "State", name: "Texas" },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: [...SITE_ALTERNATE_NAMES],
    url: `${SITE_URL}/`,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
  };
}

export function webPageJsonLd(input: WebPageJsonLdInput) {
  const path = normalizePath(input.path);
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: clampDescription(input.description),
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
    ...(input.image
      ? { primaryImageOfPage: imageObjectJsonLd({ ...input.image, representativeOfPage: true }) }
      : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function personJsonLd(input: PersonJsonLdInput) {
  const url = input.url ? absolute(input.url) : undefined;
  const newsroomDesk = getAuthor(input.name);
  if (newsroomDesk) {
    const deskId = url ? `${url}#desk` : input.id?.replace(/#person$/, "#desk");
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      ...(deskId ? { "@id": deskId } : {}),
      name: newsroomDesk.name,
      ...(url ? { url } : {}),
      ...(input.description ? { description: input.description } : {}),
      ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
      parentOrganization: { "@id": ORGANIZATION_ID },
      knowsAbout: newsroomDesk.beats,
    };
  }

  const id = input.id ?? (url ? `${url}#person` : undefined);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    ...(id ? { "@id": id } : {}),
    name: input.name,
    ...(url ? { url } : {}),
    ...(input.image && isUsableSeoImage(input.image) ? { image: absoluteSeoImage(input.image) } : {}),
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
    worksFor: { "@id": ORGANIZATION_ID },
  };
}
