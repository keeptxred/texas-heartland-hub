import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { getBillRelations, SITE_URL } from '@/lib/bills';
import { buildBillPrimarySourceReference } from '@/lib/bill-primary-source-reference';
import { normalizePublicBillSessionCode, publicBillPath, publicBillReferencePath } from '@/lib/bill-public-path';

const db = supabase as any;
const BILL_REFERENCE_PATH = /^\/bills\/texas\/(\d+)\/([a-zA-Z0-9]+)\/([a-zA-Z]+)\/(\d+)\/reference\.json\/?$/;

export const Route = createFileRoute('/bills/texas/$legislature/$session/$billType/$billNumber/reference.json')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const match = BILL_REFERENCE_PATH.exec(url.pathname);
        if (!match) return Response.json({ error: 'Invalid bill reference path' }, { status: 400 });

        const legislature = Number(match[1]);
        const sessionCode = normalizePublicBillSessionCode(match[2]);
        const billType = match[3].toLowerCase();
        const billNumber = Number(match[4]);
        if (!Number.isInteger(legislature) || !Number.isInteger(billNumber) || billNumber < 1) {
          return Response.json({ error: 'Invalid bill reference path' }, { status: 400 });
        }
        if (sessionCode === 'R') {
          return Response.redirect(new URL(`/bills/texas/${legislature}/${billType}/${billNumber}/reference.json`, url.origin), 301);
        }

        const identity = { legislature_number: legislature, session_code: sessionCode, bill_type: billType, bill_number: billNumber };
        const canonicalReferencePath = publicBillReferencePath(identity);
        if (url.pathname.replace(/\/$/, '') !== canonicalReferencePath) {
          return Response.redirect(new URL(canonicalReferencePath, url.origin), 301);
        }

        const { data: bill, error } = await db
          .from('bills')
          .select('*')
          .eq('legislature_number', legislature)
          .eq('session_code', sessionCode)
          .eq('bill_type', billType)
          .eq('bill_number', billNumber)
          .eq('is_active', true)
          .maybeSingle();
        if (error) throw error;
        if (!bill) return Response.json({ error: 'Bill not found' }, { status: 404 });

        const { actions, documents } = await getBillRelations(bill.id);
        const payload = buildBillPrimarySourceReference(bill, actions, documents);
        payload.canonicalUrl = `${SITE_URL}${publicBillPath(bill)}`;

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
