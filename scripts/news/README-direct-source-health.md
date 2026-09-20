# Direct source health semantics

`ingest-feeds` distinguishes source transport failures from quiet sources:

- `healthySources`: HTTP success with one or more parsed items.
- `quietSources`: HTTP success with zero parsed items.
- `failedSources`: non-2xx transport responses only.

Quiet sources are not treated as broken. Persistently failing supplemental sources should be retired or replaced only after source-fetch telemetry confirms repeated failures and equivalent coverage is preserved.
