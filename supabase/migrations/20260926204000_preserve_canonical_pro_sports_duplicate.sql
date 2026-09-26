-- Preserve exactly one canonical candidate per duplicate title in the
-- Texas Pro Sports discovery lane. The prior EXISTS-any-duplicate rule could
-- quarantine the original row on later updates after a duplicate arrived.
-- Lowest bigint id wins deterministically; later copies remain review-held.

create or replace function public.guard_pro_sports_duplicate_title()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $function$
declare
  has_earlier_copy boolean;
begin
  if new.trend_source is distinct from 'Texas Pro Sports — Daily Discovery'
     or new.internal_slug is not null or new.texasdefined_slug is not null
  then return new; end if;

  select exists (
    select 1 from public.texas_news_feed f
    where f.trend_source = new.trend_source
      and lower(btrim(f.title)) = lower(btrim(new.title))
      and f.id < new.id
  ) into has_earlier_copy;

  if has_earlier_copy then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.classification_confidence := greatest(coalesce(new.classification_confidence,0),1);
    new.viral_scored_at := coalesce(new.viral_scored_at,now());
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object(
      'duplicate_title_quarantine',true,'auto_publish_eligible',false,'editorial_lane','REVIEW',
      'exclusion_reason','Duplicate Texas Pro Sports discovery title',
      'routing_lock',true,'routing_locked_site','review','routing_locked_section','Unclassified'
    );
  elsif coalesce((new.viral_signals->>'duplicate_title_quarantine')::boolean,false) is true then
    -- Earlier routing/quality guards have already decided the canonical row.
    -- Remove only duplicate-specific state; do not override source contamination.
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb)
      - 'duplicate_title_quarantine';
    if coalesce((new.viral_signals->>'source_contamination')::boolean,false) is false then
      new.viral_signals := new.viral_signals
        - 'auto_publish_eligible' - 'editorial_lane' - 'exclusion_reason'
        - 'routing_lock' - 'routing_locked_site' - 'routing_locked_section';
      new.viral_scored_at := null;
      new.classification_confidence := null;
      new.viral_score := 0;
      new.ready_for_rewrite := false;
    end if;
  end if;
  return new;
end;
$function$;

drop trigger if exists zzzzzzzzzzzzz_guard_pro_sports_duplicate_title on public.texas_news_feed;
drop trigger if exists zzzzzzzzzzzzzzzz_guard_pro_sports_duplicate_title on public.texas_news_feed;
create trigger zzzzzzzzzzzzzzzz_guard_pro_sports_duplicate_title
before insert or update of title, trend_source, target_site, target_section, viral_signals
on public.texas_news_feed
for each row execute function public.guard_pro_sports_duplicate_title();

update public.texas_news_feed
set title=title
where trend_source='Texas Pro Sports — Daily Discovery'
  and internal_slug is null and texasdefined_slug is null;

comment on function public.guard_pro_sports_duplicate_title() is
  'Keeps the lowest-id Texas Pro Sports row as the canonical candidate and quarantines only later same-title duplicates.';
