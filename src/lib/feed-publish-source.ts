import {
  resolveRewriteSource,
  type ResolvedRewriteSource,
  type RewriteSourceInput,
} from "@/lib/rewrite-source";

/**
 * Production integration boundary for feed publishing. Keeping this wrapper
 * small makes it practical to prove the route passes every available source
 * candidate to the shared resolver.
 */
export function resolveFeedPublishSource(input: RewriteSourceInput): ResolvedRewriteSource {
  return resolveRewriteSource(input);
}
