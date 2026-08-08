import { readFile } from 'node:fs/promises';

const checks = [
  {
    file: 'src/routes/bills/index.tsx',
    required: [
      "import { createFileRoute, Link, notFound, stripSearchParams } from '@tanstack/react-router'",
      'middlewares: [stripSearchParams(DEFAULT_SEARCH)]',
      "? `${SITE_URL}/bills?page=${search.page}`",
      'function paginationPages(current: number, total: number): number[]',
      'const maxPage = Math.max(1, Math.ceil(results.count / 24));',
      'if (deps.page > maxPage) throw notFound();',
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
  {
    file: 'src/lib/bills.ts',
    required: [
      "const BILL_DIRECTORY_PAGE_SIZE = 1000;",
      ".order('last_action_date', { ascending: false, nullsFirst: false })",
      ".order('id', { ascending: true })",
      ".range(from, from + BILL_DIRECTORY_PAGE_SIZE - 1)",
      '`${SITE_URL}/bills/texas/${bill.legislature_number}`',
      '`${SITE_URL}/bills/texas/${bill.legislature_number}/${billType}`',
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

const bills = await readFile('src/lib/bills.ts', 'utf8');
if (bills.includes('`${SITE_URL}/bills?legislature=${bill.legislature_number}`')) {
  errors.push('bill structured breadcrumbs must not point to the filtered/noindex legislature URL');
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
