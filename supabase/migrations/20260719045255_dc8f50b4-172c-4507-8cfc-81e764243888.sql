
ALTER TABLE public.content_packages
  ADD COLUMN IF NOT EXISTS asset_type text CHECK (asset_type IN ('IMAGE','REEL')),
  ADD COLUMN IF NOT EXISTS asset_url text,
  ADD COLUMN IF NOT EXISTS asset_source_account text,
  ADD COLUMN IF NOT EXISTS asset_notes text,
  ADD COLUMN IF NOT EXISTS workflow_status text NOT NULL DEFAULT 'DRAFT'
    CHECK (workflow_status IN ('DRAFT','ASSET_READY','READY_TO_POST','PUBLISHED'));
