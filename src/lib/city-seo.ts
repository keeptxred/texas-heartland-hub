import type { TexasCityConfig } from "@/data/texas-cities";

const SITE_URL = "https://keeptxred.com";

export function cityGuideHead(config: TexasCityConfig, title: string, description: string) {
  const url = `${SITE_URL}${config.slug}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: config.title,
          description,
          url,
          about: {
            "@type": "City",
            name: config.name,
            containedInPlace: { "@type": "State", name: "Texas" },
          },
          isPartOf: { "@type": "WebSite", name: "Keep TX Red", url: SITE_URL },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Moving to Texas", item: `${SITE_URL}/moving-to-texas` },
            { "@type": "ListItem", position: 3, name: config.title, item: url },
          ],
        }),
      },
    ],
  };
}
