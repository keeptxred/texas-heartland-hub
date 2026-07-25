# Texas Living Platform Architecture

## North star

Keep TX Red is the complete practical resource for people moving to Texas and people already living in Texas, supported by current Texas news and politics coverage.

## Primary navigation

1. Home
2. Texas News
3. Politics
4. Moving to Texas
5. Living in Texas
6. Shop

The top navigation stays intentionally small. Existing topic pages such as Houston, sports, business, elections, laws, and non-political news remain available through the Texas News, Politics, hub pages, contextual links, footer navigation, and search.

## Core hubs

### `/moving-to-texas`

Audience: prospective residents and households actively planning a Texas move.

Primary jobs:

- understand affordability and cost of living
- compare salaries and cities
- plan moving expenses
- decide whether to rent or buy
- estimate home-buying costs
- prepare for utilities, licensing, registration, schools, healthcare, and voting

Initial tool collection:

- Texas Moving Cost Calculator
- Texas Cost of Living Calculator
- Texas Salary Calculator
- Texas Salary Comparison by City
- Texas Budget Planner
- Texas Rent vs Buy Calculator
- Texas Mortgage Calculator
- Texas Home Affordability Calculator
- Texas Down Payment Calculator
- Texas Down Payment Assistance Calculator
- Texas Closing Cost Calculator

### `/living-in-texas`

Audience: current Texas residents, homeowners, renters, and households.

Primary jobs:

- manage property taxes and homeownership costs
- understand insurance, utilities, equity, refinancing, and payoff options
- access state services, laws, elections, licenses, and resident guides
- make better household financial decisions

Initial tool collection:

- Texas Property Tax Calculator
- Texas Property Tax Increase Calculator
- Texas Homeownership Cost Calculator
- Texas Home Insurance Calculator
- Texas Utility Cost Calculator
- Texas Home Equity Calculator
- Texas Home Equity Growth Calculator
- Texas Mortgage Payoff Calculator
- Texas Refinance Savings Calculator
- Texas Budget Planner

### `/texas-financial-tools`

Purpose: the complete permanent directory of all calculators and interactive financial tools.

This page is not required in primary navigation. It is linked prominently from both hub pages, the homepage, relevant articles, the footer, and individual calculators.

The directory is divided into:

- Moving to Texas tools
- Living in Texas tools

Tools may appear in both collections when they support both user journeys.

## Homepage structure

1. Breaking and latest Texas news
2. Clear value proposition for moving to and living in Texas
3. Moving to Texas feature section
4. Living in Texas feature section
5. Popular Texas tools
6. Latest Texas news and politics
7. Shop feature

The homepage should remain useful to returning news readers while making the two evergreen hubs immediately discoverable.

## Internal linking rules

- Every relocation guide links to the relevant relocation tools.
- Every resident guide links to the relevant resident tools.
- Every calculator links to its parent hub and two to four logical next-step tools.
- Property-tax content links to both `/living-in-texas` and the property-tax calculators.
- The Moving to Texas and Living in Texas hubs link to the full tools directory.
- Existing URLs remain stable; content is curated into hubs rather than moved unnecessarily.
- Do not place private financial inputs in URLs or analytics payloads.

## Content taxonomy

### Moving to Texas

- Start Here
- Cost and Financial Planning
- Choosing a City
- Buying or Renting a Home
- Schools and Family
- Before You Arrive
- Getting Settled

### Living in Texas

- Homeownership and Property Taxes
- Household Costs and Utilities
- State Services and Laws
- Voting and Civic Life
- Lifestyle and Recreation

## SEO principles

- Use natural-language intent phrases such as “Moving to Texas” and “Living in Texas.”
- Each hub has a unique title, description, H1, introduction, FAQs, and structured internal links.
- Hub pages summarize and organize resources; they do not duplicate full article content.
- Calculator pages target specific high-intent queries and link upward to the appropriate hub.
- Existing property-tax authority is preserved inside the broader Living in Texas pillar.

## Implementation phases

### Phase V-A: Foundation

- simplify primary navigation
- create both hub routes
- reorganize the tools directory by audience
- add both hubs and popular tools to the homepage
- include routes in sitemap and footer

### Phase V-B: Content integration

- curate existing articles into the correct hub sections
- add breadcrumbs and related-resource blocks
- improve hub introductions, FAQs, and schema

### Phase V-C: Expansion

- relocation budget planner
- best Texas city finder
- ZIP-level cost comparison
- vehicle registration estimator
- homestead exemption calculator
- property-tax protest savings estimator
- electricity plan comparison
- resident checklists and interactive planners

### Phase V-D: Texas recreation and heritage

Goal: make Keep TX Red a practical trip-planning and discovery resource for Texas
state parks, state historic sites, monuments, landmarks, and historical markers.
The program should add original planning value instead of duplicating official
agency directories.

#### V-D1: Comprehensive Texas State Parks guide and finder

- create a permanent `/texas-state-parks` hub
- maintain a complete, current directory of Texas Parks and Wildlife Department
  state parks, historic sites, and natural areas
- use the official TPWD inventory as the factual source of record and retain an
  official destination and reservation link for every location
- add an interactive park finder with filters for:
  - region and distance from Houston, Dallas-Fort Worth, San Antonio, Austin,
    and El Paso
  - day trip, weekend trip, or longer stay
  - camping, cabins, RV sites, hiking, swimming, fishing, paddling, wildlife,
    stargazing, and other major activities
  - pet considerations and accessibility information
  - reservation needs and day-use versus overnight availability
- give each park a useful planning summary covering ideal trip length, major
  activities, seasonal considerations, reservation guidance, nearby
  destinations, and the best originating city
- explain passes, day-use reservations, camping reservations, common park
  rules, and how to verify closures, burn bans, weather, and capacity before
  travel
- consider a park-pass value calculator after the directory and finder are
  stable

#### V-D2: Comprehensive Texas State Historic Sites guide

- create a permanent `/texas-historic-sites` hub
- cover the complete current inventory of sites operated by the Texas
  Historical Commission
- organize sites by region and by historical theme:
  - Texas Revolution and Republic
  - military and frontier history
  - Indigenous and cultural heritage
  - ranching and agriculture
  - commerce, government, and presidential history
- support filters for proximity to the five city hubs, typical visit length,
  indoor or outdoor experience, accessibility, and family suitability
- include official hours, admission, event, and destination links while making
  clear that visitors should verify current conditions with the site

#### V-D3: Texas history and parks road trips

- publish original itineraries that connect parks, historic sites, and nearby
  communities rather than presenting isolated directory entries
- include one-day, weekend, and multi-day options
- show starting city, approximate drive sequence, suggested time at each stop,
  overnight options, reservation needs, and nearby practical resources
- prioritize routes from Houston, Dallas-Fort Worth, San Antonio, Austin, and
  El Paso
- develop thematic trips such as:
  - Texas Revolution and Republic
  - frontier forts
  - presidential and political history
  - missions and Spanish colonial history
  - ranching and cattle history
  - Gulf Coast, Hill Country, Piney Woods, Panhandle, and Far West Texas

#### V-D4: Monuments, landmarks, and historical markers guide

- create a permanent `/texas-monuments-and-markers` explainer and discovery hub
- explain the differences among:
  - Official Texas Historical Markers
  - Recorded Texas Historic Landmarks
  - State Antiquities Landmarks
  - National Historic Landmarks
  - National Register properties
  - monuments, memorials, historic cemeteries, and museums
- use the Texas Historical Commission's Historic Sites Atlas as the exhaustive
  search resource and link visitors to it
- curate significant monuments, markers, and thematic collections instead of
  attempting thin individual pages for the state's many thousands of markers
- build individual pages only when Keep TX Red can provide substantial original
  history, visitor planning, photography, an itinerary, or other added value

#### V-D5: Destination pages and city integration

- add a "Parks and history near you" section to each of the five city pages
- connect city guides to nearby parks, historic sites, and recommended road
  trips
- launch detailed individual destination pages in priority order, beginning
  with the most visited, historically significant, and practically useful
  locations
- link destination pages back to the appropriate hub, city page, related
  itinerary, and official agency page
- surface seasonal or local articles on destination pages when relevant, while
  preserving evergreen planning information

#### Editorial, data, and SEO requirements

- use TPWD, the Texas Historical Commission, the National Park Service, and
  other responsible public agencies as primary factual sources
- write original summaries and planning guidance; do not copy official
  destination descriptions
- store the official source URL and last-reviewed date with every directory
  record
- treat hours, prices, reservations, closures, weather, burn bans, and
  accessibility as changeable information and direct users to confirm before
  travel
- keep the directory data separate from presentation so official inventories
  can be updated without rewriting pages
- use descriptive titles, canonical URLs, breadcrumbs, structured data,
  internal links, and indexable server-rendered content
- avoid mass-producing thin destination or marker pages solely to increase the
  page count

Recommended delivery order:

1. State Parks hub, complete directory, and interactive finder
2. State Historic Sites hub and complete directory
3. Initial road-trip itineraries from the five city hubs
4. Monuments, landmarks, and historical-markers explainer
5. Priority individual destination pages
6. City-page integration and ongoing regional content
