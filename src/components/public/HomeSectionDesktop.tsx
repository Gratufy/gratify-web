'use client';
import React, { useState } from 'react';
import SidebarFilters from './SidebarFilters';
import BusinessList from '../shared/BusinessList';
import { OnlineFilter, Scope, SortBy } from '@/types';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';

import dynamic from 'next/dynamic';
const BusinessMapAll = dynamic(
  () => import('@/components/shared/BusinessMapAll'),
  {
    ssr: false,
  }
);
import { useInfiniteBusinesses } from '@/hooks/useBusinesses';

import ShowMap from '../ui/ShowMap';
import TopSheetFilter from './TopSheetFilter';
import { ONLINE_STATUS_LABELS } from '@/const/business';

type HomeSectionDesktopProps = {
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
    <>
      {businesses.length > 0 && (
        <>
          <div className="flex w-full justify-between bg-white px-3 py-3 xl:px-4">
            {showMap && (
              <TopSheetFilter
                cityName={cityName}
                sortBy={sortBy}
                categoryName={categoryName}
              />
            )}
            <ShowMap showMap={showMap} setShowMap={setShowMap} />
          </div>
          {showMap && (
            <div className="flex w-full lg:gap-2">
              <div className="bg-background-grey-100 flex lg:gap-2 lg:px-2 lg:py-2">
                <span className="lg:placeholder-xs xl:placeholder-sm">
                  {ONLINE_STATUS_LABELS[showOnlineStatus]}
                </span>
                <CrossIcon className="cursor-pointer lg:size-4 xl:size-5" />
              </div>
              <div className="bg-background-grey-100 flex lg:gap-2 lg:px-2 lg:py-2">
                {' '}
                <span className="lg:placeholder-xs xl:placeholder-sm">
                  {sortBy}
                </span>
                <CrossIcon className="cursor-pointer lg:size-4 xl:size-5" />
              </div>
              <div className="bg-background-grey-100 flex lg:gap-2 lg:px-2 lg:py-2">
                <span className="lg:placeholder-xs xl:placeholder-sm">
                  {categoryName}
                </span>
                <CrossIcon className="cursor-pointer lg:size-4 xl:size-5" />
              </div>
              <button
                type="button"
                // onClick={() => setTempCity('__all__')}
                className="border-elements-grey-200 flex cursor-pointer border bg-white py-1.5 lg:gap-2 lg:px-2"
              >
                <span className="lg:placeholder-xs xl:placeholder-sm">
                  Скасувати
                </span>
                <CrossIcon className="lg:size-4 xl:size-5" />
              </button>
            </div>
          )}
        </>
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

        <div className="flex flex-1 flex-col pt-2">
          <BusinessList
            businesses={businesses}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
            isError={isError}
            error={error}
            // categoryId={categoryId}
            // showOnlineStatus={showOnlineStatus}
            // sortBy={sortBy}
            // scope={scope}
          />
        </div>

        {showMap && (
          // count width of footer+32px
          <div className="top-13 sticky h-screen w-[450px] pb-32 pt-2">
            <BusinessMapAll
              businesses={businesses}
              className="w-full"
              selectedCity={city}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default HomeSectionDesktop;
