import {
  createGovernanceEvent,
  detectOwnershipDrift,
  summarizeGovernanceEvents,
  validateGovernanceEvent,
  type ContentCandidate,
  type ContentDecision,
  type GovernanceEvent,
  type PublicationGateResult,
  type PublicationOverride,
} from '@/shared/platform-core';
import { governancePersistenceConfigured, loadGovernanceEvents, persistGovernanceEvents } from './governance-persistence';

const MAX_EVENTS = 2_000;
const globalStore = globalThis as typeof globalThis & { __keepTxRedGovernanceEvents?: GovernanceEvent[] };
function store() { return (globalStore.__keepTxRedGovernanceEvents ??= []); }

export function appendGovernanceEvent(event: GovernanceEvent) {
  const validation = validateGovernanceEvent(event);
  if (!validation.valid) throw new Error(`Invalid governance event: ${validation.errors.join(' ')}`);
  const events = store();
  if (!events.some((existing) => existing.id === event.id)) {
    const copy = structuredClone(event);
    events.push(copy);
    void persistGovernanceEvents([copy]).catch((error) => console.error('governance persistence failed', error));
  }
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
  return event.id;
}

export function recordGovernanceDecision(input: { candidate: ContentCandidate; decision: ContentDecision; gate: PublicationGateResult; override?: PublicationOverride; writer: string; occurredAt?: string }) {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const primaryKind = input.gate.status === 'allowed' ? 'publication-allowed' : input.gate.status === 'blocked' ? 'publication-blocked' : 'override-required';
  const common = { occurredAt, site: input.candidate.targetSite, domain: input.candidate.domain, disposition: input.decision.disposition, gateStatus: input.gate.status, decisionFingerprint: input.gate.decisionFingerprint, canonicalOwner: input.decision.canonicalOwner, sourceSite: input.candidate.sourceSite, overrideUsed: input.gate.overrideValid, writer: input.writer, candidateId: input.candidate.id, title: input.candidate.title, sourceCanonicalUrl: input.candidate.sourceCanonicalUrl, proposedUrl: input.candidate.proposedUrl, reasonCodes: input.gate.reasons } as const;
  const ids = [appendGovernanceEvent(createGovernanceEvent({ ...common, kind: primaryKind }))];
  if (input.override) ids.push(appendGovernanceEvent(createGovernanceEvent({ ...common, kind: input.gate.overrideValid ? 'override-accepted' : 'override-rejected' })));
  return ids;
}

export async function governanceHealth() {
  const memory = store().map((event) => structuredClone(event));
  let durable: GovernanceEvent[] = [];
  let persistenceError: string | null = null;
  try { durable = await loadGovernanceEvents(); } catch (error) { persistenceError = error instanceof Error ? error.message : String(error); }
  const merged = [...new Map([...durable, ...memory].map((event) => [event.id, event])).values()];
  const drift = detectOwnershipDrift(merged);
  return {
    storage: governancePersistenceConfigured() ? 'supabase-with-memory-fallback' : 'bounded-process-memory',
    persistent: governancePersistenceConfigured() && !persistenceError,
    persistenceError,
    maxMemoryEvents: MAX_EVENTS,
    eventCount: merged.length,
    summary: summarizeGovernanceEvents(merged),
    ownershipDrift: drift,
    healthy: drift.length === 0 && !persistenceError,
    privacy: { storesArticleBodies: false, storesCaptions: false, storesReaderIdentifiers: false, storesCredentials: false },
  };
}

export function clearGovernanceEventsForTests() { globalStore.__keepTxRedGovernanceEvents = []; }
