import { buildSeo, SITE_URL } from "@/lib/seo";
import { lawGuideCanonicalPath } from "@/lib/law-guides";

export function lawGuideSeoTitle(title: string): string {
  const normalized = title.trim() || "Texas Laws Explained";
  return buildSeo({
    title: normalized,
    description: "Texas law guide.",
    path: "/laws",
  }).title;
}

export function lawGuideMetaDescription(description: string): string {
  const normalized = description.replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 156).replace(/[\s,;:.-]+$/g, "")}…`;
}

export function lawGuideCanonicalUrl(slug: string): string {
  return `${SITE_URL}${lawGuideCanonicalPath(slug)}`;
}

export function lawGuideBreadcrumbJsonLd(title: string, slug: string) {
  const url = lawGuideCanonicalUrl(slug);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Texas Laws", item: `${SITE_URL}/laws` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  } as const;
}
