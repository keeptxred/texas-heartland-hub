-- Assign a destination to high-confidence review/social stories without
-- bypassing their editorial lane. This runs after generic routing/quality
-- guards and never touches linked/published rows or explicit routing locks.

create or replace function public.route_deterministic_review_destinations()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  h text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.source,'') || ' ' || coalesce(new.trend_source,''));
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null then return new; end if;
  if coalesce((new.viral_signals->>'routing_lock')::boolean,false) then return new; end if;
  if coalesce(new.target_site,'review') <> 'review' then return new; end if;

  -- Explicit Texas collegiate athletics belongs on KTR Sports even when the
  -- editorial scorer correctly keeps it in REVIEW.
  if h ~ '(houston cougars athletics|\mcougars\M.*(win|wins|sweep|season|game)|college athletics)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    return new;
  end if;

  -- Flock-camera policy/funding is political/government accountability. Keep
  -- it review-required so routing can never be mistaken for publish approval.
  if h ~ '(flock cameras?|flock safety)' and h ~ '(abbott|governor|lawmakers?|state agencies|insurance polic|government|legislature)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Politics';
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object(
      'editorial_lane','REVIEW',
      'auto_publish_eligible',false,
      'post_rewrite_review_required',true
    );
    return new;
  end if;

  -- High-confidence statewide/local hard-news destinations; preserve the
  -- existing SOCIAL_ONLY or REVIEW lane and rewrite readiness unchanged.
  if h ~ '(grain theft|theft investigation)' and h ~ '(texas|million pounds|across the state)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;
  if h ~ '(storm|severe weather)' and h ~ '(power outages?|school closures?|damage)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  -- Material store-footprint expansion is KTR Business, not an unclassified
  -- review item; this does not change its SOCIAL_ONLY lane.
  if h ~ '(bass pro)' and h ~ '(expand|expanding|expansion|footprint|new store|new location)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Business';
    return new;
  end if;

  -- Prehistoric discoveries and Texas natural-history finds belong on
  -- TexasDefined History even when the scorer keeps them social-only.
  if h ~ '(dinosaur track|dinosaur tracks|prehistoric)' and h ~ '(hutto|central texas|texas)' then
    new.target_site := 'texasdefined';
    new.target_section := 'History';
    return new;
  end if;

  return new;
end;
$function$;

drop trigger if exists zzzzzzzzzzzz_route_deterministic_review_destinations on public.texas_news_feed;
create trigger zzzzzzzzzzzz_route_deterministic_review_destinations
before insert or update of title, description, source, trend_source, target_site, viral_signals
on public.texas_news_feed
for each row execute function public.route_deterministic_review_destinations();

-- Re-evaluate only current unlinked review rows. The trigger changes target
-- destination only, except Flock-camera stories are explicitly tightened to
-- REVIEW/auto-publish-ineligible.
update public.texas_news_feed
set title = title
where target_site = 'review'
  and internal_slug is null
  and texasdefined_slug is null
  and created_at >= now() - interval '14 days';

comment on function public.route_deterministic_review_destinations() is
  'Late destination router for high-confidence review/social stories; preserves editorial holds and explicitly review-locks Flock-camera policy stories.';
