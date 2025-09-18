import React from 'react';

import { OnlineFilter, SortBy } from '@/types';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';

import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';

import CustomSelect from '../ui/CustomSelect';
import OnlineStatusFilter from '../shared/OnlineStatusFilter';
import DeleteAllFiltersBtn from '../ui/DeleteAllFiltersBtn';
import SortFilterComponent from '../shared/SortFilterComponent';

type SidebarFiltersProps = {
  city: string;
  setCity: (city: string) => void;
  setCityName: (label: string) => void;
  showOnlineStatus: OnlineFilter;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  setCategoryName: (name: string) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  categoriesWithAll: { categoryId: string; name: string }[];
};

function SidebarFilters({
  city,
  setCity,
  setCityName,
  showOnlineStatus,
  setShowOnlineStatus,
  categoryId,
  setCategoryId,

  setCategoryName,
  sortBy,
  setSortBy,
  categoriesWithAll,
}: SidebarFiltersProps) {
  return (
    <aside className="lg:w-54 xl:w-70 lg:align-items hidden pt-2 lg:flex lg:items-start">
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
            classNameDiv="p-3 xl:p-4 placeholder-xs xl:placeholder-sm"
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
          <SortFilterComponent
            classNameDiv="p-3 xl:p-4 placeholder-xs xl:placeholder-sm"
            value={sortBy}
            onChange={setSortBy}
          />
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
            //onChange={setCategoryId}
            onChange={(val) => {
              setCategoryId(val); // id категории
              const category = categoriesWithAll.find(
                (c) => c.categoryId === val
              );
              setCategoryName(category?.name ?? '');
            }}
            options={categoriesWithAll}
            getOptionValue={(c) => c.categoryId}
            getOptionLabel={(c) => c.name}
            placeholder="Оберіть категорію"
          />
        </div>
        {/* <button
          type="button"
          className="placeholder-sm xl:placeholder-base flex w-full items-center justify-center gap-3 px-4 py-1 xl:px-4"
          onClick={() => {
            setCity('__all__');
            setCityName('Всі міста');
            setCategoryId('__all__');
            setShowOnlineStatus('all');
            setSortBy('newest');
            setCategoryName('Всі категорії');
          }}
        >
          <CrossIcon className="h-4 w-4 xl:h-5 xl:w-5" />
          <span>Очистити все</span>
        </button> */}
        <DeleteAllFiltersBtn
          setCity={setCity}
          setCityName={setCityName}
          setCategoryId={setCategoryId}
          setShowOnlineStatus={setShowOnlineStatus}
          setSortBy={setSortBy}
          setCategoryName={setCategoryName}
          className="placeholder-sm xl:placeholder-base flex w-full items-center justify-center gap-3 px-4 py-1 xl:px-4"
        />
      </div>
    </aside>
  );
}

export default SidebarFilters;
