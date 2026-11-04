/** All public bill detail and directory HTML URLs are retired. */
export function isRetiredBillDocumentPath(pathname: string): boolean {
  const normalized = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  return normalized.startsWith('/bills/');
}
