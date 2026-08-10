ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS publish_keeptxred boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publish_texasdefined boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS keeptxred_category text,
  ADD COLUMN IF NOT EXISTS texasdefined_category text,
  ADD COLUMN IF NOT EXISTS keeptxred_collections text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS texasdefined_collections text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS keeptxred_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS texasdefined_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS keeptxred_display_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS texasdefined_display_order integer NOT NULL DEFAULT 0;

UPDATE public.products
SET publish_keeptxred = is_active,
    keeptxred_category = category,
    keeptxred_collections = collections,
    keeptxred_featured = is_featured;

CREATE INDEX IF NOT EXISTS products_publish_keeptxred_idx ON public.products (publish_keeptxred);
CREATE INDEX IF NOT EXISTS products_publish_texasdefined_idx ON public.products (publish_texasdefined);