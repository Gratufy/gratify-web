'use client';
import React, { useState, useEffect } from 'react';
import { OnlineFilter, SortBy } from '@/types';
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
// import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';

import CustomSelect from '../ui/CustomSelect';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import DeleteAllFiltersBtn from '../ui/DeleteAllFiltersBtn';

import OnlineStatusFilter from '../shared/OnlineStatusFilter';
import SortFilterComponent from '../shared/SortFilterComponent';
import CategoryRadio from '../shared/CategoryRadio';
import { useFilters } from '@/hooks/useFilters';
import { getCityLabel } from '@/utils/getCityLabel';

type TopSheetFilterProps = {
  categoriesWithAll: { categoryId: string; name: string }[];
  // city: string;
  // cityName: string;
  // setCity: (city: string) => void;
  // setCityName: (label: string) => void;
  // sortBy: SortBy;
  // setSortBy: (sort: SortBy) => void;
  // showOnlineStatus: OnlineFilter;
  // setShowOnlineStatus: (status: OnlineFilter) => void;
  // categoryId: string;

  // setCategoryName: (name: string) => void;
  // setCategoryId: (id: string) => void;
};

function TopSheetFilter({
  categoriesWithAll,
  // cityName,
  // city,
  // setCity,
  // setCityName,
  // sortBy,
  // setSortBy,
  // showOnlineStatus,

  // categoryId,

  // setShowOnlineStatus,
  //setCategoryName,
  // setCategoryId,
}: TopSheetFilterProps) {
  const { filters, updateFilter, resetFilters } = useFilters();
  const [tempCity, setTempCity] = useState<string>(filters.city);
  // const [tempCategoryId, setTempCategoryId] = useState<string>(categoryId);
  const [tempCategoryId, setTempCategoryId] = useState<string>(
    filters.category
  );
  // const [showTempOnlineStatus, setShowTempOnlineStatus] =
  //   useState<OnlineFilter>(showOnlineStatus);
  const [showTempOnlineStatus, setShowTempOnlineStatus] =
    useState<OnlineFilter>(filters.mode);
  // const [tempSortBy, setTempSortBy] = useState<SortBy>(sortBy);
  const [tempSortBy, setTempSortBy] = useState<SortBy>(filters.sort);

  // useEffect(() => {
  //   setTempCity(city);
  //   setTempCategoryId(categoryId);
  //   setShowTempOnlineStatus(showOnlineStatus);
  //   setTempSortBy(sortBy);
  // }, [city, categoryId, showOnlineStatus, sortBy]);
  // const cityLabel =
  //   UKRAINE_REGIONAL_CENTERS.find((c) => c.value === filters.city)?.label ??
  //   'Вся Україна';

  return (
    <Sheet>
      <SheetTrigger className="flex cursor-pointer items-center gap-8 px-3 xl:gap-10 xl:px-4">
        <div className="flex items-center px-3 py-1 xl:px-4">
          <CityIcon className="mr-2 size-4 xl:mr-3 xl:size-5" />
          <span className="placeholder-sm xl:placeholder-base">
            {/* {cityLabel} */}
            {getCityLabel(filters.city)}
          </span>
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
        <div className="flex justify-around gap-6">
          <div className="px-3 xl:px-4">
            <label
              htmlFor="city"
              className="placeholder-sm xl:placeholder-base mb-3 flex items-center gap-3 xl:mb-4"
            >
              <CityIcon className="h-4 w-4 xl:h-5 xl:w-5" />
              <span>Місто</span>
            </label>
            <CustomSelect
              className="w-50 rounded-none px-3 py-1.5 xl:px-4"
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
              classNameDiv="py-3 xl:py-4 placeholder-xs xl:placeholder-sm"
              value={showTempOnlineStatus}
              onChange={setShowTempOnlineStatus}
            />
          </div>

          <div className="px-3 xl:px-4">
            <div className="mb-3 flex items-center xl:mb-4">
              <SortIcon className="mr-2 size-4 xl:mr-3 xl:size-5" />
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
            <label
              htmlFor="categories"
              className="placeholder-sm xl:placeholder-base mb-3 flex items-center gap-3 xl:mb-4"
            >
              <CategoryIcon className="h-4 w-4 xl:h-5 xl:w-5" />
              <span>Послуги</span>
            </label>
            <div
              role="radiogroup"
              aria-label="Category options"
              className="flex flex-wrap gap-x-2 gap-y-4 py-2"
            >
              {categoriesWithAll.map((category) => (
                <CategoryRadio
                  key={category.categoryId}
                  value={category.categoryId}
                  checked={tempCategoryId === category.categoryId}
                  // checked={filters.category === category.categoryId}
                  // onChange={(val) => {
                  //   setCategoryId(val); // id категории
                  //   const selected = categoriesWithAll.find(
                  //     (c) => c.categoryId === val
                  //   );
                  //   setCategoryName(selected?.name ?? '');
                  // }}
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
          {/* <DeleteAllFiltersBtn
            //setCity={setTempCity} //
            // setCityName={setCityName}
            // setCategoryId={setTempCategoryId} //
            // setShowOnlineStatus={setShowTempOnlineStatus} //
            // setSortBy={setTempSortBy} //
            // setCategoryName={setCategoryName}

            className="lg:placeholder-xs xl:placeholder-sm border-elements-grey-200 flex cursor-pointer border bg-white py-1.5 lg:gap-2 lg:px-2"
          /> */}
          <button
            onClick={() => {
              // 🔹 сбрасываем только временные значения
              setTempCity('__all__');
              // setCityName('Усі міста');
              setTempCategoryId('__all__');
              // setCategoryName('Усі категорії');
              setShowTempOnlineStatus('all');
              setTempSortBy('newest');
            }}
            type="button"
            className={`placeholder-small lg:placeholder-xs xl:placeholder-sm border-elements-grey-200 flex cursor-pointer items-center gap-1 border bg-white px-2 py-2 lg:gap-2`}
          >
            <CrossIcon className="size-3 lg:size-4 xl:size-5" />
            <span>Очистити все</span>
          </button>
          <SheetClose
            onClick={() => {
              updateFilter('city', tempCity);
              updateFilter('category', tempCategoryId);
              updateFilter('mode', showTempOnlineStatus);
              updateFilter('sort', tempSortBy);
              // setCity(tempCity);
              // const city = UKRAINE_REGIONAL_CENTERS.find(
              //   (c) => c.value === tempCity
              // );
              // setCityName(city?.label ?? '');
              // setCategoryId(tempCategoryId);
              // const category = categoriesWithAll.find(
              //   (c) => c.categoryId === tempCategoryId
              // );
              // setCategoryName(category?.name ?? '');
              // setShowOnlineStatus(showTempOnlineStatus);
              // setSortBy(tempSortBy);
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
