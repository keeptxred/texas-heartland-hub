# Keep TX Red → TexasDefined crosslinking policy

## Purpose

Keep TX Red and TexasDefined are separate editorial brands with complementary scopes. Keep TX Red owns politics, elections, legislation, government accountability and major Texas news. TexasDefined owns nonpolitical evergreen Texas reference content: places, counties, travel, events, history, home, relocation, real estate, practical guides and similar lifestyle/reference topics.

Crosslinks exist to help a reader continue into a genuinely useful nonpolitical resource. They are not a quota and must never make either site look like an SEO satellite for the other.

## Brand guardrails

1. Never auto-link generic words such as “Texas,” “Houston,” “county,” “BBQ,” “home,” or “park” in article body copy.
2. Keep TX Red article prose remains editorially independent. Cross-site recommendations live in a clearly labeled module outside the story body unless an editor intentionally adds a contextual source/reference link.
3. Do not show the recommendation module on election, candidate, campaign, polling, voting, legislative or bill pages merely to create a backlink.
4. A hard-politics news article needs an independently useful nonpolitical subject signal before TexasDefined can be recommended.
5. Limit the automated module to three TexasDefined links per page.
6. Use descriptive anchors that tell the reader what is on the destination page; never keyword-stuffed anchor text.
7. Use normal editorial links (`noopener noreferrer` when opening a new tab). Do not add `nofollow` to legitimate editorial references.
8. Keep one understated sitewide TexasDefined disclosure/link in the footer/About area; do not build a sitewide keyword-link block.

## Implementation of the 10 backlink patterns

### 1. Nonpolitical evergreen ownership
When a KTR story needs depth on travel, places, home, relocation, events, county reference material or Texas culture, the evergreen destination belongs on TexasDefined. KTR may retain the timely news angle and link to the evergreen resource.

### 2. Contextual “Explore TexasDefined” cards
`TexasDefinedCrosslinks` renders only on matching `/news/` stories and only when the resolver finds a useful subject match.

### 3. County crosslinks
County-centered stories may link to `https://texasdefined.com/county/<county-slug>`. The automated resolver starts with a curated set of high-use counties and counties already central to current editorial work. Add counties to the resolver only when their TexasDefined entity page is indexable and useful.

### 4. Texas reference source
For nonpolitical background—geography, local reference facts, places, moving, home and lifestyle topics—prefer an appropriate TexasDefined evergreen page rather than expanding KTR into a second lifestyle site.

### 5. Companion content
For a newsworthy development with lasting reader value, publish the timely news/reporting angle on KTR and the durable guide/explainer on TexasDefined. Crosslink only where each page adds distinct value.

### 6. Texas history
KTR news or anniversary coverage can recommend TexasDefined’s `/texas-history` resource when history is a material subject of the article.

### 7. Footer/About disclosure
KTR should carry one restrained link explaining that nonpolitical Texas lifestyle/reference coverage lives on TexasDefined.

### 8. Search handoff
KTR currently has no general `/search` route in its generated route tree. Do not invent one solely for backlinks. If a general KTR search experience is added later, lifestyle/reference queries may include clearly labeled “From TexasDefined” results using the same relevance rules.

### 9. Evergreen explainers from breaking news
Weather, preparedness, insurance, housing and other breaking-news subjects may recommend `/guides`, `/real-estate`, `/home-garden` or another verified TexasDefined evergreen destination when useful.

### 10. “More Texas” module
The automated module is the implementation of the contextual “More Texas” concept. It appears near the end of eligible news pages and is visually separated from KTR reporting.

## Editorial examples

Good: a Brewster County/Big Bend development linking to the Brewster County guide and Explore Texas.

Good: a festival story linking to TexasDefined Events.

Good: a Texas-history anniversary story linking to TexasDefined Texas History.

Bad: a candidate story linking “Texas” to TexasDefined.

Bad: an election story linking a county name solely because a county page exists.

Bad: inserting multiple TexasDefined links into every KTR article regardless of subject.
