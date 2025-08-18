import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserVote, voteBusiness } from "@/lib/actions/vote";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useUserStore } from "@/stores/useUserStore";

export function useVoteBusiness(businessId: string) {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.profile);

  return useMutation({
    mutationFn: (vote: 1 | -1) => voteBusiness(businessId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userVote(businessId, user?.userId),
      });
      // refresh the specific business
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.businesses, businessId],
        exact: true,
      });

      // refresh all business lists (different filters, scope)
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        //exact: false,
      });
    },
  });
}

export function useUserVote(businessId: string) {
  const user = useUserStore((state) => state.profile);
  return useQuery({
    queryKey: queryKeys.userVote(businessId, user?.userId),
    queryFn: () => (user ? getUserVote(businessId) : null),
    enabled: !!user, //if there is no user we do not make the request
    staleTime: 1000 * 60, // 1 min
  });
}
