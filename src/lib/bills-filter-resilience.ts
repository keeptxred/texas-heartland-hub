/** Keep core bill results available when the optional facet RPC times out. */
export type BillDirectoryFilters = {
  legislatures: Array<{ value: number; label: string }>;
  billTypes: string[];
  chambers: string[];
};

export async function loadOptionalBillFilterOptions<T extends BillDirectoryFilters>(
  loader: () => Promise<T>,
): Promise<T | BillDirectoryFilters> {
  try {
    return await loader();
  } catch (error) {
    console.error("[bills] optional filter options failed; preserving core bill results", error);
    return { legislatures: [], billTypes: [], chambers: [] };
  }
}
