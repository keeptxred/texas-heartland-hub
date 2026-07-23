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
