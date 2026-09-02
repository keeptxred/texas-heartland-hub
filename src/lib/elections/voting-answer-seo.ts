import type { VotingAnswerPageData } from "@/data/election-voting-answers";

export function buildVotingAnswerHead(data: VotingAnswerPageData, canonicalPath: string) {
  const url = `https://keeptxred.com${canonicalPath}`;
  return {
    meta: [
      { title: data.metaTitle },
      { name: "description", content: data.description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: data.title },
      { property: "og:description", content: data.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: "Keep TX Red" },
      { property: "og:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://keeptxred.com/images/elections/election-central-social.jpg" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${url}#page`,
              url,
              name: data.title,
              description: data.description,
              dateModified: "2026-09-01",
              isPartOf: { "@id": "https://keeptxred.com/#website" },
              mainEntity: { "@id": `${url}#faq` },
              breadcrumb: { "@id": `${url}#breadcrumbs` },
            },
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: data.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${url}#breadcrumbs`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://keeptxred.com/" },
                { "@type": "ListItem", position: 2, name: "Election Central", item: "https://keeptxred.com/elections/2026" },
                { "@type": "ListItem", position: 3, name: "Texas Voting", item: "https://keeptxred.com/elections/voting" },
                { "@type": "ListItem", position: 4, name: data.title, item: url },
              ],
            },
          ],
        }),
      },
    ],
  };
}
