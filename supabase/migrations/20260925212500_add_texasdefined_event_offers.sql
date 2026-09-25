-- TexasDefined event and offer discovery inventory.
-- This supports a normalized cross-network search layer for Explore, events,
-- offers, hotels, attractions, and affiliate partner placements.

CREATE TABLE IF NOT EXISTS public.texasdefined_offer_sources (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  source_key text NOT NULL UNIQUE,
  network text NOT NULL CHECK (network IN ('impact', 'cj', 'expedia', 'direct', 'internal')),
  advertiser text NOT NULL,
  source_label text NOT NULL,
  fetch_strategy text NOT NULL DEFAULT 'manual' CHECK (fetch_strategy IN ('manual', 'api', 'feed', 'webhook')),
  terms_url text,
  last_synced_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.texasdefined_event_offers (
  id text PRIMARY KEY,
  source_id uuid REFERENCES public.texasdefined_offer_sources(id) ON DELETE SET NULL,
  external_id text,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL CHECK (kind IN ('event', 'offer', 'hotel', 'attraction', 'package')),
  category text NOT NULL CHECK (category IN ('concerts', 'sports', 'festivals', 'family', 'theater', 'attractions', 'tours', 'hotels', 'outdoors', 'shopping')),
  network text NOT NULL CHECK (network IN ('impact', 'cj', 'expedia', 'direct', 'internal')),
  advertiser text NOT NULL,
  city text NOT NULL,
  region text NOT NULL DEFAULT 'Texas',
  county text,
  venue text,
  latitude numeric,
  longitude numeric,
  start_date date,
  end_date date,
  price_label text,
  offer_label text,
  promo_code text,
  affiliate_url text NOT NULL,
  source_url text,
  image_url text,
  commission_status text NOT NULL DEFAULT 'unknown' CHECK (commission_status IN ('preserved', 'reduced', 'zero', 'unknown')),
  discount_preserves_commission boolean,
  is_discount boolean NOT NULL DEFAULT false,
  is_editorial_only boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  last_verified_at timestamptz,
  tags text[] NOT NULL DEFAULT '{}',
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT texasdefined_event_offers_commission_guard CHECK (
    NOT (commission_status = 'zero' AND discount_preserves_commission = true)
  )
);

CREATE INDEX IF NOT EXISTS idx_texasdefined_event_offers_active_dates
  ON public.texasdefined_event_offers (is_active, start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_texasdefined_event_offers_location
  ON public.texasdefined_event_offers (city, region, county);

CREATE INDEX IF NOT EXISTS idx_texasdefined_event_offers_category
  ON public.texasdefined_event_offers (category, kind);

CREATE INDEX IF NOT EXISTS idx_texasdefined_event_offers_network_commission
  ON public.texasdefined_event_offers (network, commission_status, discount_preserves_commission);

CREATE INDEX IF NOT EXISTS idx_texasdefined_event_offers_tags
  ON public.texasdefined_event_offers USING gin (tags);

ALTER TABLE public.texasdefined_offer_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.texasdefined_event_offers ENABLE ROW LEVEL SECURITY;

-- Public client access is intentionally not granted here. The app reads this
-- inventory through server-side routes using the existing service-role client,
-- then exposes only active, filtered, non-secret fields.

INSERT INTO public.texasdefined_offer_sources (source_key, network, advertiser, source_label, fetch_strategy)
VALUES
  ('ticketmaster-impact', 'impact', 'Ticketmaster', 'Ticketmaster / Impact event inventory', 'api'),
  ('cj-approved-promotions', 'cj', 'CJ Advertisers', 'CJ approved promotions feed', 'api'),
  ('expedia-hotel-widgets', 'expedia', 'Expedia Group', 'Expedia hotel and stay inventory', 'api')
ON CONFLICT (source_key) DO UPDATE SET
  network = EXCLUDED.network,
  advertiser = EXCLUDED.advertiser,
  source_label = EXCLUDED.source_label,
  fetch_strategy = EXCLUDED.fetch_strategy,
  updated_at = now();
