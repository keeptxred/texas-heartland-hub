-- Retire the broad Texas local-oddities Google lane after 23 consecutive
-- successful-but-empty production fetches. The replacement
-- `Texas Human Interest — Caught on Camera` lane was live-probed at HTTP 200
-- with 10/10 items published within three days. Keeping this old lane enabled
-- would consume one slot in the 10-feed Google rotation without producing
-- candidates.
--
-- Source history is retained; only future fetching is disabled.

update public.content_sources
set
  enabled = false,
  notes = concat_ws(
    ' | ',
    nullif(notes, ''),
    'Retired 2026-08-28 after 23 consecutive HTTP-200 empty fetches; replaced for active human-interest discovery by the high-precision Texas Human Interest — Caught on Camera lane.'
  ),
  updated_at = now()
where source_name = 'Texas Local Oddities and Human Interest — Google News'
  and enabled = true;
