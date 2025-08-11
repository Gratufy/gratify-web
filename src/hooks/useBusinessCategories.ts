import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import {
  getAllBusinessCategories,
  addBusinessCategory,
  renameBusinessCategory,
  deleteBusinessCategory,
} from "@/lib/actions/businessCategories";

export function useBusinessCategories() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.businessCategories,
    queryFn: getAllBusinessCategories,
    staleTime: 1000 * 60 * 5, // 5 минут кэш
  });

  const addMutation = useMutation({
    mutationFn: addBusinessCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessCategories,
      }),
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renameBusinessCategory(id, name),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessCategories,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessCategories,
      }),
  });

  return {
    categories: data ?? [],
    isLoading,
    isError,
    // addCategory: addMutation.mutate,
    addCategory: addMutation.mutateAsync,
    renameCategory: renameMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdating: renameMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error,
  };
}
