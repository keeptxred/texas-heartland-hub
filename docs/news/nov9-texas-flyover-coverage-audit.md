# Texas Flyover gap audit — November 9, 2026

**Editorial benchmark only, not a source or republication license.** Preserve the existing shared Supabase newsroom, source-page hydration, legal review, de-duplication, image/accessibility checks, and index-readiness gates. This file tracks *story discovery*, not a claim that any corresponding article is published.

Project checkpoint: https://github.com/keeptxred/texas-heartland-hub/issues/3621
Prior November 8 benchmark: https://github.com/keeptxred/texas-heartland-hub/issues/3598

## Canonical ownership and page destinations

- **KeepTXRed:** hard news, government, elections, litigation, public safety and materially political business. Sections: `/houston`, `/politics`, `/texas-news`, with a reviewed article on `/news/{slug}` when independently reported and published.
- **TexasDefined:** travel, visitor attractions, independent local businesses, culture, wildlife, campus research, sports, events and local human interest. Discover via `/explore`, `/events`, `/sports`, `/texas-history`, or `/news`. Publish only one differentiated, ready article at `/news/{slug}` or update an existing, more helpful authority page. A news item does **not** automatically warrant a new indexable URL.
- Never route a governor-elect's **state park land-sale request** as a tourism/parks update: government decision reporting is KTR, while verified visitor access facts can link from TD park guides. Do not duplicate complete stories across both sites.

## Article-level gap inventory (2026-11-09 bounded feed scan)

| Benchmark subject | Destination | Observed shared-feed state | Independent sourcing / verification needed |
| --- | --- | --- | --- |
| Whitmire limits HPD/ICE calls | KTR Houston + Texas News | Discovered, KTR | Actual executive order + City of Houston statement; Houston Public Media and KPRC already discovered |
| Brian Harrison: governor emergency powers | KTR Politics | Discovered, KTR | Signed letter, filed bill, Texas Legislature data, direct statements |
| Gina Hinojosa transition jobs | KTR Politics | Discovered, KTR | Official transition website and appointments; do not confuse campaign assertions with actions |
| Abbott South Texas flash-flood preparations | KTR Texas News | Discovered, KTR | Official Texas Governor/TDEM notice and NWS, alert expiry; avoid stale flash-flood forecasts |
| Dallas public defender investigator murder case | KTR Texas News | No exact match in bounded scan | Dallas PD/DA and court filings, presumption of innocence; do not publish from hearsay |
| Odessa hotel shooting suspect | KTR Texas News | No exact match in bounded scan | Odessa PD active bulletin; confirm suspect status before identifying publicly |
| Arlington Veterans Day Parade | TD Events | Discovered but REVIEW/Unclassified | City of Arlington event details, accessibility, street closures, date; update event canonical, not annual duplicate |
| Ten peaceful Texas small towns | TD Explore and town authorities | One list-style feed item, unready | Original transparent methodology and primary parks/city tourism links; never reproduce third-party ranking |
| UTEP mallard genetic research | TD Explore/Wildlife | No exact match in bounded scan | UTEP primary press release and study, sample sizes and research limitations |
| Cowboys–Colts game | TD Sports | Discovered but mixed owner | Dallas Cowboys / official NFL box score; avoid thin box-score-only news |
| Texans–Chargers game | TD Sports | Discovered, TD | Houston Texans / NFL box score; explain meaningful game context |
| Ranked Texas college volleyball | TD Sports | Partial related feed hit, not this recap | Teams' university athletics schedules and NCAA standings; source each game score |
| Astros Nehomar Ochoa Arizona Fall League | TD Sports | No exact match in bounded scan | Astros / MLB / AFL primary reporting; avoid sensationalizing prior injury |
| Texas Lutheran SCAC win and teammate tribute | TD Sports | Related crash reports found, mixed owners | TLU official football recap; separate actual tragedy from sports tribute; protect affected family privacy |
| Kimpton Fredericksburg / Aaron Bludorn | TD Explore + Fredericksburg existing authority | No exact match in bounded scan | Hotel/developer release, construction status, opening date (future), chef confirmation; no invented rates |
| Canyon Ranch resort and spa in Spicewood | TD Explore | Discovered, REVIEW | Canyon Ranch official location/hours and current amenities; distinguish opening from marketing claims |
| Texas Biomed tuberculosis grant | TD Texas Life/research | No exact match in bounded scan | Texas Biomed/grant primary announcement; *preclinical research not a proven treatment*, avoid medical promises |
| Ida Mae Ford 102nd birthday | TD Texas Life | No exact match in bounded scan | Local primary report + consent/privacy; short notice is not automatically an indexable article |
| Diane Day Texas Radio Hall of Fame | TD Texas Life/History | No exact match in bounded scan | Texas Radio Hall of Fame and broadcaster bios |
| San Antonio archdiocese 100 years | TD Texas History | Discovered, REVIEW | Archdiocese official history and event program; distinguish metro archdiocese centennial from local diocesan dates |
| Texas Institute of Letters 1936 anniversary | TD Texas History / existing Texas cultural history | Not part of tracked headlines | Texas Institute of Letters and Hall of State primary archives; evergreen timeline is better than one-day news |

## Discovery and routing repair

1. Existing working *direct* publishers and first-party sources remain the primary discovery path: Houston Public Media, KPRC, KSAT, KXAN, Cowboys/Texans official RSS, Texas state notices and university/public-institution releases. Source pages may require staff review; no guessed RSS endpoint will be marked operational.
2. The seven November 8 Google News RSS relay candidates failed upstream with HTTP 503 automated-query protection. They remain disabled until *real* successful XML responses are documented; never proxy-hop or bypass Google's protections.
3. The November 9 ownership migration adds **narrow candidate title/description archetypes only**, keeping downstream safety and publication guards authoritative. Its bounded retrospective backfill updates only **unpublished, unlocked** rows; it cannot publish anything or inflate source confidence.
4. New candidate clusters must be independently corroborated, deduplicated across syndicators, and verified against official primary records. The correct outcome may be `REVIEW`, an update to an existing authority page, a short noindex report, or no article.
5. Every approved published story must add real utility: official source links, dates and updates, state/local relevance, what changes for readers, limitations/corrections, original comparison or visit details, canonical source URL, relevant authority-page links, reliable publisher/author disclosure, usable mobile layout, appropriate image provenance and captions. No invented testimony, fake firsthand observation, fake photography or copied Flyover text.
6. Event listings should use the established reusable evergreen/event canonical (not a fresh dated URL every year). Sports finals and transient alerts have short shelf lives: do not turn last week's unverified scores/forecasts into evergreen essays or artificial recency.
7. The following Flyover blocks are excluded from news article creation: sponsored insurance/light therapy/stock/food offers, newsletter book promotion, polling/trivia, dog rankings, podcasts without an independently verifiable Texas topic, national cyclist accident, and unsubstantiated celebrity headlines.

## Acceptance ledger

- **Source discovered** means a live, unblocked, independent publisher URL ingested with correct title/time, not a Google relay shell.
- **Verified** means primary reporting or official documents support claims (and a second independent source where needed).
- **Routed** means live shared-feed `target_site` and `target_section` are correct, including manual/locked exceptions.
- **Published** requires unique reviewed canonical URL, source byline, accessible page, index readiness and relevant internal links. Do **not** infer it from `ready_for_rewrite`.
- **Coverage complete** requires individual checks for every row, source gaps addressed through confirmed working paths, and live KTR/TD URL checks. This November 9 task is **not complete** merely because the routing migration or CI passed.
