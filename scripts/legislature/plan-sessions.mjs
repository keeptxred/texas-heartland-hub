#!/usr/bin/env node
/**
 * Plans live Texas Legislature FTP sessions for GitHub Actions. Daily runs
 * follow the current regular session; the quarterly sweep also revisits known
 * called sessions and discovers newer ones from the official TLO FTP directory.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

export function currentLegislature(year) {
  return 89 + Math.floor((year - 2025) / 2);
}
export function plannedSessions({ year = new Date().getUTCFullYear(), quarterly = false, directory = '' } = {}) {
  const current = currentLegislature(year);
  const sessions = new Set([`${current}R`]);
  if (quarterly) {
    // Known to exist in the official 89th Legislature archive.
    if (current >= 89) ['89R', '891', '892'].forEach((session) => sessions.add(session));
    for (const token of directory.split(/\s+/)) {
      const session = token.replace(/\/$/, '').toUpperCase();
      const match = /^(\d{2})(R|[1-9]\d?)$/.exec(session);
      if (match && Number(match[1]) >= Math.max(89, current - 1) && Number(match[1]) <= current)
        sessions.add(session);
    }
  }
  return [...sessions].sort((a, b) => Number(a.slice(0,2)) - Number(b.slice(0,2)) || (a.endsWith('R') ? -1 : b.endsWith('R') ? 1 : Number(a.slice(2)) - Number(b.slice(2))));
}
function discoverOfficialSessions() {
  try {
    return execFileSync('curl', [
      '--fail','--silent','--show-error','--ftp-pasv','--list-only',
      '--connect-timeout','15','--max-time','45','ftp://ftp.legis.state.tx.us/bills/'
    ], { encoding: 'utf8', timeout: 50_000 });
  } catch (error) {
    console.error('Official FTP discovery unavailable, using verified session fallback: ' + String(error.message).slice(0,200));
    return '';
  }
}
if (process.argv[1]?.endsWith('plan-sessions.mjs')) {
  const quarterly = process.argv.includes('--quarterly');
  const sessions = plannedSessions({quarterly, directory: quarterly ? discoverOfficialSessions() : ''});
  if (process.argv.includes('--github-output')) {
    if (!process.env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT is required');
    appendFileSync(process.env.GITHUB_OUTPUT, 'sessions=' + JSON.stringify(sessions) + '\n');
    console.log('Planned TLO sessions:', sessions.join(', '));
  } else {
    console.log(sessions.join(','));
  }
}
