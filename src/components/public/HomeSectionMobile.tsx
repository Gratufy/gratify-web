'use client';
import React from 'react';
import BusinessList from '../shared/BusinessList';
import BottomSheetFilters from './BottomSheetFilters';
import { OnlineFilter, Scope, SortBy } from '@/types';

import { useInfiniteBusinesses } from '@/hooks/useBusinesses';

type HomeSectionMobileProps = {
  city: string | undefined;
  setCity: (city: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  categoriesWithAll: { categoryId: string; name: string }[];
  scope: Scope;
};

function HomeSectionMobile({
  city,
  setCity,
  categoryId,
  setCategoryId,
  sortBy,
  setSortBy,
  showOnlineStatus,
  setShowOnlineStatus,
  categoriesWithAll,
  scope = 'public',
}: HomeSectionMobileProps) {
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
    scope,
  });
  const businesses = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <div className="container flex w-full flex-col pt-2 lg:hidden">
      <BusinessList
        businesses={businesses}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        isError={isError}
        error={error}
        // city={city}
        // categoryId={categoryId}
        // showOnlineStatus={showOnlineStatus}
        // sortBy={sortBy}
        // scope={scope}
      />
      <BottomSheetFilters
        city={city}
        setCity={setCity}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        categoriesWithAll={categoriesWithAll}
      />
    </div>
  );
}

export default HomeSectionMobile;
