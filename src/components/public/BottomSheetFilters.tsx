import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import MapIcon from '@/assets/icons/filters/icon-map.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';

function BottomSheetFilters() {
  return (
    <div className="bg-background-main-200 border-elements-grey-200 fixed inset-x-0 bottom-0 w-full border-[0.5px] px-4 py-2 lg:hidden">
      <Sheet>
        <SheetTrigger className="flex w-full items-center justify-center py-3">
          <div className="flex">
            <div className="flex flex-col items-center justify-center gap-1 px-5">
              <CityIcon />
              <p className="placeholder-xs">Місто</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 px-5">
              <SortIcon />
              <p className="placeholder-xs">Сортувати</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 px-5">
              <CategoryIcon />
              <p className="placeholder-xs">Послуги</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 px-5">
              <MapIcon />
              <p className="placeholder-xs">Мапа</p>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default BottomSheetFilters;
