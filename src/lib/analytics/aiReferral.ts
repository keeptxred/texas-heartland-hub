export type AIReferralPlatform = 'chatgpt' | 'perplexity' | 'gemini';

export type AIReferral = {
  platform: AIReferralPlatform;
  referrerHost: string;
  detection: 'referrer' | 'utm_source';
};

const HOST_PLATFORM: ReadonlyArray<[suffix: string, platform: AIReferralPlatform]> = [
  ['chatgpt.com', 'chatgpt'],
  ['chat.openai.com', 'chatgpt'],
  ['perplexity.ai', 'perplexity'],
  ['gemini.google.com', 'gemini'],
];

const UTM_PLATFORM: Record<string, AIReferralPlatform> = {
  chatgpt: 'chatgpt',
  openai: 'chatgpt',
  'chat.openai': 'chatgpt',
  perplexity: 'perplexity',
  gemini: 'gemini',
  google_gemini: 'gemini',
};

export function classifyAIReferral(referrer: string, search: string): AIReferral | null {
  const referrerHost = safeHostname(referrer);
  const referrerPlatform = platformForHost(referrerHost);
  if (referrerPlatform) return { platform: referrerPlatform, referrerHost, detection: 'referrer' };

  const source = safeUtmSource(search);
  const utmPlatform = source ? UTM_PLATFORM[source] : undefined;
  if (utmPlatform) return { platform: utmPlatform, referrerHost, detection: 'utm_source' };
  return null;
}

function platformForHost(host: string) {
  if (!host) return undefined;
  return HOST_PLATFORM.find(([suffix]) => host === suffix || host.endsWith(`.${suffix}`))?.[1];
}

function safeHostname(value: string) {
  if (!value) return '';
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function safeUtmSource(search: string) {
  try {
    return new URLSearchParams(search).get('utm_source')?.trim().toLowerCase() ?? '';
  } catch {
    return '';
  }
}
