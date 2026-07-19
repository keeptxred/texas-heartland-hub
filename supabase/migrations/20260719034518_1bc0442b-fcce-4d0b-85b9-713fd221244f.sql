CREATE TABLE public.social_connections (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  account_name text not null,
  account_id text,
  connection_status text not null default 'NOT_CONNECTED',
  access_token text,
  token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT ALL ON public.social_connections TO service_role;

ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role manages social connections"
  ON public.social_connections FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER trg_social_connections_updated_at
  BEFORE UPDATE ON public.social_connections
  FOR EACH ROW EXECUTE FUNCTION public.set_content_packages_updated_at();