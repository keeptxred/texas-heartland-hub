# Election forecast updates

Election Central requests one forecast refresh every day at 11:17 UTC through
`.github/workflows/update-election-forecasts.yml`. The workflow is also manually
dispatchable.

The update implementation remains swappable. Configure these GitHub Actions
secrets to point at the active Supabase function or API service:

- `ELECTION_FORECAST_UPDATE_URL`
- `ELECTION_FORECAST_UPDATE_TOKEN`

The service is responsible for reading verified source data, calculating the
configured model, saving a snapshot, and publishing only records that pass
editorial review rules. The workflow sends no election numbers and cannot
manufacture missing polling data. Missing secrets or a non-success response fail
the run visibly.
