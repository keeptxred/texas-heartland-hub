const DEFAULT_SITE_NAME = "KeepTXRed";
const DEFAULT_SITE_URL = "https://keeptxred.com";
const DEFAULT_SOCIAL_IMAGE = "/images/elections/election-central-social.jpg";
const DEFAULT_DESCRIPTION =
  "Follow Texas elections, candidates, races, polling, forecasts, voting dates, and voter resources from KeepTXRed.";

export type ElectionSeoPageType =
  | "website"
  | "race"
  | "candidate"
  | "poll"
  | "forecast"
  | "voter-guide";

export interface ElectionSeoInput {
  title: string;
  description?: string;
  pathname: string;
  pageType?: ElectionSeoPageType;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  siteName?: string;
  siteUrl?: string;
}

export interface ElectionSeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: "index,follow" | "noindex,follow";
  openGraph: {
    type: "website" | "article";
    title: string;
    description: string;
    url: string;
    siteName: string;
    image?: string;
    imageAlt?: string;
    publishedTime?: string;
    modifiedTime?: string;
  };
  twitter: {
    card: "summary" | "summary_large_image";
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
  };
}

export interface ElectionBreadcrumbItem {
  name: string;
  pathname: string;
}

export interface ElectionWebPageSchemaInput {
  name: string;
  description?: string;
  pathname: string;
  pageType?: ElectionSeoPageType;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: readonly ElectionBreadcrumbItem[];
  siteUrl?: string;
}

export interface ElectionCollectionSchemaInput {
  name: string;
  description: string;
  pathname: string;
  itemType: "Election" | "Person" | "Dataset" | "WebPage";
  siteUrl?: string;
}

export function buildElectionSeo(input: ElectionSeoInput): ElectionSeoMetadata {
  const siteName = input.siteName?.trim() || DEFAULT_SITE_NAME;
  const siteUrl = normalizeSiteUrl(input.siteUrl || DEFAULT_SITE_URL);
  const title = formatElectionTitle(input.title, siteName);
  const description = normalizeDescription(input.description || DEFAULT_DESCRIPTION);
  const canonicalUrl = buildCanonicalUrl(input.pathname, siteUrl);
  const image = toAbsoluteUrl(input.image || DEFAULT_SOCIAL_IMAGE, siteUrl);
  const openGraphType = input.pageType === "website" || !input.pageType ? "website" : "article";

  return {
    title,
    description,
    canonicalUrl,
    robots: input.noIndex ? "noindex,follow" : "index,follow",
    openGraph: {
      type: openGraphType,
      title,
      description,
      url: canonicalUrl,
      siteName,
      image,
      imageAlt: input.imageAlt,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      image,
      imageAlt: input.imageAlt,
    },
  };
}

export function buildElectionWebPageSchema(input: ElectionWebPageSchemaInput) {
  const siteUrl = normalizeSiteUrl(input.siteUrl || DEFAULT_SITE_URL);
  const canonicalUrl = buildCanonicalUrl(input.pathname, siteUrl);
  const breadcrumbs = input.breadcrumbs ?? [];

  return {
    "@context": "https://schema.org",
    "@type": input.pageType === "candidate" ? "ProfilePage" : "WebPage",
    name: input.name,
    description: normalizeDescription(input.description || DEFAULT_DESCRIPTION),
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: DEFAULT_SITE_NAME,
      url: siteUrl,
    },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(breadcrumbs.length > 0
      ? {
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: buildCanonicalUrl(item.pathname, siteUrl),
            })),
          },
        }
      : {}),
  };
}

export function buildElectionCollectionSchema(input: ElectionCollectionSchemaInput) {
  const siteUrl = normalizeSiteUrl(input.siteUrl || DEFAULT_SITE_URL);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: normalizeDescription(input.description),
    url: buildCanonicalUrl(input.pathname, siteUrl),
    isPartOf: {
      "@type": "WebSite",
      name: DEFAULT_SITE_NAME,
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListUnordered",
      itemListElement: [],
      additionalType: `https://schema.org/${input.itemType}`,
    },
  };
}

export function formatElectionTitle(title: string, siteName = DEFAULT_SITE_NAME): string {
  const cleanTitle = collapseWhitespace(title);
  const suffix = ` | ${siteName}`;
  const maximumTitleLength = 60;

  if (cleanTitle.endsWith(suffix) || cleanTitle === siteName) return cleanTitle;
  if (cleanTitle.length + suffix.length <= maximumTitleLength) return `${cleanTitle}${suffix}`;

  const availableLength = Math.max(1, maximumTitleLength - suffix.length - 1);
  return `${cleanTitle.slice(0, availableLength).trimEnd()}…${suffix}`;
}

export function buildCanonicalUrl(pathname: string, siteUrl = DEFAULT_SITE_URL): string {
  const base = normalizeSiteUrl(siteUrl);
  const cleanPath = pathname.split("?")[0].split("#")[0].trim();
  const path = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  const normalizedPath = path === "/" ? path : path.replace(/\/+$/, "");
  return `${base}${normalizedPath}`;
}

function normalizeDescription(description: string): string {
  const normalized = collapseWhitespace(description);
  return normalized.length <= 160 ? normalized : `${normalized.slice(0, 159).trimEnd()}…`;
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.trim().replace(/\/+$/, "");
}

function toAbsoluteUrl(value: string, siteUrl: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return buildCanonicalUrl(value, siteUrl);
}

function collapseWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}
