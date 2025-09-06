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
      <div className="flex items-center gap-8">
        <div className="flex items-center px-3 py-1">
          <CityIcon className="mr-2 size-4" />
          <span className="placeholder-sm">{cityName}</span>
        </div>

        <div className="flex items-center px-3 py-1">
          <SortIcon className="mr-2 size-4" />
          <span className="placeholder-sm">{sortBy}</span>
        </div>

        <div className="flex items-center px-3 py-1">
          <CategoryIcon className="mr-2 size-4" />
          <span className="placeholder-sm">{categoryName}</span>
        </div>
      </div>
    </>
  );
}

export default TopSheetFilter;
