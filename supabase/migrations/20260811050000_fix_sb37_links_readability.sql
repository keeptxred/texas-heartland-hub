-- Remove low-value generic section links from article prose while preserving
-- useful, descriptive internal links. Also restructure the August 9 SB 37
-- article so it reads as an article instead of one oversized paragraph.

create or replace function public.strip_low_value_internal_links_from_text(input_text text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  cleaned text := coalesce(input_text, '');
  root_pattern text := '(?:https?://(?:www\.)?keeptxred\.com)?/(?:texas-news|texas-politics|texas-economy|texas-business|news)/?';
begin
  cleaned := regexp_replace(
    cleaned,
    '\[(Texas|Texans|Texas news|news|here|this story|the state|Lone Star State)\]\((' || root_pattern || ')\)',
    '\1',
    'gi'
  );

  cleaned := regexp_replace(
    cleaned,
    '<a\s+[^>]*href\s*=\s*["''](' || root_pattern || ')["''][^>]*>(Texas|Texans|Texas news|news|here|this story|the state|Lone Star State)</a>',
    '\2',
    'gi'
  );

  return cleaned;
end;
$$;

create or replace function public.strip_low_value_internal_links_from_jsonb(input_json jsonb)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
declare
  result jsonb;
begin
  if input_json is null then
    return null;
  end if;

  case jsonb_typeof(input_json)
    when 'string' then
      return to_jsonb(public.strip_low_value_internal_links_from_text(input_json #>> '{}'));
    when 'array' then
      select coalesce(jsonb_agg(public.strip_low_value_internal_links_from_jsonb(value)), '[]'::jsonb)
      into result
      from jsonb_array_elements(input_json);
      return result;
    when 'object' then
      select coalesce(jsonb_object_agg(key, public.strip_low_value_internal_links_from_jsonb(value)), '{}'::jsonb)
      into result
      from jsonb_each(input_json);
      return result;
    else
      return input_json;
  end case;
end;
$$;

update public.daily_articles
set body_json = public.strip_low_value_internal_links_from_jsonb(body_json),
    updated_at = now()
where body_json is not null
  and body_json::text ~* '\[(Texas|Texans|Texas news|news|here|this story|the state|Lone Star State)\]\((https?://(www\.)?keeptxred\.com)?/(texas-news|texas-politics|texas-economy|texas-business|news)/?\)';

create or replace function public.clean_daily_article_low_value_internal_links()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.body_json is not null then
    new.body_json := public.strip_low_value_internal_links_from_jsonb(new.body_json);
  end if;
  return new;
end;
$$;

drop trigger if exists clean_daily_article_low_value_internal_links_trigger on public.daily_articles;
create trigger clean_daily_article_low_value_internal_links_trigger
before insert or update of body_json on public.daily_articles
for each row
execute function public.clean_daily_article_low_value_internal_links();

update public.daily_articles
set body_json = jsonb_build_object(
      'updated', '2026-08-10',
      'intro', jsonb_build_array(
        $p$Texas public universities are moving deeper into implementation of [Senate Bill 37](/bills/texas/89/sb/37), a sweeping higher-education governance law that shifts more authority over curriculum and university decision-making toward governor-appointed governing boards.$p$,
        $p$The law requires recurring reviews of general education curriculum, gives boards broader influence over academic programs and faculty governance, and creates new oversight mechanisms through the Texas Higher Education Coordinating Board. University leaders say implementation is underway, while faculty members and students have argued that the new structure can encourage self-censorship and weaken academic independence.$p$
      ),
      'sections', jsonb_build_array(
        jsonb_build_object(
          'heading', 'What SB 37 changes',
          'paragraphs', jsonb_build_array(
            $p$The disagreement is likely to intensify as the first major statutory deadlines approach. SB 37 builds a recurring governance system rather than a one-semester policy change, meaning governing boards will have an ongoing role in reviewing what public universities require students to study and how certain academic programs are maintained.$p$,
            $p$The law also expands oversight beyond the core curriculum. It gives boards broader influence over academic programs and faculty governance and requires periodic review of low-enrollment minor degree and certificate programs, creating pressure to consolidate offerings that lack clear student demand or workforce justification.$p$
          )
        ),
        jsonb_build_object(
          'heading', 'The January 2027 curriculum review',
          'paragraphs', jsonb_build_array(
            $p$Under the enrolled law, governing boards must complete their initial general-education curriculum review and certify compliance by January 1, 2027. That deadline will provide the first broad look at how aggressively individual systems use the authority granted by the Legislature.$p$,
            $p$The review is supposed to examine whether required courses are foundational, useful for civic and professional life, connected to workforce preparation, and consistent with accreditation requirements. Boards must also consider whether curriculum choices add unnecessary tuition costs or time to graduation.$p$
          )
        ),
        jsonb_build_object(
          'heading', 'Supporters and critics are watching different risks',
          'paragraphs', jsonb_build_array(
            $p$Supporters say the changes restore accountability to publicly funded institutions and ensure elected state leaders, through appointed regents, have a stronger line of responsibility for what universities require students to study. State senators have praised universities for carrying out the law and have signaled interest in strengthening oversight rather than reversing it.$p$,
            $p$Critics argue that governing boards are not academic bodies and that political pressure could influence decisions about legitimate teaching and research. The Texas Tribune has documented faculty and student concerns that some institutions are already narrowing course offerings or changing classroom practices.$p$
          )
        ),
        jsonb_build_object(
          'heading', 'What Texas families and students may notice',
          'paragraphs', jsonb_build_array(
            $p$For families and students, the effects may eventually appear in core course requirements, availability of certain minors or certificates, faculty-senate influence, and the kinds of programs universities choose to maintain. The practical impact will vary by university system because each governing board will make its own review decisions within the framework of the law.$p$,
            $p$The central question is whether the new oversight produces clearer, less costly academic pathways without narrowing legitimate scholarship or politicizing routine curriculum decisions. That balance will be easier to judge once boards begin publishing or certifying the results of their reviews.$p$
          )
        ),
        jsonb_build_object(
          'heading', 'What to watch next',
          'paragraphs', jsonb_build_array(
            $p$The January 2027 compliance reports are the next major milestone. They should provide concrete evidence of which core courses are retained, changed, or removed and how regents explain those choices.$p$,
            $p$Texans should also watch how universities handle low-enrollment programs and faculty-governance changes over the next several academic cycles. Those decisions will show whether SB 37 primarily changes administrative oversight or produces broader changes in what students can study and how academic decisions are made.$p$
          )
        )
      ),
      'faq', jsonb_build_array(
        jsonb_build_object(
          'q', 'What does Texas Senate Bill 37 do?',
          'a', 'SB 37 expands governing-board oversight of public university curriculum, academic programs, and faculty governance and requires recurring reviews of general education and certain low-enrollment programs.'
        ),
        jsonb_build_object(
          'q', 'When is the first SB 37 core curriculum review due?',
          'a', 'The initial general-education curriculum review must be completed and certified by January 1, 2027.'
        ),
        jsonb_build_object(
          'q', 'Who conducts the curriculum review under SB 37?',
          'a', 'The governing boards of Texas public university systems are responsible for the review, with oversight mechanisms involving the Texas Higher Education Coordinating Board.'
        )
      ),
      'sources', jsonb_build_array(
        jsonb_build_object('label', 'Texas Legislature Online', 'url', 'https://capitol.texas.gov/'),
        jsonb_build_object('label', 'Texas Tribune — source report', 'url', 'https://www.texastribune.org/2026/07/28/university-texas-law-scrutiny-update-testimony-censorship-2/')
      ),
      'keyTakeaways', jsonb_build_array(
        'SB 37 gives governing boards a larger recurring role in curriculum and academic-program oversight.',
        'The first general-education curriculum review must be certified by January 1, 2027.',
        'Supporters emphasize accountability and cost; critics emphasize academic independence and political pressure.',
        'The first compliance reports will show how broadly regents use the authority granted by the law.'
      )
    ),
    featured_image_url = '/images/news/generated/2026-08-09/sb37-texas-university-oversight.webp',
    image_alt_text = 'Texas public university campus, regents review, and Senate Bill 37 core curriculum documents.',
    updated_at = now()
where slug = '2026-08-09-sb37-texas-university-oversight';

comment on function public.strip_low_value_internal_links_from_text(text) is
  'Preserves article wording while stripping generic anchors such as Texas -> /texas-news from broad section links.';
comment on function public.strip_low_value_internal_links_from_jsonb(jsonb) is
  'Recursively removes low-value generic broad-section links from daily_articles.body_json.';
