-- Bill relationship mutation helpers are privileged maintenance RPCs.
-- Remove direct client execution and retain service-role execution only.

revoke execute on function public.refresh_bill_article_relationships(uuid, integer, integer) from anon, authenticated;
revoke execute on function public.refresh_bill_subject_relationships(uuid, integer) from anon, authenticated;
revoke execute on function public.refresh_bill_relationships(uuid) from anon, authenticated;
revoke execute on function public.prune_unapproved_bill_article_authority_edges(uuid) from anon, authenticated;

grant execute on function public.refresh_bill_article_relationships(uuid, integer, integer) to service_role;
grant execute on function public.refresh_bill_subject_relationships(uuid, integer) to service_role;
grant execute on function public.refresh_bill_relationships(uuid) to service_role;
grant execute on function public.prune_unapproved_bill_article_authority_edges(uuid) to service_role;
