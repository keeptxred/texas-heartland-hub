# KTR election-night estimated-votes-counted integration

## Implemented vs. not connected

The live official Texas SOS tally is operational. Its `Polling Locations Reporting` percentage is **not** the estimated share of ballots counted. The 2026 results UI and API now support an **optional, licensed** separate estimate feed, but no AP/Fox/CNN/Decision Desk HQ election-night API entitlement or matching source credential was found in the repository as of November 3, 2026. **Do not claim a media estimate is live without a validated source.**

## Enabling an authorized estimate provider

Configure server-only Cloudflare Worker environment variables (never `VITE_` public client vars):

- `ELECTION_ESTIMATES_FEED_URL`: HTTPS JSON endpoint that KTR is authorized to read and republish (not an arbitrary HTML news site).
- `ELECTION_ESTIMATES_FEED_TOKEN`: optional bearer token for that endpoint.

The provider returns JSON like:

```json
{
  "electionDate": "2026-11-03",
  "estimates": [
    {
      "raceId": "u-s-senator",
      "sourceName": "Licensed provider display name",
      "sourceFamily": "unique_underlying_data_origin",
      "sourceUrl": "https://authorized-provider.example/2026/tx",
      "updatedAt": "2026-11-04T03:25:00.000Z",
      "percent": 55
    }
  ]
}
```

`raceId` must match the official KTR slug; `sourceFamily` identifies the **underlying estimate**, not merely a distributor name. If Fox and CNN both redistribute AP's same estimate, tag both with `ap`, not independent network labels. Different proprietary models may have distinct families only if verified as independent.

### Data integrity and operations

- Estimates older than 30 minutes, more than 2 minutes in the future, outside 0–100, using non-HTTPS source links, mismatched race IDs or wrong election dates are discarded.
- Duplicated underlying source-family values are deduplicated by latest timestamp. Two or more genuinely independent estimates use an arithmetic mean; one is labeled a single-provider estimate. Both are **unofficial**.
- Estimated-vote data never alters official SOS votes, leader status, or SOS reporting percentage.
- Provider request timeout 2.5 seconds; an unavailable estimate feed fails closed without interrupting the official results.
- Without the configured, authorized provider, the public page must say the estimated-count percentage is unavailable—not invent a number or mislabel the SOS metric.
- Test: `bunx vitest run src/lib/elections/estimated-count-progress.server.test.ts`.
- Production acceptance: receive nonempty validated estimates from a **real, authorized** source, verify freshness and cited URLs, and confirm they appear on `/elections/results`. Until then this integration is **code-ready but not live-data-ready**.

AP Elections API requires an authenticated entitlement: https://developer.ap.org/ap-elections-api/index.html . Do not scrape broadcasters without authorization.
