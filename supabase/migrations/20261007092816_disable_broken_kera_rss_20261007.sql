update public.content_sources
set enabled = false,
    notes = concat_ws(
      ' ',
      nullif(notes, ''),
      'Disabled 2026-10-07 after 65 consecutive HTTP 403 fetch failures from https://www.keranews.org/news.rss; North Texas coverage remains supplied by WFAA, NBC DFW, Dallas Observer, Community Impact, City of Dallas, and regional relay sources.'
    ),
    updated_at = now()
where source_name = 'KERA News'
  and rss_url = 'https://www.keranews.org/news.rss'
  and enabled = true;
