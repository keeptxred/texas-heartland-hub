-- Backfill the Fox News story that exposed the national-source coverage gap.
-- This places it in Content Opportunities for the normal reviewed publish flow.

INSERT INTO public.texas_news_feed (
  title,
  link,
  pub_date,
  source,
  description
)
VALUES (
  'Joe Rogan warns liberals against trying to turn Texas blue, says it would wreck the state''s delicate balance',
  'https://www.foxnews.com/media/joe-rogan-warns-liberals-against-trying-turn-texas-blue-says-would-wreck-states-delicate-balance',
  '2026-07-28T00:00:00Z',
  'Fox News',
  'Podcaster Joe Rogan discussed the political character of Austin and Texas during a conversation with wildlife television personality Forrest Galante. Rogan described Austin as a progressive city surrounded by strongly Republican parts of Texas and argued that the contrast creates a balance that benefits the city and the state. He said Austin progressives tend to be more reasonable than liberals he encountered in New York or Los Angeles and pushed back on stereotypes that portray Texas as culturally uniform or unsophisticated. Rogan, who moved from Los Angeles to Austin during the COVID-19 era and records his podcast in the area, warned activists who want to make Texas uniformly Democratic that doing so could undermine what makes the state attractive, including for newcomers. The discussion also touched on the phrase “Keep Austin weird and surrounded,” Austin''s long history of Democratic municipal leadership, and the city''s position as a liberal enclave inside a Republican-led state. Rogan''s comments are relevant to the continuing debate over demographic change, migration, political identity, and Democratic efforts to become more competitive in statewide Texas elections.'
)
ON CONFLICT (link) DO UPDATE SET
  title = EXCLUDED.title,
  pub_date = EXCLUDED.pub_date,
  source = EXCLUDED.source,
  description = EXCLUDED.description;
