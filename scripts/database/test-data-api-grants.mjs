import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectMigration, validate } from './validate-data-api-grants.mjs';
test('repository grant manifest and legacy coverage', () => assert.deepEqual(validate(), []));
test('policies alone do not provide table access', () => {
  const errors = inspectMigration('CREATE TABLE public.example (id uuid); ALTER TABLE public.example ENABLE ROW LEVEL SECURITY; CREATE POLICY read ON public.example FOR SELECT USING (true);');
  assert.equal(errors.length, 1); assert.match(errors[0], /grant/);
});
test('explicit service-only table is valid', () => assert.deepEqual(inspectMigration('CREATE TABLE public.private_events (id uuid); ALTER TABLE public.private_events ENABLE ROW LEVEL SECURITY; GRANT SELECT, INSERT ON TABLE public.private_events TO service_role;'), []));
test('comments and unrelated grants do not satisfy requirement', () => {
  const errors = inspectMigration('CREATE TABLE public.example (id uuid); -- GRANT SELECT ON public.example TO anon;\nGRANT SELECT ON public.other TO anon;');
  assert.equal(errors.length, 2);
});
test('serial inserts need a sequence grant', () => {
  const sql = 'CREATE TABLE public.example (id bigserial); ALTER TABLE public.example ENABLE ROW LEVEL SECURITY; GRANT SELECT, INSERT ON public.example TO service_role;';
  assert.match(inspectMigration(sql)[0], /sequence/);
  assert.deepEqual(inspectMigration(sql + ' GRANT USAGE, SELECT ON SEQUENCE public.example_id_seq TO service_role;'), []);
});
test('private schemas excluded, quoted public names checked', () => {
  assert.deepEqual(inspectMigration('CREATE TABLE private.audit (id uuid);'), []);
  assert.equal(inspectMigration('CREATE TABLE "public"."example" (id uuid);').length, 2);
});
