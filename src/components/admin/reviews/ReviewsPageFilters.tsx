import React from 'react';
import { useId } from 'react';

import { AdminFiltersWithReviewStatus } from '@/types/filters-query';

import { BusinessReviewStatus, OnlineFilter } from '@/types/enums';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { ONLINE_STATUS } from '@/const/online-status';
import {
  BUSINESS_REVIEW_STATUS,
  BUSINESS_REVIEW_STATUS_LABELS,
} from '@/const/review';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { Label } from '@/components/ui/label';

interface ReviewsPageFiltersProps {
  filters: AdminFiltersWithReviewStatus;
  updateFilter: <K extends keyof AdminFiltersWithReviewStatus>(
    key: K,
    value: AdminFiltersWithReviewStatus[K]
  ) => void;

  categoriesWithAll: (
    | {
        categoryId: string;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
      }
    | {
        categoryId: string;
        name: string;
      }
  )[];
}

function ReviewsPageFilters({
  filters,
  updateFilter,
  categoriesWithAll,
}: ReviewsPageFiltersProps) {
  const id = useId();
  return (
    <div className="border-b-elements-grey-200 mb-8 flex flex-col justify-center gap-5 border-b pb-8 lg:flex-row lg:gap-3">
      <div className="flex flex-1 flex-col gap-5 lg:gap-3">
        <div className="w-full">
          <Label
            htmlFor={`${id}-status-review-select`}
            className="lg:placeholder-xs xl:placeholder-sm mb-1"
          >
            Статус відгуків:
          </Label>
          <CustomSelect
            id={`${id}-status-review-select`}
            value={filters.reviewStatus}
            onChange={(val) =>
              updateFilter('reviewStatus', val as BusinessReviewStatus)
            }
            options={BUSINESS_REVIEW_STATUS}
            getOptionValue={(s) => s}
            getOptionLabel={(s) => BUSINESS_REVIEW_STATUS_LABELS[s]}
            placeholder="Оберіть статус"
            className="admin-select w-full"
          />
        </div>
        <div className="w-full">
          <Label
            htmlFor={`${id}-category-select`}
            className="xl:placeholder-sm lg:placeholder-xs mb-1"
          >
            Категорія:
          </Label>
          <CustomSelect
            id={`${id}-category-select`}
            value={filters.categoryId}
            onChange={(val) => updateFilter('categoryId', val)}
            options={categoriesWithAll}
            getOptionValue={(c) => c.categoryId}
            getOptionLabel={(c) => c.name}
            placeholder="Оберіть категорію"
            className="admin-select w-full"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 lg:gap-3">
        <div className="w-full">
          <Label
            htmlFor={`${id}-city-select`}
            className="xl:placeholder-sm lg:placeholder-xs mb-1"
          >
            Місто:
          </Label>
          <CustomSelect
            id={`${id}-city-select`}
            value={filters.city}
            onChange={(val) => updateFilter('city', val)}
            options={UKRAINE_REGIONAL_CENTERS}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            placeholder="Оберіть місто"
            className="admin-select w-full"
          />
        </div>
        <div className="w-full">
          <Label
            htmlFor={`${id}-online-select`}
            className="xl:placeholder-sm lg:placeholder-xs mb-1"
          >
            Online:
          </Label>
          <CustomSelect
            id={`${id}-online-select`}
            // label="Місто"
            value={filters.showOnlineStatus}
            onChange={(val) =>
              updateFilter('showOnlineStatus', val as OnlineFilter)
            }
            options={ONLINE_STATUS}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            placeholder="Оберіть місто"
            className="admin-select w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default ReviewsPageFilters;
