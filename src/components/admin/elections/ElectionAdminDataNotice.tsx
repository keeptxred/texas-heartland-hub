import { ElectionEmptyState } from "@/components/elections";

export function ElectionAdminDataNotice({
  isEmpty,
  hasStaleData,
}: {
  isEmpty: boolean;
  hasStaleData: boolean;
}) {
  if (isEmpty) {
    return (
      <ElectionEmptyState
        kind="admin"
        title="No repository records"
        message="The active repository returned no records for this admin list."
      />
    );
  }
  if (hasStaleData) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Stale repository data:</strong> One or more records are outside their freshness
        window. Verify the source before relying on them.
      </div>
    );
  }
  return null;
}
