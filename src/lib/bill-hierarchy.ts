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

type DirectorySummaryRow = {
  bill_type: string;
  chamber: Bill['chamber'];
  bill_count: number | string;
  last_action_date?: string | null;
};

function validLegislature(value: number) {
  return Number.isInteger(value) && value > 0 && value < 200;
}

async function getLegislatureDirectorySummary(legislature: number): Promise<DirectorySummaryRow[]> {
  const { data, error } = await db.rpc('get_legislature_bill_directory_summary', {
    p_legislature: legislature,
  });
  if (error) throw error;
  return (data ?? []) as DirectorySummaryRow[];
}

export async function getLegislatureBillDirectory(legislature: number): Promise<LegislatureBillDirectory | null> {
  if (!validLegislature(legislature)) return null;

  const [rows, recent] = await Promise.all([
    getLegislatureDirectorySummary(legislature),
    listBills({ legislature, limit: 24, offset: 0 }),
  ]);
  if (rows.length === 0) return null;

  const grouped = new Map<string, BillTypeSummary>();
  let totalCount = 0;
  let lastActionDate: string | null = null;
  for (const row of rows) {
    const billType = normalizeBillType(row.bill_type);
    if (!billType) continue;
    const count = Number(row.bill_count);
    if (!Number.isFinite(count) || count < 0) continue;
    totalCount += count;
    grouped.set(billType, {
      billType,
      chamber: row.chamber,
      count,
      lastActionDate: row.last_action_date ?? null,
    });
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
    totalCount,
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
