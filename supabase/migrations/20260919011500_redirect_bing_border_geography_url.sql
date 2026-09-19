-- Recover a historical Bing-visible KeepTXRed URL by permanently redirecting it
-- to the existing indexable static border-policy pillar guide.
insert into public.article_slug_redirects (old_slug, new_slug)
values (
  '2026-07-07-mapping-the-1-254-miles-the-real-reason-texas-border-geography-matters',
  'texas-border-policy-full-guide'
)
on conflict (old_slug) do update
set new_slug = excluded.new_slug;
