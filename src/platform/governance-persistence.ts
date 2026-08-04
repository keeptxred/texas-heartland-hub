import type { GovernanceEvent } from '@/shared/platform-core';

const TABLE = 'platform_governance_events';

function credentials() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
}

function headers(key: string, extra: Record<string, string> = {}) {
  return { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json', ...extra };
}

export function governancePersistenceConfigured() { return Boolean(credentials()); }

export async function persistGovernanceEvents(events: GovernanceEvent[]) {
  const auth = credentials();
  if (!auth || events.length === 0) return { persisted: false, count: 0, reason: 'not-configured' as const };
  const rows = events.map((event) => ({
    id: event.id, occurred_at: event.occurredAt, kind: event.kind, site: event.site, domain: event.domain,
    disposition: event.disposition, gate_status: event.gateStatus, decision_fingerprint: event.decisionFingerprint,
    candidate_fingerprint: event.candidateFingerprint, canonical_owner: event.canonicalOwner,
    source_site: event.sourceSite, override_used: event.overrideUsed, writer: event.writer ?? null,
    reason_codes: event.reasonCodes,
  }));
  const response = await fetch(`${auth.url}/rest/v1/${TABLE}?on_conflict=id`, {
    method: 'POST', headers: headers(auth.key, { prefer: 'resolution=ignore-duplicates,return=minimal' }), body: JSON.stringify(rows),
  });
  if (!response.ok) throw new Error(`Governance persistence failed: ${response.status} ${(await response.text()).slice(0, 300)}`);
  return { persisted: true, count: rows.length };
}

export async function loadGovernanceEvents(limit = 5000): Promise<GovernanceEvent[]> {
  const auth = credentials();
  if (!auth) return [];
  const capped = Math.max(1, Math.min(limit, 10000));
  const response = await fetch(`${auth.url}/rest/v1/${TABLE}?select=*&order=occurred_at.desc&limit=${capped}`, {
    headers: headers(auth.key), cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Governance read failed: ${response.status} ${(await response.text()).slice(0, 300)}`);
  const rows = await response.json() as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    id: String(row.id), occurredAt: String(row.occurred_at), kind: row.kind as GovernanceEvent['kind'],
    site: row.site as GovernanceEvent['site'], domain: row.domain as GovernanceEvent['domain'],
    disposition: row.disposition as GovernanceEvent['disposition'], gateStatus: row.gate_status as GovernanceEvent['gateStatus'],
    decisionFingerprint: String(row.decision_fingerprint), candidateFingerprint: String(row.candidate_fingerprint),
    canonicalOwner: row.canonical_owner as GovernanceEvent['canonicalOwner'], sourceSite: row.source_site as GovernanceEvent['sourceSite'],
    overrideUsed: Boolean(row.override_used), ...(row.writer ? { writer: String(row.writer) } : {}),
    reasonCodes: Array.isArray(row.reason_codes) ? row.reason_codes.map(String) : [],
  }));
}

export async function pruneGovernanceEvents(retainDays = 180) {
  const auth = credentials();
  if (!auth) return { pruned: false, removed: 0, reason: 'not-configured' as const };
  const days = Math.max(30, Math.min(Math.trunc(retainDays), 3650));
  const response = await fetch(`${auth.url}/rest/v1/rpc/prune_platform_governance_events`, {
    method: 'POST', headers: headers(auth.key), body: JSON.stringify({ retain_days: days }),
  });
  if (!response.ok) throw new Error(`Governance prune failed: ${response.status} ${(await response.text()).slice(0, 300)}`);
  return { pruned: true, removed: Number(await response.json()) || 0, retainDays: days };
}
