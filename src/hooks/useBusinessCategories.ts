import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import {
  getAllBusinessCategories,
  addBusinessCategory,
  renameBusinessCategory,
  deleteBusinessCategory,
} from "@/lib/actions/businessCategories";
import { BusinessCategory, NewBusinessCategory } from "@/types";

export function useBusinessCategories() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<BusinessCategory[]>({
    queryKey: queryKeys.businessCategories,
    queryFn: getAllBusinessCategories,
    staleTime: 1000 * 60 * 5, // 5 минут кеш
  });

  const addMutation = useMutation({
    mutationFn: (payload: NewBusinessCategory) => addBusinessCategory(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessCategories,
      }),
  });

  const renameMutation = useMutation({
    mutationFn: renameBusinessCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessCategories,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessCategories,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.businesses,
        exact: false,
      });
    },
  });

  return {
    categories: data ?? [],
    isLoading,
    isError,
    // addCategory: addMutation.mutate,
    addCategory: addMutation.mutateAsync,
    renameCategory: renameMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: renameMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error,
  };
}
