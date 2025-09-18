'use client';
import React, { useState } from 'react';
import { OnlineFilter, SortBy } from '@/types';

import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import MapIcon from '@/assets/icons/filters/icon-map.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
  SheetDescription,
} from '@/components/ui/sheet';

import CityFilter from './mobiles-filters/CityFilter';
import SortFilter from './mobiles-filters/SortFilter';

type BottomSheetFiltersProps = {
  city: string | undefined;
  setCity: (city: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  categoriesWithAll: { categoryId: string; name: string }[];
};

function BottomSheetFilters(props: BottomSheetFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<
    'city' | 'sort' | 'category' | 'map' | null
  >(null);
  const renderContent = () => {
    switch (activeFilter) {
      case 'city':
        return (
          <CityFilter
            city={props.city}
            setCity={props.setCity}
            onApply={() => setActiveFilter(null)}
          />
        );
      case 'sort':
        return (
          <SortFilter
            sortBy={props.sortBy}
            setSortBy={props.setSortBy}
            showOnlineStatus={props.showOnlineStatus}
            setShowOnlineStatus={props.setShowOnlineStatus}
          />
        );
      case 'category':
        return <div>Фільтр послуг</div>;
      case 'map':
        return <div>Мапа</div>;
      default:
        return null;
    }
  };
  return (
    // pb-[env(safe-area-inset-bottom)]
    <div className="bg-background-main-200 border-elements-grey-200 fixed inset-x-0 bottom-0 z-50 w-full border-[0.5px] px-4 py-2 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex w-full items-center justify-center">
            <button
              type="button"
              className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
              onClick={() => setActiveFilter('city')}
            >
              <CityIcon className="h-4 w-4" />
              <p className="placeholder-xs">Місто</p>
            </button>
            <button
              type="button"
              className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
              onClick={() => setActiveFilter('sort')}
            >
              <SortIcon className="h-4 w-4" />
              <p className="placeholder-xs">Сортувати</p>
            </button>
            <button
              type="button"
              className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
              onClick={() => setActiveFilter('category')}
            >
              <CategoryIcon className="h-4 w-4" />
              <p className="placeholder-xs">Послуги</p>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-1 px-5"
              onClick={() => setActiveFilter('map')}
            >
              <MapIcon className="h-4 w-4" />
              <p className="placeholder-xs">Мапа</p>
            </button>
          </div>
        </SheetTrigger>
        <SheetContent side="bottom" className="mx-auto mb-14 h-auto w-4/5">
          <SheetHeader className="sr-only">
            <SheetTitle>Застосувати фільтри</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          {renderContent()}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default BottomSheetFilters;
