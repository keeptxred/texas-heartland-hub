import { createServerFn } from "@tanstack/react-start";
import { ALL_GUIDES } from "@/data/all-guides";
import { LAW_TOPICS, type LawTopic } from "@/lib/law-guides";
import { guidesForTopic } from "@/lib/guide-registry";
import { isSupportingGuideIndexable } from "@/lib/supporting-guide-indexability";
import type { LawHubSummaries } from "@/lib/laws-hub-summaries.types";

const CHILD_SUPPORT_SLUG = "texas-child-support-guidelines-law";

// Keep expensive full guide objects and word-count/indexability validation on
// the server. Only indexable public summaries reach the browser, preserving
// exactly the same discovery links and SSR HTML as the previous implementation.
export const getLawsHubSummaries = createServerFn({ method: "GET" }).handler(
  async (): Promise<LawHubSummaries> => ({
    showChildSupportGuide: isSupportingGuideIndexable(ALL_GUIDES[CHILD_SUPPORT_SLUG]),
    topics: (Object.keys(LAW_TOPICS) as LawTopic[]).map((topic) => {
      const { label, description } = LAW_TOPICS[topic];
      const guides = guidesForTopic(topic)
        .filter((meta) => meta.status === "verified")
        .flatMap((meta) => {
          const guide = ALL_GUIDES[meta.slug];
          return isSupportingGuideIndexable(guide)
            ? [{ slug: meta.slug, title: guide.title, dek: guide.dek, lastVerified: meta.lastVerified ?? null }]
            : [];
        });
      return { topic, label, description, guides };
    }),
  }),
);
