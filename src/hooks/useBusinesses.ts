"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import type { InfiniteData } from "@tanstack/react-query";

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
  BusinessesResponse,
  BusinessReviewStatus,
  BusinessUpdate,
  BusinessWithCategoryName,
  GetBusinessesParams,
  Scope,
} from "@/types";
import { PAGE_SIZE } from "@/const/business";

export type UseBusinessesParams = GetBusinessesParams;
// all businesses
//simple
export function useBusinesses(params: GetBusinessesParams = {}) {
  return useQuery({
    queryKey: queryKeys.businessList(params),
    queryFn: () => getBusinesses(params),
    staleTime: 1000 * 60 * 5,
  });
}

//infinity
export function useInfiniteBusinesses(
  params: Omit<GetBusinessesParams, "limit" | "offset">
) {
  return useInfiniteQuery({
    //queryKey: queryKeys.businessList(params),
    queryKey: ["businesses", params],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getBusinesses({
        ...params,
        offset: pageParam,
        limit: PAGE_SIZE,
      });
      return {
        data: result.data ?? [],
        nextOffset: result.nextOffset,
      };
    },
    //getNextPageParam: (lastPage) => lastPage.nextOffset,
    getNextPageParam: (lastPage) => {
      console.log("lastPage in getNextPageParam:", lastPage);
      return lastPage?.nextOffset ?? undefined;
    },
    staleTime: 1000 * 60 * 10, // 10 минут кеш
    initialPageParam: 0,
  });
}

// one business
export function useBusiness(id: string) {
  return useQuery({
    queryKey: queryKeys.businessById(id),
    queryFn: () => getBusinessById(id),
    staleTime: 1000 * 60 * 10, // 10 минут кеш
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
        queryKey: ["businesses"],
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
        queryKey: ["businesses"],
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
        queryKey: ["businesses"],
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
