-- Public bill pages may only read approved relationship rows.
-- Service-role/admin processes retain full access through RLS bypass.

drop policy if exists "Public read bill_subject_relationships" on public.bill_subject_relationships;
create policy "Public read approved bill subject relationships"
on public.bill_subject_relationships
for select
using (review_status = 'approved');

drop policy if exists "Public read bill_article_relationships" on public.bill_article_relationships;
create policy "Public read approved bill article relationships"
on public.bill_article_relationships
for select
using (review_status = 'approved');

comment on policy "Public read approved bill subject relationships" on public.bill_subject_relationships is
  'Prevents pending or rejected automatic topic matches from appearing on public bill pages.';
comment on policy "Public read approved bill article relationships" on public.bill_article_relationships is
  'Prevents pending or rejected automatic article matches from appearing on public bill pages.';
