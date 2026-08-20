alter table public.article_slug_redirects
  drop constraint if exists article_slug_redirects_new_slug_key;

create index if not exists article_slug_redirects_new_slug_idx
  on public.article_slug_redirects(new_slug);

insert into public.article_slug_redirects(old_slug,new_slug)
values
  ('live-2026-07-19-voter-registration-countdown-begins-for-texas-2026-midterm-elections-yx9ejb','texas-voting-guide-2026'),
  ('live-2026-07-24-san-antonio-residents-seek-organized-opposition-to-flock-safety-survei-hz11ng','2026-08-09-houston-flock-camera-backlash')
on conflict (old_slug) do update set new_slug=excluded.new_slug;