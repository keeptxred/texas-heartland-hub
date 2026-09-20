-- Escalate high-priority newsroom gaps that require editorial attention, not
-- only generation/publish failures. This remains alert-only: it does not
-- generate, rewrite, or publish content. The existing cap prevents alert floods.

create or replace function public.sync_coverage_gap_alerts(
  p_min_priority integer default 80,
  p_min_age_hours integer default 10,
  p_limit integer default 10
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
declare
  opened_count integer := 0;
  resolved_count integer := 0;
  candidate_count integer := 0;
begin
  if p_min_priority < 0 or p_min_priority > 100 then raise exception 'p_min_priority must be between 0 and 100'; end if;
  if p_min_age_hours < 1 or p_min_age_hours > 168 then raise exception 'p_min_age_hours must be between 1 and 168'; end if;
  if p_limit < 1 or p_limit > 25 then raise exception 'p_limit must be between 1 and 25'; end if;

  select count(*) into candidate_count
  from public.news_coverage_gaps g
  where g.gap_reason in (
      'article_generation_or_publish_gap',
      'held_for_corroboration',
      'corroborated_review_hold',
      'low_classification_confidence'
    )
    and coalesce(g.coverage_priority,0) >= p_min_priority
    and g.pub_date < now() - make_interval(hours => p_min_age_hours);

  with candidates as (
    select g.id,g.title,g.source,g.pub_date,g.coverage_priority,g.gap_reason
    from public.news_coverage_gaps g
    where g.gap_reason in (
        'article_generation_or_publish_gap',
        'held_for_corroboration',
        'corroborated_review_hold',
        'low_classification_confidence'
      )
      and coalesce(g.coverage_priority,0) >= p_min_priority
      and g.pub_date < now() - make_interval(hours => p_min_age_hours)
    order by g.coverage_priority desc,g.pub_date asc
    limit p_limit
  ), upserted as (
    insert into public.publishing_alerts(incident_key,status,latest_published_at,message,updated_at)
    select
      'coverage-gap-' || c.id::text,
      'open',
      c.pub_date,
      format(
        'High-priority newsroom coverage gap requires attention after %s hours. Priority %s. Reason: %s. Source: %s. Story: %s',
        p_min_age_hours,
        coalesce(c.coverage_priority,0),
        coalesce(c.gap_reason,'unknown'),
        coalesce(c.source,'unknown'),
        c.title
      ),
      now()
    from candidates c
    on conflict (incident_key) do update set
      status='open',
      resolved_at=null,
      latest_published_at=excluded.latest_published_at,
      message=excluded.message,
      updated_at=now()
    returning 1
  ) select count(*) into opened_count from upserted;

  with resolved as (
    update public.publishing_alerts a
    set status='resolved',resolved_at=now(),updated_at=now()
    where a.status='open'
      and a.incident_key like 'coverage-gap-%'
      and not exists (
        select 1
        from public.news_coverage_gaps g
        where ('coverage-gap-' || g.id::text)=a.incident_key
          and g.gap_reason in (
            'article_generation_or_publish_gap',
            'held_for_corroboration',
            'corroborated_review_hold',
            'low_classification_confidence'
          )
          and coalesce(g.coverage_priority,0)>=p_min_priority
          and g.pub_date < now()-make_interval(hours=>p_min_age_hours)
      )
    returning 1
  ) select count(*) into resolved_count from resolved;

  return jsonb_build_object(
    'ok',true,
    'candidate_count',candidate_count,
    'alerts_opened_or_refreshed',opened_count,
    'alerts_resolved',resolved_count,
    'min_priority',p_min_priority,
    'min_age_hours',p_min_age_hours,
    'alert_limit',p_limit
  );
end;
$function$;

comment on function public.sync_coverage_gap_alerts(integer,integer,integer) is
  'Opens bounded alerts for overdue high-priority publish gaps and editorial review/corroboration/classification holds; never publishes content.';
