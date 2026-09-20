-- Durable keyed benchmark for the Aug. 10, 2026 Texas Flyover audit.
-- Production evidence may advance rows from source_needed to review_ready or
-- published, but no migration or health check is allowed to publish content.

create table if not exists public.flyover_aug10_reconciliation (
  story_key text primary key,
  expected_site text not null check (expected_site in ('keeptxred','texasdefined')),
  disposition text not null check (disposition in ('published','review_ready','source_needed','out_of_scope')),
  feed_id bigint null references public.texas_news_feed(id) on delete set null,
  feed_title text null,
  published_slug text null,
  evidence_note text not null default '',
  last_verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.flyover_aug10_reconciliation enable row level security;
revoke all on table public.flyover_aug10_reconciliation from anon, authenticated;
grant select, insert, update, delete on table public.flyover_aug10_reconciliation to service_role;

insert into public.flyover_aug10_reconciliation (story_key,expected_site,disposition,evidence_note)
values
('state-fair-gun-ban','keeptxred','source_needed','Await production evidence reconciliation.'),
('fort-worth-alligators-shot','keeptxred','source_needed','Await production evidence reconciliation.'),
('don-nelson','keeptxred','source_needed','Await production evidence reconciliation.'),
('ingram-school-flood-repairs','keeptxred','source_needed','Await production evidence reconciliation.'),
('st-louis-encephalitis','keeptxred','source_needed','Exact Corpus Christi patient source required.'),
('lakeside-fentanyl-children','keeptxred','source_needed','Await production evidence reconciliation.'),
('dallas-pedestrian-waymo','keeptxred','source_needed','Await production evidence reconciliation.'),
('canyon-lake-full','texasdefined','source_needed','Await production evidence reconciliation.'),
('bastrop-council-retreat','keeptxred','source_needed','Await production evidence reconciliation.'),
('kaylee-hottle-scholarship','texasdefined','source_needed','Await production evidence reconciliation.'),
('tate-taylor-sprint-double','keeptxred','source_needed','Await production evidence reconciliation.'),
('texas-stadium-mavericks-redevelopment','keeptxred','source_needed','Await production evidence reconciliation.'),
('cowboys-quinnen-williams','keeptxred','source_needed','Await production evidence reconciliation.'),
('rangers-jonah-bride','keeptxred','source_needed','Await production evidence reconciliation.'),
('heb-store-upgrades','keeptxred','source_needed','Await production evidence reconciliation.'),
('caseys-pak-a-sak','keeptxred','source_needed','Await production evidence reconciliation.'),
('sushi-door-dash-dispute','keeptxred','source_needed','Await production evidence reconciliation.'),
('texas-born-county-ranking','texasdefined','source_needed','Await production evidence reconciliation.'),
('eds-plano-implosion','texasdefined','source_needed','Await production evidence reconciliation.'),
('richardson-lego-public-safety','texasdefined','source_needed','Await production evidence reconciliation.'),
('kris6-anchor-layoffs','keeptxred','source_needed','Await production evidence reconciliation.'),
('3d-printed-wheelchair','texasdefined','out_of_scope','Recovered source places the story in Lehi, Utah; do not force it onto a Texas site.'),
('nueces-1862-history','texasdefined','source_needed','Await production evidence reconciliation.')
on conflict (story_key) do nothing;

comment on table public.flyover_aug10_reconciliation is
  'Stable 23-story Aug. 10 Texas Flyover benchmark. Uses exact keyed evidence instead of fragile regex matching; does not authorize publication.';
