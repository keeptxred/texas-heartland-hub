const WORKER_HOST = 'keeptxred-site.freddy-coppola.workers.dev';
const CANONICAL_HOST = 'keeptxred.com';
const originalFetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = async (input, init = {}) => {
  let url;
  try {
    url = input instanceof Request ? new URL(input.url) : new URL(String(input));
  } catch {
    return originalFetch(input, init);
  }

  if (url.hostname !== WORKER_HOST) return originalFetch(input, init);

  const baseHeaders = input instanceof Request ? input.headers : undefined;
  const headers = new Headers(baseHeaders);
  for (const [key, value] of new Headers(init.headers)) headers.set(key, value);
  if (!headers.has('x-forwarded-host')) headers.set('x-forwarded-host', CANONICAL_HOST);

  return originalFetch(input, { ...init, headers });
};
