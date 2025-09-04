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
import MapIcon from '@/assets/icons/filters/icon-map.svg';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
    <div className="hidden w-full lg:flex lg:flex-row lg:gap-6">
      {!showMap && (
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
      )}
      <div className="flex flex-1 flex-col">
        {businesses.length > 0 && (
          <div className="ml-auto flex items-center py-3">
            <MapIcon className="mr-2 inline h-4 w-4" />
            <span className="placeholder-sm mr-3">Мапа</span>
            <Switch
              id="map-show"
              checked={showMap}
              onCheckedChange={setShowMap}
              className=""
            />
            <Label htmlFor="map-show" className="sr-only">
              Показати мапу
            </Label>
          </div>
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
      </div>

      {showMap && (
        <div className="pt-13 flex-1">
          <BusinessMapAll
            businesses={businesses}
            className="w-full"
            selectedCity={city}
          />
        </div>
      )}
    </div>
  );
}

export default HomeSectionDesktop;
