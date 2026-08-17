create or replace function public.retire_pending_ai_rewrite_claims_on_publication()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.internal_slug is not null and btrim(new.internal_slug) <> '')
     or (new.texasdefined_slug is not null and btrim(new.texasdefined_slug) <> '') then
    delete from public.ai_rewrite_cache
    where feed_item_id = new.id
      and status = 'pending';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_retire_pending_ai_rewrite_claims_on_publication on public.texas_news_feed;
create trigger trg_retire_pending_ai_rewrite_claims_on_publication
after insert or update of internal_slug, texasdefined_slug on public.texas_news_feed
for each row
execute function public.retire_pending_ai_rewrite_claims_on_publication();

delete from public.ai_rewrite_cache c
using public.texas_news_feed f
where c.feed_item_id = f.id
  and c.status = 'pending'
  and (
    (f.internal_slug is not null and btrim(f.internal_slug) <> '')
    or (f.texasdefined_slug is not null and btrim(f.texasdefined_slug) <> '')
  );
