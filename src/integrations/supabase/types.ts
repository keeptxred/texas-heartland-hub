export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
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
          id: string
          notes: string | null
          platform: string
          source_name: string
          source_quality_reason: string | null
          source_reputation_score: number | null
          source_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          platform: string
          source_name: string
          source_quality_reason?: string | null
          source_reputation_score?: number | null
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          platform?: string
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
          colors: string[]
          created_at: string
          currency: string
          description: string
          id: string
          image_url: string
          is_active: boolean
          price: number
          product_url: string
          source: string
          synced_at: string
          tags: string[]
          title: string
          updated_at: string
          variants: Json
        }
        Insert: {
          colors?: string[]
          created_at?: string
          currency?: string
          description?: string
          id: string
          image_url?: string
          is_active?: boolean
          price?: number
          product_url?: string
          source?: string
          synced_at?: string
          tags?: string[]
          title: string
          updated_at?: string
          variants?: Json
        }
        Update: {
          colors?: string[]
          created_at?: string
          currency?: string
          description?: string
          id?: string
          image_url?: string
          is_active?: boolean
          price?: number
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
          id: number
          internal_slug: string | null
          link: string
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
          id?: number
          internal_slug?: string | null
          link: string
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
          id?: number
          internal_slug?: string | null
          link?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
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
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
