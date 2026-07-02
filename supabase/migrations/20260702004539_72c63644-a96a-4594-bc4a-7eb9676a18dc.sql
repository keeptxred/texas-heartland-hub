CREATE OR REPLACE FUNCTION public._decode_html_entities(s text) RETURNS text
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  r text := s;
  m text;
BEGIN
  IF r IS NULL THEN RETURN NULL; END IF;
  -- numeric decimal entities
  LOOP
    m := (regexp_match(r, '&#(\d+);'))[1];
    EXIT WHEN m IS NULL;
    r := replace(r, '&#' || m || ';', chr(m::int));
  END LOOP;
  -- numeric hex entities
  LOOP
    m := (regexp_match(r, '&#x([0-9a-fA-F]+);'))[1];
    EXIT WHEN m IS NULL;
    r := replace(r, '&#x' || m || ';', chr(('x' || lpad(m,8,'0'))::bit(32)::int));
  END LOOP;
  r := replace(r, '&nbsp;', ' ');
  r := replace(r, '&lsquo;', '''');
  r := replace(r, '&rsquo;', '''');
  r := replace(r, '&ldquo;', '"');
  r := replace(r, '&rdquo;', '"');
  r := replace(r, '&ndash;', '—');
  r := replace(r, '&mdash;', '—');
  r := replace(r, '&hellip;', '…');
  r := replace(r, '&quot;', '"');
  r := replace(r, '&apos;', '''');
  r := replace(r, '&#39;', '''');
  r := replace(r, '&lt;', '<');
  r := replace(r, '&gt;', '>');
  r := replace(r, '&amp;', '&');
  RETURN r;
END;
$$;

UPDATE public.texas_news_feed
SET title = public._decode_html_entities(title),
    description = public._decode_html_entities(description)
WHERE title ~ '&(#\d+|#x[0-9a-fA-F]+|amp|lt|gt|quot|apos|nbsp|lsquo|rsquo|ldquo|rdquo|ndash|mdash|hellip);'
   OR description ~ '&(#\d+|#x[0-9a-fA-F]+|amp|lt|gt|quot|apos|nbsp|lsquo|rsquo|ldquo|rdquo|ndash|mdash|hellip);';

DROP FUNCTION public._decode_html_entities(text);