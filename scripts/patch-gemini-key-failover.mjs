import fs from 'node:fs';

const serverPath = 'src/server.ts';
let server = fs.readFileSync(serverPath, 'utf8');

server = server.replace(
`function directGeminiApiKey(): string | undefined {\n  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;\n}`,
`type GeminiApiKey = { source: string; key: string };\n\nfunction directGeminiApiKeys(): GeminiApiKey[] {\n  const configured: GeminiApiKey[] = [\n    { source: \"GEMINI_API_KEY\", key: process.env.GEMINI_API_KEY || \"\" },\n    { source: \"GOOGLE_API_KEY\", key: process.env.GOOGLE_API_KEY || \"\" },\n    { source: \"GOOGLE_AI_API_KEY\", key: process.env.GOOGLE_AI_API_KEY || \"\" },\n  ].filter((entry) => entry.key.length > 0);\n  const seen = new Set<string>();\n  return configured.filter((entry) => {\n    if (seen.has(entry.key)) return false;\n    seen.add(entry.key);\n    return true;\n  });\n}\n\nfunction directGeminiApiKey(): string | undefined {\n  return directGeminiApiKeys()[0]?.key;\n}`,
);

server = server.replace(
`  const geminiApiKey = directGeminiApiKey();\n  const cf = cloudflareCredentials();`,
`  const geminiKeys = directGeminiApiKeys();\n  const geminiApiKey = geminiKeys[0]?.key;\n  const cf = cloudflareCredentials();`,
);

const oldBlock = `    let geminiFailure: { status: number; body: string } | null = null;\n    if (geminiApiKey) {\n      const geminiResponse = await directGeminiVisionResponse(chatBody, geminiApiKey, init?.signal);\n      if (geminiResponse.ok || !cf) return geminiResponse;\n\n      const retryableGeminiFailure = geminiResponse.status === 429 || geminiResponse.status >= 500;\n      if (!retryableGeminiFailure) return geminiResponse;\n\n      const geminiFailureBody = await geminiResponse.clone().text();\n      geminiFailure = { status: geminiResponse.status, body: geminiFailureBody };\n      console.warn(\"[AI] direct Gemini text rewrite failed; falling back to Cloudflare Workers AI\", {\n        status: geminiResponse.status,\n        detail: geminiFailureBody.slice(0, 300),\n      });\n    }`;

const newBlock = `    const geminiFailures: Array<{ source: string; status: number; body: string }> = [];\n    let lastGeminiResponse: Response | null = null;\n    for (const geminiKey of geminiKeys) {\n      const geminiResponse = await directGeminiVisionResponse(chatBody, geminiKey.key, init?.signal);\n      lastGeminiResponse = geminiResponse;\n      if (geminiResponse.ok) return geminiResponse;\n\n      const retryableGeminiFailure = geminiResponse.status === 429 || geminiResponse.status >= 500;\n      if (!retryableGeminiFailure) return geminiResponse;\n\n      const geminiFailureBody = await geminiResponse.clone().text();\n      geminiFailures.push({ source: geminiKey.source, status: geminiResponse.status, body: geminiFailureBody });\n      console.warn(\"[AI] direct Gemini text rewrite failed; trying next provider credential\", {\n        source: geminiKey.source,\n        status: geminiResponse.status,\n        detail: geminiFailureBody.slice(0, 300),\n      });\n    }\n\n    if (!cf && lastGeminiResponse) return lastGeminiResponse;`;

if (!server.includes(oldBlock)) throw new Error('Expected single-key Gemini fallback block not found');
server = server.replace(oldBlock, newBlock);
server = server.replace(
`    if (!cloudflareResponse.ok && geminiFailure) {\n      const cloudflareFailureBody = await cloudflareResponse.clone().text();\n      return Response.json(\n        {\n          error: {\n            message: \`Gemini \${geminiFailure.status}: \${geminiFailure.body.slice(0, 900)} | Cloudflare \${cloudflareResponse.status}: \${cloudflareFailureBody.slice(0, 500)}\`,\n          },\n        },\n        { status: geminiFailure.status || cloudflareResponse.status || 502 },\n      );\n    }`,
`    if (!cloudflareResponse.ok && geminiFailures.length > 0) {\n      const cloudflareFailureBody = await cloudflareResponse.clone().text();\n      const geminiDetail = geminiFailures\n        .map((failure) => \`\${failure.source} Gemini \${failure.status}: \${failure.body.slice(0, 700)}\`)\n        .join(\" | \" );\n      return Response.json(\n        { error: { message: \`\${geminiDetail} | Cloudflare \${cloudflareResponse.status}: \${cloudflareFailureBody.slice(0, 500)}\` } },\n        { status: geminiFailures[0]?.status || cloudflareResponse.status || 502 },\n      );\n    }`,
);
fs.writeFileSync(serverPath, server);

const healthPath = 'src/routes/api/public/hooks/health.ts';
let health = fs.readFileSync(healthPath, 'utf8');
health = health.replace(
`  const ready = Boolean(\n    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY,\n  );\n  return {`,
`  const geminiKeySources = [\n    process.env.GEMINI_API_KEY ? \"GEMINI_API_KEY\" : null,\n    process.env.GOOGLE_API_KEY ? \"GOOGLE_API_KEY\" : null,\n    process.env.GOOGLE_AI_API_KEY ? \"GOOGLE_AI_API_KEY\" : null,\n  ].filter((value): value is string => Boolean(value));\n  const ready = geminiKeySources.length > 0;\n  return {\n    gemini_key_sources: geminiKeySources,\n    gemini_key_source_count: geminiKeySources.length,`,
);
fs.writeFileSync(healthPath, health);

const updatedServer = fs.readFileSync(serverPath, 'utf8');
const updatedHealth = fs.readFileSync(healthPath, 'utf8');
if (!updatedServer.includes('for (const geminiKey of geminiKeys)')) throw new Error('Gemini key failover loop missing');
if (!updatedHealth.includes('gemini_key_source_count')) throw new Error('Health key-source diagnostics missing');
