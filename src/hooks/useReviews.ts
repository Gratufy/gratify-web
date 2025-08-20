import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/reactQuery/queryKeys";

import {
  createReview,
  updateReviewText,
  deleteReview,
  updateReviewStatus,
  getBusinessReviews,
} from "@/lib/actions/reviews";
import { BusinessReviewStatus, ScopeReview } from "@/types";

export function useBusinessReviews(
  businessId: string,
  scope: ScopeReview,
  status?: BusinessReviewStatus
) {
  return useQuery({
    queryKey: queryKeys.businessReviews(businessId, scope, status),
    queryFn: () => getBusinessReviews(businessId, scope, status),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessReviewsRoot(variables.businessId),
      });
      // карточка бизнеса (reviewCount и т.п.)
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessById(variables.businessId),
        exact: true,
      });
      // все списки бизнесов (мог измениться счетчик/сортировка)
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        exact: false,
      });

      // админ-агрегаты по статусам
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminBusinessesByReviewStatusRoot,
        exact: false,
      });
    },
  });
}
//text
export function useUpdateReview(businessId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReviewText,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessReviewsRoot(businessId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessById(businessId),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        exact: false,
      });
    },
  });
}
//delete
export function useDeleteReview(businessId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      // 1. update list reviews for this business
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessReviewsRoot(businessId),
      });
      // 2. update business (detailed card)
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessById(businessId),
        exact: true,
      });
      // 3. update general list of businesses
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        exact: false,
      });
      // 4. update admin list of businesses
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminBusinessesByReviewStatusRoot,
        exact: false,
      });
    },
  });
}
// for Admin
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReviewStatus,
    onSuccess: (review) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessReviewsRoot(review.businessId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.adminBusinessesByReviewStatusRoot,
      });
    },
  });
}
