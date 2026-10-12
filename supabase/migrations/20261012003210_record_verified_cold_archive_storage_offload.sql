-- Applied private certification ledger; historic exports were independently verified before database copies were released.

CREATE TABLE IF NOT EXISTS private.cold_archive_offload_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certified_at timestamptz NOT NULL DEFAULT now(),
  storage_bucket text NOT NULL,
  manifest_object_name text NOT NULL UNIQUE,
  verified_storage_objects integer NOT NULL CHECK(verified_storage_objects > 0),
  verified_storage_bytes bigint NOT NULL CHECK(verified_storage_bytes > 0),
  legislative_rows integer NOT NULL CHECK(legislative_rows >= 0),
  newsroom_rows integer NOT NULL CHECK(newsroom_rows >= 0),
  feed_rows integer NOT NULL CHECK(feed_rows >= 0),
  storage_readback_run text NOT NULL,
  database_bytes_before bigint NOT NULL,
  released_from_database boolean NOT NULL DEFAULT false,
  released_at timestamptz
);
ALTER TABLE private.cold_archive_offload_certifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.cold_archive_offload_certifications FROM PUBLIC,anon,authenticated;
COMMENT ON TABLE private.cold_archive_offload_certifications IS
 'Immutable certification ledger of full SHA-256 Storage-export verification before releasing redundant PostgreSQL cold archive bytes.';

