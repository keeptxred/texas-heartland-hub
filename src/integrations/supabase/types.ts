export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_rewrite_cache: {
        Row: {
          budget_exempt: boolean
          claimed_at: string
          completed_at: string | null
          content_fingerprint: string
          failure_reason: string | null
          feed_item_id: number | null
          result_json: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          budget_exempt?: boolean
          claimed_at?: string
          completed_at?: string | null
          content_fingerprint: string
          failure_reason?: string | null
          feed_item_id?: number | null
          result_json?: Json | null
          status: string
          updated_at?: string
        }
        Update: {
          budget_exempt?: boolean
          claimed_at?: string
          completed_at?: string | null
          content_fingerprint?: string
          failure_reason?: string | null
          feed_item_id?: number | null
          result_json?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_rewrite_cache_feed_item_id_fkey"
            columns: ["feed_item_id"]
            isOneToOne: false
            referencedRelation: "texas_news_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_rewrite_failures: {
        Row: {
          content_fingerprint: string
          failed_at: string
          failure_reason: string | null
          feed_item_id: number | null
          id: number
        }
        Insert: {
          content_fingerprint: string
          failed_at?: string
          failure_reason?: string | null
          feed_item_id?: number | null
          id?: number
        }
        Update: {
          content_fingerprint?: string
          failed_at?: string
          failure_reason?: string | null
          feed_item_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_rewrite_failures_feed_item_id_fkey"
            columns: ["feed_item_id"]
            isOneToOne: false
            referencedRelation: "texas_news_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_rewrite_manual_bypass: {
        Row: {
          expires_at: string
          feed_item_id: number
          granted_at: string
        }
        Insert: {
          expires_at?: string
          feed_item_id: number
          granted_at?: string
        }
        Update: {
          expires_at?: string
          feed_item_id?: number
          granted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_rewrite_manual_bypass_feed_item_id_fkey"
            columns: ["feed_item_id"]
            isOneToOne: true
            referencedRelation: "texas_news_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_rewrite_usage: {
        Row: {
          claimed_at: string
          content_fingerprint: string
          feed_item_id: number | null
          id: number
        }
        Insert: {
          claimed_at?: string
          content_fingerprint: string
          feed_item_id?: number | null
          id?: number
        }
        Update: {
          claimed_at?: string
          content_fingerprint?: string
          feed_item_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_rewrite_usage_feed_item_id_fkey"
            columns: ["feed_item_id"]
            isOneToOne: false
            referencedRelation: "texas_news_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_relationships: {
        Row: {
          created_at: string
          evidence: Json
          id: string
          is_manual: boolean
          relationship_type: string
          score: number
          source_key: string
          source_type: string
          target_key: string
          target_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          evidence?: Json
          id?: string
          is_manual?: boolean
          relationship_type: string
          score?: number
          source_key: string
          source_type: string
          target_key: string
          target_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          evidence?: Json
          id?: string
          is_manual?: boolean
          relationship_type?: string
          score?: number
          source_key?: string
          source_type?: string
          target_key?: string
          target_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      bill_actions: {
        Row: {
          action_code: string | null
          action_date: string
          action_sequence: number
          action_text: string
          action_time: string | null
          bill_id: string
          chamber: string | null
          committee_id: string | null
          created_at: string
          id: string
          normalized_status: string | null
          source_url: string | null
          updated_at: string
        }
        Insert: {
          action_code?: string | null
          action_date: string
          action_sequence?: number
          action_text: string
          action_time?: string | null
          bill_id: string
          chamber?: string | null
          committee_id?: string | null
          created_at?: string
          id?: string
          normalized_status?: string | null
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          action_code?: string | null
          action_date?: string
          action_sequence?: number
          action_text?: string
          action_time?: string | null
          bill_id?: string
          chamber?: string | null
          committee_id?: string | null
          created_at?: string
          id?: string
          normalized_status?: string | null
          source_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_actions_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill_document_completeness"
            referencedColumns: ["bill_id"]
          },
          {
            foreignKeyName: "bill_actions_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_actions_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "legislative_committees"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_article_relationships: {
        Row: {
          article_id: string
          bill_id: string
          confidence: number | null
          created_at: string
          id: string
          is_manual: boolean
          relationship_type: string
          updated_at: string
        }
        Insert: {
          article_id: string
          bill_id: string
          confidence?: number | null
          created_at?: string
          id?: string
          is_manual?: boolean
          relationship_type?: string
          updated_at?: string
        }
        Update: {
          article_id?: string
          bill_id?: string
          confidence?: number | null
          created_at?: string
          id?: string
          is_manual?: boolean
          relationship_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_article_relationships_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill_document_completeness"
            referencedColumns: ["bill_id"]
          },
          {
            foreignKeyName: "bill_article_relationships_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_committee_history: {
        Row: {
          action_description: string | null
          action_type: string | null
          bill_id: string
          chamber: string | null
          committee_id: string | null
          committee_name: string
          created_at: string
          hearing_date: string | null
          id: string
          referred_date: string | null
          reported_date: string | null
          sequence: number
          source_url: string | null
          updated_at: string
          vote_date: string | null
        }
        Insert: {
          action_description?: string | null
          action_type?: string | null
          bill_id: string
          chamber?: string | null
          committee_id?: string | null
          committee_name: string
          created_at?: string
          hearing_date?: string | null
          id?: string
          referred_date?: string | null
          reported_date?: string | null
          sequence?: number
          source_url?: string | null
          updated_at?: string
          vote_date?: string | null
        }
        Update: {
          action_description?: string | null
          action_type?: string | null
          bill_id?: string
          chamber?: string | null
          committee_id?: string | null
          committee_name?: string
          created_at?: string
          hearing_date?: string | null
          id?: string
          referred_date?: string | null
          reported_date?: string | null
          sequence?: number
          source_url?: string | null
          updated_at?: string
          vote_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_committee_history_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill_document_completeness"
            referencedColumns: ["bill_id"]
          },
          {
            foreignKeyName: "bill_committee_history_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_committee_history_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "legislative_committees"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_documents: {
        Row: {
          bill_id: string
          bill_number: number | null
          bill_type: string | null
          content_hash: string | null
          created_at: string
          document_date: string | null
          document_title: string
          document_type: string
          document_url: string
          extracted_text: string | null
          extracted_text_hash: string | null
          file_format: string | null
          id: string
          is_latest: boolean
          last_imported_at: string | null
          last_seen_at: string
          legislature_number: number | null
          metadata: Json
          session_code: string | null
          source_html_url: string | null
          source_key: string
          source_pdf_url: string | null
          source_record_key: string
          storage_path: string | null
          updated_at: string
          version_code: string | null
          version_label: string | null
          version_sequence: number | null
        }
        Insert: {
          bill_id: string
          bill_number?: number | null
          bill_type?: string | null
          content_hash?: string | null
          created_at?: string
          document_date?: string | null
          document_title: string
          document_type: string
          document_url: string
          extracted_text?: string | null
          extracted_text_hash?: string | null
          file_format?: string | null
          id?: string
          is_latest?: boolean
          last_imported_at?: string | null
          last_seen_at?: string
          legislature_number?: number | null
          metadata?: Json
          session_code?: string | null
          source_html_url?: string | null
          source_key?: string
          source_pdf_url?: string | null
          source_record_key: string
          storage_path?: string | null
          updated_at?: string
          version_code?: string | null
          version_label?: string | null
          version_sequence?: number | null
        }
        Update: {
          bill_id?: string
          bill_number?: number | null
          bill_type?: string | null
          content_hash?: string | null
          created_at?: string
          document_date?: string | null
          document_title?: string
          document_type?: string
          document_url?: string
          extracted_text?: string | null
          extracted_text_hash?: string | null
          file_format?: string | null
          id?: string
          is_latest?: boolean
          last_imported_at?: string | null
          last_seen_at?: string
          legislature_number?: number | null
          metadata?: Json
          session_code?: string | null
          source_html_url?: string | null
          source_key?: string
          source_pdf_url?: string | null
          source_record_key?: string
          storage_path?: string | null
          updated_at?: string
          version_code?: string | null
          version_label?: string | null
          version_sequence?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_documents_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill_document_completeness"
            referencedColumns: ["bill_id"]
          },
          {
            foreignKeyName: "bill_documents_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_sponsors: {
        Row: {
          bill_id: string
          chamber: string | null
          created_at: string
          date_added: string | null
          district: string | null
          external_legislator_id: string | null
          id: string
          party: string | null
          representative_id: string | null
          sequence: number
          sponsor_name: string
          sponsor_role: string
          sponsor_slug: string | null
          updated_at: string
        }
        Insert: {
          bill_id: string
          chamber?: string | null
          created_at?: string
          date_added?: string | null
          district?: string | null
          external_legislator_id?: string | null
          id?: string
          party?: string | null
          representative_id?: string | null
          sequence?: number
          sponsor_name: string
          sponsor_role: string
          sponsor_slug?: string | null
          updated_at?: string
        }
        Update: {
          bill_id?: string
          chamber?: string | null
          created_at?: string
          date_added?: string | null
          district?: string | null
          external_legislator_id?: string | null
          id?: string
          party?: string | null
          representative_id?: string | null
          sequence?: number
          sponsor_name?: string
          sponsor_role?: string
          sponsor_slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_sponsors_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill_document_completeness"
            referencedColumns: ["bill_id"]
          },
          {
            foreignKeyName: "bill_sponsors_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_subject_relationships: {
        Row: {
          bill_id: string
          subject_id: string
        }
        Insert: {
          bill_id: string
          subject_id: string
        }
        Update: {
          bill_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_subject_relationships_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill_document_completeness"
            referencedColumns: ["bill_id"]
          },
          {
            foreignKeyName: "bill_subject_relationships_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_subject_relationships_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "bill_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_subjects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          analysis_url: string | null
          became_law: boolean
          bill_identifier: string | null
          bill_number: number
          bill_text_url: string | null
          bill_type: string
          caption: string
          chamber: string
          created_at: string
          current_chamber: string | null
          current_committee_id: string | null
          current_status_code: string
          current_status_description: string | null
          current_status_label: string
          description: string | null
          effective_date: string | null
          fiscal_note_url: string | null
          id: string
          introduced_date: string | null
          is_active: boolean
          is_featured: boolean
          last_action_date: string | null
          last_synced_at: string | null
          legislative_session_id: string | null
          legislature_number: number
          passed_house_date: string | null
          passed_senate_date: string | null
          plain_language_summary: string | null
          sent_to_governor_date: string | null
          seo_description: string | null
          seo_title: string | null
          session_code: string
          short_title: string | null
          signed_date: string | null
          source_url: string | null
          summary: string | null
          updated_at: string
          vetoed_date: string | null
        }
        Insert: {
          analysis_url?: string | null
          became_law?: boolean
          bill_identifier?: string | null
          bill_number: number
          bill_text_url?: string | null
          bill_type: string
          caption: string
          chamber: string
          created_at?: string
          current_chamber?: string | null
          current_committee_id?: string | null
          current_status_code?: string
          current_status_description?: string | null
          current_status_label?: string
          description?: string | null
          effective_date?: string | null
          fiscal_note_url?: string | null
          id?: string
          introduced_date?: string | null
          is_active?: boolean
          is_featured?: boolean
          last_action_date?: string | null
          last_synced_at?: string | null
          legislative_session_id?: string | null
          legislature_number: number
          passed_house_date?: string | null
          passed_senate_date?: string | null
          plain_language_summary?: string | null
          sent_to_governor_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          session_code?: string
          short_title?: string | null
          signed_date?: string | null
          source_url?: string | null
          summary?: string | null
          updated_at?: string
          vetoed_date?: string | null
        }
        Update: {
          analysis_url?: string | null
          became_law?: boolean
          bill_identifier?: string | null
          bill_number?: number
          bill_text_url?: string | null
          bill_type?: string
          caption?: string
          chamber?: string
          created_at?: string
          current_chamber?: string | null
          current_committee_id?: string | null
          current_status_code?: string
          current_status_description?: string | null
          current_status_label?: string
          description?: string | null
          effective_date?: string | null
          fiscal_note_url?: string | null
          id?: string
          introduced_date?: string | null
          is_active?: boolean
          is_featured?: boolean
          last_action_date?: string | null
          last_synced_at?: string | null
          legislative_session_id?: string | null
          legislature_number?: number
          passed_house_date?: string | null
          passed_senate_date?: string | null
          plain_language_summary?: string | null
          sent_to_governor_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          session_code?: string
          short_title?: string | null
          signed_date?: string | null
          source_url?: string | null
          summary?: string | null
          updated_at?: string
          vetoed_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_current_committee_id_fkey"
            columns: ["current_committee_id"]
            isOneToOne: false
            referencedRelation: "legislative_committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_legislative_session_id_fkey"
            columns: ["legislative_session_id"]
            isOneToOne: false
            referencedRelation: "legislative_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_packages: {
        Row: {
          asset_notes: string | null
          asset_source_account: string | null
          asset_type: string | null
          asset_url: string | null
          category: string | null
          content_item_id: string | null
          created_at: string
          facebook_body: string | null
          facebook_cta: string | null
          facebook_hashtags: string | null
          facebook_hook: string | null
          id: string
          instagram_caption: string | null
          instagram_hashtags: string | null
          instagram_hook: string | null
          instagram_script: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          source_title: string
          source_url: string | null
          status: string
          updated_at: string
          workflow_status: string
        }
        Insert: {
          asset_notes?: string | null
          asset_source_account?: string | null
          asset_type?: string | null
          asset_url?: string | null
          category?: string | null
          content_item_id?: string | null
          created_at?: string
          facebook_body?: string | null
          facebook_cta?: string | null
          facebook_hashtags?: string | null
          facebook_hook?: string | null
          id?: string
          instagram_caption?: string | null
          instagram_hashtags?: string | null
          instagram_hook?: string | null
          instagram_script?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          source_title: string
          source_url?: string | null
          status?: string
          updated_at?: string
          workflow_status?: string
        }
        Update: {
          asset_notes?: string | null
          asset_source_account?: string | null
          asset_type?: string | null
          asset_url?: string | null
          category?: string | null
          content_item_id?: string | null
          created_at?: string
          facebook_body?: string | null
          facebook_cta?: string | null
          facebook_hashtags?: string | null
          facebook_hook?: string | null
          id?: string
          instagram_caption?: string | null
          instagram_hashtags?: string | null
          instagram_hook?: string | null
          instagram_script?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          source_title?: string
          source_url?: string | null
          status?: string
          updated_at?: string
          workflow_status?: string
        }
        Relationships: []
      }
      content_sources: {
        Row: {
          category: string | null
          created_at: string
          enabled: boolean
          id: string
          notes: string | null
          platform: string
          rss_url: string | null
          source_name: string
          source_quality_reason: string | null
          source_reputation_score: number | null
          source_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          notes?: string | null
          platform: string
          rss_url?: string | null
          source_name: string
          source_quality_reason?: string | null
          source_reputation_score?: number | null
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          notes?: string | null
          platform?: string
          rss_url?: string | null
          source_name?: string
          source_quality_reason?: string | null
          source_reputation_score?: number | null
          source_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      daily_articles: {
        Row: {
          affected_regions: string[] | null
          affiliate_category: string | null
          author: string
          body: string | null
          body_json: Json | null
          category: string
          content_quality_score: number | null
          created_at: string
          ctr_score: number
          dek: string
          discover_category: string | null
          featured_image_url: string | null
          gsc_avg_position: number | null
          gsc_clicks: number
          gsc_ctr: number | null
          gsc_impressions: number
          gsc_last_update: string | null
          headline_variants: Json | null
          id: string
          image_alt_text: string | null
          image_category: string | null
          image_generation_status: string
          image_hash: string | null
          image_prompt: string | null
          image_score: number | null
          image_url: string | null
          image_validation_note: string | null
          internal_links: Json | null
          internal_url: string
          is_breaking: boolean
          is_ingested: boolean
          keywords: string[] | null
          kind: string
          published_at: string
          quality_flags: string[] | null
          score: number
          seo_headline: string | null
          seo_keywords: string[] | null
          slug: string
          source_name: string | null
          source_url: string | null
          teams: string[]
          texas_impact_summary: string | null
          title: string
          variant_a_clicks: number
          variant_a_impressions: number
          variant_b_clicks: number
          variant_b_impressions: number
        }
        Insert: {
          affected_regions?: string[] | null
          affiliate_category?: string | null
          author?: string
          body?: string | null
          body_json?: Json | null
          category: string
          content_quality_score?: number | null
          created_at?: string
          ctr_score?: number
          dek: string
          discover_category?: string | null
          featured_image_url?: string | null
          gsc_avg_position?: number | null
          gsc_clicks?: number
          gsc_ctr?: number | null
          gsc_impressions?: number
          gsc_last_update?: string | null
          headline_variants?: Json | null
          id?: string
          image_alt_text?: string | null
          image_category?: string | null
          image_generation_status?: string
          image_hash?: string | null
          image_prompt?: string | null
          image_score?: number | null
          image_url?: string | null
          image_validation_note?: string | null
          internal_links?: Json | null
          internal_url: string
          is_breaking?: boolean
          is_ingested?: boolean
          keywords?: string[] | null
          kind?: string
          published_at?: string
          quality_flags?: string[] | null
          score?: number
          seo_headline?: string | null
          seo_keywords?: string[] | null
          slug: string
          source_name?: string | null
          source_url?: string | null
          teams?: string[]
          texas_impact_summary?: string | null
          title: string
          variant_a_clicks?: number
          variant_a_impressions?: number
          variant_b_clicks?: number
          variant_b_impressions?: number
        }
        Update: {
          affected_regions?: string[] | null
          affiliate_category?: string | null
          author?: string
          body?: string | null
          body_json?: Json | null
          category?: string
          content_quality_score?: number | null
          created_at?: string
          ctr_score?: number
          dek?: string
          discover_category?: string | null
          featured_image_url?: string | null
          gsc_avg_position?: number | null
          gsc_clicks?: number
          gsc_ctr?: number | null
          gsc_impressions?: number
          gsc_last_update?: string | null
          headline_variants?: Json | null
          id?: string
          image_alt_text?: string | null
          image_category?: string | null
          image_generation_status?: string
          image_hash?: string | null
          image_prompt?: string | null
          image_score?: number | null
          image_url?: string | null
          image_validation_note?: string | null
          internal_links?: Json | null
          internal_url?: string
          is_breaking?: boolean
          is_ingested?: boolean
          keywords?: string[] | null
          kind?: string
          published_at?: string
          quality_flags?: string[] | null
          score?: number
          seo_headline?: string | null
          seo_keywords?: string[] | null
          slug?: string
          source_name?: string | null
          source_url?: string | null
          teams?: string[]
          texas_impact_summary?: string | null
          title?: string
          variant_a_clicks?: number
          variant_a_impressions?: number
          variant_b_clicks?: number
          variant_b_impressions?: number
        }
        Relationships: []
      }
      election_poll_questions: {
        Row: {
          display_order: number | null
          id: string
          notes: string | null
          poll_id: string
          population: string
          prompt: string
          question_key: string
          question_type: string
          sample_size: number | null
        }
        Insert: {
          display_order?: number | null
          id?: string
          notes?: string | null
          poll_id: string
          population: string
          prompt: string
          question_key: string
          question_type: string
          sample_size?: number | null
        }
        Update: {
          display_order?: number | null
          id?: string
          notes?: string | null
          poll_id?: string
          population?: string
          prompt?: string
          question_key?: string
          question_type?: string
          sample_size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "election_poll_questions_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "election_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      election_poll_responses: {
        Row: {
          candidate_id: string | null
          id: string
          is_other: boolean
          is_undecided: boolean
          label: string
          party: string | null
          percentage: number | null
          question_id: string
          respondent_count: number | null
          response_key: string
        }
        Insert: {
          candidate_id?: string | null
          id?: string
          is_other?: boolean
          is_undecided?: boolean
          label: string
          party?: string | null
          percentage?: number | null
          question_id: string
          respondent_count?: number | null
          response_key: string
        }
        Update: {
          candidate_id?: string | null
          id?: string
          is_other?: boolean
          is_undecided?: boolean
          label?: string
          party?: string | null
          percentage?: number | null
          question_id?: string
          respondent_count?: number | null
          response_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "election_poll_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "election_poll_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      election_polls: {
        Row: {
          created_at: string
          crosstabs_url: string | null
          data_as_of: string | null
          election_cycle_id: string
          field_end_date: string
          field_start_date: string
          freshness_status: string
          id: string
          internal_poll: boolean
          jurisdiction_id: string | null
          methodology: Json
          partisan_poll: boolean
          pollster_grade: string
          pollster_name: string
          pollster_url: string | null
          publication_status: string
          published_at: string | null
          questionnaire_url: string | null
          race_id: string | null
          release_date: string | null
          retrieved_at: string
          slug: string
          source_name: string
          source_url: string
          sponsors: Json
          status: string
          title: string
          topline_url: string | null
          tracking_poll: boolean
          updated_at: string
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          crosstabs_url?: string | null
          data_as_of?: string | null
          election_cycle_id: string
          field_end_date: string
          field_start_date: string
          freshness_status?: string
          id?: string
          internal_poll?: boolean
          jurisdiction_id?: string | null
          methodology: Json
          partisan_poll?: boolean
          pollster_grade?: string
          pollster_name: string
          pollster_url?: string | null
          publication_status?: string
          published_at?: string | null
          questionnaire_url?: string | null
          race_id?: string | null
          release_date?: string | null
          retrieved_at: string
          slug: string
          source_name: string
          source_url: string
          sponsors?: Json
          status: string
          title: string
          topline_url?: string | null
          tracking_poll?: boolean
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          crosstabs_url?: string | null
          data_as_of?: string | null
          election_cycle_id?: string
          field_end_date?: string
          field_start_date?: string
          freshness_status?: string
          id?: string
          internal_poll?: boolean
          jurisdiction_id?: string | null
          methodology?: Json
          partisan_poll?: boolean
          pollster_grade?: string
          pollster_name?: string
          pollster_url?: string | null
          publication_status?: string
          published_at?: string | null
          questionnaire_url?: string | null
          race_id?: string | null
          release_date?: string | null
          retrieved_at?: string
          slug?: string
          source_name?: string
          source_url?: string
          sponsors?: Json
          status?: string
          title?: string
          topline_url?: string | null
          tracking_poll?: boolean
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      explore_activities: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon_key: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      explore_amenities: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon_key: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      explore_business_profiles: {
        Row: {
          booking_url: string | null
          business_type: string | null
          claimed: boolean
          created_at: string
          email: string | null
          entity_id: string
          operating_hours: Json
          owner_user_id: string | null
          permanently_closed: boolean
          phone: string | null
          price_level: number | null
          profile_metadata: Json
          updated_at: string
          website_url: string | null
        }
        Insert: {
          booking_url?: string | null
          business_type?: string | null
          claimed?: boolean
          created_at?: string
          email?: string | null
          entity_id: string
          operating_hours?: Json
          owner_user_id?: string | null
          permanently_closed?: boolean
          phone?: string | null
          price_level?: number | null
          profile_metadata?: Json
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          booking_url?: string | null
          business_type?: string | null
          claimed?: boolean
          created_at?: string
          email?: string | null
          entity_id?: string
          operating_hours?: Json
          owner_user_id?: string | null
          permanently_closed?: boolean
          phone?: string | null
          price_level?: number | null
          profile_metadata?: Json
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_business_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_business_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_campground_profiles: {
        Row: {
          campground_type: string | null
          created_at: string
          dump_station: boolean | null
          electric_hookups: boolean | null
          entity_id: string
          fire_rings: boolean | null
          generators_allowed: boolean | null
          group_sites: number | null
          laundry: boolean | null
          managing_authority: string | null
          max_rv_length_feet: number | null
          nightly_fee_max_cents: number | null
          nightly_fee_min_cents: number | null
          picnic_tables: boolean | null
          potable_water: boolean | null
          profile_metadata: Json
          reservation_url: string | null
          restrooms: boolean | null
          rv_sites: number | null
          sewer_hookups: boolean | null
          showers: boolean | null
          tent_sites: number | null
          total_sites: number | null
          updated_at: string
          water_hookups: boolean | null
          wifi: boolean | null
        }
        Insert: {
          campground_type?: string | null
          created_at?: string
          dump_station?: boolean | null
          electric_hookups?: boolean | null
          entity_id: string
          fire_rings?: boolean | null
          generators_allowed?: boolean | null
          group_sites?: number | null
          laundry?: boolean | null
          managing_authority?: string | null
          max_rv_length_feet?: number | null
          nightly_fee_max_cents?: number | null
          nightly_fee_min_cents?: number | null
          picnic_tables?: boolean | null
          potable_water?: boolean | null
          profile_metadata?: Json
          reservation_url?: string | null
          restrooms?: boolean | null
          rv_sites?: number | null
          sewer_hookups?: boolean | null
          showers?: boolean | null
          tent_sites?: number | null
          total_sites?: number | null
          updated_at?: string
          water_hookups?: boolean | null
          wifi?: boolean | null
        }
        Update: {
          campground_type?: string | null
          created_at?: string
          dump_station?: boolean | null
          electric_hookups?: boolean | null
          entity_id?: string
          fire_rings?: boolean | null
          generators_allowed?: boolean | null
          group_sites?: number | null
          laundry?: boolean | null
          managing_authority?: string | null
          max_rv_length_feet?: number | null
          nightly_fee_max_cents?: number | null
          nightly_fee_min_cents?: number | null
          picnic_tables?: boolean | null
          potable_water?: boolean | null
          profile_metadata?: Json
          reservation_url?: string | null
          restrooms?: boolean | null
          rv_sites?: number | null
          sewer_hookups?: boolean | null
          showers?: boolean | null
          tent_sites?: number | null
          total_sites?: number | null
          updated_at?: string
          water_hookups?: boolean | null
          wifi?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_campground_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_campground_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_categories: {
        Row: {
          created_at: string
          description: string | null
          icon_key: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "explore_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_duplicate_candidates: {
        Row: {
          created_at: string
          entity_a_id: string
          entity_b_id: string
          evidence: Json
          id: string
          matching_fields: string[]
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by_user_id: string | null
          similarity_score: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_a_id: string
          entity_b_id: string
          evidence?: Json
          id?: string
          matching_fields?: string[]
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          similarity_score: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_a_id?: string
          entity_b_id?: string
          evidence?: Json
          id?: string
          matching_fields?: string[]
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by_user_id?: string | null
          similarity_score?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_duplicate_candidates_entity_a_id_fkey"
            columns: ["entity_a_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_duplicate_candidates_entity_a_id_fkey"
            columns: ["entity_a_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_duplicate_candidates_entity_b_id_fkey"
            columns: ["entity_b_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_duplicate_candidates_entity_b_id_fkey"
            columns: ["entity_b_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entities: {
        Row: {
          alternate_names: string[]
          archived_at: string | null
          created_at: string
          entity_type_id: string
          featured: boolean
          id: string
          long_description: string | null
          name: string
          owner_user_id: string | null
          popularity_score: number
          published_at: string | null
          short_description: string | null
          slug: string
          source_confidence: number
          status: string
          summary: string | null
          updated_at: string
          verified_at: string | null
          version: number
          visibility: string
        }
        Insert: {
          alternate_names?: string[]
          archived_at?: string | null
          created_at?: string
          entity_type_id: string
          featured?: boolean
          id?: string
          long_description?: string | null
          name: string
          owner_user_id?: string | null
          popularity_score?: number
          published_at?: string | null
          short_description?: string | null
          slug: string
          source_confidence?: number
          status?: string
          summary?: string | null
          updated_at?: string
          verified_at?: string | null
          version?: number
          visibility?: string
        }
        Update: {
          alternate_names?: string[]
          archived_at?: string | null
          created_at?: string
          entity_type_id?: string
          featured?: boolean
          id?: string
          long_description?: string | null
          name?: string
          owner_user_id?: string | null
          popularity_score?: number
          published_at?: string | null
          short_description?: string | null
          slug?: string
          source_confidence?: number
          status?: string
          summary?: string | null
          updated_at?: string
          verified_at?: string | null
          version?: number
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_entities_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "explore_entity_types"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_activities: {
        Row: {
          activity_id: string
          best_months: number[]
          created_at: string
          entity_id: string
          fee_required: boolean | null
          id: string
          metadata: Json
          notes: string | null
          permit_required: boolean | null
          skill_level: string | null
          suitability: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          activity_id: string
          best_months?: number[]
          created_at?: string
          entity_id: string
          fee_required?: boolean | null
          id?: string
          metadata?: Json
          notes?: string | null
          permit_required?: boolean | null
          skill_level?: string | null
          suitability?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          activity_id?: string
          best_months?: number[]
          created_at?: string
          entity_id?: string
          fee_required?: boolean | null
          id?: string
          metadata?: Json
          notes?: string | null
          permit_required?: boolean | null
          skill_level?: string | null
          suitability?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "explore_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_activities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_activities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_amenities: {
        Row: {
          amenity_id: string
          availability: string
          created_at: string
          entity_id: string
          fee_required: boolean | null
          id: string
          metadata: Json
          notes: string | null
          quantity: number | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          amenity_id: string
          availability?: string
          created_at?: string
          entity_id: string
          fee_required?: boolean | null
          id?: string
          metadata?: Json
          notes?: string | null
          quantity?: number | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          amenity_id?: string
          availability?: string
          created_at?: string
          entity_id?: string
          fee_required?: boolean | null
          id?: string
          metadata?: Json
          notes?: string | null
          quantity?: number | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "explore_amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_amenities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_amenities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_categories: {
        Row: {
          category_id: string
          created_at: string
          entity_id: string
          is_primary: boolean
          sort_order: number
        }
        Insert: {
          category_id: string
          created_at?: string
          entity_id: string
          is_primary?: boolean
          sort_order?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          entity_id?: string
          is_primary?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "explore_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_categories_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_categories_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_media: {
        Row: {
          created_at: string
          entity_id: string
          id: string
          is_primary: boolean
          media_id: string
          metadata: Json
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          id?: string
          is_primary?: boolean
          media_id: string
          metadata?: Json
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          id?: string
          is_primary?: boolean
          media_id?: string
          metadata?: Json
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_media_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_media_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "explore_media"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_relationships: {
        Row: {
          created_at: string
          effective_from: string | null
          effective_until: string | null
          id: string
          is_active: boolean
          metadata: Json
          priority: string
          relationship_type_id: string
          source_entity_id: string
          target_entity_id: string
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          priority?: string
          relationship_type_id: string
          source_entity_id: string
          target_entity_id: string
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          priority?: string
          relationship_type_id?: string
          source_entity_id?: string
          target_entity_id?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_relationships_relationship_type_id_fkey"
            columns: ["relationship_type_id"]
            isOneToOne: false
            referencedRelation: "explore_relationship_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_relationships_source_entity_id_fkey"
            columns: ["source_entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_relationships_source_entity_id_fkey"
            columns: ["source_entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_relationships_target_entity_id_fkey"
            columns: ["target_entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_relationships_target_entity_id_fkey"
            columns: ["target_entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_reviews: {
        Row: {
          assigned_to_user_id: string | null
          checklist: Json
          completed_at: string | null
          created_at: string
          due_at: string | null
          entity_id: string
          id: string
          notes: string | null
          review_type: string
          reviewed_by_user_id: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to_user_id?: string | null
          checklist?: Json
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          entity_id: string
          id?: string
          notes?: string | null
          review_type?: string
          reviewed_by_user_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to_user_id?: string | null
          checklist?: Json
          completed_at?: string | null
          created_at?: string
          due_at?: string | null
          entity_id?: string
          id?: string
          notes?: string | null
          review_type?: string
          reviewed_by_user_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_reviews_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_reviews_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_slug_history: {
        Row: {
          entity_id: string
          id: string
          reason: string | null
          replaced_at: string
          replaced_by_user_id: string | null
          slug: string
        }
        Insert: {
          entity_id: string
          id?: string
          reason?: string | null
          replaced_at?: string
          replaced_by_user_id?: string | null
          slug: string
        }
        Update: {
          entity_id?: string
          id?: string
          reason?: string | null
          replaced_at?: string
          replaced_by_user_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_slug_history_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_slug_history_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_sources: {
        Row: {
          confidence: number
          created_at: string
          entity_id: string
          external_id: string | null
          field_paths: string[]
          id: string
          notes: string | null
          raw_metadata: Json
          retrieved_at: string | null
          source_id: string
          source_url: string | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          confidence: number
          created_at?: string
          entity_id: string
          external_id?: string | null
          field_paths?: string[]
          id?: string
          notes?: string | null
          raw_metadata?: Json
          retrieved_at?: string | null
          source_id: string
          source_url?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          confidence?: number
          created_at?: string
          entity_id?: string
          external_id?: string | null
          field_paths?: string[]
          id?: string
          notes?: string | null
          raw_metadata?: Json
          retrieved_at?: string | null
          source_id?: string
          source_url?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_sources_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_sources_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "explore_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_tags: {
        Row: {
          confidence: number
          created_at: string
          entity_id: string
          source: string
          tag_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          entity_id: string
          source?: string
          tag_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          entity_id?: string
          source?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_tags_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_tags_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "explore_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_entity_types: {
        Row: {
          created_at: string
          description: string | null
          icon_key: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          plural_name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          plural_name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_key?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          plural_name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      explore_entity_versions: {
        Row: {
          change_source: string
          change_summary: string | null
          changed_by_user_id: string | null
          created_at: string
          entity_id: string
          id: string
          snapshot: Json
          version: number
        }
        Insert: {
          change_source?: string
          change_summary?: string | null
          changed_by_user_id?: string | null
          created_at?: string
          entity_id: string
          id?: string
          snapshot: Json
          version: number
        }
        Update: {
          change_source?: string
          change_summary?: string | null
          changed_by_user_id?: string | null
          created_at?: string
          entity_id?: string
          id?: string
          snapshot?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "explore_entity_versions_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_entity_versions_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_import_jobs: {
        Row: {
          completed_at: string | null
          connector_key: string | null
          created_at: string
          cursor_after: Json | null
          cursor_before: Json | null
          cursor_state: Json
          entities_created: number
          entities_unchanged: number
          entities_updated: number
          entity_source_id: string | null
          error: Json | null
          error_details: Json
          errors_count: number
          execution_mode: Database["public"]["Enums"]["explore_import_execution_mode"]
          heartbeat_at: string | null
          id: string
          mode: string
          parent_job_id: string | null
          records_received: number
          requested_by: string | null
          source_id: string | null
          started_at: string | null
          statistics: Json
          status: string
          summary: Json
          updated_at: string
          warnings: Json
          warnings_count: number
        }
        Insert: {
          completed_at?: string | null
          connector_key?: string | null
          created_at?: string
          cursor_after?: Json | null
          cursor_before?: Json | null
          cursor_state?: Json
          entities_created?: number
          entities_unchanged?: number
          entities_updated?: number
          entity_source_id?: string | null
          error?: Json | null
          error_details?: Json
          errors_count?: number
          execution_mode?: Database["public"]["Enums"]["explore_import_execution_mode"]
          heartbeat_at?: string | null
          id?: string
          mode?: string
          parent_job_id?: string | null
          records_received?: number
          requested_by?: string | null
          source_id?: string | null
          started_at?: string | null
          statistics?: Json
          status?: string
          summary?: Json
          updated_at?: string
          warnings?: Json
          warnings_count?: number
        }
        Update: {
          completed_at?: string | null
          connector_key?: string | null
          created_at?: string
          cursor_after?: Json | null
          cursor_before?: Json | null
          cursor_state?: Json
          entities_created?: number
          entities_unchanged?: number
          entities_updated?: number
          entity_source_id?: string | null
          error?: Json | null
          error_details?: Json
          errors_count?: number
          execution_mode?: Database["public"]["Enums"]["explore_import_execution_mode"]
          heartbeat_at?: string | null
          id?: string
          mode?: string
          parent_job_id?: string | null
          records_received?: number
          requested_by?: string | null
          source_id?: string | null
          started_at?: string | null
          statistics?: Json
          status?: string
          summary?: Json
          updated_at?: string
          warnings?: Json
          warnings_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "explore_import_jobs_parent_job_id_fkey"
            columns: ["parent_job_id"]
            isOneToOne: false
            referencedRelation: "explore_import_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_import_jobs_source_id_fkey"
            columns: ["entity_source_id"]
            isOneToOne: false
            referencedRelation: "explore_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_import_jobs_source_id_fkey1"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "explore_import_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_import_records: {
        Row: {
          action: Database["public"]["Enums"]["explore_import_record_action"]
          checksum: string
          created_at: string
          duplicate_candidates: Json
          entity_id: string | null
          external_id: string
          id: string
          job_id: string
          normalized_payload: Json
          previous_checksum: string | null
          raw_payload: Json | null
          review_status: string
          reviewed_at: string | null
          reviewed_by: string | null
          source_id: string
          validation_issues: Json
        }
        Insert: {
          action: Database["public"]["Enums"]["explore_import_record_action"]
          checksum: string
          created_at?: string
          duplicate_candidates?: Json
          entity_id?: string | null
          external_id: string
          id?: string
          job_id: string
          normalized_payload: Json
          previous_checksum?: string | null
          raw_payload?: Json | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_id: string
          validation_issues?: Json
        }
        Update: {
          action?: Database["public"]["Enums"]["explore_import_record_action"]
          checksum?: string
          created_at?: string
          duplicate_candidates?: Json
          entity_id?: string | null
          external_id?: string
          id?: string
          job_id?: string
          normalized_payload?: Json
          previous_checksum?: string | null
          raw_payload?: Json | null
          review_status?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_id?: string
          validation_issues?: Json
        }
        Relationships: [
          {
            foreignKeyName: "explore_import_records_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "explore_import_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_import_records_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "explore_import_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_import_revisions: {
        Row: {
          after_payload: Json | null
          before_payload: Json | null
          created_at: string
          entity_id: string | null
          id: string
          import_record_id: string
          operation: string
        }
        Insert: {
          after_payload?: Json | null
          before_payload?: Json | null
          created_at?: string
          entity_id?: string | null
          id?: string
          import_record_id: string
          operation: string
        }
        Update: {
          after_payload?: Json | null
          before_payload?: Json | null
          created_at?: string
          entity_id?: string | null
          id?: string
          import_record_id?: string
          operation?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_import_revisions_import_record_id_fkey"
            columns: ["import_record_id"]
            isOneToOne: false
            referencedRelation: "explore_import_records"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_import_rollbacks: {
        Row: {
          completed_at: string | null
          created_at: string
          error: Json | null
          id: string
          job_id: string
          requested_by: string | null
          started_at: string | null
          statistics: Json
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error?: Json | null
          id?: string
          job_id: string
          requested_by?: string | null
          started_at?: string | null
          statistics?: Json
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error?: Json | null
          id?: string
          job_id?: string
          requested_by?: string | null
          started_at?: string | null
          statistics?: Json
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_import_rollbacks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "explore_import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_import_sources: {
        Row: {
          configuration: Json
          consecutive_failures: number
          created_at: string
          cursor: Json
          enabled: boolean
          endpoint: string
          id: string
          last_failure_at: string | null
          last_success_at: string | null
          name: string
          schedule: string | null
          source_type: string
          updated_at: string
        }
        Insert: {
          configuration?: Json
          consecutive_failures?: number
          created_at?: string
          cursor?: Json
          enabled?: boolean
          endpoint: string
          id?: string
          last_failure_at?: string | null
          last_success_at?: string | null
          name: string
          schedule?: string | null
          source_type: string
          updated_at?: string
        }
        Update: {
          configuration?: Json
          consecutive_failures?: number
          created_at?: string
          cursor?: Json
          enabled?: boolean
          endpoint?: string
          id?: string
          last_failure_at?: string | null
          last_success_at?: string | null
          name?: string
          schedule?: string | null
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      explore_lake_profiles: {
        Row: {
          average_depth_feet: number | null
          boating_allowed: boolean | null
          created_at: string
          dam_name: string | null
          entity_id: string
          fishing_allowed: boolean | null
          managing_authority: string | null
          max_depth_feet: number | null
          profile_metadata: Json
          reservoir: boolean | null
          shoreline_miles: number | null
          surface_area_acres: number | null
          swimming_allowed: boolean | null
          updated_at: string
          wake_restrictions: string | null
          water_level_source_url: string | null
          water_type: string | null
        }
        Insert: {
          average_depth_feet?: number | null
          boating_allowed?: boolean | null
          created_at?: string
          dam_name?: string | null
          entity_id: string
          fishing_allowed?: boolean | null
          managing_authority?: string | null
          max_depth_feet?: number | null
          profile_metadata?: Json
          reservoir?: boolean | null
          shoreline_miles?: number | null
          surface_area_acres?: number | null
          swimming_allowed?: boolean | null
          updated_at?: string
          wake_restrictions?: string | null
          water_level_source_url?: string | null
          water_type?: string | null
        }
        Update: {
          average_depth_feet?: number | null
          boating_allowed?: boolean | null
          created_at?: string
          dam_name?: string | null
          entity_id?: string
          fishing_allowed?: boolean | null
          managing_authority?: string | null
          max_depth_feet?: number | null
          profile_metadata?: Json
          reservoir?: boolean | null
          shoreline_miles?: number | null
          surface_area_acres?: number | null
          swimming_allowed?: boolean | null
          updated_at?: string
          wake_restrictions?: string | null
          water_level_source_url?: string | null
          water_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_lake_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_lake_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_locations: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          county: string | null
          created_at: string
          directions: string | null
          elevation_feet: number | null
          entity_id: string
          id: string
          latitude: number | null
          longitude: number | null
          map_metadata: Json
          postal_code: string | null
          state_code: string
          timezone: string
          updated_at: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          directions?: string | null
          elevation_feet?: number | null
          entity_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          map_metadata?: Json
          postal_code?: string | null
          state_code?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          county?: string | null
          created_at?: string
          directions?: string | null
          elevation_feet?: number | null
          entity_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          map_metadata?: Json
          postal_code?: string | null
          state_code?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_locations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_locations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          checksum_sha256: string | null
          created_at: string
          credit_text: string | null
          external_url: string | null
          file_size_bytes: number | null
          height: number | null
          id: string
          is_active: boolean
          license_name: string | null
          license_url: string | null
          media_type: string
          metadata: Json
          mime_type: string | null
          photographer: string | null
          source_id: string | null
          storage_bucket: string | null
          storage_path: string | null
          title: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          checksum_sha256?: string | null
          created_at?: string
          credit_text?: string | null
          external_url?: string | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          is_active?: boolean
          license_name?: string | null
          license_url?: string | null
          media_type: string
          metadata?: Json
          mime_type?: string | null
          photographer?: string | null
          source_id?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          title?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          checksum_sha256?: string | null
          created_at?: string
          credit_text?: string | null
          external_url?: string | null
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          is_active?: boolean
          license_name?: string | null
          license_url?: string | null
          media_type?: string
          metadata?: Json
          mime_type?: string | null
          photographer?: string | null
          source_id?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
          title?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_media_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "explore_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_observations: {
        Row: {
          confidence: number
          created_at: string
          entity_id: string
          expires_at: string | null
          id: string
          observation_type: string
          observed_at: string
          payload: Json
          review_status: string
          reviewed_at: string | null
          reviewed_by_user_id: string | null
          source_id: string | null
          source_url: string | null
          title: string | null
          unit: string | null
          updated_at: string
          value_number: number | null
          value_text: string | null
        }
        Insert: {
          confidence?: number
          created_at?: string
          entity_id: string
          expires_at?: string | null
          id?: string
          observation_type: string
          observed_at: string
          payload?: Json
          review_status?: string
          reviewed_at?: string | null
          reviewed_by_user_id?: string | null
          source_id?: string | null
          source_url?: string | null
          title?: string | null
          unit?: string | null
          updated_at?: string
          value_number?: number | null
          value_text?: string | null
        }
        Update: {
          confidence?: number
          created_at?: string
          entity_id?: string
          expires_at?: string | null
          id?: string
          observation_type?: string
          observed_at?: string
          payload?: Json
          review_status?: string
          reviewed_at?: string | null
          reviewed_by_user_id?: string | null
          source_id?: string | null
          source_url?: string | null
          title?: string | null
          unit?: string | null
          updated_at?: string
          value_number?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_observations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_observations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_observations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "explore_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_park_profiles: {
        Row: {
          accessibility_notes: string | null
          acreage: number | null
          camping_available: boolean | null
          created_at: string
          entity_id: string
          entrance_fee_cents: number | null
          fee_notes: string | null
          managing_authority: string | null
          official_park_id: string | null
          operating_hours: Json
          park_type: string | null
          pets_allowed: boolean | null
          playground_available: boolean | null
          profile_metadata: Json
          reservations_required: boolean | null
          reservations_url: string | null
          restrooms_available: boolean | null
          updated_at: string
          visitor_center_available: boolean | null
        }
        Insert: {
          accessibility_notes?: string | null
          acreage?: number | null
          camping_available?: boolean | null
          created_at?: string
          entity_id: string
          entrance_fee_cents?: number | null
          fee_notes?: string | null
          managing_authority?: string | null
          official_park_id?: string | null
          operating_hours?: Json
          park_type?: string | null
          pets_allowed?: boolean | null
          playground_available?: boolean | null
          profile_metadata?: Json
          reservations_required?: boolean | null
          reservations_url?: string | null
          restrooms_available?: boolean | null
          updated_at?: string
          visitor_center_available?: boolean | null
        }
        Update: {
          accessibility_notes?: string | null
          acreage?: number | null
          camping_available?: boolean | null
          created_at?: string
          entity_id?: string
          entrance_fee_cents?: number | null
          fee_notes?: string | null
          managing_authority?: string | null
          official_park_id?: string | null
          operating_hours?: Json
          park_type?: string | null
          pets_allowed?: boolean | null
          playground_available?: boolean | null
          profile_metadata?: Json
          reservations_required?: boolean | null
          reservations_url?: string | null
          restrooms_available?: boolean | null
          updated_at?: string
          visitor_center_available?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "explore_park_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_park_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_relationship_types: {
        Row: {
          created_at: string
          default_weight: number
          description: string | null
          id: string
          is_active: boolean
          is_symmetric: boolean
          key: string
          name: string
          reverse_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_weight?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_symmetric?: boolean
          key: string
          name: string
          reverse_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_weight?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_symmetric?: boolean
          key?: string
          name?: string
          reverse_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      explore_saved_searches: {
        Row: {
          created_at: string
          filters: Json
          id: string
          is_shared: boolean
          name: string
          owner_user_id: string | null
          query_text: string | null
          sort_key: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          is_shared?: boolean
          name: string
          owner_user_id?: string | null
          query_text?: string | null
          sort_key?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          is_shared?: boolean
          name?: string
          owner_user_id?: string | null
          query_text?: string | null
          sort_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      explore_search_index: {
        Row: {
          alternate_names: string[]
          category_names: string[]
          document: unknown
          entity_id: string
          entity_type_key: string
          indexed_at: string
          location_text: string | null
          name: string
          popularity_score: number
          searchable_text: string
          slug: string
          source_confidence: number
          status: string
          tag_names: string[]
          updated_at: string
          visibility: string
        }
        Insert: {
          alternate_names?: string[]
          category_names?: string[]
          document?: unknown
          entity_id: string
          entity_type_key: string
          indexed_at?: string
          location_text?: string | null
          name: string
          popularity_score?: number
          searchable_text?: string
          slug: string
          source_confidence?: number
          status: string
          tag_names?: string[]
          updated_at?: string
          visibility?: string
        }
        Update: {
          alternate_names?: string[]
          category_names?: string[]
          document?: unknown
          entity_id?: string
          entity_type_key?: string
          indexed_at?: string
          location_text?: string | null
          name?: string
          popularity_score?: number
          searchable_text?: string
          slug?: string
          source_confidence?: number
          status?: string
          tag_names?: string[]
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_search_index_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_search_index_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_search_synonyms: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_bidirectional: boolean
          normalized_term: string
          relationship: string
          synonym: string
          synonym_normalized: string
          term: string
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_bidirectional?: boolean
          normalized_term: string
          relationship?: string
          synonym: string
          synonym_normalized: string
          term: string
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_bidirectional?: boolean
          normalized_term?: string
          relationship?: string
          synonym?: string
          synonym_normalized?: string
          term?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      explore_sources: {
        Row: {
          base_url: string | null
          created_at: string
          default_confidence: number
          id: string
          is_active: boolean
          is_authoritative: boolean
          license_name: string | null
          license_url: string | null
          name: string
          publisher: string | null
          source_type: string
          updated_at: string
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          default_confidence?: number
          id?: string
          is_active?: boolean
          is_authoritative?: boolean
          license_name?: string | null
          license_url?: string | null
          name: string
          publisher?: string | null
          source_type: string
          updated_at?: string
        }
        Update: {
          base_url?: string | null
          created_at?: string
          default_confidence?: number
          id?: string
          is_active?: boolean
          is_authoritative?: boolean
          license_name?: string | null
          license_url?: string | null
          name?: string
          publisher?: string | null
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      explore_species_profiles: {
        Row: {
          average_length_inches: number | null
          average_weight_pounds: number | null
          bloom_months: number[]
          conservation_status: string | null
          created_at: string
          entity_id: string
          family: string | null
          game_species: boolean | null
          genus: string | null
          habitat_notes: string | null
          identification_notes: string | null
          invasive: boolean | null
          kingdom: string | null
          migration_months: number[]
          native_to_texas: boolean | null
          profile_metadata: Json
          safety_notes: string | null
          scientific_name: string | null
          spawning_months: number[]
          species: string | null
          updated_at: string
        }
        Insert: {
          average_length_inches?: number | null
          average_weight_pounds?: number | null
          bloom_months?: number[]
          conservation_status?: string | null
          created_at?: string
          entity_id: string
          family?: string | null
          game_species?: boolean | null
          genus?: string | null
          habitat_notes?: string | null
          identification_notes?: string | null
          invasive?: boolean | null
          kingdom?: string | null
          migration_months?: number[]
          native_to_texas?: boolean | null
          profile_metadata?: Json
          safety_notes?: string | null
          scientific_name?: string | null
          spawning_months?: number[]
          species?: string | null
          updated_at?: string
        }
        Update: {
          average_length_inches?: number | null
          average_weight_pounds?: number | null
          bloom_months?: number[]
          conservation_status?: string | null
          created_at?: string
          entity_id?: string
          family?: string | null
          game_species?: boolean | null
          genus?: string | null
          habitat_notes?: string | null
          identification_notes?: string | null
          invasive?: boolean | null
          kingdom?: string | null
          migration_months?: number[]
          native_to_texas?: boolean | null
          profile_metadata?: Json
          safety_notes?: string | null
          scientific_name?: string | null
          spawning_months?: number[]
          species?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "explore_species_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_species_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      explore_tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          key: string
          name: string
          slug: string
          tag_group: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          slug: string
          tag_group?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          slug?: string
          tag_group?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      explore_trips: {
        Row: {
          created_at: string
          ends_on: string | null
          id: string
          is_public: boolean
          itinerary: Json
          owner_id: string | null
          preferences: Json
          share_token: string | null
          starts_on: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_on?: string | null
          id?: string
          is_public?: boolean
          itinerary?: Json
          owner_id?: string | null
          preferences?: Json
          share_token?: string | null
          starts_on?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_on?: string | null
          id?: string
          is_public?: boolean
          itinerary?: Json
          owner_id?: string | null
          preferences?: Json
          share_token?: string | null
          starts_on?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      legislative_committees: {
        Row: {
          chamber: string
          committee_code: string | null
          committee_name: string
          committee_slug: string
          created_at: string
          description: string | null
          id: string
          legislature_number: number
          session_code: string
          source_url: string | null
          updated_at: string
        }
        Insert: {
          chamber: string
          committee_code?: string | null
          committee_name: string
          committee_slug: string
          created_at?: string
          description?: string | null
          id?: string
          legislature_number: number
          session_code?: string
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          chamber?: string
          committee_code?: string | null
          committee_name?: string
          committee_slug?: string
          created_at?: string
          description?: string | null
          id?: string
          legislature_number?: number
          session_code?: string
          source_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      legislative_report_indexes: {
        Row: {
          content_hash: string
          extracted_text: string | null
          id: string
          last_imported_at: string
          last_seen_at: string
          legislature_number: number
          metadata: Json
          report_key: string | null
          report_title: string
          report_type: string
          session_code: string
          source_key: string
          source_record_key: string
          source_url: string
        }
        Insert: {
          content_hash: string
          extracted_text?: string | null
          id?: string
          last_imported_at?: string
          last_seen_at?: string
          legislature_number: number
          metadata?: Json
          report_key?: string | null
          report_title: string
          report_type: string
          session_code: string
          source_key?: string
          source_record_key: string
          source_url: string
        }
        Update: {
          content_hash?: string
          extracted_text?: string | null
          id?: string
          last_imported_at?: string
          last_seen_at?: string
          legislature_number?: number
          metadata?: Json
          report_key?: string | null
          report_title?: string
          report_type?: string
          session_code?: string
          source_key?: string
          source_record_key?: string
          source_url?: string
        }
        Relationships: []
      }
      legislative_sessions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_current: boolean
          legislature_number: number
          session_code: string
          session_name: string
          session_type: string
          source_url: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          legislature_number: number
          session_code?: string
          session_name: string
          session_type?: string
          source_url?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          legislature_number?: number
          session_code?: string
          session_name?: string
          session_type?: string
          source_url?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      legislative_source_records: {
        Row: {
          content_hash: string
          last_imported_at: string
          last_seen_at: string
          metadata: Json
          source_key: string
          source_record_key: string
          source_updated_at: string | null
          source_url: string
        }
        Insert: {
          content_hash: string
          last_imported_at?: string
          last_seen_at?: string
          metadata?: Json
          source_key: string
          source_record_key: string
          source_updated_at?: string | null
          source_url: string
        }
        Update: {
          content_hash?: string
          last_imported_at?: string
          last_seen_at?: string
          metadata?: Json
          source_key?: string
          source_record_key?: string
          source_updated_at?: string | null
          source_url?: string
        }
        Relationships: []
      }
      legislative_sync_runs: {
        Row: {
          completed_at: string | null
          cursor_after: Json
          cursor_before: Json
          errors: Json
          id: string
          legislature_number: number
          records_changed: number
          records_seen: number
          session_code: string
          source_key: string
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          cursor_after?: Json
          cursor_before?: Json
          errors?: Json
          id?: string
          legislature_number: number
          records_changed?: number
          records_seen?: number
          session_code: string
          source_key?: string
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          cursor_after?: Json
          cursor_before?: Json
          errors?: Json
          id?: string
          legislature_number?: number
          records_changed?: number
          records_seen?: number
          session_code?: string
          source_key?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      newsletter_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          source_page: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source_page?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source_page?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notified: boolean
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_notified: boolean
          customer_phone: string | null
          environment: string
          id: string
          items: Json
          printify_order_id: string | null
          shipping_address: Json
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          subtotal_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          admin_notified?: boolean
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_notified?: boolean
          customer_phone?: string | null
          environment?: string
          id?: string
          items: Json
          printify_order_id?: string | null
          shipping_address: Json
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id: string
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Update: {
          admin_notified?: boolean
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_notified?: boolean
          customer_phone?: string | null
          environment?: string
          id?: string
          items?: Json
          printify_order_id?: string | null
          shipping_address?: Json
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          collections: string[]
          colors: string[]
          created_at: string
          currency: string
          description: string
          id: string
          image_url: string
          is_active: boolean
          is_featured: boolean
          is_new: boolean
          is_on_sale: boolean
          price: number
          printify_product_id: string | null
          product_url: string
          source: string
          synced_at: string
          tags: string[]
          title: string
          updated_at: string
          variants: Json
        }
        Insert: {
          category?: string | null
          collections?: string[]
          colors?: string[]
          created_at?: string
          currency?: string
          description?: string
          id: string
          image_url?: string
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_on_sale?: boolean
          price?: number
          printify_product_id?: string | null
          product_url?: string
          source?: string
          synced_at?: string
          tags?: string[]
          title: string
          updated_at?: string
          variants?: Json
        }
        Update: {
          category?: string | null
          collections?: string[]
          colors?: string[]
          created_at?: string
          currency?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_on_sale?: boolean
          price?: number
          printify_product_id?: string | null
          product_url?: string
          source?: string
          synced_at?: string
          tags?: string[]
          title?: string
          updated_at?: string
          variants?: Json
        }
        Relationships: []
      }
      publishing_alerts: {
        Row: {
          created_at: string
          id: string
          incident_key: string
          latest_published_at: string | null
          message: string
          notification_sent_at: string | null
          opened_at: string
          reserve_slug: string | null
          resolved_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          incident_key: string
          latest_published_at?: string | null
          message: string
          notification_sent_at?: string | null
          opened_at?: string
          reserve_slug?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          incident_key?: string
          latest_published_at?: string | null
          message?: string
          notification_sent_at?: string | null
          opened_at?: string
          reserve_slug?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      publishing_queue: {
        Row: {
          content_package_id: string
          created_at: string
          id: string
          notes: string | null
          platform: string
          published_time: string | null
          scheduled_time: string | null
          status: string
          updated_at: string
        }
        Insert: {
          content_package_id: string
          created_at?: string
          id?: string
          notes?: string | null
          platform: string
          published_time?: string | null
          scheduled_time?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          content_package_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          platform?: string
          published_time?: string | null
          scheduled_time?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "publishing_queue_content_package_id_fkey"
            columns: ["content_package_id"]
            isOneToOne: false
            referencedRelation: "content_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      reel_candidates: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          source_account: string
          source_platform: string
          source_url: string
          status: string
          title: string | null
          topic: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          source_account: string
          source_platform: string
          source_url: string
          status?: string
          title?: string | null
          topic?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          source_account?: string
          source_platform?: string
          source_url?: string
          status?: string
          title?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      reserve_article_publications: {
        Row: {
          created_at: string
          published_at: string
          reserve_key: string
          slug: string
        }
        Insert: {
          created_at?: string
          published_at?: string
          reserve_key: string
          slug: string
        }
        Update: {
          created_at?: string
          published_at?: string
          reserve_key?: string
          slug?: string
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          access_token: string | null
          account_id: string | null
          account_name: string
          connection_status: string
          created_at: string
          id: string
          platform: string
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          account_id?: string | null
          account_name: string
          connection_status?: string
          created_at?: string
          id?: string
          platform: string
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          account_id?: string | null
          account_name?: string
          connection_status?: string
          created_at?: string
          id?: string
          platform?: string
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      texas_news_feed: {
        Row: {
          classification_confidence: number | null
          created_at: string
          description: string | null
          extracted_body: string | null
          id: number
          internal_slug: string | null
          link: string
          preflight_json: Json | null
          pub_date: string
          ready_for_rewrite: boolean
          routing_type: string | null
          source: string
          source_count: number | null
          source_reputation_score: number | null
          texas_relevance_score: number | null
          title: string
          trend_source: string | null
          trend_velocity: number | null
          viral_score: number
          viral_scored_at: string | null
          viral_signals: Json | null
        }
        Insert: {
          classification_confidence?: number | null
          created_at?: string
          description?: string | null
          extracted_body?: string | null
          id?: number
          internal_slug?: string | null
          link: string
          preflight_json?: Json | null
          pub_date?: string
          ready_for_rewrite?: boolean
          routing_type?: string | null
          source: string
          source_count?: number | null
          source_reputation_score?: number | null
          texas_relevance_score?: number | null
          title: string
          trend_source?: string | null
          trend_velocity?: number | null
          viral_score?: number
          viral_scored_at?: string | null
          viral_signals?: Json | null
        }
        Update: {
          classification_confidence?: number | null
          created_at?: string
          description?: string | null
          extracted_body?: string | null
          id?: number
          internal_slug?: string | null
          link?: string
          preflight_json?: Json | null
          pub_date?: string
          ready_for_rewrite?: boolean
          routing_type?: string | null
          source?: string
          source_count?: number | null
          source_reputation_score?: number | null
          texas_relevance_score?: number | null
          title?: string
          trend_source?: string | null
          trend_velocity?: number | null
          viral_score?: number
          viral_scored_at?: string | null
          viral_signals?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      bill_document_completeness: {
        Row: {
          analysis_count: number | null
          bill_id: string | null
          bill_number: number | null
          bill_text_count: number | null
          bill_type: string | null
          completeness_score: number | null
          document_count: number | null
          fiscal_note_count: number | null
          has_analysis: boolean | null
          has_bill_text: boolean | null
          has_fiscal_note: boolean | null
          has_history: boolean | null
          has_witness_list: boolean | null
          history_count: number | null
          latest_document_imported_at: string | null
          legislature_number: number | null
          session_code: string | null
          witness_list_count: number | null
        }
        Relationships: []
      }
      explore_public_entities: {
        Row: {
          activities: string[] | null
          address: Json | null
          alternate_names: string[] | null
          amenities: string[] | null
          categories: string[] | null
          city: string | null
          county: string | null
          description: string | null
          email: string | null
          entity_type: string | null
          fee_required: boolean | null
          fees: Json | null
          hero_image_alt: string | null
          hero_image_url: string | null
          hours: Json | null
          id: string | null
          is_accessible: boolean | null
          is_family_friendly: boolean | null
          is_featured: boolean | null
          is_pet_friendly: boolean | null
          latitude: number | null
          longitude: number | null
          name: string | null
          official_url: string | null
          phone: string | null
          popularity_score: number | null
          profile: Json | null
          region: string | null
          regulations: Json | null
          seasonal_guidance: Json | null
          slug: string | null
          source_name: string | null
          source_updated_at: string | null
          source_url: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          updated_at: string | null
          visibility: string | null
        }
        Relationships: []
      }
      explore_public_observations: {
        Row: {
          description: string | null
          ends_at: string | null
          entity_id: string | null
          id: string | null
          observation_type: string | null
          severity: string | null
          source_url: string | null
          starts_at: string | null
          title: string | null
        }
        Insert: {
          description?: never
          ends_at?: string | null
          entity_id?: string | null
          id?: string | null
          observation_type?: string | null
          severity?: never
          source_url?: string | null
          starts_at?: string | null
          title?: never
        }
        Update: {
          description?: never
          ends_at?: string | null
          entity_id?: string | null
          id?: string | null
          observation_type?: string | null
          severity?: never
          source_url?: string | null
          starts_at?: string | null
          title?: never
        }
        Relationships: [
          {
            foreignKeyName: "explore_observations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "explore_observations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "explore_public_entities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      autocomplete_explore_entities: {
        Args: { result_limit?: number; search_query: string }
        Returns: {
          entity_type: string
          name: string
          region: string
          slug: string
        }[]
      }
      claim_ai_rewrite_slot: {
        Args: {
          p_content_fingerprint: string
          p_daily_limit?: number
          p_feed_item_id: number
        }
        Returns: string
      }
      claim_automated_ai_rewrite_slot: {
        Args: {
          p_content_fingerprint: string
          p_daily_limit?: number
          p_feed_item_id: number
        }
        Returns: string
      }
      claim_explore_import_job: {
        Args: never
        Returns: {
          completed_at: string | null
          connector_key: string | null
          created_at: string
          cursor_after: Json | null
          cursor_before: Json | null
          cursor_state: Json
          entities_created: number
          entities_unchanged: number
          entities_updated: number
          entity_source_id: string | null
          error: Json | null
          error_details: Json
          errors_count: number
          execution_mode: Database["public"]["Enums"]["explore_import_execution_mode"]
          heartbeat_at: string | null
          id: string
          mode: string
          parent_job_id: string | null
          records_received: number
          requested_by: string | null
          source_id: string | null
          started_at: string | null
          statistics: Json
          status: string
          summary: Json
          updated_at: string
          warnings: Json
          warnings_count: number
        }
        SetofOptions: {
          from: "*"
          to: "explore_import_jobs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      explore_merge_duplicate_candidate: {
        Args: {
          p_candidate_id: string
          p_notes?: string
          p_resolved_by?: string
          p_survivor_id: string
        }
        Returns: Json
      }
      explore_merge_entities: {
        Args: {
          p_loser_id: string
          p_notes?: string
          p_resolved_by?: string
          p_survivor_id: string
        }
        Returns: Json
      }
      grant_manual_ai_rewrite_bypass: {
        Args: { p_feed_item_id: number }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_variant_metric: {
        Args: { _kind: string; _slug: string; _variant: string }
        Returns: undefined
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      refresh_bill_document_latest_flags: {
        Args: { p_bill_id?: string }
        Returns: undefined
      }
      refresh_legislative_authority_graph: { Args: never; Returns: undefined }
      related_authority_content: {
        Args: { p_limit?: number; p_source_key: string; p_source_type: string }
        Returns: {
          evidence: Json
          relationship_type: string
          score: number
          target_key: string
          target_type: string
        }[]
      }
      search_explore_entities: {
        Args: {
          counties?: string[]
          entity_types?: string[]
          near_lat?: number
          near_lng?: number
          radius_km?: number
          regions?: string[]
          required_activities?: string[]
          required_amenities?: string[]
          result_limit?: number
          result_offset?: number
          search_query?: string
        }
        Returns: {
          activities: string[]
          amenities: string[]
          city: string
          county: string
          distance_km: number
          entity_type: string
          fee_required: boolean
          hero_image_alt: string
          hero_image_url: string
          id: string
          is_accessible: boolean
          is_family_friendly: boolean
          is_pet_friendly: boolean
          latitude: number
          longitude: number
          name: string
          rank: number
          region: string
          slug: string
          summary: string
          total_count: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      upsert_bidirectional_authority_relationship: {
        Args: {
          p_evidence?: Json
          p_is_manual?: boolean
          p_relationship_type: string
          p_score: number
          p_source_key: string
          p_source_type: string
          p_target_key: string
          p_target_type: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      explore_import_execution_mode: "live" | "dry-run" | "preview"
      explore_import_job_status:
        | "queued"
        | "running"
        | "completed"
        | "completed_with_warnings"
        | "failed"
        | "cancelled"
        | "rolled_back"
      explore_import_record_action:
        | "insert"
        | "update"
        | "unchanged"
        | "duplicate"
        | "reject"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      explore_import_execution_mode: ["live", "dry-run", "preview"],
      explore_import_job_status: [
        "queued",
        "running",
        "completed",
        "completed_with_warnings",
        "failed",
        "cancelled",
        "rolled_back",
      ],
      explore_import_record_action: [
        "insert",
        "update",
        "unchanged",
        "duplicate",
        "reject",
      ],
    },
  },
} as const

