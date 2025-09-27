'use client';
import React from 'react';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';

function FooterCategoryList() {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі категорії' },
    ...categories,
  ];
  return (
    <ul className="flex flex-col gap-2">
      {categoriesWithAll.map((category) => (
        <li key={category.categoryId}>
          <p className="placeholder-sm">{category.name}</p>
        </li>
      ))}
    </ul>
  );
}

export default FooterCategoryList;
