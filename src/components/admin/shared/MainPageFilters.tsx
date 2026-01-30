// 'use client';
import React, { useId } from 'react';

import { BusinessStatus, OnlineFilter } from '@/types/enums';
import { AdminFilters } from '@/types/filters-query';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { BUSINESS_STATUS, BUSINESS_STATUS_LABELS } from '@/const/business';
import { ONLINE_STATUS } from '@/const/online-status';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { Label } from '@/components/ui/label';

interface MainPageFiltersProps {
  isModeringSection?: boolean;
  categoriesWithAll: (
    | {
        name: string;
        categoryId: string;
        createdAt: Date | null;
        updatedAt: Date | null;
      }
    | {
        categoryId: string;
        name: string;
      }
  )[];
  filters: AdminFilters;
  updateFilter: (key: keyof AdminFilters, value: string | OnlineFilter) => void;
}

function MainPageFilters({
  isModeringSection,
  categoriesWithAll,
  filters,
  updateFilter,
}: MainPageFiltersProps) {
  const id = useId();
  return (
    <div className="border-b-elements-grey-200 mb-8 flex flex-col justify-center gap-5 border-b pb-8 lg:mb-8 lg:flex-row lg:gap-3">
      <div className="flex flex-1 flex-col gap-5 lg:gap-3">
        {!isModeringSection && (
          <div className="w-full">
            <Label
              htmlFor={`${id}-status-select`}
              className="placeholder-xs xl:placeholder-sm mb-1"
            >
              Статус:
            </Label>
            <CustomSelect
              id={`${id}-status-select`}
              value={filters.businessStatus}
              // onChange={handleStatusChange}
              onChange={(val) =>
                updateFilter('businessStatus', val as BusinessStatus)
              }
              options={BUSINESS_STATUS}
              getOptionValue={(s) => s}
              getOptionLabel={(s) => BUSINESS_STATUS_LABELS[s]}
              placeholder="Оберіть статус"
              className="admin-select select-input-deko-main w-full"
              // statusForm={true}
            />
          </div>
        )}
        <div className="w-full">
          <Label
            htmlFor={`${id}-category-select`}
            className="placeholder-xs xl:placeholder-sm mb-1"
          >
            Категорія:
          </Label>
          <CustomSelect
            id={`${id}-category-select`}
            value={filters.categoryId}
            // onChange={setCategoryId}
            onChange={(val) => updateFilter('categoryId', val)}
            options={categoriesWithAll}
            getOptionValue={(c) => c.categoryId}
            getOptionLabel={(c) => c.name}
            // label="Категорія"
            placeholder="Оберіть категорію"
            className="admin-select select-input-deko-main w-full"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 lg:gap-3">
        <div className="w-full">
          <Label
            htmlFor={`${id}-city-select`}
            className="placeholder-xs xl:placeholder-sm mb-1"
          >
            Місто:
          </Label>
          <CustomSelect
            id={`${id}-city-select`}
            // label="Місто"
            value={filters.city}
            // onChange={setCity}
            onChange={(val) => updateFilter('city', val)}
            options={UKRAINE_REGIONAL_CENTERS}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            placeholder="Оберіть місто"
            className="admin-select select-input-deko-main w-full"
          />
        </div>
        <div className="w-full">
          <Label
            htmlFor={`${id}-online-select`}
            className="placeholder-xs xl:placeholder-sm mb-1"
          >
            Online:
          </Label>
          <CustomSelect
            id={`${id}-online-select`}
            // label="Місто"
            // value={showOnlineStatus}
            value={filters.showOnlineStatus}
            // onChange={(val) => setShowOnlineStatus(val as OnlineFilter)}
            onChange={(val) =>
              updateFilter('showOnlineStatus', val as OnlineFilter)
            }
            options={ONLINE_STATUS}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            placeholder="Оберіть місто"
            className="admin-select select-input-deko-main w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default MainPageFilters;
