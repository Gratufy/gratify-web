import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserVote, voteBusiness } from '@/lib/actions/vote';
import { queryKeys } from '@/lib/reactQuery/queryKeys';
import { useUserStore } from '@/stores/useUserStore';

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
        queryKey: queryKeys.businessById(businessId),
        exact: true,
      });
      //refresh all business lists (different filters, scope)
      queryClient.invalidateQueries({
        queryKey: ['businesses'], // вместо queryKeys.businesses
        exact: false,
      });
    },
    // onMutate: async (vote) => {
    //   await queryClient.cancelQueries({
    //     queryKey: queryKeys.businessById(businessId),
    //   });

    //   const prevData = queryClient.getQueryData<
    //     BusinessWithDetails & { userVote?: 1 | -1 | 0 }
    //   >(queryKeys.businessById(businessId));

    //   if (prevData) {
    //     const userPrevVote = prevData.userVote ?? 0;
    //     const newVote = userPrevVote === vote ? 0 : vote;
    //     const delta = newVote - userPrevVote;

    //     queryClient.setQueryData(queryKeys.businessById(businessId), {
    //       ...prevData,
    //       karma: prevData.karma + delta,
    //       userVote: newVote,
    //     });
    //   }

    //   return { prevData };
    // },
    // onError: (err, vote, context) => {
    //   if (context?.prevData) {
    //     queryClient.setQueryData(
    //       queryKeys.businessById(businessId),
    //       context.prevData
    //     );
    //   }
    // },
    // onSettled: () => {
    //   if (user?.userId) {
    //     queryClient.invalidateQueries({
    //       queryKey: queryKeys.userVote(businessId, user.userId),
    //     });
    //   }
    //   queryClient.invalidateQueries({
    //     queryKey: queryKeys.businessById(businessId),
    //     exact: true,
    //   });
    //   queryClient.invalidateQueries({ queryKey: ['businesses'], exact: false });
    // },
  });
}

export function useUserVote(businessId: string) {
  const user = useUserStore((state) => state.profile);
  return useQuery({
    queryKey: queryKeys.userVote(businessId, user?.userId),
    queryFn: () => (user ? getUserVote(businessId) : null),
    enabled: !!user, //if there is no user we do not make the request
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
