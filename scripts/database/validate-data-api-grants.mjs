import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const clean = (sql) => sql.replace(/\/\*[\s\S]*?\*\//g, '').replace(/--[^\n]*/g, '');
const escape = (name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function inspectMigration(source) {
  const sql = clean(source).replace(/"([a-z_][a-z_0-9]*)"/g, '$1');
  const errors = [];
  const tables = [...sql.matchAll(/\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?((?:[a-z_][a-z_0-9]*\.)?[a-z_][a-z_0-9]*)\s*(?:\(|AS\b)/gi)];
  for (const match of tables) {
    if (match[1].includes('.') && !match[1].startsWith('public.')) continue;
    const name = match[1].replace(/^public\./, '');
    const target = `(?:public\\.)?${escape(name)}\\b`;
    if (!new RegExp(`\\bGRANT\\s+(?:SELECT|INSERT|UPDATE|DELETE|ALL)[^;]*?\\sON\\s+(?:TABLE\\s+)?[^;]*?${target}[^;]*?\\sTO\\s+[^;]*?\\b(?:anon|authenticated|service_role)\\b`, 'i').test(sql)) errors.push(`${name}: missing explicit application-role table grant`);
    if (!new RegExp(`\\bALTER\\s+TABLE\\s+(?:ONLY\\s+)?${target}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, 'i').test(sql)) errors.push(`${name}: missing ENABLE ROW LEVEL SECURITY`);
    const definition = sql.slice(match.index, tables.find((m) => m.index > match.index)?.index ?? sql.length);
    if (/\b(?:smallserial|serial|bigserial)\b|\bGENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY/i.test(definition) && !/\bGRANT\s+(?:USAGE|SELECT|ALL)[^;]*\bON\s+SEQUENCE\b[^;]*\bTO\b/i.test(sql)) errors.push(`${name}: identity/serial table needs explicit sequence grants`);
  }
  return errors;
}

export function validate(root = '.') {
  const manifest = JSON.parse(readFileSync(`${root}/scripts/database/data-api-grants.json`, 'utf8'));
  const folder = `${root}/supabase/migrations`;
  const errors = [];
  for (const file of readdirSync(folder).filter((f) => f.endsWith('.sql'))) {
    const source = readFileSync(`${folder}/${file}`, 'utf8');
    const hash = createHash('sha256').update(source).digest('hex');
    if (manifest.legacyCreationFiles[file] === hash) continue;
    errors.push(...inspectMigration(source).map((error) => `${file}: ${error}`));
  }
  for (const [file, expected] of Object.entries(manifest.legacyCreationFiles)) {
    const hash = createHash('sha256').update(readFileSync(`${folder}/${file}`)).digest('hex');
    if (hash !== expected) errors.push(`${file}: historical creation SQL changed; use a new migration`);
  }
  const migration = readFileSync(`${folder}/${manifest.migration}`, 'utf8');
  for (const grant of manifest.grants) {
    const statement = `GRANT ${grant.privileges.join(', ')} ON ${grant.kind.toUpperCase()} public.${grant.name} TO ${grant.role};`;
    if (!migration.includes(statement)) errors.push(`Missing readiness statement: ${statement}`);
    if (grant.kind === 'table' && !migration.includes(`ALTER TABLE public.${grant.name} ENABLE ROW LEVEL SECURITY;`)) errors.push(`${grant.name}: readiness RLS missing`);
  }
  const actual = clean(migration).match(/\bGRANT\s+[^;]+;/gi) ?? [];
  if (actual.length !== manifest.grants.length) errors.push('Readiness grant count differs from reviewed manifest');
  for (const file of Object.keys(manifest.legacyCreationFiles)) {
    const sql = clean(readFileSync(`${folder}/${file}`, 'utf8'));
    for (const [, name] of sql.matchAll(/\bcreate\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?([a-z_][a-z_0-9]*)\s*\(/gi)) {
      if (!manifest.grants.some((g) => g.kind === 'table' && g.name === name)) errors.push(`${file}: ${name} absent from readiness grant manifest`);
    }
  }
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = validate();
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('PASS: legacy table grants reconciled; new public tables require grants, RLS and sequence access.');
}
