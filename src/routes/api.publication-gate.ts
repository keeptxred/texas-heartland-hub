import { createFileRoute } from '@tanstack/react-router';
import {
  decideCrossSiteContent,
  enforcePublicationDecision,
  type ContentCandidate,
  type ContentDomain,
  type PlatformSite,
  type PublicationOverride,
} from '@/shared/platform-core';

const DOMAINS = new Set<ContentDomain>(['travel','food','events','history','moving','home-garden','real-estate','property-tax','shopping','politics','elections','legislation','breaking-news','government-accountability','texas-culture']);
const SITES = new Set<PlatformSite>(['TexasDefined', 'KeepTXRed']);

export const Route = createFileRoute('/api/publication-gate')({
  server: { handlers: { POST: async ({ request }) => {
    const raw = await request.text();
    if (raw.length > 100_000) return json({ error: 'Request body exceeds 100,000 characters.' }, 413);
    let input: Record<string, unknown>;
    try { input = JSON.parse(raw) as Record<string, unknown>; } catch { return json({ error: 'Request body must be valid JSON.' }, 400); }
    if (!DOMAINS.has(input.domain as ContentDomain)) return json({ error: 'Unknown content domain.' }, 400);
    if (!SITES.has(input.sourceSite as PlatformSite)) return json({ error: 'Unknown source site.' }, 400);
    if (input.targetSite && input.targetSite !== 'KeepTXRed') return json({ error: 'This endpoint only evaluates publication to KeepTXRed.' }, 400);
    if (typeof input.sourceCanonicalUrl !== 'string' || !isHttps(input.sourceCanonicalUrl)) return json({ error: 'sourceCanonicalUrl must be HTTPS.' }, 400);
    const candidate: ContentCandidate = {
      id: typeof input.id === 'string' ? input.id.slice(0, 200) : 'publication-preview',
      title: typeof input.title === 'string' ? input.title.slice(0, 500) : 'Untitled preview',
      domain: input.domain as ContentDomain,
      sourceSite: input.sourceSite as PlatformSite,
      targetSite: 'KeepTXRed',
      sourceCanonicalUrl: input.sourceCanonicalUrl,
      ...(typeof input.proposedUrl === 'string' && isHttps(input.proposedUrl) ? { proposedUrl: input.proposedUrl } : {}),
      ...(typeof input.contentFingerprint === 'string' ? { contentFingerprint: input.contentFingerprint.slice(0, 160) } : {}),
      ...(typeof input.sourceFingerprint === 'string' ? { sourceFingerprint: input.sourceFingerprint.slice(0, 160) } : {}),
      ...(isPurpose(input.derivativePurpose) ? { derivativePurpose: input.derivativePurpose } : {}),
    };
    const decision = decideCrossSiteContent(candidate);
    const gate = enforcePublicationDecision(candidate, decision, normalizeOverride(input.override));
    return json({ mode: 'enforcement-preview', targetSite: 'KeepTXRed', candidate, decision, gate }, gate.publishable ? 200 : 409);
  } } },
});

function normalizeOverride(value: unknown): PublicationOverride | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const item = value as Record<string, unknown>;
  const keys = ['candidateId','targetSite','decisionFingerprint','reviewer','reason','reviewedAt','expiresAt','token'] as const;
  if (!keys.every((key) => typeof item[key] === 'string')) return undefined;
  return Object.fromEntries(keys.map((key) => [key, String(item[key]).slice(0, 1000)])) as PublicationOverride;
}
function json(body: unknown, status: number) { return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' } }); }
function isHttps(value: string) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
function isPurpose(value: unknown): value is ContentCandidate['derivativePurpose'] { return ['summary','context','guide','news-update','commerce'].includes(String(value)); }
