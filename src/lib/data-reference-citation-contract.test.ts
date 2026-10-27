import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getTexasDataSet } from "@/data/texas-data-catalog";
import { texasDataHead } from "@/lib/texas-data-head";
import {
  dataReferenceCitation,
  dataReferenceSourceCollectionJsonLd,
} from "./data-reference-structured-data";

describe("Data Center citation contract", () => {
  const dataset = getTexasDataSet("energy-grid");

  it("models the official source directory without falsely claiming KTR owns the source datasets", () => {
    expect(dataset).toBeDefined();
    const graph = dataReferenceSourceCollectionJsonLd(dataset!);

    expect(graph["@type"]).toBe("CollectionPage");
    expect(graph["@id"]).toBe("https://keeptxred.com/data/energy-grid#source-directory");
    expect(graph.mainEntity["@type"]).toBe("ItemList");
    expect(graph.mainEntity.numberOfItems).toBe(dataset!.sources.length);
    expect(graph.mainEntity.itemListElement).toHaveLength(dataset!.sources.length);
    expect(graph.mainEntity.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "WebPage",
        name: dataset!.sources[0].label,
        url: dataset!.sources[0].url,
        description: dataset!.sources[0].scope,
        publisher: {
          "@type": "Organization",
          name: dataset!.sources[0].publisher,
        },
      },
    });

    const source = readFileSync(new URL("./data-reference-structured-data.ts", import.meta.url), "utf8");
    expect(source).not.toContain('"@type": "Dataset"');
  });

  it("publishes a stable canonical citation snapshot", () => {
    const citation = dataReferenceCitation(dataset!);
    expect(citation).toEqual({
      title: dataset!.title,
      publisher: "Keep TX Red Data Desk",
      reviewed: dataset!.updated,
      url: "https://keeptxred.com/data/energy-grid",
    });

    const page = readFileSync(new URL("../components/texas-data-page.tsx", import.meta.url), "utf8");
    expect(page).toContain("Citation & provenance");
    expect(page).toContain("Reference snapshot");
    expect(page).toContain("Canonical reference");
    expect(page).toContain("When citing a statistic or official record, cite the controlling source");
  });

  it("connects the article graph to the machine-readable source directory", () => {
    const page = readFileSync(new URL("../components/texas-data-page.tsx", import.meta.url), "utf8");
    const metadata = readFileSync(new URL("./texas-data-head.ts", import.meta.url), "utf8");
    expect(metadata).toContain('"@id": `${url}#article`');
    expect(metadata).toContain('hasPart: { "@id": `${url}#source-directory` }');
    expect(metadata).toContain("dataReferenceSourceCollectionJsonLd(dataset)");
    const head = texasDataHead(dataset!);
    expect(head.links.some((link) => link.rel === "canonical" && link.href === "https://keeptxred.com/data/energy-grid")).toBe(true);
    expect(head.scripts).toHaveLength(3);
    expect(head.scripts.some((script) => script.children.includes("#source-directory"))).toBe(true);
    expect(page).toContain('id="official-sources"');
  });
});
