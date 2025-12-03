'use client';
import React from 'react';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';

import CityIcon from '@/assets/icons/filters/icon-locatio.svg';
import SortIcon from '@/assets/icons/filters/icon-sort.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';

import CustomSelect from '../ui/custom-ui/CustomSelect';
import OnlineStatusFilter from '../shared/filters/OnlineStatusFilter';
import DeleteAllFiltersBtn from '../ui/custom-ui/DeleteAllFiltersBtn';
import SortFilterComponent from '../shared/filters/SortFilterComponent';
import CategoryRadio from '../shared/filters/CategoryRadio';

import { useFilters } from '@/hooks/useFilters';

type SidebarFiltersProps = {
  categoriesWithAll: { categoryId: string; name: string }[];
};

function SidebarFilters({ categoriesWithAll }: SidebarFiltersProps) {
  const { filters, updateFilter } = useFilters();

  return (
    <aside className="lg:w-54 xl:w-70 hidden flex-shrink-0 lg:flex lg:items-start">
      {/* // треба lg:gap-4 xl:gap-6 */}
      <div className="lg:border-elements-grey-200 w-full lg:flex lg:flex-col lg:gap-2 lg:border-[0.5px] lg:px-2 lg:pb-4 lg:pt-2 xl:px-4 xl:pb-8 xl:pt-3">
        <div className="flex flex-col gap-6 xl:gap-8">
          <div className="border-elements-grey-200 border-b pb-3">
            <label
              htmlFor="city"
              className="placeholder-sm xl:placeholder-base flex items-center gap-3 px-4 py-1 xl:mb-2"
            >
              <CityIcon className="h-4 w-4 xl:h-5 xl:w-5" />
              <span>Місто</span>
            </label>
            <CustomSelect
              className="standart w-full px-3 py-1.5 xl:px-4"
              id="city"
              value={filters.city}
              onChange={(val) => updateFilter('city', val)}
              options={UKRAINE_REGIONAL_CENTERS}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
              placeholder="Оберіть місто"
            />

            <OnlineStatusFilter
              classNameDiv="p-3 xl:p-4 placeholder-xs xl:placeholder-sm"
              value={filters.mode}
              onChange={(val) => updateFilter('mode', val)}
            />
          </div>
          <div className="border-elements-grey-200 border-b pb-3">
            <label
              htmlFor="sort"
              className="placeholder-sm xl:placeholder-base flex items-center gap-3 px-4 py-1 xl:mb-2"
            >
              <SortIcon className="h-4 w-4 xl:h-5 xl:w-5" />
              <span>Сортувати</span>
            </label>
            <SortFilterComponent
              classNameDiv="p-3 xl:p-4 placeholder-xs xl:placeholder-sm"
              value={filters.sort}
              onChange={(val) => updateFilter('sort', val)}
            />
          </div>
          <div>
            <label
              htmlFor="categories"
              className="placeholder-sm xl:placeholder-base flex items-center gap-3 px-4 py-1 xl:mb-2"
            >
              <CategoryIcon className="h-4 w-4 xl:h-5 xl:w-5" />
              <span>Послуги</span>
            </label>
            <div
              role="radiogroup"
              aria-label="Category options"
              className="flex flex-wrap gap-x-2 gap-y-4 py-2"
            >
              {categoriesWithAll.map((category) => (
                <CategoryRadio
                  key={category.categoryId}
                  value={category.categoryId}
                  checked={filters.category === category.categoryId}
                  onChange={(val) => updateFilter('category', val)}
                  // className="placeholder-xs xl:placeholder-sm border-elements-main-500 border px-4 py-2"
                >
                  {category.name}
                </CategoryRadio>
              ))}
            </div>
          </div>
        </div>

        <DeleteAllFiltersBtn className="placeholder-sm xl:placeholder-base flex w-full items-center justify-center gap-3 px-4 py-1 xl:px-4" />
      </div>
    </aside>
  );
}

export default SidebarFilters;
