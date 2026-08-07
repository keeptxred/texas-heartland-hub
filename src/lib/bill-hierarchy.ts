import { supabase } from '@/integrations/supabase/client';
import { listBills, normalizeBillType, type Bill } from '@/lib/bills';

const db = supabase as any;

export type BillTypeSummary = {
  billType: string;
  chamber: Bill['chamber'];
  count: number;
  lastActionDate: string | null;
};

export type LegislatureBillDirectory = {
  legislature: number;
  totalCount: number;
  billTypes: BillTypeSummary[];
  recentBills: Bill[];
  lastActionDate: string | null;
};

function validLegislature(value: number) {
  return Number.isInteger(value) && value > 0 && value < 200;
}

export async function getLegislatureBillDirectory(legislature: number): Promise<LegislatureBillDirectory | null> {
  if (!validLegislature(legislature)) return null;

  const [{ data, error }, recent] = await Promise.all([
    db
      .from('bills')
      .select('bill_type,chamber,last_action_date')
      .eq('is_active', true)
      .eq('legislature_number', legislature)
      .order('last_action_date', { ascending: false, nullsFirst: false })
      .limit(50000),
    listBills({ legislature, limit: 24, offset: 0 }),
  ]);

  if (error) throw error;
  const rows = (data ?? []) as Array<{ bill_type: string; chamber: Bill['chamber']; last_action_date?: string | null }>;
  if (rows.length === 0) return null;

  const grouped = new Map<string, BillTypeSummary>();
  let lastActionDate: string | null = null;
  for (const row of rows) {
    const billType = normalizeBillType(row.bill_type);
    if (!billType) continue;
    const existing = grouped.get(billType);
    if (existing) {
      existing.count += 1;
      if (row.last_action_date && (!existing.lastActionDate || row.last_action_date > existing.lastActionDate)) {
        existing.lastActionDate = row.last_action_date;
      }
    } else {
      grouped.set(billType, {
        billType,
        chamber: row.chamber,
        count: 1,
        lastActionDate: row.last_action_date ?? null,
      });
    }
    if (row.last_action_date && (!lastActionDate || row.last_action_date > lastActionDate)) {
      lastActionDate = row.last_action_date;
    }
  }

  const billTypes = [...grouped.values()].sort((a, b) => {
    const chamberRank = { house: 0, senate: 1, joint: 2 } as const;
    return chamberRank[a.chamber] - chamberRank[b.chamber] || a.billType.localeCompare(b.billType);
  });

  return {
    legislature,
    totalCount: rows.length,
    billTypes,
    recentBills: recent.bills,
    lastActionDate,
  };
}

export async function getBillTypePage(legislature: number, billTypeRaw: string, page = 1) {
  if (!validLegislature(legislature)) return null;
  const billType = normalizeBillType(billTypeRaw);
  if (!/^[a-z]{1,8}$/.test(billType)) return null;
  const safePage = Math.max(1, Math.floor(page));
  const limit = 48;
  const result = await listBills({
    legislature,
    billType,
    limit,
    offset: (safePage - 1) * limit,
  });
  if (result.count === 0) return null;
  return {
    ...result,
    legislature,
    billType,
    page: safePage,
    pages: Math.max(1, Math.ceil(result.count / limit)),
  };
}
