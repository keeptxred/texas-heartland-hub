import fs from 'node:fs';

const migrationPath = 'supabase/migrations/20260905013000_disambiguate_bill_article_sessions.sql';
const sql = fs.readFileSync(migrationPath, 'utf8');

const required = [
  "explicit-bill-identifier-v2-session-aware",
  "partition by b.legislature_number, b.bill_type, b.bill_number",
  "b.session_code = 'R'",
  "first special session",
  "second special session",
  "relationship.is_manual = false",
];

for (const token of required) {
  if (!sql.includes(token)) {
    throw new Error(`Missing bill/article session disambiguation guard: ${token}`);
  }
}

console.log('Bill/article session disambiguation validation passed.');
