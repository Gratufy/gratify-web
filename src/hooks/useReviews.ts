import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/reactQuery/queryKeys';

import {
  createReview,
  updateReviewText,
  deleteReview,
  updateReviewStatus,
  getBusinessReviews,
} from '@/lib/actions/reviews';
import { BusinessReviewStatus, ScopeReview } from '@/types/enums';

export function useBusinessReviews(
  businessId: string,
  scope: ScopeReview,
  status?: BusinessReviewStatus
) {
  return useQuery({
    queryKey: queryKeys.businessReviews(businessId, scope, status),
    queryFn: () => getBusinessReviews(businessId, scope, status),
    staleTime: 1000 * 60 * 10, // 10 минут кеш
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (review, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessReviewsRoot(variables.businessId),
      });
      // delete?
      // queryClient.invalidateQueries({
      //   queryKey: ['businessReviews'],
      //   exact: false,
      // });
      // карточка бизнеса (reviewCount и т.п.)
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessById(variables.businessId),
        exact: true,
      });
      // все списки бизнесов (мог измениться счетчик/сортировка)
      // queryClient.invalidateQueries({
      //   queryKey: ['businesses'], // вместо queryKeys.businesses
      //   exact: false,
      // });

      // update admin list of admin
      queryClient.invalidateQueries({
        queryKey: ['adminBusinesses'],
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
        queryKey: ['businesses'], // вместо queryKeys.businesses
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
        queryKey: ['businesses'], // вместо queryKeys.businesses
        exact: false,
      });
      // 4. update admin list of businesses

      queryClient.invalidateQueries({
        queryKey: ['adminBusinesses'],
      });
    },
  });
}
// for Admin  Review Status Update
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReviewStatus,
    onSuccess: (review) => {
      // 1. update list reviews for this business
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessReviewsRoot(review.businessId),
      });
      // 2. update business (detailed card)
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessById(review.businessId),
        exact: true,
      });
      // 3. update general list of businesses
      queryClient.invalidateQueries({
        queryKey: ['businesses'], // instead of queryKeys.businesses
        exact: false,
      });

      // update admin list of admin
      queryClient.invalidateQueries({
        queryKey: ['adminBusinesses'],
      });
    },
  });
}
