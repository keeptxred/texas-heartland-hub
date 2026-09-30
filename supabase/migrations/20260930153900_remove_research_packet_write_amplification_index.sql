-- The built_at index had negligible read usage but was maintained on every meaningful
-- research-packet refresh because built_at changes with each write. Removing it reduces
-- B-tree churn and allows future packet updates to qualify for HOT updates when page space permits.

drop index if exists public.idx_news_research_packets_built;

comment on table public.news_research_packets is
  'Deterministic newsroom research packets keyed by cluster. built_at is intentionally not indexed because packet refreshes update it and the former index caused heavy write amplification with negligible read usage.';
