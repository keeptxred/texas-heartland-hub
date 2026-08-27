export function routeRegexFromRouteName(routeName) {
  let name = routeName.replace(/\.(tsx?|jsx?)$/, '');
  if (name === '__root') return null;

  const literalDot = '__KTR_LITERAL_DOT__';
  const parts = name
    .split('/')
    .flatMap((segment) => segment.replace(/\[\.\]/g, literalDot).split('.'))
    .map((part) => part.replaceAll(literalDot, '.'));

  if (parts.at(-1) === 'index') parts.pop();

  const publicParts = parts
    .filter((part) => part && !part.startsWith('_'))
    .map((part) => part.endsWith('_') ? part.slice(0, -1) : part)
    .filter(Boolean);

  const route = '/' + publicParts
    .map((part) => {
      if (part === '$') return '.+';
      if (part.startsWith('$')) return '[^/]+';
      return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');

  return new RegExp(`^${route === '/' ? '/' : route}/?$`);
}

export function normalizeInternalLink(raw, site) {
  if (!raw) return null;
  const candidate = raw.trim();
  if (!candidate || candidate.startsWith('#') || candidate.startsWith('mailto:') || candidate.startsWith('tel:') || candidate.startsWith('javascript:')) return null;

  // Bare identifiers in generated metadata (for example `to: "table_name"`)
  // are not navigational links. Internal navigation must be root-relative or
  // an absolute KTR URL.
  if (!(candidate.startsWith('/') || /^https?:\/\//i.test(candidate))) return null;

  // Route templates and regex/source patterns are code, not user-facing URLs.
  if (candidate.includes('${') || candidate.includes('{') || candidate.includes('}') || candidate.includes('$')) return null;
  if (/[\\()[\]^*]/.test(candidate)) return null;

  try {
    const url = new URL(candidate, site);
    if (!['keeptxred.com', 'www.keeptxred.com'].includes(url.hostname)) return null;
    return url.pathname.replace(/\/{2,}/g, '/') || '/';
  } catch {
    return null;
  }
}

export function extractLinkCandidates(text) {
  const found = new Set();
  const patterns = [
    /\b(?:href|to|url|canonical|loc)\s*[:=]\s*["'`]([^"'`]+)["'`]/gi,
    /\]\((https?:\/\/keeptxred\.com[^)\s]*|\/[^)\s]*)\)/gi,
    /https?:\/\/(?:www\.)?keeptxred\.com\/[A-Za-z0-9_?&=/%#.-]*/gi,
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) found.add(match[1] || match[0]);
  }
  return [...found];
}
