'use client';
import React, { useState } from 'react';

import { UserFavoritesProvider } from '@/providers/UserFavoritesProvider';
import { useInfiniteBusinesses } from '@/hooks/useBusinesses';

import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { OnlineFilter, SortBy } from '@/types';

//import DeleteAccountButton from '@/components/ui/DeleteAccountButton';

import HomeSectionMobile from './HomeSectionMobile';
import HomeSectionDesktop from './HomeSectionDesktop';

function PublicHomeClient() {
  //const user = useUserStore((s) => s.profile);
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();

  const [city, setCity] = useState<string>('__all__');
  const [cityName, setCityName] = useState<string>('Всі міста');
  const [categoryId, setCategoryId] = useState<string>('__all__');
  const [categoryName, setCategoryName] = useState<string>('Всі категорії');
  const [showOnlineStatus, setShowOnlineStatus] = useState<OnlineFilter>('all');

  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі категорії' },
    ...categories,
  ];
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteBusinesses({
    city,
    categoryId,
    showOnlineStatus,
    sortBy,
    scope: 'public',
  });
  const businesses = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <UserFavoritesProvider>
      {/* <div className="flex w-full flex-col gap-6 pt-2 lg:flex-row"> */}
      <HomeSectionMobile
        businesses={businesses}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        isError={isError}
        error={error}
        city={city}
        setCity={setCity}
        cityName={cityName}
        setCityName={setCityName}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
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
        city={city}
        setCity={setCity}
        cityName={cityName}
        setCityName={setCityName}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        categoriesWithAll={categoriesWithAll}
      />
    </UserFavoritesProvider>
  );
}

export default PublicHomeClient;
