import React from 'react';
import BusinessList from '../shared/BusinessList';
import BottomSheetFilters from './BottomSheetFilters';
import { OnlineFilter, Scope, SortBy } from '@/types';

type HomeSectionMobileProps = {
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

function HomeSectionMobile({
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
}: HomeSectionMobileProps) {
  return (
    <div className="flex w-full flex-col pt-2 lg:hidden">
      <BusinessList
        city={city}
        categoryId={categoryId}
        showOnlineStatus={showOnlineStatus}
        sortBy={sortBy}
        scope={scope}
      />
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
