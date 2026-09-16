-- Preserve owner management and shared-trip readability without evaluating
-- two permissive SELECT policies for every authenticated read.
drop policy if exists "Owners manage Explore trips" on public.explore_trips;
drop policy if exists "Shared Explore trips are readable" on public.explore_trips;

create policy "Authenticated can read owned or shared Explore trips"
  on public.explore_trips
  for select
  to authenticated
  using (
    owner_id = (select auth.uid())
    or (is_public and share_token is not null)
  );

create policy "Anonymous can read shared Explore trips"
  on public.explore_trips
  for select
  to anon
  using (is_public and share_token is not null);

create policy "Owners can insert Explore trips"
  on public.explore_trips
  for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "Owners can update Explore trips"
  on public.explore_trips
  for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Owners can delete Explore trips"
  on public.explore_trips
  for delete
  to authenticated
  using (owner_id = (select auth.uid()));
