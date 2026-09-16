-- pg_trgm is relocatable and the database search_path already includes the
-- extensions schema. Move it out of public without dropping/recreating objects.
alter extension pg_trgm set schema extensions;
