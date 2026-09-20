import path from 'node:path';

const NON_RUNTIME_SEGMENTS = [
  `${path.sep}src${path.sep}test${path.sep}`,
  `${path.sep}src${path.sep}tests${path.sep}`,
  `${path.sep}test${path.sep}`,
  `${path.sep}tests${path.sep}`,
  `${path.sep}__tests__${path.sep}`,
  `${path.sep}supabase${path.sep}migrations${path.sep}`,
];

const ASSET_EXTENSIONS = new Set([
  '.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.webp',
  '.woff', '.woff2', '.ttf', '.otf', '.mp3', '.mp4', '.webm', '.wav',
]);

export function shouldScanRuntimeLinks(file) {
  const normalized = path.resolve(file);
  if (NON_RUNTIME_SEGMENTS.some((segment) => normalized.includes(segment))) return false;
  return !/\.(?:test|spec)\.[cm]?[jt]sx?$/i.test(normalized);
}

export function isNavigationalPath(pathname) {
  const extension = path.extname(pathname).toLowerCase();
  return !extension || !ASSET_EXTENSIONS.has(extension);
}
