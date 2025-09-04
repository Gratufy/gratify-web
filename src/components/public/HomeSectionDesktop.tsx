'use client';
import React, { useState } from 'react';
import SidebarFilters from './SidebarFilters';
import BusinessList from '../shared/BusinessList';
import { OnlineFilter, Scope, SortBy } from '@/types';
import { Button } from '../ui/button';
import dynamic from 'next/dynamic';
const BusinessMapAll = dynamic(
  () => import('@/components/shared/BusinessMapAll'),
  {
    ssr: false,
  }
);
import { useInfiniteBusinesses } from '@/hooks/useBusinesses';

type HomeSectionDesktopProps = {
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

function HomeSectionDesktop({
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
    <div className="hidden w-full pt-2 lg:flex lg:flex-row lg:gap-6">
      <SidebarFilters
        city={city}
        setCity={setCity}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoriesWithAll={categoriesWithAll}
      />
      {businesses.length > 0 && (
        <Button onClick={() => setShowMap((prev) => !prev)}>
          {!showMap ? 'Show Map' : 'Hide Map'}
        </Button>
      )}
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

      {showMap && (
        <BusinessMapAll
          businesses={businesses}
          className="w-full"
          selectedCity={city}
        />
      )}
    </div>
  );
}

export default HomeSectionDesktop;
