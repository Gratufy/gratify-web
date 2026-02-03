'use client';
import React from 'react';

import { useInfiniteBusinesses } from '@/hooks/useBusinesses';
import { useFilters } from '@/hooks/useFilters';

import { useBusinessCategories } from '@/hooks/useBusinessCategories';

import HomeSectionMobile from './HomeSectionMobile';
import HomeSectionDesktop from './HomeSectionDesktop';
import { getCategoriesWithAll } from '@/utils/categoriesWithAll';

function PublicHomeClient() {
  const { filters } = useFilters();
  //const user = useUserStore((s) => s.profile);
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  //DELETE

  const categoriesWithAll = getCategoriesWithAll(categories);
  ////DELETE above
  console.log('in client', filters.search);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteBusinesses({
    city: filters.city,
    categoryId: filters.category,
    showOnlineStatus: filters.mode,
    sortBy: filters.sort,
    scope: 'public',
    search: filters.search,
  });

  const businesses = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    // <UserFavoritesProvider>
    <>
      {/* <div className="flex w-full flex-col gap-6 pt-2 lg:flex-row"> */}
      <HomeSectionMobile
        businesses={businesses}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        isError={isError}
        error={error}
        categoriesWithAll={categoriesWithAll}
      />
      <HomeSectionDesktop
        businesses={businesses}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        isError={isError}
        error={error}
        categoriesWithAll={categoriesWithAll}
      />
    </>

    // </UserFavoritesProvider>
  );
}

export default PublicHomeClient;
