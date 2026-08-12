# Citation Magnet Page Standard — Batch 2.3

Status: **required reusable standard for promoted citation-magnet resources**

This standard applies to existing election, legislature, bill, law and government resources promoted from the Batch 2.2 scorecard. It does not authorize duplicate routes or article-style copies of structured authority pages.

## Required page layers

1. **Direct answer layer**
   - The first substantive section must state the current answer: race status, election date, bill status, officeholder context, voting rule or legal effect.
   - Key facts must be visible without forcing the user through commentary or unrelated news coverage.
   - Facts and analysis must be labeled separately.

2. **Structured evidence layer**
   - Prefer labeled fact blocks, entity relationships, timelines, comparison tables, sponsor/committee lists, poll methodology fields and official action histories.
   - Normalize recurring fields across race/candidate/district/poll/bill families.
   - Unknown or pending facts must be marked as such rather than inferred.

3. **Visible trust layer**
   - Every promoted citation magnet must visibly show **Sources**, **Methodology**, and **Last verified**.
   - Primary official sources should be linked directly.
   - Methodology must explain normalization, aggregation, model use or editorial interpretation.
   - Last verified must reflect the underlying factual verification date, not the deploy date.

4. **Machine-readable layer**
   - Preserve stable canonicals.
   - Emit schema that matches the visible content and entity type.
   - When available, include `dateModified`, official identifiers, source URLs and entity relationships.

5. **Relationship layer**
   - Preserve the durable graph: bill → legislature → legislator → election → candidate → district → voting → law → explainer.
   - Internal links should represent real entity relationships, not generic keyword cross-linking.

## Source hierarchy

Preferred order:

1. Texas Secretary of State, Texas Legislature Online, official chamber/committee records, county election authorities and other government primary sources.
2. Official candidate, campaign, agency or district records for claims only those entities can establish.
3. Primary pollster datasets/methodology for polling facts.
4. High-quality secondary reporting only when primary material is unavailable or when commentary is explicitly labeled.

Forecasts and editorial explanations may synthesize facts, but they must not be presented as primary-source facts.

## Programmatic uniqueness gate

A race, candidate, district, poll or bill detail page is citation-ready only if its entity record contains meaningful verified substance rather than a shell. At least two of the following should be present where applicable:

- current status/date fields;
- official source links or identifiers;
- entity-specific relationships (candidates, sponsors, committees, district, result, poll, law);
- entity-specific timeline/history;
- structured methodology/measurement fields;
- verified explanatory text grounded in the entity record.

Thin shells remain unpromoted/noindex where appropriate.

## Freshness classes

- **Live:** results, breaking status or election-night data; verification target measured in minutes/hours according to feed capability.
- **Active-cycle:** races, candidates, polls, voting and current-session bills; verify on material official changes and on a regular operating cadence.
- **Session-bound:** legislature/committee/bill history; verify when official actions post and after session close.
- **Evergreen:** law and civic explainers; verify at least annually and whenever the governing statute/rule changes.

## Factual vs analytical content

For forecasts, ratings and editorial explanations:

- source facts are shown first and separately;
- model inputs/methodology are visible;
- judgments are labeled as analysis/forecast, not fact;
- the last-verified date applies to factual inputs; model/update timestamps may be shown separately.

## Answer-engine readiness checklist

A resource is citation-ready only when all are true:

- one canonical intent and URL;
- direct answer/current status is visible near the top;
- factual claims have traceable provenance;
- structured fields are normalized and internally consistent;
- methodology distinguishes facts from calculations/model/editorial judgment;
- last-verified date is visible;
- thin/template safeguards pass;
- entity relationships are useful and accurate;
- indexability matches publication/verification status.

## Reusable implementation

Use `CitationTrustPanel` for the visible trust layer instead of page-specific provenance variants. Specialized election or legislative source details can remain, but the labels **Sources**, **Methodology**, and **Last verified** stay consistent across promoted resources.
