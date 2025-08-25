"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import {
  //   getAllBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinesses,
  getBusinessesWithReviewStatus,
} from "@/lib/actions/businesses";
import {
  BusinessReviewStatus,
  BusinessUpdate,
  GetBusinessesParams,
  Scope,
} from "@/types";

export type UseBusinessesParams = GetBusinessesParams;
// all businesses

export function useBusinesses({
  city,
  categoryId,
  sortBy,
  scope,
  showOnlineStatus,
}: UseBusinessesParams = {}) {
  const filters = {
    city: city ?? "__all__",
    categoryId: categoryId ?? "__all__",
    sortBy: sortBy ?? "newest",
    scope: scope ?? "public",
    showOnlineStatus: showOnlineStatus ?? "all",
  };
  return useQuery({
    queryKey: queryKeys.businessList(filters),
    queryFn: () => getBusinesses(filters),
    staleTime: 1000 * 60 * 5, // кеш 5 минут
  });
}

// one business
export function useBusiness(id: string) {
  return useQuery({
    queryKey: queryKeys.businessById(id),
    queryFn: () => getBusinessById(id),
    staleTime: 1000 * 60 * 5, // 5 минут кеш
    enabled: !!id,
  });
}

// create
export function useCreateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBusiness,
    onSuccess: () => {
      // update all business lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        exact: false,
      });
    },
  });
}

// update
export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: BusinessUpdate }) =>
      updateBusiness(id, values),
    onSuccess: (_data, variables) => {
      // one business
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessById(variables.id),
        exact: true,
      });
      // all lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        exact: false,
      });
    },
  });
}

// delete
export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBusiness,
    onSuccess: (_data, id) => {
      // one business
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessById(id),
        exact: true,
      });
      // all lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        exact: false,
      });
    },
  });
}
//get businesses by review status
export function useAdminBusinessesByReviewStatus(
  status: BusinessReviewStatus,
  categoryId?: string | null
) {
  return useQuery({
    queryKey: ["adminBusinessesByReviewStatus", { status, categoryId }],
    queryFn: () =>
      getBusinessesWithReviewStatus(status, categoryId ?? undefined),
    staleTime: 1000 * 60 * 5,
  });
}
