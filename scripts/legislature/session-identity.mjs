/**
 * Parse official TLO folder tokens: 89R = 89th regular, 891 = first called
 * and 892 = second called session. Numeric suffix belongs to session.
 */
export function parseTloSession(token) {
  const match = /^(\d{2})(R|[1-9]\d*)$/i.exec(String(token ?? '').trim());
  if (!match) throw new Error('Invalid Texas Legislature session token: ' + String(token));
  return { legislature_number: Number(match[1]), session_code: match[2].toUpperCase() };
}
/**
 * Official FTP has grouping folders such as HB00001_HB00099, which must NEVER
 * be parsed as the target measure. Only the decoded XML basename is valid.
 */
export function identityFromTloHistoryUrl(sourceUrl, sessionToken) {
  let filename;
  try {
    const url = new URL(sourceUrl);
    if (url.protocol !== 'ftp:' && url.protocol !== 'https:') return null;
    filename = decodeURIComponent(url.pathname.split('/').pop() || '');
  } catch {
    return null;
  }
  const match = /^(HB|SB|HJR|SJR|HCR|SCR|HR|SR)\s*0*(\d{1,5})\.xml$/i.exec(filename);
  if (!match || Number(match[2]) <= 0) return null;
  return { ...parseTloSession(sessionToken), bill_type: match[1].toLowerCase(), bill_number: Number(match[2]) };
}
