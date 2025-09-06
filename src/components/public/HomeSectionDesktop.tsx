'use client';
import React, { useState } from 'react';
import SidebarFilters from './SidebarFilters';
import BusinessList from '../shared/BusinessList';
import { OnlineFilter, Scope, SortBy } from '@/types';

import dynamic from 'next/dynamic';
const BusinessMapAll = dynamic(
  () => import('@/components/shared/BusinessMapAll'),
  {
    ssr: false,
  }
);
import { useInfiniteBusinesses } from '@/hooks/useBusinesses';

import ShowMap from '../ui/ShowMap';

type HomeSectionDesktopProps = {
  city: string | undefined;
  setCity: (city: string) => void;
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
        <ShowMap showMap={showMap} setShowMap={setShowMap} />
      )}
      <div className="hidden w-full lg:flex lg:flex-row lg:gap-6">
        {!showMap && (
          <SidebarFilters
            city={city}
            setCity={setCity}
            showOnlineStatus={showOnlineStatus}
            setShowOnlineStatus={setShowOnlineStatus}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categoriesWithAll={categoriesWithAll}
          />
        )}

        <div className="flex flex-1 flex-col">
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
          <div className="top-13 sticky h-screen w-[450px] pb-32">
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
