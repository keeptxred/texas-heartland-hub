// Deployment-only protocol checks. No credentials, uploads, products or listings.
const base = process.env.SITE_URL || 'https://keeptxred.com';
const origin = 'https://keeptxred.com';
const resource = `${origin}/api/publisher/mcp`;
const issuer = `${origin}/publisher/oauth`;
const TRANSIENT_HTTP_STATUSES = new Set([429, 502, 503, 504]);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function read(path, init) {
  const url = new URL(path, base);
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: 'error',
        ...init,
        signal: AbortSignal.timeout(20000),
      });
      if (TRANSIENT_HTTP_STATUSES.has(response.status) && attempt < 5) {
        const retryAfter = Number(response.headers.get('retry-after'));
        const backoff = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, 15000)
          : 500 * (2 ** (attempt - 1));
        console.warn(`Publisher boundary probe HTTP ${response.status} (${url.pathname}); retry ${attempt}/4 after ${backoff}ms`);
        await pause(backoff);
        continue;
      }
      return response;
    } catch (error) {
      // Transient TCP resets, timeouts and dropped connections must not
      // silently downgrade the OAuth/publication assertions below.
      if (attempt === 5) throw new Error(`Publisher boundary transport failed after 5 attempts at ${url.pathname}`, { cause: error });
      const backoff = 500 * (2 ** (attempt - 1));
      console.warn(`Publisher boundary transport retry ${attempt}/4 at ${url.pathname}: ${String(error)}`);
      await pause(backoff);
    }
  }
  throw new Error(`Publisher boundary probe retries exhausted at ${url.pathname}`);
}
function requireValue(condition, message) { if (!condition) throw new Error(message); }
const metadataResponse = await read('/.well-known/oauth-protected-resource/api/publisher/mcp');
requireValue(metadataResponse.status === 200, 'Publisher protected-resource discovery failed');
const metadata = await metadataResponse.json();
requireValue(metadata.resource === resource && metadata.authorization_servers?.includes(issuer) && metadata.scopes_supported?.includes('products:publish'), 'Publisher resource, issuer or scope mismatch');
const authResponse = await read('/.well-known/oauth-authorization-server/publisher/oauth');
requireValue(authResponse.status === 200, 'Publisher authorization-server discovery failed');
const auth = await authResponse.json();
requireValue(auth.issuer === issuer && auth.authorization_endpoint === `${issuer}/authorize` && auth.token_endpoint === `${issuer}/token` && auth.code_challenge_methods_supported?.includes('S256') && auth.client_id_metadata_document_supported === true && auth.authorization_response_iss_parameter_supported === true, 'Publisher OAuth metadata is incomplete');
const unauthenticated = await read('/api/publisher/mcp', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) });
requireValue(unauthenticated.status === 401 && unauthenticated.headers.get('www-authenticate')?.includes('resource_metadata='), 'Publisher must reject unauthenticated tool discovery with OAuth metadata challenge');
const guide = await read('/publisher/connect');
requireValue(guide.status === 200 && (await guide.text()).includes(resource) && guide.headers.get('cache-control')?.includes('no-store'), 'Publisher connection guide failed');
const retired = await read('/api/admin/printify-publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
requireValue(retired.status === 410, 'Initial shared-token publisher is not retired');
console.log(JSON.stringify({ publisher_protocol: 'verified', resource, issuer, unauthenticated_access: 'rejected', legacy_endpoint: 'retired', owner_authorization_ready: auth.owner_authorization_ready === true, owner_installation_and_real_publication: 'not_exercised' }));
