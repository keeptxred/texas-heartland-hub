# Texas Legislature Phase I Deployment Runbook

This runbook deploys the unified 89R legislative document ingestion foundation without uploading raw archives or PDFs to the application repository.

## Preconditions

- The bill-history sync has created canonical `bills` rows for 89R.
- The runtime has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- The extracted archive root uses separate dataset directories:

```text
89R/
  billhistory/
  billtext/
  analysis/
  fiscalnotes/
  reports/
  witlistbill/
```

The reports directory may be partial. Missing reports do not block the per-bill document import.

## 1. Apply the additive migration

Apply:

```text
supabase/migrations/20260803010000_legislative_document_ingestion.sql
```

The migration:

- extends `bill_documents` without deleting existing rows;
- creates deterministic source-record uniqueness;
- adds extracted text, content hashes, version metadata, and latest-version flags;
- creates `legislative_report_indexes`;
- creates `refresh_bill_document_latest_flags`.

## 2. Validate the extracted archive

```bash
npm run legislature:archive:validate -- --root=/path/to/89R
```

Expected core result for the supplied 89R archives:

- bill history: 11,505 XML files;
- bill text: 21,871 HTML files;
- analysis: 6,030 HTML files;
- fiscal notes: 7,320 HTML files;
- witness lists: 3,870 HTML files plus archival PDFs;
- zero unmatched text records.

## 3. Validate cross-dataset relationships

```bash
npm run legislature:archive:relationships -- --root=/path/to/89R
```

Expected result:

- 11,503 canonical legislative items;
- zero orphaned per-bill document groups;
- zero duplicate canonical document records;
- zero unknown version codes.

## 4. Run a local-only dry run

```bash
npm run legislature:archive:import -- --root=/path/to/89R --session=89R --dry-run --fresh
```

The dry run must not require Supabase credentials and must finish with zero errors.

## 5. Run a small database-backed import

```bash
npm run legislature:archive:import -- --root=/path/to/89R --session=89R --fresh --limit=100
```

Then validate the imported rows:

```bash
npm run legislature:archive:validate-imported -- --session=89R
```

Stop if the validator reports:

- orphaned documents;
- missing source keys or hashes;
- duplicate source records;
- more than one latest document per bill and document type.

## 6. Run the resumable full import

```bash
npm run legislature:archive:import -- --root=/path/to/89R --session=89R --max-seconds=450
```

Re-run the same command until it reports completion. The checkpoint file prevents the importer from restarting at the beginning.

Use `--fresh` only when intentionally restarting the archive import from the first file.

## 7. Final validation

```bash
npm run legislature:archive:validate-imported -- --session=89R
npm run legislature:validate
```

Confirm:

- every imported document links to a canonical bill;
- all source records are unique;
- all imported text records have hashes;
- one latest record exists per bill/document type where documents exist;
- existing bill routes still return successfully.

## Rollback

The migration is additive. If deployment must be paused:

1. stop the importer;
2. retain the checkpoint file;
3. do not delete existing `bills`, `bill_actions`, `bill_sponsors`, or `bill_documents` rows;
4. correct the importer or migration and resume from the checkpoint.

Raw PDFs remain outside PostgreSQL and outside the application repository throughout Phase I.
