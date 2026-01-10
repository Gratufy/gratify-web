'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { BusinessWithCategoryName } from '@/types';

import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import MapIcon from '@/assets/icons/filters/icon-map.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';
import CityFilter from './mobiles-filters/CityFilter';
import SortFilter from './mobiles-filters/SortFilter';
import CategoryFilter from './mobiles-filters/CategoryFilter';
import MobileMapBottom from './mobiles-filters/MobileMapBottom';
import { useFilters } from '@/hooks/useFilters';

interface NewBottomSheetFiltersProps {
  categoriesWithAll: { categoryId: string; name: string }[];
  businesses: BusinessWithCategoryName[]; // for Map
}

function NewBottomSheetFilters(props: NewBottomSheetFiltersProps) {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const { filters } = useFilters();
  const [activeFilter, setActiveFilter] = useState<
    'city' | 'sort' | 'category' | 'map' | null
  >(null);

  // ESC
  useEffect(() => {
    if (!bottomSheetOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBottomSheetOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [bottomSheetOpen]);
  console.log('bottom', bottomSheetOpen);
  const renderContent = () => {
    switch (activeFilter) {
      case 'city':
        return (
          <CityFilter
            onApply={() => {
              setBottomSheetOpen(false);
              setActiveFilter(null);
            }}
          />
        );
      case 'sort':
        return (
          <SortFilter
            onApply={() => {
              setBottomSheetOpen(false);
              setActiveFilter(null);
            }}
          />
        );
      case 'category':
        return (
          <CategoryFilter
            categoriesWithAll={props.categoriesWithAll}
            onApply={() => {
              setBottomSheetOpen(false);
              setActiveFilter(null);
            }}
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
    <div className="z-80 bg-background-main-200 border-elements-grey-200 sticky bottom-0 flex w-full justify-center border-[0.5px] lg:hidden">
      <div className="flex w-full items-center justify-center py-2">
        <button
          type="button"
          className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
          onClick={() => {
            setBottomSheetOpen(!bottomSheetOpen);
            setActiveFilter('city');
          }}
        >
          <CityIcon className="h-4 w-4" />
          <p className="placeholder-xs">Місто</p>
        </button>
        <button
          type="button"
          className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
          onClick={() => {
            setBottomSheetOpen(!bottomSheetOpen);
            setActiveFilter('sort');
          }}
        >
          <SortIcon className="h-4 w-4" />
          <p className="placeholder-xs">Сортувати</p>
        </button>
        <button
          type="button"
          className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
          onClick={() => {
            setBottomSheetOpen(!bottomSheetOpen);
            setActiveFilter('category');
          }}
        >
          <CategoryIcon className="h-4 w-4" />
          <p className="placeholder-xs">Послуги</p>
        </button>
        <button
          type="button"
          className="flex cursor-pointer flex-col items-center justify-center gap-1 px-5"
          onClick={() => {
            setBottomSheetOpen(!bottomSheetOpen);
            setActiveFilter('map');
          }}
        >
          <MapIcon className="h-4 w-4" />
          <p className="placeholder-xs">Мапа</p>
        </button>
      </div>
      {/* Overlay */}
      {bottomSheetOpen && (
        <div
          className="bg-overlay-background fixed inset-0 z-40"
          onClick={() => setBottomSheetOpen(false)}
        />
      )}
      {/* Sheet */}
      <div
        className={cn(
          'bg-background-white absolute bottom-0 z-50 mx-auto h-auto w-4/5 shadow-lg',

          'transition-transform duration-300 ease-out',
          bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <button
          className="btn-custom absolute right-2 top-2 p-1"
          onClick={() => setBottomSheetOpen(false)}
        >
          <CrossIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>
        <span className="sr-only">Застосувати фільтри</span>
        {renderContent()}
      </div>
    </div>
  );
}

export default NewBottomSheetFilters;
