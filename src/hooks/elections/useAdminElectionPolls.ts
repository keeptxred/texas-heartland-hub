import { useQuery } from "@tanstack/react-query";
import { electionAdminQueryDefaults, electionQueryKeys } from "@/lib/elections/queries";
import { useElectionRepositories } from "@/lib/elections/repositories";

export function useAdminElectionPolls() {
  const { polls } = useElectionRepositories();
  return useQuery({
    ...electionAdminQueryDefaults,
    queryKey: [...electionQueryKeys.polls.lists(), "admin"],
    queryFn: () =>
      polls.list({
        pagination: { page: 1, pageSize: 100 },
        sort: [{ field: "field_end_date", direction: "desc" }],
      }),
  });
}
