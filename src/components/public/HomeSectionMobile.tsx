'use client';
import React from 'react';

import { BusinessWithCategoryName, OnlineFilter, SortBy } from '@/types';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';

// import BusinessList from '../shared/BusinessListOld';
import BottomSheetFilters from './BottomSheetFilters';
import SelectedFiltersPanel from '../shared/SelectedFiltersPanel';
import BusinessList from '../shared/BusinessList';

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
}: HomeSectionMobileProps) {
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
        {/* <BusinessList
          businesses={businesses}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          isError={isError}
          error={error}
          selectedCity={city}
        /> */}
        {businesses.length === 0 && !isLoading && !isError && (
          <p className="placeholder-sm lg:placeholder-base">
            Немає жодного бізнесу, який відповідає вашим фільтрам
          </p>
        )}
        <BusinessList
          businesses={businesses}
          selectedCity={city}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          isError={isError}
          error={error}
          enableInfiniteScroll
          linkPrefix="/business"
          includeCityQuery
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
