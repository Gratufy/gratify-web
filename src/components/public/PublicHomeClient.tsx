'use client';
import React, { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { OnlineFilter, SortBy } from '@/types';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';

import OnlineStatusFilter from '@/components/shared/OnlineStatusFilter';
import BusinessList from '@/components/shared/BusinessList';
import DeleteAccountButton from '@/components/ui/DeleteAccountButton';
import CustomSelect from '@/components/ui/CustomSelect';
import BottomSheetFilters from './BottomSheetFilters';
import SidebarFilters from './SidebarFilters';

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
      {/* {user && <DeleteAccountButton />} */}
      {/* <CustomSelect
        value={categoryId}
        onChange={setCategoryId}
        options={categoriesWithAll}
        getOptionValue={(c) => c.categoryId}
        getOptionLabel={(c) => c.name}
        label="Категорія"
        placeholder="Оберіть категорію"
      />
      <CustomSelect
        label="Місто"
        value={city}
        onChange={setCity}
        options={UKRAINE_REGIONAL_CENTERS}
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => option.label}
        placeholder="Оберіть місто"
      />
      <OnlineStatusFilter
        value={showOnlineStatus}
        onChange={setShowOnlineStatus}
      /> */}
      <div className="flex w-full flex-col gap-6 lg:flex-row">
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
          scope="public"
        />
      </div>

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
    </>
  );
}

export default PublicHomeClient;
