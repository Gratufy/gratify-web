'use client';
import React, { useState } from 'react';
import { BusinessWithCategoryName } from '@/types';

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
import CategoryFilter from './mobiles-filters/CategoryFilter';
import MobileMapBottom from './mobiles-filters/MobileMapBottom';
import { useFilters } from '@/hooks/useFilters';

type BottomSheetFiltersProps = {
  categoriesWithAll: { categoryId: string; name: string }[];
  businesses: BusinessWithCategoryName[]; // for Map
};

function BottomSheetFilters(props: BottomSheetFiltersProps) {
  const { filters } = useFilters();
  const [activeFilter, setActiveFilter] = useState<
    'city' | 'sort' | 'category' | 'map' | null
  >(null);
  const renderContent = () => {
    switch (activeFilter) {
      case 'city':
        return <CityFilter onApply={() => setActiveFilter(null)} />;
      case 'sort':
        return <SortFilter onApply={() => setActiveFilter(null)} />;
      case 'category':
        return (
          <CategoryFilter
            categoriesWithAll={props.categoriesWithAll}
            onApply={() => setActiveFilter(null)}
          />
        );
      case 'map':
        return (
          <MobileMapBottom
            businesses={props.businesses}
            className="w-full"
            city={filters.city}
          />
        );
      default:
        return null;
    }
  };
  return (
    // pb-[env(safe-area-inset-bottom)]  z-80
    <div className="z-80 bg-background-main-200 border-elements-grey-200 sticky bottom-0 w-full border-[0.5px] lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex w-full items-center justify-center py-2">
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
              className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
              onClick={() => setActiveFilter('map')}
            >
              <MapIcon className="h-4 w-4" />
              <p className="placeholder-xs">Мапа</p>
            </button>
          </div>
        </SheetTrigger>
        {/* mb-14 mb-30*/}
        <SheetContent side="bottom" className="mx-auto h-auto w-4/5">
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
