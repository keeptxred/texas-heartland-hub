CREATE TABLE public.publishing_queue (
  id uuid primary key default gen_random_uuid(),
  content_package_id uuid not null references public.content_packages(id) on delete cascade,
  platform text not null,
  status text not null default 'DRAFT',
  scheduled_time timestamptz,
  published_time timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint publishing_queue_status_chk check (status in ('DRAFT','READY','PUBLISHED','ARCHIVED'))
);

GRANT ALL ON public.publishing_queue TO service_role;

ALTER TABLE public.publishing_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role manages publishing_queue"
  ON public.publishing_queue FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER trg_publishing_queue_updated_at
  BEFORE UPDATE ON public.publishing_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_content_packages_updated_at();

CREATE INDEX idx_publishing_queue_status ON public.publishing_queue (status, created_at DESC);
CREATE INDEX idx_publishing_queue_package ON public.publishing_queue (content_package_id);