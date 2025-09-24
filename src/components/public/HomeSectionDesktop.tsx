'use client';
import React, { useState, useEffect } from 'react';

import { OnlineFilter, Scope, SortBy } from '@/types';

import { useInfiniteBusinesses } from '@/hooks/useBusinesses';

import SidebarFilters from './SidebarFilters';
import BusinessList from '../shared/BusinessList';

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

type HomeSectionDesktopProps = {
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

function HomeSectionDesktop({
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
}: HomeSectionDesktopProps) {
  const [showMap, setShowMap] = useState(false);
  // console.log('City', city);
  // console.log('CategoryId', categoryId);
  // console.log('CategoryName', categoryName);
  // console.log('SortBy', sortBy);
  // console.log('ShowOnlineStatus', showOnlineStatus);
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
      {businesses.length > 0 && (
        <div
          className={`w-full ${showMap ? 'lg:pr-[50px] xl:pr-[150px]' : ''}`}
        >
          <div className="flex w-full justify-between bg-white py-3">
            {showMap && (
              <TopSheetFilter
                cityName={cityName}
                city={city}
                setCity={setCity}
                setCityName={setCityName}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showOnlineStatus={showOnlineStatus}
                setShowOnlineStatus={setShowOnlineStatus}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                // categoryName={categoryName}
                categoriesWithAll={categoriesWithAll}
                setCategoryName={setCategoryName}
              />
            )}
            <ShowMap showMap={showMap} setShowMap={setShowMap} />
          </div>
          {showMap && (
            // <div className="flex w-full lg:gap-2">
            //   <div className="bg-background-grey-100 flex lg:gap-2 lg:px-2 lg:py-2">
            //     <span className="lg:placeholder-xs xl:placeholder-sm">
            //       {ONLINE_STATUS_LABELS[showOnlineStatus]}
            //     </span>
            //   </div>
            //   <div className="bg-background-grey-100 flex lg:gap-2 lg:px-2 lg:py-2">
            //     <span className="lg:placeholder-xs xl:placeholder-sm">
            //       {SORT_BY_LABELS[sortBy]}
            //     </span>
            //   </div>
            //   <div className="bg-background-grey-100 flex lg:gap-2 lg:px-2 lg:py-2">
            //     <span className="lg:placeholder-xs xl:placeholder-sm">
            //       {categoryName}
            //     </span>
            //   </div>

            //   <DeleteAllFiltersBtn
            //     isSecondVariant
            //     setCity={setCity}
            //     setCityName={setCityName}
            //     setCategoryId={setCategoryId}
            //     setShowOnlineStatus={setShowOnlineStatus}
            //     setSortBy={setSortBy}
            //     setCategoryName={setCategoryName}
            //     className="lg:placeholder-xs xl:placeholder-sm border-elements-grey-200 flex cursor-pointer border bg-white py-1.5 lg:gap-2 lg:px-2"
            //   />
            // </div>
            <div className="pb-2">
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
          )}
        </div>
      )}
      <div className="hidden w-full lg:flex lg:flex-row lg:gap-6">
        {!showMap && (
          <SidebarFilters
            city={city}
            setCity={setCity}
            setCityName={setCityName}
            showOnlineStatus={showOnlineStatus}
            setShowOnlineStatus={setShowOnlineStatus}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            setCategoryName={setCategoryName}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categoriesWithAll={categoriesWithAll}
          />
        )}

        <div className="flex flex-1 flex-col lg:pb-8">
          <BusinessList
            businesses={businesses}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
            isError={isError}
            error={error}
            selectedCity={city}
            // categoryId={categoryId}
            // showOnlineStatus={showOnlineStatus}
            // sortBy={sortBy}
            // scope={scope}
          />
        </div>

        {showMap && (
          // count width of footer+32px
          <div className="top-13 sticky h-screen pb-32 lg:w-[500px] xl:w-[708px]">
            <BusinessMapAll
              businesses={businesses}
              className="w-full"
              selectedCity={city}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeSectionDesktop;
