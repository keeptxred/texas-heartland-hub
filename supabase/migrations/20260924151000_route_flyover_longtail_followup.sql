-- Follow-up to the September 22-24 Texas Flyover coverage audit.
-- Route recurring long-tail Texas stories out of the generic review bucket while
-- preserving all later newsroom quality/syndication/ownership guards.
--
-- Trigger name intentionally sorts after the base router but before zzz*
-- quality guards, so those guards remain authoritative.

create or replace function public.route_flyover_longtail_followup()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  haystack text := lower(
    coalesce(new.title,'') || ' ' ||
    coalesce(new.description,'') || ' ' ||
    coalesce(new.source,'')
  );
begin
  if new.internal_slug is not null or new.texasdefined_slug is not null then
    return new;
  end if;

  if coalesce(new.target_site,'review') <> 'review' then
    return new;
  end if;

  if new.trend_source = 'Texas Business Long-Tail — Google News' then
    if haystack ~ '(wine harvest|wine grape|vineyard|vintage)' then
      new.target_site := 'texasdefined';
      new.target_section := 'Food & Drink';
    elsif haystack ~ '(texas trucking association|diesel prices?|trucking|freight|logistics|cattle imports?|livestock imports?|santa teresa|tourism impact|economic impact.*tourism|goodfellow air force base|christoval road|defense community infrastructure|road improvements?|transportation grant)' then
      new.target_site := 'keeptxred';
      new.target_section := 'Business';
    end if;

  elsif new.trend_source = 'Texas Campus Long-Tail — Google News' then
    if haystack ~ '(university ranking|college ranking|student award|student recognition|math stars|research milestone)' then
      new.target_site := 'texasdefined';
      new.target_section := 'Texas Life';
    elsif haystack ~ '(nuclear reactor|nuclear fuel|molten salt|major campus expansion|university investment|college investment)' then
      new.target_site := 'keeptxred';
      new.target_section := 'Business';
    end if;

  elsif new.trend_source = 'Texas Community Long-Tail — Google News' then
    if haystack ~ '(see you at the pole|prayer event|community tradition|parade|honorary|student recognition|student award|local record|human interest|homecoming mum|sandcastle|nicu awareness|storytime|lady lamp|fall color|autumn color)' then
      new.target_site := 'texasdefined';
      new.target_section := 'Texas Life';
    end if;
  end if;

  return new;
end;
$function$;

drop trigger if exists zz_route_flyover_longtail_followup on public.texas_news_feed;
create trigger zz_route_flyover_longtail_followup
before insert or update of title, description, source, trend_source, target_site, target_section
on public.texas_news_feed
for each row
execute function public.route_flyover_longtail_followup();

-- Re-run the complete routing/quality trigger chain for only the newly added
-- long-tail rows from this audit. Published/linked rows are excluded.
update public.texas_news_feed
set title = title
where created_at >= now() - interval '2 days'
  and internal_slug is null
  and texasdefined_slug is null
  and trend_source in (
    'Texas Business Long-Tail — Google News',
    'Texas Campus Long-Tail — Google News',
    'Texas Community Long-Tail — Google News'
  );

comment on function public.route_flyover_longtail_followup() is
  'Routes recurring September Flyover-style business, campus and community discoveries before final newsroom quality guards run.';
