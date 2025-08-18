import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/reactQuery/queryKeys";

import {
  createReview,
  updateReviewText,
  deleteReview,
  updateReviewStatus,
  getBusinessReviews,
} from "@/lib/actions/reviews";

export function useBusinessReviews(businessId: string) {
  return useQuery({
    queryKey: queryKeys.businessReviews(businessId),
    queryFn: () => getBusinessReviews(businessId),
  });
}

export function useCreateReview(businessId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
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

export function useUpdateReviewStatus(businessId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReviewStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessReviews(businessId),
      });
    },
  });
}
