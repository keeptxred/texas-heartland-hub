import type { Database as GeneratedDatabase } from "./types";

type NewsFeedNormalizationTable = {
  Row: {
    canonical_url: string;
    content_fingerprint: string | null;
    created_at: string;
    dedupe_confidence: number | null;
    duplicate_of_feed_item_id: number | null;
    duplicate_reason: string | null;
    feed_item_id: number;
    normalization_version: number;
    normalized_at: string;
    normalized_description: string | null;
    normalized_title: string;
    observed_at: string;
    source_key: string;
    title_fingerprint: string;
    updated_at: string;
  };
  Insert: {
    canonical_url: string;
    content_fingerprint?: string | null;
    created_at?: string;
    dedupe_confidence?: number | null;
    duplicate_of_feed_item_id?: number | null;
    duplicate_reason?: string | null;
    feed_item_id: number;
    normalization_version?: number;
    normalized_at?: string;
    normalized_description?: string | null;
    normalized_title: string;
    observed_at: string;
    source_key: string;
    title_fingerprint: string;
    updated_at?: string;
  };
  Update: {
    canonical_url?: string;
    content_fingerprint?: string | null;
    created_at?: string;
    dedupe_confidence?: number | null;
    duplicate_of_feed_item_id?: number | null;
    duplicate_reason?: string | null;
    feed_item_id?: number;
    normalization_version?: number;
    normalized_at?: string;
    normalized_description?: string | null;
    normalized_title?: string;
    observed_at?: string;
    source_key?: string;
    title_fingerprint?: string;
    updated_at?: string;
  };
  Relationships: [];
};

export type Database = Omit<GeneratedDatabase, "public"> & {
  public: Omit<GeneratedDatabase["public"], "Tables"> & {
    Tables: GeneratedDatabase["public"]["Tables"] & {
      news_feed_normalization: NewsFeedNormalizationTable;
    };
  };
};
