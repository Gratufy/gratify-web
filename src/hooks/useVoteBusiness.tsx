import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserVote, voteBusiness } from "@/lib/actions/vote";
import { queryKeys } from "@/lib/reactQuery/queryKeys";

export function useVoteBusiness(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vote: 1 | -1) => voteBusiness(businessId, vote),
    onSuccess: () => {
      // refresh the specific business
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.businesses, businessId],
        exact: true,
      });

      // refresh all business lists (different filters, scope)
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        exact: false,
      });
    },
  });
}

export function useUserVote(businessId: string) {
  return useQuery({
    queryKey: queryKeys.userVote(businessId),
    queryFn: () => getUserVote(businessId),
    staleTime: 1000 * 60, // 1 min
  });
}
