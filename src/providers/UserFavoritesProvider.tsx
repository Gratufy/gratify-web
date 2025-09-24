'use client';
// src/components/UserFavoritesProvider.tsx
import { createContext, useContext, useMemo } from 'react';
import { useUserFavorites } from '@/hooks/useFavorites';

const FavoritesContext = createContext<Set<string>>(new Set());

export function UserFavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: favorites, isLoading } = useUserFavorites();

  // or
  // if (isLoading) {
  //   return <div>Загрузка...</div>; // но не `return null;`
  // }
  const favoritesSet = useMemo(
    () => new Set(favorites?.map((f) => f.businessId) ?? []),
    [favorites]
  );
  console.log('FavoritesProvider set', favoritesSet);

  return (
    <FavoritesContext.Provider value={favoritesSet}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);

//const favorites = useFavorites(); // Set<string>
//const isFavorite = favorites.has(business.id);
