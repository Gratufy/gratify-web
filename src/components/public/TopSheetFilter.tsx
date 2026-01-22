'use client';
import React, { useState, useEffect } from 'react';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';

import CheckIcon from '@/assets/icons/general/icon-check.svg';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';

import CustomSelect from '../ui/custom-ui/CustomSelect';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';

import OnlineStatusFilter from '../shared/filters/OnlineStatusFilter';
import SortFilterComponent from '../shared/filters/SortFilterComponent';
import CategoryRadio from '../shared/filters/CategoryRadio';
import { useFilters } from '@/hooks/useFilters';
import { getCityLabel } from '@/utils/getCityLabel';
import { OnlineFilter, SortBy } from '@/types/enums';

type TopSheetFilterProps = {
  categoriesWithAll: { categoryId: string; name: string }[];
};

function TopSheetFilter({ categoriesWithAll }: TopSheetFilterProps) {
  const { filters, updateFilters } = useFilters();
  const [tempCity, setTempCity] = useState<string>(filters.city);

  const [tempCategoryId, setTempCategoryId] = useState<string>(
    filters.category
  );

  const [showTempOnlineStatus, setShowTempOnlineStatus] =
    useState<OnlineFilter>(filters.mode);

  const [tempSortBy, setTempSortBy] = useState<SortBy>(filters.sort);

  // manage Sheet
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTempCity(filters.city);
    setTempCategoryId(filters.category);
    setShowTempOnlineStatus(filters.mode);
    setTempSortBy(filters.sort);
  }, [open, filters]);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        //if Sheet is closing without applying -
        // reset temporary values to current filters
        if (!isOpen) {
          setTempCity(filters.city);
          setTempCategoryId(filters.category);
          setShowTempOnlineStatus(filters.mode);
          setTempSortBy(filters.sort);
        }
      }}
    >
      <SheetTrigger className="flex cursor-pointer items-center gap-8 px-3 xl:gap-10 xl:px-4">
        <div className="hover:shadow-card-dark bg-background-white-3 flex items-center px-3 py-1 xl:px-4">
          <CityIcon
            className="text-icons-main-600 mr-2 size-4 xl:mr-3 xl:size-5"
            aria-hidden="true"
          />
          <span className="placeholder-sm xl:placeholder-base">
            {/* {cityLabel} */}
            {getCityLabel(filters.city)}
          </span>
        </div>

        <div className="hover:shadow-card-dark bg-background-white-3 flex items-center px-3 py-1 xl:px-4">
          <SortIcon
            className="text-icons-main-600 mr-2 size-4 xl:mr-3 xl:size-5"
            aria-hidden="true"
          />
          <span className="placeholder-sm xl:placeholder-base">Сортувати</span>
        </div>

        <div className="hover:shadow-card-dark bg-background-white-3 flex items-center px-3 py-1 xl:px-4">
          <CategoryIcon
            className="text-icons-main-600 mr-2 size-4 xl:mr-3 xl:size-5"
            aria-hidden="true"
          />
          <span className="placeholder-sm xl:placeholder-base">Послуги</span>
        </div>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="container mx-auto h-auto w-full pb-20 pt-6"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Застосувати фільтри</SheetTitle>
          <SheetDescription>
            Виберіть фільтри для пошуку бізнесів
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-around gap-6">
          <div className="px-3 xl:px-4">
            <label
              htmlFor="top-city"
              className="bg-background-white placeholder-sm xl:placeholder-base mb-3 flex items-center gap-3 px-4 py-1 xl:mb-4"
            >
              <CityIcon
                className="text-icons-main-600 h-4 w-4 xl:h-5 xl:w-5"
                aria-hidden="true"
              />
              <span>Місто</span>
            </label>
            <CustomSelect
              className="w-50 standart px-4"
              id="top-city"
              value={tempCity}
              onChange={(val) => {
                setTempCity(val);
              }}
              options={UKRAINE_REGIONAL_CENTERS}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
              placeholder="Оберіть місто"
            />
            <OnlineStatusFilter
              classNameDiv="py-3 xl:py-4 placeholder-xs xl:placeholder-sm"
              value={showTempOnlineStatus}
              onChange={setShowTempOnlineStatus}
            />
          </div>

          <div className="px-3 xl:px-4">
            <div className="bg-background-white mb-3 flex items-center px-4 py-1 xl:mb-4">
              <SortIcon
                className="text-icons-main-600 mr-2 size-4 xl:mr-3 xl:size-5"
                aria-hidden="true"
              />
              <span className="placeholder-sm xl:placeholder-base">
                Сортувати
              </span>
            </div>
            <SortFilterComponent
              value={tempSortBy}
              onChange={setTempSortBy}
              classNameDiv=" placeholder-xs xl:placeholder-sm"
            />
          </div>

          <div className="px-3 xl:px-4">
            <span className="bg-background-white placeholder-sm xl:placeholder-base mb-3 flex w-60 items-center gap-3 px-4 py-1 xl:mb-4">
              <CategoryIcon
                className="text-icons-main-600 h-4 w-4 xl:h-5 xl:w-5"
                aria-hidden="true"
              />
              <span>Послуги</span>
            </span>
            <span id="category-group-label" className="sr-only">
              Обрати категорію послуг
            </span>
            <div
              role="radiogroup"
              aria-labelledby="category-group-label"
              className="flex flex-wrap gap-x-2 gap-y-4 py-2"
            >
              {categoriesWithAll.map((category) => (
                <CategoryRadio
                  key={category.categoryId}
                  value={category.categoryId}
                  checked={tempCategoryId === category.categoryId}
                  onChange={setTempCategoryId}
                  className="placeholder-xs xl:placeholder-sm border-elements-main-500 border px-4 py-2"
                >
                  {category.name}
                </CategoryRadio>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto flex gap-4">
          <button
            onClick={() => {
              setTempCity('__all__');

              setTempCategoryId('__all__');

              setShowTempOnlineStatus('all');
              setTempSortBy('newest');
            }}
            type="button"
            className="btn-reject"
          >
            <CrossIcon
              className="size-3 lg:size-4 xl:size-5"
              aria-hidden="true"
            />
            <span>Очистити все</span>
          </button>
          <SheetClose
            onClick={() => {
              updateFilters({
                city: tempCity,
                category: tempCategoryId,
                mode: showTempOnlineStatus,
                sort: tempSortBy,
              });
            }}
            //className="placeholder-xs bg-background-main-300 w-30 border-background-main-300 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2 shadow-[1px_2px_10px_2px_var(--elements-grey-50)]"
            className="btn-aprove"
          >
            <CheckIcon
              className="size-3 lg:size-4 xl:size-5"
              aria-hidden="true"
            />
            <span>Застосувати</span>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default TopSheetFilter;
