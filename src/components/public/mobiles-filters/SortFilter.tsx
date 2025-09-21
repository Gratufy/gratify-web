'use client';

import React, { useState } from 'react';
import { OnlineFilter, SortBy } from '@/types';

import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';

import { SheetClose } from '@/components/ui/sheet';

import OnlineStatusFilter from '@/components/shared/OnlineStatusFilter';
import SortFilterComponent from '@/components/shared/SortFilterComponent';

type SortFilterProps = {
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  onApply: () => void;
};

function SortFilter({
  sortBy,
  setSortBy,
  showOnlineStatus,
  setShowOnlineStatus,
  onApply,
}: SortFilterProps) {
  const [tempOnlineStatus, setTempOnlineStatus] =
    useState<OnlineFilter>(showOnlineStatus);
  const [tempSortBy, setTempSortBy] = useState<SortBy>(sortBy);
  return (
    <div className="w-65 flex flex-col gap-4 self-center py-5">
      <div className="flex items-center gap-3 py-2">
        <SortIcon className="h-5 w-5" />
        <h2 className="placeholder-sm font-medium">Сортувати</h2>
      </div>
      <div className="flex justify-center gap-4">
        <div className="space-x-2">
          <SortFilterComponent
            value={tempSortBy}
            onChange={setTempSortBy}
            classNameDiv="px-2 placeholder-small"
          />
        </div>
        <div className="space-x-2">
          <OnlineStatusFilter
            value={tempOnlineStatus}
            onChange={setTempOnlineStatus}
            classNameDiv="placeholder-small"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-5 py-2">
        <button
          type="button"
          onClick={() => {
            setTempOnlineStatus(showOnlineStatus);
            setTempSortBy(sortBy);
          }}
          className="placeholder-xs w-30 border-background-main-400 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2"
        >
          <CrossIcon className="h-3 w-3" />
          <span>Скасувати</span>
        </button>
        <SheetClose
          onClick={() => {
            setShowOnlineStatus(tempOnlineStatus);
            setSortBy(tempSortBy);
            onApply(); // close Sheet
          }}
          className="placeholder-sm bg-background-main-300 w-30 border-background-main-300 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2 shadow-[1px_2px_10px_2px_var(--elements-grey-50)]"
        >
          <CheckIcon className="h-4 w-4" /> <span>Застосувати</span>
        </SheetClose>
      </div>
    </div>
  );
}

export default SortFilter;
