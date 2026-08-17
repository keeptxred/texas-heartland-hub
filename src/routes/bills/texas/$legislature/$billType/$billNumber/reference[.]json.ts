import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';

import { getBill, getBillRelations } from '@/lib/bills';
import { buildBillPrimarySourceReference } from '@/lib/bill-primary-source-reference';

const BILL_REFERENCE_PATH = /^\/bills\/texas\/(\d+)\/([a-zA-Z]+)\/(\d+)\/reference\.json\/?$/;

export const Route = createFileRoute('/bills/texas/$legislature/$billType/$billNumber/reference.json')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const match = BILL_REFERENCE_PATH.exec(url.pathname);
        if (!match) return Response.json({ error: 'Invalid bill reference path' }, { status: 400 });

        const legislature = Number(match[1]);
        const billType = match[2].toLowerCase();
        const billNumber = Number(match[3]);
        if (!Number.isInteger(legislature) || !Number.isInteger(billNumber) || billNumber < 1) {
          return Response.json({ error: 'Invalid bill reference path' }, { status: 400 });
        }

        const canonicalPath = `/bills/texas/${legislature}/${billType}/${billNumber}/reference.json`;
        if (url.pathname.replace(/\/$/, '') !== canonicalPath) {
          return Response.redirect(new URL(canonicalPath, url.origin), 301);
        }

        const bill = await getBill(legislature, billType, billNumber);
        if (!bill) return Response.json({ error: 'Bill not found' }, { status: 404 });

        const { actions, documents } = await getBillRelations(bill.id);
        const payload = buildBillPrimarySourceReference(bill, actions, documents);

        return new Response(JSON.stringify(payload), {
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
            'x-robots-tag': 'noindex, follow',
            'link': `<${payload.canonicalUrl}>; rel="canonical"`,
          },
        });
      },
    },
  },
});
