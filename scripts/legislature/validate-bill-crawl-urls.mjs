import { readFile } from 'node:fs/promises';

const checks = [
  {
    file: 'src/routes/bills/index.tsx',
    required: [
      "import { createFileRoute, Link, stripSearchParams } from '@tanstack/react-router'",
      'middlewares: [stripSearchParams(DEFAULT_SEARCH)]',
      "? `${SITE_URL}/bills?page=${search.page}`",
      'function paginationPages(current: number, total: number): number[]',
      'const visiblePages = paginationPages(search.page, pages);',
      'visiblePages.map((target, index) =>',
    ],
  },
  {
    file: 'src/routes/bills/texas/$legislature/$billType/index.tsx',
    required: [
      'stripSearchParams',
      'const DEFAULT_SEARCH = { page: 1 } as const;',
      'middlewares: [stripSearchParams(DEFAULT_SEARCH)]',
      '? `${baseUrl}?page=${page}`',
      'function paginationPages(current: number, total: number): number[]',
      'const visiblePages = paginationPages(page, pages);',
      'visiblePages.map((target, index) =>',
    ],
  },
  {
    file: 'src/start.ts',
    required: [
      'function isIndexableBillPagination(url: URL): boolean',
      'pathname === "/bills" || /^\\/bills\\/texas\\/\\d+\\/[a-z]{1,8}$/i.test(pathname)',
      'if (normalized === "page" && allowBillPage) continue;',
      'result.response.status === 404 || result.response.status === 410',
      'result.response.headers.set("X-Robots-Tag", "noindex, follow")',
    ],
  },
];

const errors = [];
for (const check of checks) {
  const source = await readFile(check.file, 'utf8');
  for (const token of check.required) {
    if (!source.includes(token)) errors.push(`${check.file} missing crawl URL contract: ${token}`);
  }
}

const robots = await readFile('src/routes/robots[.]txt.ts', 'utf8');
if (robots.includes('Disallow: /*?page=')) {
  errors.push('robots.txt must not block bill pagination with ?page=');
}
if (!robots.includes('Disallow: /*?q=')) {
  errors.push('robots.txt should continue blocking search-query crawl variants');
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Bill crawl URL validation passed.');
