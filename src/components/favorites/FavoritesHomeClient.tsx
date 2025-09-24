'use client';
import React, { useState } from 'react';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import FavoritesSectionDesktop from './FavoritesSectionDesktop';

function FavoritesHomeClient() {
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
  return (
    <>
      <FavoritesSectionDesktop
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoriesWithAll={categoriesWithAll}
      />
    </>
  );
}

export default FavoritesHomeClient;
