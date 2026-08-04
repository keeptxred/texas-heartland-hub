import { createFileRoute } from '@tanstack/react-router';
import {
  decideCrossSiteContent,
  validateContentOwnershipRules,
  type ContentCandidate,
  type ContentDomain,
  type PlatformSite,
} from '@/shared/platform-core';

const DOMAINS = new Set<ContentDomain>([
  'travel', 'food', 'events', 'history', 'moving', 'home-garden', 'real-estate',
  'property-tax', 'shopping', 'politics', 'elections', 'legislation',
  'breaking-news', 'government-accountability', 'texas-culture',
]);
const SITES = new Set<PlatformSite>(['TexasDefined', 'KeepTXRed']);

export const Route = createFileRoute('/api/content-disposition')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rules = validateContentOwnershipRules();
        if (!rules.valid) return response({ error: 'Content ownership rules are invalid.', details: rules.errors }, 503);
        const raw = await request.text();
        if (raw.length > 100_000) return response({ error: 'Request body exceeds 100,000 characters.' }, 413);
        let input: Record<string, unknown>;
        try { input = JSON.parse(raw) as Record<string, unknown>; }
        catch { return response({ error: 'Request body must be valid JSON.' }, 400); }
        if (!DOMAINS.has(input.domain as ContentDomain)) return response({ error: 'Unknown content domain.' }, 400);
        if (!SITES.has(input.sourceSite as PlatformSite)) return response({ error: 'Unknown source site.' }, 400);
        if (input.targetSite && input.targetSite !== 'KeepTXRed') return response({ error: 'This endpoint only evaluates publication to KeepTXRed.' }, 400);
        if (typeof input.sourceCanonicalUrl !== 'string' || !isHttpsUrl(input.sourceCanonicalUrl)) return response({ error: 'sourceCanonicalUrl must be a valid HTTPS URL.' }, 400);
        const candidate: ContentCandidate = {
          id: typeof input.id === 'string' ? input.id.slice(0, 200) : 'preview',
          title: typeof input.title === 'string' ? input.title.slice(0, 500) : 'Untitled preview',
          domain: input.domain as ContentDomain,
          sourceSite: input.sourceSite as PlatformSite,
          targetSite: 'KeepTXRed',
          sourceCanonicalUrl: input.sourceCanonicalUrl,
          ...(typeof input.proposedUrl === 'string' && isHttpsUrl(input.proposedUrl) ? { proposedUrl: input.proposedUrl } : {}),
          ...(typeof input.contentFingerprint === 'string' ? { contentFingerprint: input.contentFingerprint.slice(0, 160) } : {}),
          ...(typeof input.sourceFingerprint === 'string' ? { sourceFingerprint: input.sourceFingerprint.slice(0, 160) } : {}),
          ...(isPurpose(input.derivativePurpose) ? { derivativePurpose: input.derivativePurpose } : {}),
        };
        return response({ mode: 'preview-only', targetSite: 'KeepTXRed', decision: decideCrossSiteContent(candidate), candidate }, 200);
      },
    },
  },
});

function response(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
function isHttpsUrl(value: string) { try { return new URL(value).protocol === 'https:'; } catch { return false; } }
function isPurpose(value: unknown): value is ContentCandidate['derivativePurpose'] {
  return ['summary', 'context', 'guide', 'news-update', 'commerce'].includes(String(value));
}
