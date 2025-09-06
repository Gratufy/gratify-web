import React from 'react';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';
import { SortBy } from '@/types';

type TopSheetFilterProps = {
  city: string | undefined;
  sort: SortBy;
  category: string;
};

function TopSheetFilter({ city, sort, category }: TopSheetFilterProps) {
  return (
    <div className="flex items-center bg-white p-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center px-3 py-1">
          <CityIcon className="mr-2 size-4" />
          <span className="placeholder-sm">{city}</span>
        </div>

        <div className="flex items-center px-3 py-1">
          <SortIcon className="mr-2 size-4" />
          <span className="placeholder-sm">{sort}</span>
        </div>

        <div className="flex items-center px-3 py-1">
          <CategoryIcon className="mr-2 size-4" />
          <span className="placeholder-sm">{category}</span>
        </div>
      </div>
    </div>
  );
}

export default TopSheetFilter;
