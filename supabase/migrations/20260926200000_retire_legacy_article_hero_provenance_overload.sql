do $$
begin
  if to_regprocedure(
    'public.article_hero_has_visual_readiness_provenance(text,text,text)'
  ) is null then
    raise exception
      'Refusing to retire legacy hero provenance overload before hardened three-argument helper exists';
  end if;
end
$$;

drop function if exists public.article_hero_has_visual_readiness_provenance(text);

comment on function public.article_hero_has_visual_readiness_provenance(text, text, text) is
  'Fail-closed hero readiness provenance: Cloudflare visual validation or tightly scoped authoritative/manual exemptions bound to the exact hero URL and, where required, article slug. The permissive legacy one-argument overload is retired.';
