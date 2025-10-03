'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
  getUserFavoriteBusinesses,
} from '@/lib/actions/favorites';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

// import { Favorite } from '@/types';

export const useUserFavorites = () => {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: getUserFavorites,
  });
};

export const useUserFavoriteBusinesses = (
  categoryId = '__all__',
  enabled = true
) => {
  return useQuery({
    queryKey: [...queryKeys.favoriteBusinesses, categoryId],
    queryFn: () => getUserFavoriteBusinesses(categoryId),
    enabled, // only fetch if profile exists
  });
};
// --- Hook for adding favorite ---
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUserFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.favoriteBusinesses,
      });
    },
  });
};

// --- Delete favorite ---
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeUserFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.favoriteBusinesses,
      });
    },
  });
};
