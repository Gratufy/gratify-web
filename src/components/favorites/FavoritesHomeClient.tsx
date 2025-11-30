'use client';
import React, { useState, useMemo } from 'react';

import { UserFavoritesProvider } from '@/providers/UserFavoritesProvider';
import { useUserFavoriteBusinesses } from '@/hooks/useFavorites';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';

import FavoritesSectionDesktop from './FavoritesSectionDesktop';

import FavoritesSectionMobile from './FavoritesSectionMobile';
import { useUserStore } from '@/stores/useUserStore';
// import NotFoundComponent from '../shared/NotFoundComponent';
import { useFavoritesSearchStore } from '@/stores/FavoritesSearchStore';

import NotFoundComponent from '../shared/NotFoundComponent';

function FavoritesHomeClient() {
  const search = useFavoritesSearchStore((s) => s.search);
  const profile = useUserStore((s) => s.profile);
  
  const isProfileLoaded = profile !== null && profile !== undefined;
  
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();

  const [categoryId, setCategoryId] = useState<string>('__all__');
  const [categoryName, setCategoryName] = useState<string>('Всі категорії');

  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі категорії' },
    ...categories,
  ];

  const {
    data: businesses,
    isLoading,
    isError,
    error,
  } = useUserFavoriteBusinesses(categoryId ?? '__all__', !!profile); // only fetch if profile exists

  const filtered = useMemo(() => {
    if (!businesses) return [];

    return businesses.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [businesses, search]);

  return (
    <UserFavoritesProvider>
      {!isLoading && isProfileLoaded && !profile && (
        <p>Будь ласка, увійдіть, щоб побачити ваші улюблені бізнеси.</p>
      )}
      {!isLoading && profile && filtered.length === 0 && (
        <NotFoundComponent IfFavorites />
      )}
      <FavoritesSectionMobile
        businesses={filtered}
        isLoading={isLoading}
        isError={isError}
        error={error}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoriesWithAll={categoriesWithAll}
      />
      <FavoritesSectionDesktop
        businesses={filtered}
        isLoading={isLoading}
        isError={isError}
        error={error}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        // categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoriesWithAll={categoriesWithAll}
      />
    </UserFavoritesProvider>
  );
}

export default FavoritesHomeClient;
