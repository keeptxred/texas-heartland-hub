-- Keep the admin content-opportunity surface synchronized with the publication gate.
--
-- The dashboard already treats any persisted preflight reason other than READY or
-- PENDING_EXTRACTION as non-actionable. Publication-quality/fact holds, however,
-- are persisted in cluster_json. Mirror those holds into preflight_json so an
-- editor is never shown a dead-end Publish button for a story the server has
-- already determined cannot be published.
--
-- The original preflight snapshot is preserved and restored automatically when
-- corroboration/primary-record support later clears the publication hold.

create or replace function public.sync_news_feed_publication_hold_preflight()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  hold_reason text;
  readiness text;
  snapshot jsonb;
begin
  hold_reason := nullif(btrim(coalesce(new.cluster_json ->> 'publication_hold_reason', '')), '');
  readiness := lower(btrim(coalesce(new.cluster_json ->> 'publication_readiness', '')));

  if new.internal_slug is null
     and hold_reason is not null
     and (readiness = '' or readiness like 'hold%') then
    snapshot := coalesce(new.preflight_json, '{}'::jsonb);

    -- Preserve the most recent real extraction/preflight result. If a retry
    -- recomputed preflight while the publication hold still exists, replace the
    -- saved snapshot with that fresher result before reapplying the UI hold.
    if coalesce(snapshot ->> 'reason', '') <> 'PUBLICATION_HOLD' then
      snapshot := snapshot || jsonb_build_object(
        'publicationHoldPrevious', new.preflight_json
      );
    end if;

    new.preflight_json := snapshot || jsonb_build_object(
      'status', 'PUBLICATION_HOLD',
      'reason', 'PUBLICATION_HOLD',
      'message', 'Publication held: ' || hold_reason,
      'checkedAt', now()::text,
      'failureStage', 'none',
      'publicationHoldReason', hold_reason
    );
  elsif coalesce(new.preflight_json ->> 'reason', '') = 'PUBLICATION_HOLD' then
    -- The hold cleared (or the item was published). Restore the snapshot that
    -- existed before the publication hold so normal dashboard behavior resumes.
    if jsonb_typeof(new.preflight_json -> 'publicationHoldPrevious') = 'object' then
      new.preflight_json := new.preflight_json -> 'publicationHoldPrevious';
      if new.preflight_json = '{}'::jsonb then
        new.preflight_json := null;
      end if;
    else
      new.preflight_json := null;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_news_feed_publication_hold_preflight() from public;
revoke all on function public.sync_news_feed_publication_hold_preflight() from anon;
revoke all on function public.sync_news_feed_publication_hold_preflight() from authenticated;

drop trigger if exists sync_news_feed_publication_hold_preflight on public.texas_news_feed;

create trigger sync_news_feed_publication_hold_preflight
before update of cluster_json, preflight_json, internal_slug
on public.texas_news_feed
for each row
execute function public.sync_news_feed_publication_hold_preflight();

-- Backfill every currently held, unpublished item so the fix takes effect on
-- the existing admin queue immediately, not only on future publication checks.
update public.texas_news_feed
set cluster_json = cluster_json
where internal_slug is null
  and nullif(btrim(coalesce(cluster_json ->> 'publication_hold_reason', '')), '') is not null
  and (
    nullif(btrim(coalesce(cluster_json ->> 'publication_readiness', '')), '') is null
    or lower(cluster_json ->> 'publication_readiness') like 'hold%'
  );
