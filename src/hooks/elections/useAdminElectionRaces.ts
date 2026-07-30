import { useQuery } from "@tanstack/react-query";
import { electionAdminQueryDefaults, electionQueryKeys } from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";

export function useAdminElectionRaces() {
  const { races } = useElectionRepositories();
  return useQuery({
    ...electionAdminQueryDefaults,
    queryKey: [...electionQueryKeys.races.lists(), "admin"],
    queryFn: () =>
      races.listCore({
        pagination: { page: 1, pageSize: 100 },
        sort: [{ field: "updated_at", direction: "desc" }],
      }),
  });
}
