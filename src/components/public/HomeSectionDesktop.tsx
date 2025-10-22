'use client';
import React, { useState, useEffect } from 'react';

import { BusinessWithCategoryName, OnlineFilter, SortBy } from '@/types';

import SidebarFilters from './SidebarFilters';
// import BusinessList from '../shared/BusinessListOld';

import dynamic from 'next/dynamic';
const BusinessMapAll = dynamic(
  () => import('@/components/shared/BusinessMapAll'),
  {
    ssr: false,
  }
);

import ShowMap from '../ui/ShowMap';
import TopSheetFilter from './TopSheetFilter';
import SelectedFiltersPanel from '../shared/SelectedFiltersPanel';
import BusinessList from '../shared/BusinessList';
import NotFoundComponent from '../shared/NotFoundComponent';
import { Filters } from '@/types/filters-query';
import { useFilters } from '@/hooks/useFilters';

type HomeSectionDesktopProps = {
  businesses: BusinessWithCategoryName[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;

  // city: string;
  // setCity: (city: string) => void;
  // cityName: string;
  // setCityName: (label: string) => void;
  // categoryId: string;
  // setCategoryId: (id: string) => void;
  // categoryName: string;
  // setCategoryName: (name: string) => void;
  // sortBy: SortBy;
  // setSortBy: (sort: SortBy) => void;
  // showOnlineStatus: OnlineFilter;
  // setShowOnlineStatus: (status: OnlineFilter) => void;
  categoriesWithAll: { categoryId: string; name: string }[];
};

function HomeSectionDesktop({
  businesses,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
  error,
  categoriesWithAll,

  // city,
  // setCity,
  // cityName,
  // setCityName,
  // categoryId,
  // setCategoryId,
  // categoryName,
  // setCategoryName,
  // sortBy,
  // setSortBy,
  // showOnlineStatus,
  // setShowOnlineStatus,
}: HomeSectionDesktopProps) {
  const { filters, updateFilter } = useFilters();
  const [showMap, setShowMap] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null); // for map hover effect

  useEffect(() => {
    if (
      !isLoading &&
      !isFetchingNextPage &&
      businesses.length === 0 &&
      showMap
    ) {
      setShowMap(false);
    }
  }, [businesses.length, isLoading, isFetchingNextPage, showMap]);

  return (
    <div
      className={`hidden w-full lg:block lg:max-w-[1024px] xl:max-w-[1440px] ${showMap ? 'lg:pl-[50px] xl:pl-[150px]' : 'lg:px-[50px] xl:px-[150px]'}`}
    >
      {businesses.length === 0 && (
        <div className="lg:h-13 xl:g-14 w-full"></div>
      )}
      {businesses.length > 0 && (
        <div
          className={`w-full ${showMap ? 'lg:pr-[50px] xl:pr-[150px]' : ''}`}
        >
          <div className="flex w-full justify-between bg-white py-3">
            {showMap && (
              <TopSheetFilter
                categoriesWithAll={categoriesWithAll}
                // cityName={cityName}
                // city={city}
                // setCity={setCity}
                // setCityName={setCityName}
                // sortBy={sortBy}
                // setSortBy={setSortBy}
                // showOnlineStatus={showOnlineStatus}
                // setShowOnlineStatus={setShowOnlineStatus}
                // categoryId={categoryId}
                // setCategoryId={setCategoryId}

                // setCategoryName={setCategoryName}
              />
            )}
            <ShowMap showMap={showMap} setShowMap={setShowMap} />
          </div>
          {showMap && (
            <div className="pb-2">
              <SelectedFiltersPanel
                categoriesWithAll={categoriesWithAll}
                // setCity={setCity}
                // setCityName={setCityName}
                // showOnlineStatus={showOnlineStatus}
                // setShowOnlineStatus={setShowOnlineStatus}
                // sortBy={sortBy}
                // setSortBy={setSortBy}
                // setCategoryId={setCategoryId}
                // categoryName={categoryName}
                // setCategoryName={setCategoryName}
              />
            </div>
          )}
        </div>
      )}
      <div className="hidden w-full lg:flex lg:flex-row lg:gap-6">
        {!showMap && (
          <SidebarFilters
            // filters={filters}
            // updateFilter={updateFilter}
            categoriesWithAll={categoriesWithAll ?? []}
            // city={city}
            // setCity={setCity}
            // setCityName={setCityName}
            // showOnlineStatus={showOnlineStatus}
            // setShowOnlineStatus={setShowOnlineStatus}
            // categoryId={categoryId}
            // setCategoryId={setCategoryId}
            // setCategoryName={setCategoryName}
            // sortBy={sortBy}
            // setSortBy={setSortBy}
          />
        )}
        {/* !!!! overflow-hidden */}
        <div className="flex flex-1 flex-col overflow-hidden lg:pb-8">
          {businesses.length === 0 && !isLoading && !isError && (
            // <p className="placeholder-sm lg:placeholder-base">
            //   Немає жодного бізнесу, який відповідає вашим фільтрам
            // </p>
            <NotFoundComponent />
          )}
          <BusinessList
            businesses={businesses}
            ///selectedCity={city}
            selectedCity={filters.city}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
            isError={isError}
            error={error}
            enableInfiniteScroll
            linkPrefix="/business"
            includeCityQuery
            onHover={setHoveredId}
          />
        </div>
        {showMap && (
          // count width of footer+32px
          <div className="top-13 sticky h-screen lg:w-[500px] xl:w-[708px]">
            <BusinessMapAll
              businesses={businesses}
              className="lg:h-140 xl:h-155 w-full"
              // selectedCity={city}
              selectedCity={filters.city}
              hoveredId={hoveredId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeSectionDesktop;
