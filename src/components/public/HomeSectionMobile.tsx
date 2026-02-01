'use client';
import React from 'react';

import { BusinessWithCategoryName } from '@/types';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';

import BottomSheetFilters from './mobiles-filters/BottomSheetFilters';
import SelectedFiltersPanel from '../shared/filters/SelectedFiltersPanel';
import BusinessList from '../shared/BusinessList';
import NotFoundComponent from '../shared/NotFoundComponent';
import { getCityLabel } from '@/utils/getCityLabel';
import { useFilters } from '@/hooks/useFilters';

type HomeSectionMobileProps = {
  businesses: BusinessWithCategoryName[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
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
  categoriesWithAll,
}: HomeSectionMobileProps) {
  const { filters } = useFilters();
  return (
    <div className="relative w-full lg:hidden">
      <div className="container flex w-full flex-col pt-2 lg:hidden">
        <div className="flex items-center px-2 pb-2" aria-label="Обране місто">
          <CityIcon className="mr-2 size-4" aria-hidden="true" />
          <span className="placeholder-xs"> {getCityLabel(filters.city)}</span>
        </div>
        <div className="px-2 pb-2">
          <SelectedFiltersPanel categoriesWithAll={categoriesWithAll} />
        </div>
        <div className="flex flex-1 flex-col pb-20 pt-3">
          {businesses.length === 0 && !isLoading && !isError && (
            <NotFoundComponent />
          )}
          <BusinessList
            businesses={businesses}
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
          />
        </div>
      </div>
      <BottomSheetFilters
        businesses={businesses} // for Map
        categoriesWithAll={categoriesWithAll}
      />
    </div>
  );
}

export default HomeSectionMobile;
