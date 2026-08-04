# Texas Life Platform

## Vision

TexasDefined exists to help people confidently live, work, invest, travel, and thrive in Texas.

Build the most trusted digital guide for living in Texas—helping people understand, decide, and take action through practical guidance, interactive tools, and authoritative information.

## Site roles

- **TexasDefined:** everyday life in Texas, including housing, money, moving, cities, counties, schools, weather, travel, recreation, and practical tasks.
- **Keep TX Red:** Texas politics, government, elections, representatives, legislation, and political analysis.
- **Shared platform:** entities, search, calculators, relationships, recommendations, trust components, telemetry, and reusable content standards.

## Five pillars

1. **Learn — Help me understand.** Evergreen reference pages.
2. **Decide — Help me make a decision.** Comparisons, calculators, and tradeoffs.
3. **Do — Help me accomplish something.** Task guides with official next actions.
4. **Discover — Help me explore.** Destinations, experiences, and inspiration.
5. **Stay Informed — Tell me what changed.** Timely updates framed around practical impact.

## Golden Rule

Every finished page answers:

1. What is it?
2. Why should I care?
3. What do I do next?
4. Where can I verify it?
5. What else should I know?

## Decision graph

Links should reflect the visitor's next likely decision rather than category similarity. The initial shared graph covers the home-buying journey from mortgage and property taxes through schools, moving, county information, representatives, and community events.

## Trust framework

Every page must distinguish:

- What TexasDefined explains.
- What the official authority decides.

Official actions, approvals, deadlines, and eligibility decisions must link to the responsible government or institutional source.

## Success metrics

Measure outcomes rather than page views alone:

- Visitor found the needed resource.
- Visitor selected a recommended next step.
- Visitor opened the official source.
- Visitor returned later for another task.

## Editorial principles

- Plain English first.
- Guide before opinion.
- Official sources whenever possible.
- Tools beat long explanations when calculation is needed.
- Every page leads naturally to the next step.
- Build once and reuse through shared components and data.

## Implementation location

The reusable framework lives in `src/shared/texas-platform/texas-life-platform.ts` with shared UI in `texas-life-platform-components.tsx`. Site-specific pages should consume these shared exports rather than duplicating the standards.
