import type { LawTopic } from "@/lib/law-guides-core";

export type LawHubGuidePreview = {
  slug: string;
  title: string;
  dek: string;
  lastVerified: string | null;
};

export type LawHubTopicPreview = {
  topic: LawTopic;
  label: string;
  description: string;
  guides: LawHubGuidePreview[];
};

export type LawHubSummaries = {
  showChildSupportGuide: boolean;
  topics: LawHubTopicPreview[];
};
