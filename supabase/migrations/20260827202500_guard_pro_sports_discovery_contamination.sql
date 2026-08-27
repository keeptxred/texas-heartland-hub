-- Defense in depth for Texas Pro Sports discovery. Google News can occasionally
-- return loosely related results even when the query uses quoted team names.
-- Keep those rows for audit/history, but quarantine them before scoring or
-- publication eligibility. Legitimate team rows continue through the normal
-- newsroom pipeline unchanged.

create or replace function public.guard_texas_pro_sports_discovery_row()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  haystack text := lower(
    coalesce(new.title, '') || ' ' ||
    coalesce(new.description, '') || ' ' ||
    coalesce(new.source, '')
  );
begin
  if new.trend_source = 'Texas Pro Sports — Daily Discovery'
     and haystack !~ '(dallas mavericks|dallas cowboys|texas rangers|houston astros|houston texans|san antonio spurs)'
  then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.classification_confidence := 1;
    new.viral_scored_at := coalesce(new.viral_scored_at, now());
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'source_contamination', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'exclusion_reason', 'Texas Pro Sports discovery result did not mention an allowlisted Texas pro team'
    );
  end if;
  return new;
end;
$function$;

drop trigger if exists guard_texas_pro_sports_discovery_row on public.texas_news_feed;
create trigger guard_texas_pro_sports_discovery_row
before insert or update of title, description, source, trend_source
on public.texas_news_feed
for each row
execute function public.guard_texas_pro_sports_discovery_row();

-- Quarantine only existing unlinked rows from this discovery source that do not
-- mention one of the six allowlisted teams. Published/linked content is never
-- touched by this cleanup.
update public.texas_news_feed
set title = title
where trend_source = 'Texas Pro Sports — Daily Discovery'
  and internal_slug is null
  and lower(coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(source, ''))
      !~ '(dallas mavericks|dallas cowboys|texas rangers|houston astros|houston texans|san antonio spurs)';

comment on function public.guard_texas_pro_sports_discovery_row() is
  'Quarantines non-team noise attributed to Texas Pro Sports Daily Discovery while preserving legitimate six-team coverage and publication safeguards.';
