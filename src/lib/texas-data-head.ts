import type { TexasDataSet } from "@/data/texas-data-catalog";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { dataReferenceSourceCollectionJsonLd } from "@/lib/data-reference-structured-data";

export function texasDataHead(dataset: TexasDataSet) {
  const path = `/data/${dataset.slug}`;
  const url = `${SITE_URL}${path}`;
  const seo = buildSeo({ title: dataset.title, description: dataset.dek, path, type: "article", publishedTime: `${dataset.updated}T12:00:00-05:00`, modifiedTime: `${dataset.updated}T12:00:00-05:00`, section: "Texas Data Center", author: "Keep TX Red Data Desk" });
  return { meta: seo.meta, links: seo.links, scripts: [
    { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`, headline: dataset.title, description: dataset.dek, datePublished: dataset.updated, dateModified: dataset.updated, articleSection: "Texas Data Center", mainEntityOfPage: { "@type": "WebPage", "@id": url }, hasPart: { "@id": `${url}#source-directory` }, author: { "@type": "Organization", name: "Keep TX Red Data Desk", url: `${SITE_URL}/about` }, publisher: { "@type": "Organization", name: "Keep TX Red", url: SITE_URL } }) },
    { type: "application/ld+json", children: JSON.stringify(dataReferenceSourceCollectionJsonLd(dataset)) },
    { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Texas Data Center", item: `${SITE_URL}/data` }, { "@type": "ListItem", position: 3, name: dataset.title, item: url }] }) },
  ] };
}

