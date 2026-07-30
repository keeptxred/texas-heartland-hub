const SITE_URL = "https://keeptxred.com";

interface CalculatorRouteSeoOptions {
  title: string;
  description: string;
  path: string;
  category?: string;
}

export function calculatorRouteSeo({
  title,
  description,
  path,
  category = "FinanceApplication",
}: CalculatorRouteSeoOptions) {
  const canonical = `${SITE_URL}${path}`;
  const fullTitle = `${title} | Keep TX Red`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: title,
          description,
          url: canonical,
          applicationCategory: category,
          operatingSystem: "Web",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          provider: {
            "@type": "Organization",
            name: "Keep TX Red",
            url: SITE_URL,
          },
          author: {
            "@type": "Organization",
            name: "Keep TX Red Data Desk",
            url: `${SITE_URL}/authors/data-desk`,
          },
          reviewedBy: {
            "@type": "Organization",
            name: "Keep TX Red Taxpayer Desk",
            url: `${SITE_URL}/authors/taxpayer-desk`,
          },
          dateModified: "2026-07-25",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            {
              "@type": "ListItem",
              position: 2,
              name: "Texas Tools",
              item: `${SITE_URL}/texas-financial-tools`,
            },
            { "@type": "ListItem", position: 3, name: title, item: canonical },
          ],
        }),
      },
    ],
  };
}
