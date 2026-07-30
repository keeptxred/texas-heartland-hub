const SITE_URL = "https://keeptxred.com";

export function legislatureSeo({ title, description, path, breadcrumb }: { title: string; description: string; path: string; breadcrumb: string }) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | Keep TX Red`;
  const image = `${SITE_URL}/images/elections/election-central-social.jpg`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${url}#webpage`,
              url,
              name: title,
              description,
              isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Keep TX Red", url: SITE_URL },
              about: { "@type": "GovernmentOrganization", name: "Texas Legislature", url: "https://capitol.texas.gov/" },
              publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Keep TX Red", url: SITE_URL },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Texas Legislature", item: `${SITE_URL}/texas-legislature` },
                ...(path === "/texas-legislature" ? [] : [{ "@type": "ListItem", position: 3, name: breadcrumb, item: url }]),
              ],
            },
          ],
        }),
      },
    ],
  };
}
