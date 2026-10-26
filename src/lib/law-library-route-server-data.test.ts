import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LAW_TOPICS } from "@/data/law-topics";
import { isLawTopicIndexable } from "@/lib/law-topic-indexability";

const read = (path: string) => readFileSync(path, "utf8");
const server = read("src/lib/law-library-route.functions.ts");
const directory = read("src/routes/laws_.topics.tsx");
const detail = read("src/routes/laws.topic.$slug.tsx");
const template = read("src/components/law-topic-page.tsx");

describe("server-side law authority payload boundary", () => {
  it("still returns exactly the eligible public law topics for SSR and in-browser search", () => {
    expect(LAW_TOPICS.filter(isLawTopicIndexable)).toHaveLength(18);
    expect(server).toContain("LAW_TOPICS.filter(isLawTopicIndexable)");
    expect(directory).toContain("loader: () => getIndexableLawTopics()");
    expect(directory).toContain("head: ({ loaderData }) =>");
    expect(directory).toContain("const INDEXABLE_LAW_TOPICS = loaderData ?? []");
    expect(directory).toContain("const INDEXABLE_LAW_TOPICS = Route.useLoaderData()");
    expect(directory).toContain("INDEXABLE_LAW_TOPICS.filter((topic) => lawTopicMatchesQuery(topic, query))");
    expect(directory).toContain("numberOfItems: INDEXABLE_LAW_TOPICS.length");
  });
  it("preserves SSR law topic JSON-LD, noindex protection and reciprocal discovery", () => {
    expect(server).toContain("publicSupportingGuidesForAuthority(topic.slug)");
    expect(server).toContain("publicEditorialArticlesForLawTopic(topic.slug)");
    expect(detail).toContain("if (!detail) throw notFound()");
    expect(detail).toContain("isLawTopicIndexable(loaderData.topic)");
    expect(detail).toContain("lawTopicHead(loaderData.topic)");
    expect(detail).toContain("supportingGuides={supportingGuides}");
    expect(detail).toContain("editorials={editorials}");
    expect(template).toContain("citation: topic.sources.map((source) => source.url)");
    expect(template).toContain("supportingGuides.map");
    expect(template).toContain("editorials.map");
    expect(template).not.toContain('import { publicSupportingGuidesForAuthority }');
    expect(template).not.toContain('import { publicEditorialArticlesForLawTopic }');
    expect(directory).not.toContain('import { LAW_TOPICS }');
    expect(detail).not.toContain('import { getLawTopic }');
  });
});
