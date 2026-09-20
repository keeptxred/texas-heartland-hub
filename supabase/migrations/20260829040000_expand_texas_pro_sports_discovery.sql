-- Add dedicated discovery lanes for Texas pro teams represented in the public
-- sports registry but not covered by the existing six-team pro-sports relay.
-- These remain discovery-only inputs; normal relevance, scoring, review,
-- source-quality, rewrite, and publication safeguards remain authoritative.

insert into public.content_sources (platform, source_name, source_url, category, notes, enabled, rss_url)
select
  'rss',
  'Texas Pro Basketball — Rockets and Wings Discovery',
  'https://news.google.com/',
  'Sports',
  'Exact-phrase Google News discovery for Houston Rockets and Dallas Wings via the dedicated KTR sports relay.',
  true,
  'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-sports?feed=basketball-expansion'
where not exists (
  select 1 from public.content_sources
  where source_name = 'Texas Pro Basketball — Rockets and Wings Discovery'
     or rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-sports?feed=basketball-expansion'
);

insert into public.content_sources (platform, source_name, source_url, category, notes, enabled, rss_url)
select
  'rss',
  'Texas Pro Soccer — Daily Discovery',
  'https://news.google.com/',
  'Sports',
  'Exact-phrase Google News discovery for Austin FC, FC Dallas, Houston Dynamo FC, and Houston Dash via the dedicated KTR sports relay.',
  true,
  'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-sports?feed=soccer-women'
where not exists (
  select 1 from public.content_sources
  where source_name = 'Texas Pro Soccer — Daily Discovery'
     or rss_url = 'https://ftkznprjljkhymknvhye.supabase.co/functions/v1/ktr-rss-relay-sports?feed=soccer-women'
);

create or replace function public.guard_expanded_texas_pro_sports_discovery_row()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  haystack text := lower(coalesce(new.title,'') || ' ' || coalesce(new.description,'') || ' ' || coalesce(new.source,''));
  title_text text := lower(coalesce(new.title,''));
  is_basketball_lane boolean := new.trend_source = 'Texas Pro Basketball — Rockets and Wings Discovery';
  is_soccer_lane boolean := new.trend_source = 'Texas Pro Soccer — Daily Discovery';
  has_team_name boolean := false;
  has_team_alias boolean := false;
  has_sports_context boolean := false;
  is_utility_page boolean;
  is_allowed boolean;
  was_guarded boolean := coalesce((new.viral_signals->>'expanded_pro_sports_guard')::boolean,false);
begin
  if not is_basketball_lane and not is_soccer_lane then
    return new;
  end if;

  if is_basketball_lane then
    has_team_name := haystack ~ '(houston rockets|dallas wings)';
    has_team_alias := haystack ~ '\m(rockets|wings)\M';
    has_sports_context := haystack ~ '(\mnba\M|\mwnba\M|basketball|game|games|playoff|playoffs|player|players|roster|draft|trade|guard|forward|center|coach|arena|court|season|standings|three-pointer|three point|tipoff)';
  else
    has_team_name := haystack ~ '(austin fc|fc dallas|houston dynamo fc|houston dash)';
    has_team_alias := haystack ~ '(\mdynamo\M|\mdash\M)';
    has_sports_context := haystack ~ '(\mmls\M|\mnwsl\M|soccer|football club|match|matches|goal|goals|striker|midfielder|defender|keeper|goalkeeper|pitch|season|standings|playoff|playoffs|cup)';
  end if;

  is_utility_page := title_text ~ '(how to watch|live stream|where to watch|tv channel|\modds\M|\mspread\M|prediction|\mpicks\M|betting odds|best bets)';
  is_allowed := (has_team_name or (has_team_alias and has_sports_context)) and not is_utility_page;

  if is_allowed then
    new.target_site := 'keeptxred';
    new.target_section := 'Sports';
    if was_guarded and new.internal_slug is null and new.texasdefined_slug is null then
      new.viral_scored_at := null;
      new.classification_confidence := null;
      new.viral_score := 0;
      new.ready_for_rewrite := false;
    end if;
    new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb)
      - 'source_contamination'
      - 'expanded_pro_sports_guard'
      - 'auto_publish_eligible'
      - 'editorial_lane'
      - 'exclusion_reason'
      - 'routing_lock'
      - 'routing_locked_site'
      - 'routing_locked_section';
    return new;
  end if;

  new.target_site := 'review';
  new.target_section := 'Unclassified';
  new.ready_for_rewrite := false;
  new.viral_score := 0;
  new.classification_confidence := greatest(coalesce(new.classification_confidence,0),1);
  new.viral_scored_at := coalesce(new.viral_scored_at,now());
  new.viral_signals := coalesce(new.viral_signals,'{}'::jsonb) || jsonb_build_object(
    'source_contamination',true,
    'expanded_pro_sports_guard',true,
    'auto_publish_eligible',false,
    'editorial_lane','REVIEW',
    'exclusion_reason',case
      when is_utility_page then 'Expanded Texas pro-sports utility/service page is not an editorial article'
      else 'Expanded Texas pro-sports discovery result lacked the lane allowlisted team signal'
    end,
    'routing_lock',true,
    'routing_locked_site','review',
    'routing_locked_section','Unclassified'
  );
  return new;
end;
$function$;

drop trigger if exists zzzzzzzz_guard_expanded_texas_pro_sports_discovery_row on public.texas_news_feed;
create trigger zzzzzzzz_guard_expanded_texas_pro_sports_discovery_row
before insert or update of title,description,source,trend_source,viral_signals
on public.texas_news_feed
for each row execute function public.guard_expanded_texas_pro_sports_discovery_row();

update public.texas_news_feed
set title = title
where trend_source in (
  'Texas Pro Basketball — Rockets and Wings Discovery',
  'Texas Pro Soccer — Daily Discovery'
)
  and internal_slug is null
  and texasdefined_slug is null;

comment on function public.guard_expanded_texas_pro_sports_discovery_row() is
  'Source-scoped guard for Rockets/Wings and Texas pro soccer discovery lanes; routes allowlisted team stories to KTR Sports and review-locks unrelated or utility results.';
