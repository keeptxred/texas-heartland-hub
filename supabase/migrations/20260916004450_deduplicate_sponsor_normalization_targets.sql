-- Some legacy sponsor aliases normalize onto an already-existing canonical
-- sponsor row for the same bill. Delete those collisions, and collapse multiple
-- legacy aliases that map to the same target, before updating survivors.
create or replace function public.normalize_89th_bill_sponsors_batch(p_aliases jsonb, p_limit integer default 250)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_deleted integer := 0;
  v_updated integer := 0;
  v_touched integer := 0;
begin
  if coalesce(jsonb_typeof(p_aliases),'') <> 'array' then
    raise exception 'p_aliases must be a JSON array';
  end if;
  p_limit := greatest(1, least(coalesce(p_limit,250),500));

  create temporary table _sponsor_aliases (
    old_name text not null,
    chamber text not null,
    full_name text not null,
    canonical_slug text not null,
    district text,
    external_legislator_id text not null,
    primary key(old_name,chamber)
  ) on commit drop;

  insert into _sponsor_aliases(old_name,chamber,full_name,canonical_slug,district,external_legislator_id)
  select trim(x.old_name),lower(trim(x.chamber)),trim(x.full_name),trim(x.canonical_slug),nullif(trim(x.district),''),trim(x.external_legislator_id)
  from jsonb_to_recordset(p_aliases) as x(old_name text,chamber text,full_name text,canonical_slug text,district text,external_legislator_id text)
  where nullif(trim(x.old_name),'') is not null
    and lower(trim(x.chamber)) in ('house','senate')
    and nullif(trim(x.full_name),'') is not null
    and nullif(trim(x.canonical_slug),'') is not null
    and nullif(trim(x.external_legislator_id),'') is not null
  on conflict(old_name,chamber) do update set
    full_name=excluded.full_name,canonical_slug=excluded.canonical_slug,district=excluded.district,external_legislator_id=excluded.external_legislator_id;

  insert into private.bill_sponsor_identity_aliases(
    alias_name,chamber,canonical_name,canonical_slug,district,external_legislator_id,source_url,updated_at
  )
  select old_name,chamber,full_name,canonical_slug,district,external_legislator_id,
         'https://capitol.texas.gov/'::text,now()
  from _sponsor_aliases
  on conflict(alias_name,chamber) do update set
    canonical_name=excluded.canonical_name,
    canonical_slug=excluded.canonical_slug,
    district=excluded.district,
    external_legislator_id=excluded.external_legislator_id,
    updated_at=now();

  create temporary table _candidate_bills on commit drop as
  select distinct bs.bill_id
  from public.bill_sponsors bs
  join public.bills b on b.id=bs.bill_id
  join _sponsor_aliases a
    on lower(btrim(bs.sponsor_name))=lower(btrim(a.old_name))
   and lower(btrim(bs.chamber))=a.chamber
  where b.legislature_number=89
    and (bs.sponsor_name is distinct from a.full_name
      or bs.sponsor_slug is distinct from a.canonical_slug
      or bs.chamber is distinct from a.chamber
      or bs.district is distinct from a.district
      or bs.external_legislator_id is distinct from a.external_legislator_id)
  limit p_limit;

  select count(*) into v_touched from _candidate_bills;
  if v_touched=0 then
    return jsonb_build_object('updated',0,'deduplicated',0,'touched_bills',0,'aliases',(select count(*) from _sponsor_aliases));
  end if;

  create temporary table _candidate_sponsors on commit drop as
  select bs.id,bs.bill_id,bs.representative_id,bs.sponsor_role,
         a.full_name,a.canonical_slug,a.chamber,a.district,a.external_legislator_id
  from public.bill_sponsors bs
  join _candidate_bills cb on cb.bill_id=bs.bill_id
  join _sponsor_aliases a
    on lower(btrim(bs.sponsor_name))=lower(btrim(a.old_name))
   and lower(btrim(bs.chamber))=a.chamber
  where (bs.sponsor_name is distinct from a.full_name
      or bs.sponsor_slug is distinct from a.canonical_slug
      or bs.chamber is distinct from a.chamber
      or bs.district is distinct from a.district
      or bs.external_legislator_id is distinct from a.external_legislator_id);

  delete from public.bill_sponsors bs
  using _candidate_sponsors c
  where bs.id=c.id
    and (
      exists(
        select 1
        from public.bill_sponsors x
        where x.id<>bs.id
          and x.bill_id=c.bill_id
          and x.representative_id is not distinct from c.representative_id
          and x.external_legislator_id is not distinct from c.external_legislator_id
          and x.sponsor_name=c.full_name
          and x.sponsor_role=c.sponsor_role
      )
      or exists(
        select 1
        from _candidate_sponsors c2
        where c2.id<c.id
          and c2.bill_id=c.bill_id
          and c2.representative_id is not distinct from c.representative_id
          and c2.external_legislator_id is not distinct from c.external_legislator_id
          and c2.full_name=c.full_name
          and c2.sponsor_role=c.sponsor_role
      )
    );
  get diagnostics v_deleted=row_count;

  update public.bill_sponsors bs
  set sponsor_name=c.full_name,sponsor_slug=c.canonical_slug,chamber=c.chamber,district=c.district,external_legislator_id=c.external_legislator_id
  from _candidate_sponsors c
  where bs.id=c.id;
  get diagnostics v_updated=row_count;

  delete from public.authority_relationships ar
  where ar.is_manual=false
    and ar.relationship_type in ('author','coauthor','sponsor','cosponsor','primary author','primary sponsor','sponsor-district')
    and ((ar.source_type='bill' and ar.source_key in (select bill_id::text from _candidate_bills))
      or (ar.target_type='bill' and ar.target_key in (select bill_id::text from _candidate_bills)));

  perform private.refresh_sponsor_authority_edges_for_bills(array(select bill_id from _candidate_bills));

  return jsonb_build_object('updated',v_updated,'deduplicated',v_deleted,'touched_bills',v_touched,'aliases',(select count(*) from _sponsor_aliases));
end;
$$;

revoke all on function public.normalize_89th_bill_sponsors_batch(jsonb, integer) from public, anon, authenticated;
grant execute on function public.normalize_89th_bill_sponsors_batch(jsonb, integer) to service_role;
