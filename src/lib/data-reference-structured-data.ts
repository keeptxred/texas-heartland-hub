import type { TexasDataSet } from "@/data/texas-data-catalog";
import { ORGANIZATION_ID, SITE_NAME, SITE_URL } from "@/lib/seo";

/**
 * Data Center pages are curated source maps, not republished copies of every
 * underlying government dataset. Model the visible source directory faithfully
 * as a CollectionPage containing an ItemList of source pages rather than
 * claiming KTR owns each underlying dataset.
 */
export function dataReferenceSourceCollectionJsonLd(dataset: TexasDataSet) {
  const url = `${SITE_URL}/data/${dataset.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#source-directory`,
    url: `${url}#official-sources`,
    name: `${dataset.title} — official source directory`,
    description: `Primary and authoritative source pages used by ${SITE_NAME} for this reference guide.`,
    isPartOf: { "@id": `${url}#article` },
    publisher: { "@id": ORGANIZATION_ID },
    dateModified: dataset.updated,
    mainEntity: {
      "@type": "ItemList",
      "@id": `${url}#official-source-list`,
      numberOfItems: dataset.sources.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: dataset.sources.map((source, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebPage",
          name: source.label,
          url: source.url,
          description: source.scope,
          publisher: {
            "@type": "Organization",
            name: source.publisher,
          },
        },
      })),
    },
  };
}

export function dataReferenceCitation(dataset: TexasDataSet) {
  return {
    title: dataset.title,
    publisher: "Keep TX Red Data Desk",
    reviewed: dataset.updated,
    url: `${SITE_URL}/data/${dataset.slug}`,
  };
}
