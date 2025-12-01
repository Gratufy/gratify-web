'use client';
// src/components/UserFavoritesProvider.tsx
import { createContext, useContext, useMemo } from 'react';
import { useUserFavorites } from '@/hooks/useFavorites';
import { useUserStore } from '@/stores/useUserStore';

const FavoritesContext = createContext<Set<string>>(new Set());

export function UserFavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((s) => s.profile);
  const userId = user?.userId ?? null;
  const { data: favorites } = useUserFavorites(userId);

  const favoritesSet = useMemo(
    () => new Set(favorites?.map((f) => f.businessId) ?? []),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={favoritesSet}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);

//const favorites = useFavorites(); // Set<string>
//const isFavorite = favorites.has(business.id);
