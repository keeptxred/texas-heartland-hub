import fs from 'node:fs';

for (const path of ['src/server.ts', 'src/routes/api/public/hooks/health.ts']) {
  let text = fs.readFileSync(path, 'utf8');
  text = text.replaceAll('gemini-3.5-flash-lite', 'gemini-3.1-flash-lite');
  fs.writeFileSync(path, text);
  if (!fs.readFileSync(path, 'utf8').includes('gemini-3.1-flash-lite')) {
    throw new Error(`${path} was not updated to gemini-3.1-flash-lite`);
  }
}
