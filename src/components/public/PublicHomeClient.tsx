'use client';
import React, { useState } from 'react';
//import { useUserStore } from '@/stores/useUserStore';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { OnlineFilter, SortBy } from '@/types';

//import DeleteAccountButton from '@/components/ui/DeleteAccountButton';

import HomeSectionMobile from './HomeSectionMobile';
import HomeSectionDesktop from './HomeSectionDesktop';

function PublicHomeClient() {
  //const user = useUserStore((s) => s.profile);
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const [city, setCity] = useState<string | undefined>('__all__');
  const [categoryId, setCategoryId] = useState<string>('__all__');
  const [categoryName, setCategoryName] = useState<string>('Всі категорії');
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
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showOnlineStatus={showOnlineStatus}
        setShowOnlineStatus={setShowOnlineStatus}
        categoriesWithAll={categoriesWithAll}
        scope="public"
      />
    </>
  );
}

export default PublicHomeClient;
