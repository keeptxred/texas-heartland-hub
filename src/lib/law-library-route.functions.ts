import { createServerFn } from "@tanstack/react-start";

/**
 * Keep the complete, statute-backed law authority catalog and its editorial
 * crosslink registries on the server. The directory still receives all indexed
 * topics for immediate, private, in-browser question-based search.
 */
export const getIndexableLawTopics = createServerFn({ method: "GET" })
  .handler(async () => {
    const [{ LAW_TOPICS }, { isLawTopicIndexable }] = await Promise.all([
      import("@/data/law-topics"),
      import("@/lib/law-topic-indexability"),
    ]);
    return LAW_TOPICS.filter(isLawTopicIndexable);
  });

export const getLawTopicDetail = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => ({
    slug: String(input.slug ?? "").trim().slice(0, 120),
  }))
  .handler(async ({ data }) => {
    const [{ getLawTopic }, { publicSupportingGuidesForAuthority }, { publicEditorialArticlesForLawTopic }] =
      await Promise.all([
        import("@/data/law-topics"),
        import("@/lib/law-authority-crosslinks"),
        import("@/lib/editorial-law-authority-links"),
      ]);
    const topic = getLawTopic(data.slug);
    if (!topic) return null;
    return {
      topic,
      supportingGuides: publicSupportingGuidesForAuthority(topic.slug),
      editorials: publicEditorialArticlesForLawTopic(topic.slug),
    };
  });
