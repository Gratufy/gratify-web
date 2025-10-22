'use client';
import { ONLINE_STATUS_LABELS, SORT_BY_LABELS } from '@/const/business';
import React from 'react';
import DeleteAllFiltersBtn from '../ui/DeleteAllFiltersBtn';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import { OnlineFilter, SortBy } from '@/types';
import { useFilters } from '@/hooks/useFilters';
import { get } from 'http';
import { getCategoryLabel } from '@/utils/getCategoryLabel';

type SelectedFiltersPanelProps = {
  categoriesWithAll: { categoryId: string; name: string }[];
  // setCity: (city: string) => void;
  // setCityName: (label: string) => void;
  // showOnlineStatus: OnlineFilter;
  // setShowOnlineStatus: (status: OnlineFilter) => void;
  // sortBy: SortBy;
  // setSortBy: (sort: SortBy) => void;
  // setCategoryId: (id: string) => void;
  // categoryName: string;
  // setCategoryName: (name: string) => void;
};

function SelectedFiltersPanel({
  categoriesWithAll,
}: SelectedFiltersPanelProps) {
  const { filters, updateFilter } = useFilters();
  return (
    <div className="flex w-full flex-wrap gap-2">
      <div className="bg-background-grey-100 flex gap-1 px-2 py-2 lg:gap-2">
        <span className="placeholder-small lg:placeholder-xs xl:placeholder-sm">
          {/* {ONLINE_STATUS_LABELS[showOnlineStatus]} */}
          {ONLINE_STATUS_LABELS[filters.mode]}
        </span>
      </div>
      <div className="bg-background-grey-100 flex gap-1 px-2 py-2 lg:gap-2">
        <span className="placeholder-small lg:placeholder-xs xl:placeholder-sm">
          {/* {SORT_BY_LABELS[sortBy]} */}
          {SORT_BY_LABELS[filters.sort]}
        </span>
      </div>
      <div className="bg-background-grey-100 flex gap-1 px-2 py-2 lg:gap-2">
        <span className="placeholder-small lg:placeholder-xs xl:placeholder-sm">
          {/* {categoryName} */}
          {getCategoryLabel(filters.category, categoriesWithAll)}
        </span>
      </div>
      <DeleteAllFiltersBtn
        isSecondVariant
        // setCity={setCity}
        // setCityName={setCityName}
        // setCategoryId={setCategoryId}
        // setShowOnlineStatus={setShowOnlineStatus}
        // setSortBy={setSortBy}
        // setCategoryName={setCategoryName}
        className="placeholder-small lg:placeholder-xs xl:placeholder-sm border-elements-grey-200 gap-1 border bg-white px-2 py-2 lg:gap-2"
      />
    </div>
  );
}

export default SelectedFiltersPanel;
