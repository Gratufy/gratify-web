'use client';
import React, { useState, useEffect } from 'react';
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
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

import { OnlineFilter, SortBy } from '@/types';
import CustomSelect from '../ui/CustomSelect';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import OnlineStatusFilter from '../shared/OnlineStatusFilter';
import DeleteAllFiltersBtn from '../ui/DeleteAllFiltersBtn';

type TopSheetFilterProps = {
  city: string | undefined;
  cityName: string | undefined;
  setCity: (city: string) => void;
  setCityName: (label: string) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  categoryId: string;
  categoryName: string;
  categoriesWithAll: { categoryId: string; name: string }[];
  setCategoryName: (name: string) => void;
  setCategoryId: (id: string) => void;
};

function TopSheetFilter({
  cityName,
  city,
  setCity,
  setCityName,
  sortBy,
  setSortBy,
  showOnlineStatus,
  categoryName,
  categoryId,
  categoriesWithAll,
  setShowOnlineStatus,
  setCategoryName,
  setCategoryId,
}: TopSheetFilterProps) {
  const [tempCity, setTempCity] = useState<string>(city || '__all__');
  const [tempCategoryId, setTempCategoryId] = useState<string>('__all__');
  const [showTempOnlineStatus, setShowTempOnlineStatus] =
    useState<OnlineFilter>('all');
  useState<OnlineFilter>(showOnlineStatus);
  useEffect(() => {
    setTempCity(city || '__all__');
    setTempCategoryId(categoryId || '__all__');
    setShowTempOnlineStatus(showOnlineStatus);
  }, [city, categoryId, showOnlineStatus]);

  return (
    <Sheet>
      <SheetTrigger className="flex cursor-pointer items-center gap-8 px-3 xl:gap-10 xl:px-4">
        <div className="flex items-center px-3 py-1 xl:px-4">
          <CityIcon className="mr-2 size-4 xl:mr-3 xl:size-5" />
          <span className="placeholder-sm xl:placeholder-base">{cityName}</span>
        </div>

        <div className="flex items-center px-3 py-1 xl:px-4">
          <SortIcon className="mr-2 size-4 xl:mr-3 xl:size-5" />
          <span className="placeholder-sm xl:placeholder-base">Сортувати</span>
        </div>

        <div className="flex items-center px-3 py-1 xl:px-4">
          <CategoryIcon className="mr-2 size-4 xl:mr-3 xl:size-5" />
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
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="flex gap-6">
          <div>
            <label
              htmlFor="city"
              className="placeholder-sm xl:placeholder-base mb-1 flex items-center gap-3 px-3 xl:mb-2 xl:px-4"
            >
              <CityIcon className="h-4 w-4 xl:h-5 xl:w-5" />
              <span>Місто</span>
            </label>
            <CustomSelect
              className="w-full rounded-none px-3 py-1.5 xl:px-4"
              id="city"
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
              value={showTempOnlineStatus}
              onChange={setShowTempOnlineStatus}
            />
          </div>
          <div className="flex items-center px-3 py-1 xl:px-4">
            <SortIcon className="mr-2 size-4 xl:mr-3 xl:size-5" />
            <span className="placeholder-sm xl:placeholder-base">
              Сортувати
            </span>
          </div>

          <div>
            <label
              htmlFor="categories"
              className="placeholder-sm xl:placeholder-base mb-1 flex items-center gap-3 px-3 xl:mb-2 xl:px-4"
            >
              <CategoryIcon className="h-4 w-4 xl:h-5 xl:w-5" />
              <span>Послуги</span>
            </label>
            <CustomSelect
              className="w-full rounded-none px-3 py-1.5 xl:px-4"
              id="categories"
              value={tempCategoryId}
              //onChange={setCategoryId}
              onChange={(val) => {
                setTempCategoryId(val);
              }}
              options={categoriesWithAll}
              getOptionValue={(c) => c.categoryId}
              getOptionLabel={(c) => c.name}
              placeholder="Оберіть категорію"
            />
          </div>
        </div>
        <div className="mx-auto flex gap-4">
          <DeleteAllFiltersBtn
            isSecondVariant
            setCity={setTempCity} //
            setCityName={setCityName}
            setCategoryId={setTempCategoryId} //
            setShowOnlineStatus={setShowTempOnlineStatus} //
            setSortBy={setSortBy}
            setCategoryName={setCategoryName}
            className="lg:placeholder-xs xl:placeholder-sm border-elements-grey-200 flex cursor-pointer border bg-white py-1.5 lg:gap-2 lg:px-2"
          />
          <SheetClose
            onClick={() => {
              setCity(tempCity);
              const city = UKRAINE_REGIONAL_CENTERS.find(
                (c) => c.value === tempCity
              );
              setCityName(city?.label ?? '');

              //------
              setCategoryId(tempCategoryId);
              const category = categoriesWithAll.find(
                (c) => c.categoryId === tempCategoryId
              );
              setCategoryName(category?.name ?? '');
              //------
              setShowOnlineStatus(showTempOnlineStatus);
              // onApply(); // close Sheet
            }}
            className="placeholder-xs bg-background-main-300 w-30 border-background-main-300 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2 shadow-[1px_2px_10px_2px_var(--elements-grey-50)]"
          >
            <CheckIcon className="h-4 w-4" /> <span>Застосувати</span>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default TopSheetFilter;
