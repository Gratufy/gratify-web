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

export const useUserFavoriteBusinesses = (categoryId = '__all__') => {
  return useQuery({
    queryKey: [...queryKeys.favoriteBusinesses, categoryId],
    queryFn: () => getUserFavoriteBusinesses(categoryId),
  });
};
// --- Хук для добавления фаворита ---
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUserFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites,
      });
    },
  });
};

// --- Хук для удаления фаворита ---
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeUserFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favorites'],
      });
    },
  });
};
