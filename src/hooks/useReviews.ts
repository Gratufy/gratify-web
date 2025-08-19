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
  scope: ScopeReview = "public",
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
        queryKey: queryKeys.businessReviews(variables.businessId),
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.businesses, variables.businessId],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses });
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
        queryKey: queryKeys.businessReviews(businessId),
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.businesses, businessId],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses });
    },
  });
}
//delete
export function useDeleteReview(businessId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessReviews(businessId),
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.businesses, businessId],
        exact: true,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses });
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
        queryKey: ["businessReviews", review.businessId],
        exact: false, // инвалидируются все запросы, начинающиеся с ["businessReviews", review.businessId]
      });
      queryClient.invalidateQueries({
        queryKey: ["adminBusinessesByReviewStatus"],
        exact: false,
      });
    },
  });
}
