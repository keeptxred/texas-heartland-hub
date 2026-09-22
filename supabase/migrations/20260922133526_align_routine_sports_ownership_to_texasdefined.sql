create or replace function public.enforce_texasdefined_sports_ownership()
returns trigger
language plpgsql
set search_path = public
as $function$
declare
  t text := lower(coalesce(new.title, ''));
  is_election_public_affairs boolean;
  is_government_public_affairs boolean;
  is_legal_public_affairs boolean;
  is_public_finance boolean;
begin
  -- Never rewrite ownership after either site has already attached a published slug.
  if new.internal_slug is not null or new.texasdefined_slug is not null then
    return new;
  end if;

  -- Preserve review/exclusion decisions and unrelated site sections.
  if new.target_site is distinct from 'keeptxred'
     or new.target_section is distinct from 'Sports'
  then
    return new;
  end if;

  is_election_public_affairs :=
    t ~ '(republican|democrat|\mgop\M|political ad|statewide office|railroad commissioner|\melection\M|\mballot\M|\mvoter\M)'
    and t ~ '(candidate|campaign|republican|democrat|\mgop\M|election|ballot|voter|senate|house|governor|lieutenant governor|attorney general|railroad commissioner|statewide office)';

  is_government_public_affairs :=
    t ~ '(lawmakers?|legislature|legislation|house bill|senate bill|\mhb[[:space:]]*[0-9]+\M|\msb[[:space:]]*[0-9]+\M|\mstate[[:space:]]+rep\M|\mstate[[:space:]]+representative\M|\mstate[[:space:]]+senator\M|governor abbott|gov\.?[[:space:]]+abbott|attorney general|city council|commissioners court|school board)';

  is_legal_public_affairs :=
    t ~ '(lawsuit|\msues?\M|court documents?|court ruling|judge rules?|injunction|restraining order|\marrested\M|\mcharged\M|\mindicted\M|\mdwi\M|\mdui\M)';

  is_public_finance :=
    t ~ '(stadium|arena|sports venue|athletics)'
    and t ~ '(public funding|taxpayer|tax incentive|economic development|financ|bond|public money|subsid)';

  if is_election_public_affairs then
    new.target_site := 'keeptxred';
    new.target_section := 'Elections';
    return new;
  elsif is_government_public_affairs then
    new.target_site := 'keeptxred';
    new.target_section := 'Politics';
    return new;
  elsif is_public_finance then
    new.target_site := 'keeptxred';
    new.target_section := 'Business';
    return new;
  elsif is_legal_public_affairs then
    new.target_site := 'keeptxred';
    new.target_section := 'Texas News';
    return new;
  end if;

  -- Routine sports belongs to TexasDefined. Hold it for the TexasDefined
  -- article channel rather than leaving it eligible for KTR rewriting.
  new.target_site := 'texasdefined';
  new.target_section := 'Sports';
  new.ready_for_rewrite := false;
  new.viral_signals :=
    (coalesce(new.viral_signals, '{}'::jsonb)
      - 'auto_publish_eligible'
      - 'editorial_lane'
      - 'routing_lock'
      - 'routing_locked_site'
      - 'routing_locked_section')
    || jsonb_build_object(
      'site_ownership', 'texasdefined',
      'ownership_reason', 'Routine Texas sports coverage belongs on TexasDefined'
    );

  return new;
end;
$function$;

drop trigger if exists zzzzzzzzzzzz_enforce_texasdefined_sports_ownership
  on public.texas_news_feed;

create trigger zzzzzzzzzzzz_enforce_texasdefined_sports_ownership
before insert or update of
  title,
  description,
  source,
  trend_source,
  target_site,
  target_section,
  viral_signals
on public.texas_news_feed
for each row
execute function public.enforce_texasdefined_sports_ownership();

-- Reconcile only unpublished/unlinked inventory. Existing KTR or TexasDefined
-- publications keep their historical linkage untouched.
update public.texas_news_feed
set target_site = target_site,
    target_section = target_section
where target_site = 'keeptxred'
  and target_section = 'Sports'
  and internal_slug is null
  and texasdefined_slug is null;
