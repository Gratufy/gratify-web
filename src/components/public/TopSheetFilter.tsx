import React from 'react';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';

import { SortBy } from '@/types';

type TopSheetFilterProps = {
  cityName: string | undefined;
  sortBy: SortBy;
  categoryName: string;
};

function TopSheetFilter({
  cityName,
  sortBy,
  categoryName,
}: TopSheetFilterProps) {
  return (
    <>
      <div className="flex items-center gap-8 xl:gap-10">
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
      </div>
    </>
  );
}

export default TopSheetFilter;
