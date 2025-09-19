import { ONLINE_STATUS_LABELS, SORT_BY_LABELS } from '@/const/business';
import React from 'react';
import DeleteAllFiltersBtn from '../ui/DeleteAllFiltersBtn';
import { OnlineFilter, SortBy } from '@/types';

type SelectedFiltersPanelProps = {
  setCity: (city: string) => void;
  setCityName: (label: string) => void;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;

  setCategoryId: (id: string) => void;
  categoryName: string;
  setCategoryName: (name: string) => void;
};

function SelectedFiltersPanel({
  setCity,
  setCityName,

  showOnlineStatus,
  setShowOnlineStatus,
  sortBy,
  setSortBy,

  setCategoryId,
  categoryName,
  setCategoryName,
}: SelectedFiltersPanelProps) {
  return (
    <div className="flex w-full flex-wrap gap-2">
      <div className="bg-background-grey-100 flex gap-1 px-2 py-2 lg:gap-2">
        <span className="placeholder-small lg:placeholder-xs xl:placeholder-sm">
          {ONLINE_STATUS_LABELS[showOnlineStatus]}
        </span>
      </div>
      <div className="bg-background-grey-100 flex gap-1 px-2 py-2 lg:gap-2">
        <span className="placeholder-small lg:placeholder-xs xl:placeholder-sm">
          {SORT_BY_LABELS[sortBy]}
        </span>
      </div>
      <div className="bg-background-grey-100 flex gap-1 px-2 py-2 lg:gap-2">
        <span className="placeholder-small lg:placeholder-xs xl:placeholder-sm">
          {categoryName}
        </span>
      </div>

      <DeleteAllFiltersBtn
        isSecondVariant
        setCity={setCity}
        setCityName={setCityName}
        setCategoryId={setCategoryId}
        setShowOnlineStatus={setShowOnlineStatus}
        setSortBy={setSortBy}
        setCategoryName={setCategoryName}
        className="placeholder-small lg:placeholder-xs xl:placeholder-sm border-elements-grey-200 gap-1 border bg-white px-2 py-2 lg:gap-2"
      />
    </div>
  );
}

export default SelectedFiltersPanel;
