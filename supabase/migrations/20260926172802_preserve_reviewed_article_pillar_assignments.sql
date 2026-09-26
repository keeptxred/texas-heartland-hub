create or replace function public.preserve_reviewed_article_pillar_assignment()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if old.classifier_version like 'manual-taxonomy-review%'
     and new.classifier_version like 'content-pillars-v2%'
     and exists (
       select 1
       from public.daily_articles d
       where d.slug = old.article_slug
         and 'taxonomy_locked' = any(coalesce(d.quality_flags, '{}'::text[]))
     )
  then
    new.pillar_slug := old.pillar_slug;
    new.classifier_version := old.classifier_version;
    new.classified_at := old.classified_at;
  end if;
  return new;
end;
$$;

drop trigger if exists preserve_reviewed_article_pillar_assignment on public.article_pillar_assignments;
create trigger preserve_reviewed_article_pillar_assignment
before update of pillar_slug, classifier_version, classified_at
on public.article_pillar_assignments
for each row
execute function public.preserve_reviewed_article_pillar_assignment();

update public.article_pillar_assignments
set pillar_slug = null,
    classifier_version = 'manual-taxonomy-review-20260926',
    classified_at = now()
where article_slug = '2026-09-06-texas-a-m-dominates-missouri-state-in-season-opener';

update public.article_pillar_assignments
set pillar_slug = 'texas-politics-government',
    classifier_version = 'manual-taxonomy-review-20260926',
    classified_at = now()
where article_slug = '2026-09-11-texas-needs-more-foster-care-spending-transparency-state-report-says';

update public.article_pillar_assignments
set pillar_slug = 'texas-economy-small-business',
    classifier_version = 'manual-taxonomy-review-20260926',
    classified_at = now()
where article_slug = '2026-09-10-texas-stock-exchange-first-primary-listings';

update public.article_pillar_assignments
set pillar_slug = null,
    classifier_version = 'manual-taxonomy-review-20260926',
    classified_at = now()
where article_slug in (
  '2026-09-01-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border',
  '2026-09-02-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border',
  '2026-09-03-tropical-storm-edouard-makes-landfall-near-texas-louisiana-border'
);

update public.article_pillar_assignments
set pillar_slug = 'texas-elections',
    classifier_version = 'manual-taxonomy-review-20260926',
    classified_at = now()
where article_slug in (
  '2026-09-04-paxton-financial-disclosures-ethics',
  '2026-09-14-several-texas-republicans-condemn-bo-french-s-racist-posts-calling-asian-student'
);

update public.article_pillar_assignments
set pillar_slug = 'texas-energy-oil',
    classifier_version = 'manual-taxonomy-review-20260926',
    classified_at = now()
where article_slug = '2026-08-13-texas-agency-removes-cost-details-from-transmission-project-brief';
