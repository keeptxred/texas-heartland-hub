export const PLATFORM_CORE_CONTRACT = {
  packageName: '@keeptxred/texas-platform-core',
  packageVersion: '0.2.0',
  apiVersion: '1.0',
  releasedAt: '2026-08-04',
  capabilities: [
    'entity-contracts',
    'entity-canonicalization',
    'deterministic-fingerprints',
    'entity-set-diffs',
    'baseline-quarantine',
    'promotion-previews',
  ],
} as const;

export type PlatformCoreCapability = (typeof PLATFORM_CORE_CONTRACT.capabilities)[number];
export type PlatformCoreConsumerManifest = {
  consumer: 'TexasDefined' | 'KeepTXRed';
  repository: string;
  coreRepository: 'keeptxred/texas-common-core';
  coreCommit: string;
  packageVersion: string;
  apiVersion: string;
  capabilities: PlatformCoreCapability[];
  localExtensions: string[];
  excludedDomains: string[];
  reviewedAt: string;
};

export function validateConsumerManifest(manifest: PlatformCoreConsumerManifest) {
  const errors: string[] = [];
  if (!/^[0-9a-f]{40}$/.test(manifest.coreCommit)) errors.push('coreCommit must be a full 40-character SHA.');
  if (manifest.coreRepository !== 'keeptxred/texas-common-core') errors.push('Unexpected core repository.');
  if (manifest.packageVersion !== PLATFORM_CORE_CONTRACT.packageVersion) errors.push('Package version mismatch.');
  if (manifest.apiVersion !== PLATFORM_CORE_CONTRACT.apiVersion) errors.push('API version mismatch.');
  const supported = new Set<string>(PLATFORM_CORE_CONTRACT.capabilities);
  for (const capability of manifest.capabilities) if (!supported.has(capability)) errors.push(`Unsupported capability: ${capability}`);
  if (!manifest.capabilities.length) errors.push('Consumer must declare at least one capability.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(manifest.reviewedAt)) errors.push('reviewedAt must use YYYY-MM-DD.');
  return { valid: errors.length === 0, errors };
}
