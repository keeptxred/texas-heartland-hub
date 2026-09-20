import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

type LooseClient = {
  from: (table: string) => any;
  rpc: (name: string, args?: Record<string, unknown>) => any;
};

const SUBJECT_IMPORT_VERSION = 2;

function authOk(token: string | null | undefined): boolean {
  const expected = process.env.ADMIN_PASSCODE;
  return Boolean(expected && token && token === expected);
}

async function getAdmin(): Promise<LooseClient> {
  const mod = await import('@/integrations/supabase/client.server');
  return mod.supabaseAdmin as unknown as LooseClient;
}

async function countRows(admin: LooseClient, table: string, configure?: (query: any) => any): Promise<number> {
  let query = admin.from(table).select('*', { count: 'exact', head: true });
  if (configure) query = configure(query);
  const { count, error } = await query;
  if (error) throw error;
  return Number(count ?? 0);
}

async function loadSubjectCheckpointCounts(admin: LooseClient, session: string) {
  let checked = 0;
  let sourceRecords = 0;

  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin
      .from('legislative_source_records')
      .select('source_record_key,metadata')
      .eq('source_key', 'texas-legislature-online')
      .like('source_record_key', `${session}:%`)
      .range(from, from + 999);
    if (error) throw error;

    const rows = data ?? [];
    sourceRecords += rows.length;
    checked += rows.filter((row: any) => Number(row.metadata?.subjectsImportedVersion ?? 0) >= SUBJECT_IMPORT_VERSION).length;
    if (rows.length < 1000) break;
  }

  return { sourceRecords, checked, remaining: Math.max(0, sourceRecords - checked) };
}

async function getStatus(admin: LooseClient, session: string) {
  const legislatureNumber = Number(session.match(/^\d+/)?.[0] ?? 0);
  const sessionCode = session.replace(/^\d+/, '').toUpperCase();

  const [bills, subjects, subjectRelationships, articleRelationships, authorityEdges, checkpoints] = await Promise.all([
    countRows(admin, 'bills', (query) => query.eq('legislature_number', legislatureNumber).eq('session_code', sessionCode)),
    countRows(admin, 'bill_subjects'),
    countRows(admin, 'bill_subject_relationships'),
    countRows(admin, 'bill_article_relationships'),
    countRows(admin, 'authority_relationships', (query) => query.eq('source_type', 'bill')),
    loadSubjectCheckpointCounts(admin, session),
  ]);

  return {
    session,
    bills,
    subjects,
    subjectRelationships,
    articleRelationships,
    authorityEdges,
    sourceRecords: checkpoints.sourceRecords,
    checkedSourceRecords: checkpoints.checked,
    remainingSourceRecords: checkpoints.remaining,
    complete: checkpoints.sourceRecords > 0 && checkpoints.remaining === 0,
    measuredAt: new Date().toISOString(),
  };
}

async function runSubjectPass(session: string, maxSeconds: number, limit: number): Promise<{ stdout: string; stderr: string }> {
  const { spawn } = await import('node:child_process');

  return new Promise((resolve, reject) => {
    const args = [
      'scripts/legislature/sync-bill-subjects.mjs',
      `--sessions=${session}`,
      `--subject-max-seconds=${maxSeconds}`,
      `--subject-limit=${limit}`,
    ];
    const child = spawn(process.execPath, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    const timeout = setTimeout(() => child.kill('SIGTERM'), (maxSeconds + 15) * 1000);

    child.stdout.on('data', (chunk) => { stdout += String(chunk); });
    child.stderr.on('data', (chunk) => { stderr += String(chunk); });
    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on('exit', (code, signal) => {
      clearTimeout(timeout);
      if (signal) return reject(new Error(`Subject pass terminated by ${signal}. ${stderr}`));
      if (code !== 0) return reject(new Error(`Subject pass exited with code ${code}. ${stderr}`));
      resolve({ stdout: stdout.slice(-8000), stderr: stderr.slice(-4000) });
    });
  });
}

const StatusInput = z.object({
  token: z.string().min(1),
  session: z.string().regex(/^\d+[A-Z]+$/).default('89R'),
});

export const getLegislativeBackfillStatus = createServerFn({ method: 'POST' })
  .validator((input: unknown) => StatusInput.parse(input))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };
    try {
      const admin = await getAdmin();
      return { ok: true as const, status: await getStatus(admin, data.session) };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : 'Could not load backfill status.' };
    }
  });

const RunInput = StatusInput.extend({
  maxSeconds: z.number().int().min(15).max(75).default(60),
  limit: z.number().int().min(1).max(250).default(100),
});

export const runLegislativeBackfillPass = createServerFn({ method: 'POST' })
  .validator((input: unknown) => RunInput.parse(input))
  .handler(async ({ data }) => {
    if (!authOk(data.token)) return { ok: false as const, error: 'Unauthorized' };

    try {
      const admin = await getAdmin();
      const before = await getStatus(admin, data.session);
      if (before.complete) return { ok: true as const, before, after: before, output: 'Backfill already complete.' };

      const output = await runSubjectPass(data.session, data.maxSeconds, data.limit);

      const { error: refreshError } = await admin.rpc('refresh_bill_relationships', { p_bill_id: null });
      if (refreshError) throw refreshError;

      const { error: activityError } = await admin.rpc('refresh_bill_committee_activity_edges', { p_bill_id: null });
      if (activityError) throw activityError;

      const { error: pruneError } = await admin.rpc('prune_unapproved_bill_article_authority_edges', { p_bill_id: null });
      if (pruneError) throw pruneError;

      const after = await getStatus(admin, data.session);
      return { ok: true as const, before, after, output: output.stdout || output.stderr || 'Backfill pass completed.' };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : 'Backfill pass failed.' };
    }
  });
