CREATE TABLE IF NOT EXISTS public.platform_governance_events (
  id TEXT PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  kind TEXT NOT NULL,
  site TEXT NOT NULL,
  domain TEXT NOT NULL,
  disposition TEXT NOT NULL,
  gate_status TEXT NOT NULL,
  decision_fingerprint TEXT NOT NULL,
  candidate_fingerprint TEXT NOT NULL,
  canonical_owner TEXT NOT NULL,
  source_site TEXT NOT NULL,
  override_used BOOLEAN NOT NULL DEFAULT false,
  writer TEXT,
  reason_codes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.platform_governance_events TO service_role;

ALTER TABLE public.platform_governance_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS platform_governance_events_occurred_at_idx ON public.platform_governance_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS platform_governance_events_site_idx ON public.platform_governance_events (site);

CREATE OR REPLACE FUNCTION public.prune_platform_governance_events(retain_days INTEGER DEFAULT 180)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed INTEGER;
BEGIN
  DELETE FROM public.platform_governance_events
  WHERE occurred_at < now() - (GREATEST(LEAST(retain_days, 3650), 30) || ' days')::interval;
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE ALL ON FUNCTION public.prune_platform_governance_events(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prune_platform_governance_events(INTEGER) TO service_role;