import React from 'react';
import CustomSelect from '../ui/CustomSelect';
import OnlineStatusFilter from '../shared/OnlineStatusFilter';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { OnlineFilter, SortBy } from '@/types';
import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';

type SidebarFiltersProps = {
  city: string | undefined;
  setCity: (city: string) => void;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  categoriesWithAll: { categoryId: string; name: string }[];
};

function SidebarFilters({
  city,
  setCity,
  showOnlineStatus,
  setShowOnlineStatus,
  categoryId,
  setCategoryId,
  sortBy,
  setSortBy,
  categoriesWithAll,
}: SidebarFiltersProps) {
  return (
    // треба gap-4
    <aside className="w-54 border-elements-grey-200 hidden flex-col gap-6 border-[0.5px] px-2 pb-4 pt-2 lg:flex">
      <div>
        <label
          htmlFor="city"
          className="placeholder-sm mb-1 flex items-center gap-3 px-3"
        >
          <CityIcon className="h-4 w-4" />
          <span>Місто</span>
        </label>
        <CustomSelect
          className="w-50 rounded-none px-3 py-1.5"
          id="city"
          value={city}
          onChange={setCity}
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
      <div>
        <label
          htmlFor="sort"
          className="placeholder-sm mb-1 flex items-center gap-3 px-3"
        >
          <SortIcon className="h-4 w-4" />
          <span>Сортувати</span>
        </label>
      </div>
      <div>
        <label
          htmlFor="categories"
          className="placeholder-sm mb-1 flex items-center gap-3 px-3"
        >
          <CategoryIcon className="h-4 w-4" />
          <span>Послуги</span>
        </label>
        <CustomSelect
          className="w-50 rounded-none px-3 py-1.5"
          id="categories"
          value={categoryId}
          onChange={setCategoryId}
          options={categoriesWithAll}
          getOptionValue={(c) => c.categoryId}
          getOptionLabel={(c) => c.name}
          placeholder="Оберіть категорію"
        />
      </div>
      <button
        type="button"
        className="placeholder-sm flex w-full items-center justify-center gap-3 px-4 py-1"
        onClick={() => {
          setCity('__all__');
          setCategoryId('__all__');
          setShowOnlineStatus('all');
          setSortBy('newest');
        }}
      >
        <CrossIcon className="h-4 w-4" />
        <span>Очистити все</span>
      </button>
    </aside>
  );
}

export default SidebarFilters;
