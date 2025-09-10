import React from 'react';
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
} from '@/components/ui/sheet';

import { OnlineFilter, SortBy } from '@/types';
import CustomSelect from '../ui/CustomSelect';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import OnlineStatusFilter from '../shared/OnlineStatusFilter';

type TopSheetFilterProps = {
  cityName: string | undefined;
  city: string | undefined;
  setCity: (city: string) => void;
  setCityName: (label: string) => void;
  sortBy: SortBy;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  categoryName: string;
};

function TopSheetFilter({
  cityName,
  city,
  setCity,
  setCityName,
  sortBy,
  showOnlineStatus,
  categoryName,
  setShowOnlineStatus,
}: TopSheetFilterProps) {
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
        className="mt-33 container mx-auto h-auto w-full pb-20 pt-6"
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
              value={city}
              onChange={(val) => {
                setCity(val);
                const city = UKRAINE_REGIONAL_CENTERS.find(
                  (c) => c.value === val
                );
                setCityName(city?.label ?? '');
              }}
              options={UKRAINE_REGIONAL_CENTERS}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
              placeholder="Оберіть місто"
            />
            <OnlineStatusFilter
              value={showOnlineStatus}
              onChange={setShowOnlineStatus}
            />
          </div>
          <div className="flex items-center px-3 py-1 xl:px-4">
            <SortIcon className="mr-2 size-4 xl:mr-3 xl:size-5" />
            <span className="placeholder-sm xl:placeholder-base">
              Сортувати
            </span>
          </div>

          <div className="flex items-center px-3 py-1 xl:px-4">
            <CategoryIcon className="mr-2 size-4 xl:mr-3 xl:size-5" />
            <span className="placeholder-sm xl:placeholder-base">Послуги</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default TopSheetFilter;
