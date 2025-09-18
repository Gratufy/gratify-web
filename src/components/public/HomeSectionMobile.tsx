'use client';
import React from 'react';
import BusinessList from '../shared/BusinessList';
import BottomSheetFilters from './BottomSheetFilters';
import { OnlineFilter, Scope, SortBy } from '@/types';

import { useInfiniteBusinesses } from '@/hooks/useBusinesses';
import SelectedFiltersPanel from '../shared/SelectedFiltersPanel';

type HomeSectionMobileProps = {
  city: string | undefined;
  setCity: (city: string) => void;
  cityName: string;
  setCityName: (label: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  categoryName: string;
  setCategoryName: (name: string) => void;
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
  cityName,
  setCityName,
  categoryId,
  setCategoryId,
  categoryName,
  setCategoryName,
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
      <div className="px-2 pb-2">
        <SelectedFiltersPanel
          setCity={setCity}
          setCityName={setCityName}
          showOnlineStatus={showOnlineStatus}
          setShowOnlineStatus={setShowOnlineStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setCategoryId={setCategoryId}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
        />
      </div>
      <div className="flex flex-1 flex-col pb-20 pt-3">
        <BusinessList
          businesses={businesses}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>

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
