import React from 'react';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { getAllBusinessCategories } from '@/lib/actions/businessCategories';

async function FooterCategoryList() {
  // const {
  //   categories,
  //   // isLoading: isCategoriesLoading,
  //   // isError: isCategoriesError,
  // } = useBusinessCategories();
  // const categoriesWithAll = [
  //   { categoryId: '__all__', name: 'Всі категорії' },
  //   ...categories,
  // ];
  const categories = await getAllBusinessCategories();
  return (
    <ul className="flex flex-col gap-2">
      {categories.map((category) => (
        <li key={category.categoryId}>
          <p className="lg:placeholder-xs xl:placeholder-sm">{category.name}</p>
        </li>
      ))}
    </ul>
  );
}

export default FooterCategoryList;
