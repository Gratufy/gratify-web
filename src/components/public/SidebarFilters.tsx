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
    <aside className="lg:w-54 xl:w-70 lg:align-items hidden lg:flex lg:items-start">
      {/* // треба lg:gap-4 xl:gap-6 */}
      <div className="lg:border-elements-grey-200 w-full lg:flex lg:flex-col lg:gap-6 lg:border-[0.5px] lg:px-2 lg:pb-4 lg:pt-2 xl:gap-8 xl:px-4 xl:pb-8 xl:pt-3">
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
            className="placeholder-sm xl:placeholder-base mb-1 flex items-center gap-3 px-3 xl:mb-2 xl:px-4"
          >
            <SortIcon className="h-4 w-4 xl:h-5 xl:w-5" />
            <span>Сортувати</span>
          </label>
        </div>
        <div>
          <label
            htmlFor="categories"
            className="placeholder-sm xl:placeholder-base mb-1 flex items-center gap-3 px-3 xl:mb-2 xl:px-4"
          >
            <CategoryIcon className="h-4 w-4 xl:h-5 xl:w-5" />
            <span>Послуги</span>
          </label>
          <CustomSelect
            className="w-full rounded-none px-3 py-1.5 xl:px-4"
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
          className="placeholder-sm xl:placeholder-base flex w-full items-center justify-center gap-3 px-4 py-1 xl:px-4"
          onClick={() => {
            setCity('__all__');
            setCategoryId('__all__');
            setShowOnlineStatus('all');
            setSortBy('newest');
          }}
        >
          <CrossIcon className="h-4 w-4 xl:h-5 xl:w-5" />
          <span>Очистити все</span>
        </button>
      </div>
    </aside>
  );
}

export default SidebarFilters;
