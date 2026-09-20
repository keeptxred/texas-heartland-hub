-- Additional deterministic routing for the expanded local-source layer.
-- Runs after v2, respects route locks, and never modifies linked/published rows.

create or replace function public.guard_final_newsroom_quality_v3()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  t text := lower(coalesce(new.title, ''));
  body_text text := lower(coalesce(new.title, '') || ' ' || coalesce(new.description, ''));
  locked boolean := coalesce((new.viral_signals->>'routing_lock')::boolean, false);
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null or locked then
    return new;
  end if;

  -- Meta-roundups are discovery inputs, not articles to rewrite.
  if t ~ 'check out [0-9]+ trending .* stories' then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.viral_scored_at := coalesce(new.viral_scored_at, now());
    new.routing_type := null;
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'low_value_title', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'final_quality_guard', true,
      'exclusion_reason', 'Source roundup/meta page is not a standalone newsroom story',
      'routing_lock', true,
      'routing_locked_site', 'review',
      'routing_locked_section', 'Unclassified'
    );
    return new;
  end if;

  -- National syndication surfaced on a Houston local feed without a Texas angle.
  if coalesce(new.trend_source, '') = 'KHOU 11 — Houston Local'
     and t ~ 'unidentified katrina victims'
     and body_text !~ '(texas|houston|harris county|galveston)'
  then
    new.target_site := 'review';
    new.target_section := 'Unclassified';
    new.ready_for_rewrite := false;
    new.viral_score := 0;
    new.viral_scored_at := coalesce(new.viral_scored_at, now());
    new.routing_type := null;
    new.viral_signals := coalesce(new.viral_signals, '{}'::jsonb) || jsonb_build_object(
      'national_syndication_noise', true,
      'auto_publish_eligible', false,
      'editorial_lane', 'REVIEW',
      'final_quality_guard', true,
      'exclusion_reason', 'National syndicated Katrina item lacks a Texas newsroom angle',
      'routing_lock', true,
      'routing_locked_site', 'review',
      'routing_locked_section', 'Unclassified'
    );
    return new;
  end if;

  if t ~ '(\mxc\M.*\mrun\M|qb marcel reed.*texas a&m|texas a&m.*qb marcel reed)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    return new;
  end if;

  if t ~ '(texas lawmakers?.*txdot|us rep\.? .*community meeting|bastrop officials.*retreat.*house hearing|state rep .*plans bill)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Politics';
    return new;
  end if;

  if t ~ '(international bridge toll rates|fort bliss.*domestic violence|released from ice custody|detained .*ice custody|man at large.*stolen debit card|ex-cfo.*stealing.*dallas charity|humane society.*(harassed|threatened)|stormwater fee|drainage needs|unauthorized agencies accessed.*flock|18-wheeler.*train collide|train collide|severe weather.*storm damage|unexpected deaths|new facilities, programs coming to utep)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  if t ~ '(federal credit union relocates|credit union relocates)' then
    new.target_site := 'keeptxred';
    new.target_section := 'Business';
    return new;
  end if;

  if t ~ '(miss el paso.*crowned|miss teen el paso.*crowned|homegoods.*now open|goodyear auto service.*now open|karol g|ronald mcdonald house.*(celebrates|farewell)|pet care celebrates|family field day|bucketheads.*(clothing|home decor)|luxury ranch for sale|historic .* home for sale|new store at .*northpark|new .*store.*northpark|single turns fatherhood into a battle cry|cheered on flour bluff hornets.*decade)' then
    new.target_site := 'texasdefined';
    new.target_section := 'Texas Life';
    return new;
  end if;

  return new;
end;
$function$;

drop trigger if exists zzzzzzzzzz_guard_final_newsroom_quality_v3 on public.texas_news_feed;
create trigger zzzzzzzzzz_guard_final_newsroom_quality_v3
before insert or update of title, description, source, trend_source, viral_signals
on public.texas_news_feed
for each row execute function public.guard_final_newsroom_quality_v3();

update public.texas_news_feed
set title = title
where internal_slug is null
  and texasdefined_slug is null
  and created_at >= now() - interval '30 days'
  and (
    lower(title) ~ 'check out [0-9]+ trending .* stories'
    or (coalesce(trend_source, '') = 'KHOU 11 — Houston Local' and lower(title) ~ 'unidentified katrina victims')
    or lower(title) ~ '(\mxc\M.*\mrun\M|qb marcel reed.*texas a&m|texas a&m.*qb marcel reed)'
    or lower(title) ~ '(texas lawmakers?.*txdot|us rep\.? .*community meeting|bastrop officials.*retreat.*house hearing|state rep .*plans bill)'
    or lower(title) ~ '(international bridge toll rates|fort bliss.*domestic violence|released from ice custody|detained .*ice custody|man at large.*stolen debit card|ex-cfo.*stealing.*dallas charity|humane society.*(harassed|threatened)|stormwater fee|drainage needs|unauthorized agencies accessed.*flock|18-wheeler.*train collide|train collide|severe weather.*storm damage|unexpected deaths|new facilities, programs coming to utep)'
    or lower(title) ~ '(federal credit union relocates|credit union relocates)'
    or lower(title) ~ '(miss el paso.*crowned|miss teen el paso.*crowned|homegoods.*now open|goodyear auto service.*now open|karol g|ronald mcdonald house.*(celebrates|farewell)|pet care celebrates|family field day|bucketheads.*(clothing|home decor)|luxury ranch for sale|historic .* home for sale|new store at .*northpark|new .*store.*northpark|single turns fatherhood into a battle cry|cheered on flour bluff hornets.*decade)'
  );

comment on function public.guard_final_newsroom_quality_v3() is
  'Deterministic final router for high-confidence local civic, sports, business, lifestyle and source-roundup/national-noise cases.';
