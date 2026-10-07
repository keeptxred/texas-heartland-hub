create or replace function public.count_overdue_news_coverage_gaps(p_cutoff timestamptz)
returns bigint
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select count(*)::bigint
  from public.news_coverage_gaps
  where gap_reason = 'article_generation_or_publish_gap'
    and pub_date < p_cutoff
$$;

revoke all on function public.count_overdue_news_coverage_gaps(timestamptz) from public, anon, authenticated;
grant execute on function public.count_overdue_news_coverage_gaps(timestamptz) to service_role;

comment on function public.count_overdue_news_coverage_gaps(timestamptz) is
  'Counts overdue publishable KeepTXRed coverage gaps from the optimized news_coverage_gaps view.';
