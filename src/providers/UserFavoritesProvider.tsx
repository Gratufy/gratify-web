'use client';
// src/components/UserFavoritesProvider.tsx
import { createContext, useContext } from 'react';
import { useUserFavorites } from '@/hooks/useFavorites';

const FavoritesContext = createContext<Set<string> | null>(null);

export function UserFavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: favorites, isLoading } = useUserFavorites();

  if (isLoading) return null; // или skeleton
  const favoritesSet = new Set(favorites?.map((f) => f.businessId));

  return (
    <FavoritesContext.Provider value={favoritesSet}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);

//const favorites = useFavorites(); // Set<string>
//const isFavorite = favorites.has(business.id);
