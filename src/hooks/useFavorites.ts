'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
} from '@/lib/actions/favorites';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

import { Favorite } from '@/types';

export const useUserFavorites = () => {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: getUserFavorites,
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
