/**
 * An illustration may fail the article-specific vision check even when the
 * provider is healthy. In a >24h publication gap, allow one different vetted
 * reserve story to try its own independent, mandatory image validation.
 * Do NOT retry a provider outage, quota exhaustion, moderation rejection,
 * transport timeout, bad credentials, or unavailable storage with a second
 * expensive generation attempt.
 */
export function canTrySecondVerifiedReserveImage(error: string): boolean {
  return error.startsWith("Generated image failed Cloudflare story-match/photorealism validation:");
}
