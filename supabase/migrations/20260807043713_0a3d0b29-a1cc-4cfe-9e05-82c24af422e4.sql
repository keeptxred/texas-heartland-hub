ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS keeptxred_title text,
  ADD COLUMN IF NOT EXISTS keeptxred_description text,
  ADD COLUMN IF NOT EXISTS keeptxred_image_url text,
  ADD COLUMN IF NOT EXISTS texasdefined_title text,
  ADD COLUMN IF NOT EXISTS texasdefined_description text,
  ADD COLUMN IF NOT EXISTS texasdefined_image_url text;