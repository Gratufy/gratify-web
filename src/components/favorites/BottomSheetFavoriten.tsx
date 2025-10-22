'use client';
import React, { useState } from 'react';
import { BusinessWithCategoryName } from '@/types';

import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
  SheetDescription,
} from '@/components/ui/sheet';
import CategoryFilter from '../public/mobiles-filters/CategoryFilter';
import CategoryFilterFavorites from './CategoryFilterFavorites';

type BottomSheetFavoritenProps = {
  // city: string | undefined;
  // setCity: (city: string) => void;
  // setCityName: (label: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  setCategoryName: (name: string) => void;
  // sortBy: SortBy;
  // setSortBy: (sort: SortBy) => void;
  // showOnlineStatus: OnlineFilter;
  // setShowOnlineStatus: (status: OnlineFilter) => void;
  categoriesWithAll: { categoryId: string; name: string }[];
  businesses: BusinessWithCategoryName[]; // for Map
};

function BottomSheetFavoriten(props: BottomSheetFavoritenProps) {
  const [activeFilter, setActiveFilter] = useState<
    'city' | 'sort' | 'category' | 'map' | null
  >(null);
  const renderContent = () => {
    switch (activeFilter) {
      case 'category':
        return (
          <CategoryFilterFavorites
            categoryId={props.categoryId}
            setCategoryId={props.setCategoryId}
            categories={props.categoriesWithAll}
            setCategoryName={props.setCategoryName}
            onApply={() => setActiveFilter(null)}
          />
        );

      default:
        return null;
    }
  };
  return (
    // pb-[env(safe-area-inset-bottom)] z-80
    <div className="bg-background-main-200 border-elements-grey-200 sticky bottom-0 w-full border-[0.5px] lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex w-full items-center justify-center py-2">
            <button
              type="button"
              className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
              onClick={() => setActiveFilter('category')}
            >
              <CategoryIcon className="h-4 w-4" />
              <p className="placeholder-xs">Послуги</p>
            </button>
          </div>
        </SheetTrigger>
        {/* mb-14 */}
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

export default BottomSheetFavoriten;
