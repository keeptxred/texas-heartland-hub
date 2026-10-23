-- OAuth credentials, provider defaults and durable publishing checkpoints.
-- Service-only: no public Data API or authenticated-user table access.
CREATE TABLE public.publisher_state (
  key text PRIMARY KEY CHECK (length(key) <= 256),
  value jsonb NOT NULL CHECK (jsonb_typeof(value) = 'object'),
  version uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.publisher_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.publisher_state FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.publisher_state TO service_role;
CREATE INDEX publisher_state_expiry_idx ON public.publisher_state (expires_at);
COMMENT ON TABLE public.publisher_state IS 'Private Printify publisher state. OAuth bearer values and file download URLs are never stored; tokens are SHA256 indexed. Jobs retain checkpoints for retry reconciliation.';
