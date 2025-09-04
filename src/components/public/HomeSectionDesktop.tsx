import React from 'react';
import SidebarFilters from './SidebarFilters';
import BusinessList from '../shared/BusinessList';
import { OnlineFilter, Scope, SortBy } from '@/types';

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
      <BusinessList
        city={city}
        categoryId={categoryId}
        showOnlineStatus={showOnlineStatus}
        sortBy={sortBy}
        scope={scope}
      />
    </div>
  );
}

export default HomeSectionDesktop;
