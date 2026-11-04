import { createFileRoute } from '@tanstack/react-router';
import type {} from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { getBillEditorialEnrichment } from '@/lib/bills';
import { getBillEffectiveDateProvisions } from '@/lib/bill-effective-date-provisions';
import { getRelatedBills } from '@/lib/related-bills';
import { getPublicBillRelations } from '@/lib/public-bill-relations';
import { parseBillSearchKey } from '@/lib/bill-public-path';

const db = supabase as any;
const NOINDEX = { 'X-Robots-Tag': 'noindex, follow', 'X-Content-Type-Options': 'nosniff' };

/** Only returns data for an explicitly selected bill. Never emits an HTML document. */
export const Route = createFileRoute('/api/public/bill-detail')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = new URL(request.url).searchParams.get('bill') ?? '';
        const identity = parseBillSearchKey(key);
        if (!identity) return Response.json({ error: 'Invalid bill identity.' }, { status: 400, headers: NOINDEX });
        try {
          const { data: bill, error } = await db.from('bills').select('*')
            .eq('legislature_number', identity.legislature_number)
            .eq('session_code', identity.session_code)
            .eq('bill_type', identity.bill_type)
            .eq('bill_number', identity.bill_number)
            .eq('is_active', true)
            .maybeSingle();
          if (error) throw error;
          if (!bill) return Response.json({ error: 'Bill not found.' }, { status: 404, headers: NOINDEX });
          const [relations, editorial, effectiveDates] = await Promise.all([
            getPublicBillRelations(bill.id),
            getBillEditorialEnrichment(bill.id),
            getBillEffectiveDateProvisions(bill.id),
          ]);
          const relatedBills = await getRelatedBills(bill.id, bill.legislature_number, 8, {
            subjectIds: (relations.subjects ?? []).map((subject: any) => subject.id).filter(Boolean),
          }).catch((relatedError) => {
            console.error('[bill-detail] related bills unavailable', relatedError);
            return [];
          });
          return Response.json({ bill, relations, editorial, effectiveDates, relatedBills }, {
            headers: { ...NOINDEX, 'Cache-Control': 'public, max-age=60, s-maxage=120' },
          });
        } catch (error) {
          console.error('[bill-detail] failed', error);
          return Response.json({ error: 'The official bill record is temporarily unavailable.' }, {
            status: 503, headers: { ...NOINDEX, 'Cache-Control': 'no-store' },
          });
        }
      },
    },
  },
});
