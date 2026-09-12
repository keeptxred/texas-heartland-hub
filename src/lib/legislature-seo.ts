import { buildSeo, SITE_URL } from "@/lib/seo";

export function legislatureSeo({
  title,
  description,
  path,
  breadcrumb,
}: {
  title: string;
  description: string;
  path: string;
  breadcrumb: string;
}) {
  const url = `${SITE_URL}${path}`;
  const seo = buildSeo({
    title,
    description,
    path,
    type: "website",
    imageAlt: "Keep TX Red Texas Legislature coverage",
  });

  return {
    meta: seo.meta,
    links: seo.links,
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
              isPartOf: {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: "Keep TX Red",
                url: SITE_URL,
              },
              about: {
                "@type": "GovernmentOrganization",
                name: "Texas Legislature",
                url: "https://capitol.texas.gov/",
              },
              publisher: {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "Keep TX Red",
                url: SITE_URL,
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Texas Legislature",
                  item: `${SITE_URL}/texas-legislature`,
                },
                ...(path === "/texas-legislature"
                  ? []
                  : [{ "@type": "ListItem", position: 3, name: breadcrumb, item: url }]),
              ],
            },
          ],
        }),
      },
    ],
  };
}
