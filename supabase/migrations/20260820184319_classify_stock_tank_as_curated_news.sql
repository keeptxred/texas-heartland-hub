update public.daily_articles
set kind = 'news',
    featured_image_url = featured_image_url,
    image_alt_text = image_alt_text,
    updated_at = now()
where slug = 'live-2026-06-29-the-history-behind-the-texas-stock-tank-name-bxkvg7'
  and kind = 'evergreen';
