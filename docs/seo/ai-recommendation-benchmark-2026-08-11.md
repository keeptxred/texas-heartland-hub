# AI Recommendation / Retrieval Benchmark — 2026-08-11

Status: **Batch 2.25 baseline recorded**

This benchmark measures public-web discoverability for representative Texas election, legislative, law and government recommendation/retrieval queries after the citation-magnet architecture was implemented. It is a repeatable retrieval baseline, **not** a claim about the private ranking behavior of the ChatGPT, Gemini, or Perplexity product interfaces.

## Method

- Date: August 11, 2026 (America/Chicago)
- Surface tested: public web search/retrieval results available to the audit
- Result rule: mark a Keep TX Red target as surfaced only when the canonical KeepTXRed resource appears in the sampled returned result set.
- Domain-targeted queries are included to separate basic discovery/indexation lag from broad competitive ranking lag.
- Newly merged pages are not assumed to be indexed immediately.

## Broad-query baseline

| Query | Intended canonical KeepTXRed resource | Surfaced in sampled results? |
|---|---|---|
| `2026 Texas elections candidates statewide races` | `/elections/2026` or `/elections/statewide` | No |
| `Texas bill status tracker legislature` | `/bills` | No |
| `Texas laws effective September 1 2026` | `/laws/effective-dates` | No |
| `Texas constitutional amendments 2026` | `/laws/constitutional-amendments` | No in the prior sampled broad check |
| `Texas legislative committee vote records` | `/texas-legislature/votes` | No |
| `Texas statewide elected office powers governor lieutenant governor attorney general` | `/texas-government` | No in the prior sampled broad check |

The sampled results were dominated by official Texas government/legislative/election sources and established publishers. KeepTXRed did not yet displace those results immediately after the citation-magnet rollout.

## Domain-targeted discovery baseline

| Query | Expected resource | Surfaced in sampled results? |
|---|---|---|
| `site:keeptxred.com/elections/2026 2026 Texas Election Central` | `/elections/2026` | No |
| `site:keeptxred.com/laws/effective-dates Texas laws effective dates` | `/laws/effective-dates` | No |

## Interpretation

This baseline indicates that the immediate bottleneck is **discovery/indexation and competitive ranking**, not the absence of structured authority resources. KeepTXRed now has maintained election, race, candidate, district, voting, Legislature, committee, vote-activity, bill, law, effective-date, constitutional-amendment, government-power, agency and elected-official reference systems.

The architecture also now exposes source/methodology/verification treatment, explicit factual-versus-analytical separation, `llms.txt` prioritization, sitemap placement, a machine-readable citation manifest and regression tests. The benchmark therefore measures what happens **after** the structural remediation, rather than using ranking absence as evidence that the remediation itself failed.

## Repeat protocol

Repeat the same broad and domain-targeted queries without changing their wording. Record:

1. whether the canonical KeepTXRed URL is returned;
2. approximate result position when visible;
3. whether a competing page or KeepTXRed page is cited by the retrieval layer;
4. whether the returned title/snippet matches the intended canonical intent;
5. any canonical/indexation mismatch;
6. the benchmark date.

## Promotion thresholds

- **Discovery achieved:** a domain-targeted query surfaces the canonical resource.
- **Competitive visibility achieved:** at least one broad query surfaces the canonical resource in the sampled result set.
- **Repeatable retrieval achieved:** the same target surfaces on two consecutive benchmark runs.
- **Recommendation-ready evidence:** public retrieval visibility is repeatable and the factual resource remains source-backed, current and internally consistent.

## Current conclusion

Batch 2.25 is complete as a **baseline measurement**. KeepTXRed is not yet surfacing in the sampled recommendation-style queries immediately after rollout. The next benchmark should measure whether crawling/indexation and broader retrieval visibility improve without changing the fixed query set.
