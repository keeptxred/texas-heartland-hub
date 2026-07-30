import { useQuery } from "@tanstack/react-query";
import { electionAdminQueryDefaults, electionQueryKeys } from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";
export function useAdminElectionResults() {
  const { results } = useElectionRepositories();
  return useQuery({
    ...electionAdminQueryDefaults,
    queryKey: [...electionQueryKeys.results.lists(), "admin"],
    queryFn: () =>
      results.list({
        pagination: { page: 1, pageSize: 100 },
        sort: [{ field: "updated_at", direction: "desc" }],
      }),
  });
}
