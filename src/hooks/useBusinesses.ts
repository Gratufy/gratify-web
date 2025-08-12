"use client";
import { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import {
  getAllBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "@/lib/actions/businesses";
import { BusinessUpdate } from "@/types";

// all businesses
export function useBusinesses() {
  return useQuery({
    queryKey: queryKeys.businesses,
    queryFn: getAllBusinesses,
    staleTime: 1000 * 60 * 5, // 5 минут кеш
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
