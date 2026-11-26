import { pathToFileURL } from 'node:url';

const ENDPOINT = 'https://ftkznprjljkhymknvhye.supabase.co/customer/v1/privileged/metrics';
const CAP = 2_000_000;
// The provider's dashboard uses the "/" mountpoint, excluding rootfs.
// Match size and availability on the same complete label set, fail on
// ambiguous series, and never log raw metrics or authorization material.
export function parseRootDiskMetrics(body) {
  const seen = new Map();
  for (const line of body.split(/\r?\n/)) {
    const m = /^(node_filesystem_(?:avail|size)_bytes)\{([^}]*)\}\s+([0-9.eE+-]+)(?:\s+\d+)?$/.exec(line);
    if (!m) continue;
    const labels = [...m[2].matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)="((?:\\.|[^"\\])*)"/g)];
    const fields = Object.fromEntries(labels.map(x => [x[1], x[2]]));
    if (fields.mountpoint !== '/' || !fields.fstype || fields.fstype === 'rootfs') continue;
    if (fields.supabase_project_ref && fields.supabase_project_ref !== 'ftkznprjljkhymknvhye') continue;
    const key = JSON.stringify(Object.entries(fields).sort(([a],[b])=>a.localeCompare(b)));
    const record = seen.get(key) || {};
    const value = Number(m[3]);
    if (!Number.isSafeInteger(value) || value < 0 || Object.hasOwn(record,m[1])) throw Error('invalid or duplicated disk metric');
    record[m[1]] = value;
    seen.set(key, record);
  }
  if (seen.size !== 1) throw Error('missing or ambiguous provider root filesystem');
  const [entry] = seen.values();
  const total = entry.node_filesystem_size_bytes, available = entry.node_filesystem_avail_bytes;
  if (!Number.isSafeInteger(total) || total <= 0 || !Number.isSafeInteger(available) || available > total)
    throw Error('incomplete or inconsistent disk metric pair');
  return { totalBytes:total, availableBytes:available, usedBytes:total-available };
}
async function boundedText(response) {
  const reader = response.body?.getReader();
  if (!reader) throw Error('missing metrics body');
  let length = 0;
  const chunks = [];
  try {
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      length += value.length;
      if (length > CAP) throw Error('metrics response too large');
      chunks.push(Buffer.from(value));
    }
  } finally { await reader.cancel().catch(()=>{}); }
  return Buffer.concat(chunks,length).toString('utf8');
}
async function main() {
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || process.env.GITHUB_REPOSITORY !== 'keeptxred/texas-heartland-hub') {
    console.log('SUPABASE_DISK_HEADROOM_UNAVAILABLE: trusted key/repository absent');
    return;
  }
  try {
    const response = await fetch(ENDPOINT,{
      redirect:'error',signal:AbortSignal.timeout(12_000),
      headers:{Authorization:'Basic '+Buffer.from('service_role:'+key).toString('base64'),Accept:'text/plain'},
    });
    if (!response.ok) { console.log('SUPABASE_DISK_HEADROOM_UNAVAILABLE: provider HTTP '+response.status); return; }
    const data=parseRootDiskMetrics(await boundedText(response));
    console.log('SUPABASE_DISK_HEADROOM '+JSON.stringify({...data,measuredAt:new Date().toISOString(),source:'provider root filesystem metrics',compactionAuthorized:false}));
  } catch {
    console.log('SUPABASE_DISK_HEADROOM_UNAVAILABLE: bounded metrics transport or series validation failed');
  }
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) await main();
