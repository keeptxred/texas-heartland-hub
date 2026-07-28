import { useQuery } from "@tanstack/react-query";
import { electionAdminQueryDefaults, electionQueryKeys } from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";

export function useAdminElectionCandidates() {
  const { candidates } = useElectionRepositories();
  return useQuery({
    ...electionAdminQueryDefaults,
    queryKey: [...electionQueryKeys.candidates.lists(), "admin"],
    queryFn: async () => {
      const query = {
        pagination: { page: 1, pageSize: 100 },
        sort: [{ field: "updated_at", direction: "desc" }] as const,
      };
      const [summaries, records] = await Promise.all([
        candidates.list(query),
        candidates.listCore(query),
      ]);
      const recordById = new Map(records.items.map((record) => [record.id, record]));
      return summaries.items.map((summary) => ({
        summary,
        publicationStatus: recordById.get(summary.id)?.publicationStatus ?? "draft",
      }));
    },
  });
}
