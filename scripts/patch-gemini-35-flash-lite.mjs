import fs from 'node:fs';

const serverPath = 'src/server.ts';
let server = fs.readFileSync(serverPath, 'utf8');
server = server.replaceAll('gemini-2.5-flash-lite', 'gemini-3.5-flash-lite');
server = server.replace(/\n\s*temperature: 0\.1,/, '');
fs.writeFileSync(serverPath, server);

const healthPath = 'src/routes/api/public/hooks/health.ts';
let health = fs.readFileSync(healthPath, 'utf8');
health = health.replaceAll('gemini-2.5-flash-lite', 'gemini-3.5-flash-lite');
fs.writeFileSync(healthPath, health);

for (const [path, expected] of [[serverPath, 'gemini-3.5-flash-lite'], [healthPath, 'gemini-3.5-flash-lite']]) {
  const text = fs.readFileSync(path, 'utf8');
  if (!text.includes(expected)) throw new Error(`${path} was not updated`);
}
if (/generationConfig:\s*\{[\s\S]*?temperature:\s*0\.1/.test(fs.readFileSync(serverPath, 'utf8'))) {
  throw new Error('Deprecated Gemini 3.x temperature parameter is still present in generationConfig');
}
