'use client';
import React from 'react';

import { BusinessWithCategoryName, OnlineFilter, Scope, SortBy } from '@/types';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import { useInfiniteBusinesses } from '@/hooks/useBusinesses';

import BusinessList from '../shared/BusinessList';
import BottomSheetFilters from './BottomSheetFilters';
import SelectedFiltersPanel from '../shared/SelectedFiltersPanel';

type HomeSectionMobileProps = {
  businesses: BusinessWithCategoryName[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
  city: string;
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
  businesses,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
  error,
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
  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   isLoading,
  //   isError,
  //   error,
  // } = useInfiniteBusinesses({
  //   city,
  //   categoryId,
  //   showOnlineStatus,
  //   sortBy,
  //   scope,
  // });
  // const businesses = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <div className="container flex w-full flex-col pt-2 lg:hidden">
      <div className="flex items-center px-2 pb-2">
        <CityIcon className="mr-2 size-4" />
        <span className="placeholder-xs">{cityName}</span>
      </div>
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
          selectedCity={city}
        />
      </div>

      <BottomSheetFilters
        city={city}
        setCity={setCity}
        setCityName={setCityName}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        setCategoryName={setCategoryName}
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
