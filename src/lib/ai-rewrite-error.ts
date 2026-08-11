export function classifyAiRewriteError(message: string):
  | "ktr_daily_cap"
  | "gemini_quota"
  | "gemini_unconfigured"
  | "gemini_auth"
  | "gemini_server"
  | "gemini_timeout"
  | "generic_rewrite"
  | "other" {
  const lower = message.trim().toLowerCase();
  if (/daily ai rewrite budget reached|budget_exhausted/.test(lower)) return "ktr_daily_cap";
  if (/ai gateway http 429|resource_exhausted|rate limit|rate_limit|quota exceeded|quota_exceeded|too many requests/.test(lower)) return "gemini_quota";
  if (/ai gateway http 503|direct gemini ai is not configured|no direct gemini key|gemini.*not configured/.test(lower)) return "gemini_unconfigured";
  if (/ai gateway http 401|ai gateway http 403|api key not valid|permission_denied|unauthenticated/.test(lower)) return "gemini_auth";
  if (/ai gateway http 5\d\d/.test(lower)) return "gemini_server";
  if (/ai gateway timed out|ai gateway request failed|timeout|timed out/.test(lower)) return "gemini_timeout";
  if (lower === "ai rewrite failed" || lower.startsWith("ai rewrite failed")) return "generic_rewrite";
  return "other";
}
