'use client';
import React, { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { OnlineFilter, SortBy } from '@/types';

import BusinessList from '@/components/shared/BusinessList';
//import DeleteAccountButton from '@/components/ui/DeleteAccountButton';

import BottomSheetFilters from './BottomSheetFilters';
import SidebarFilters from './SidebarFilters';
import HomeSectionMobile from './HomeSectionMobile';
import HomeSectionDesktop from './HomeSectionDesktop';

function PublicHomeClient() {
  const user = useUserStore((s) => s.profile);
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const [city, setCity] = useState<string | undefined>('__all__');
  const [categoryId, setCategoryId] = useState<string>('__all__');
  const [showOnlineStatus, setShowOnlineStatus] = useState<OnlineFilter>('all');

  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі категорії' },
    ...categories,
  ];
  return (
    <>
      {/* <div className="flex w-full flex-col gap-6 pt-2 lg:flex-row"> */}
      <HomeSectionMobile
        city={city}
        setCity={setCity}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        categoriesWithAll={categoriesWithAll}
        scope="public"
      />
      <HomeSectionDesktop
        city={city}
        setCity={setCity}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        categoriesWithAll={categoriesWithAll}
        scope="public"
      />
      {/* <SidebarFilters
        city={city}
        setCity={setCity}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoriesWithAll={categoriesWithAll}
      /> */}

      {/* <BusinessList
          city={city}
          categoryId={categoryId}
          showOnlineStatus={showOnlineStatus}
          sortBy={sortBy}
          scope="public"
        /> */}
      {/* </div> */}

      {/* <BottomSheetFilters
        city={city}
        setCity={setCity}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        categoriesWithAll={categoriesWithAll}
      /> */}
    </>
  );
}

export default PublicHomeClient;
