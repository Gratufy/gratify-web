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
import { BusinessReviewStatus, BusinessUpdate, Scope } from "@/types";

interface UseBusinessesParams {
  city?: string;
  categoryId?: string;
  sortBy?: "newest" | "mostKarma";
}
// all businesses

export function useBusinesses({
  city,
  categoryId,
  sortBy,
  scope,
}: UseBusinessesParams & { scope?: Scope } = {}) {
  const cityValue = city ?? "__all__";
  const categoryValue = categoryId ?? "__all__";
  const sortValue = sortBy ?? "newest";
  const scopeValue = scope ?? "public";
  return useQuery({
    queryKey: [
      "businesses",
      {
        city: cityValue,
        categoryId: categoryValue,
        sortBy: sortValue,
        scope: scopeValue,
      },
    ],
    queryFn: () =>
      getBusinesses({
        city: cityValue,
        categoryId: categoryValue,
        sortBy: sortValue,
        scope: scopeValue,
      }),
    staleTime: 1000 * 60 * 5, // кеш 5 минут
  });
}

// one business
export function useBusiness(id: string) {
  return useQuery({
    queryKey: [...queryKeys.businesses, id],
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
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses });
    },
  });
}

// update
export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: BusinessUpdate }) =>
      updateBusiness(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses });
    },
  });
}

// delete
export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses });
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
