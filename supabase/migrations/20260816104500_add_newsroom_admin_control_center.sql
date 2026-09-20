-- Low-credit newsroom Phase 11: admin editorial control center support.
-- This migration adds audit/health surfaces only. It does not schedule or invoke AI.

CREATE TABLE IF NOT EXISTS public.newsroom_editorial_actions (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.news_publish_candidates(id) ON DELETE CASCADE,
  cluster_id uuid NOT NULL REFERENCES public.news_story_clusters(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('SELECT','HOLD','REJECT','RELEASE')),
  previous_candidate_status text,
  next_candidate_status text NOT NULL,
  reason text,
  actor text NOT NULL DEFAULT 'admin-control-center',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsroom_editorial_actions_candidate
  ON public.newsroom_editorial_actions(candidate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsroom_editorial_actions_created
  ON public.newsroom_editorial_actions(created_at DESC);

ALTER TABLE public.newsroom_editorial_actions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.newsroom_admin_cron_health()
RETURNS TABLE (
  jobname text,
  schedule text,
  active boolean,
  status text,
  return_message text,
  start_time timestamptz,
  end_time timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, cron, pg_temp
AS $$
  SELECT
    j.jobname::text,
    j.schedule::text,
    j.active,
    d.status::text,
    d.return_message::text,
    d.start_time,
    d.end_time
  FROM cron.job j
  LEFT JOIN LATERAL (
    SELECT r.status, r.return_message, r.start_time, r.end_time
    FROM cron.job_run_details r
    WHERE r.jobid = j.jobid
    ORDER BY r.start_time DESC
    LIMIT 1
  ) d ON true
  WHERE j.jobname LIKE 'keep-tx-red-%'
  ORDER BY j.jobname;
$$;

REVOKE ALL ON FUNCTION public.newsroom_admin_cron_health() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.newsroom_admin_cron_health() TO service_role;

COMMENT ON TABLE public.newsroom_editorial_actions IS
  'Server-only audit trail for explicit newsroom editorial control-center actions. No AI generation is triggered.';
COMMENT ON FUNCTION public.newsroom_admin_cron_health() IS
  'Service-role-only readout of KeepTXRed pg_cron job status for the admin newsroom control center.';
