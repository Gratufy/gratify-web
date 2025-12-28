'use client';
import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { Label } from '@/components/ui/label';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import {
  BUSINESS_REVIEW_STATUS,
  BUSINESS_REVIEW_STATUS_LABELS,
} from '@/const/review';
import React, { useState } from 'react';
import AdminSkeleton from '../shared/AdminSkeleton';
import Link from 'next/link';

import IconEyeOpen from '@/assets/icons/admin/icon-eye-open.svg';
import IconEyeClose from '@/assets/icons/admin/icon-eye.svg';
import { ArrowBigDown } from 'lucide-react';
import { ArrowBigUp } from 'lucide-react';

import { AdminFiltersWithReviewStatus } from '@/types/filters-query';
import { AdminBusinessRowType } from '@/types';
import { BusinessReviewStatus, OnlineFilter } from '@/types/enums';
import { ONLINE_STATUS } from '@/const/online-status';
import AdminReviewList from './AdminReviewList';

interface AdminDesktopBusinessReviewsListProps {
  businesses: AdminBusinessRowType[];
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
  error: Error | null;
  isError?: boolean;
  isBusinessesLoading: boolean;
  toggleReviews: (businessId: string) => void;
  showReviewsMap: Record<string, boolean>;
}
function AdminDesktopBusinessReviewsList({
  businesses,
  filters,
  updateFilter,
  categoriesWithAll,
  error,
  isError,
  isBusinessesLoading,
  toggleReviews,
  showReviewsMap,
}: AdminDesktopBusinessReviewsListProps) {
  const [isHoveringButton, setIsHoveringButton] = useState<boolean>(false);

  // const categoriesWithAll = [
  //   { categoryId: '__all__', name: 'Всі' }, //index "__all__" for   "всi"
  //   ...(categories || []),
  // ];
  return (
    <>
      {/*  Filters*/}
      <div className="flex justify-center lg:mb-5 lg:gap-3">
        <div>
          <Label
            htmlFor="status-review-select"
            className="lg:placeholder-xs xl:placeholder-sm mb-1"
          >
            Статус відгуків:
          </Label>
          <CustomSelect
            id="status-review-select"
            value={filters.reviewStatus}
            onChange={(val) =>
              updateFilter('reviewStatus', val as BusinessReviewStatus)
            }
            options={BUSINESS_REVIEW_STATUS}
            getOptionValue={(s) => s}
            getOptionLabel={(s) => BUSINESS_REVIEW_STATUS_LABELS[s]}
            placeholder="Оберіть статус"
            className="admin-select w-40"
          />
        </div>
        <div>
          <Label
            htmlFor="category-select"
            className="xl:placeholder-sm lg:placeholder-xs mb-1"
          >
            Категорія:
          </Label>
          <CustomSelect
            id="category-select"
            value={filters.categoryId}
            onChange={(val) => updateFilter('categoryId', val)}
            options={categoriesWithAll}
            getOptionValue={(c) => c.categoryId}
            getOptionLabel={(c) => c.name}
            placeholder="Оберіть категорію"
            className="admin-select w-40"
          />
        </div>
        <div>
          <Label
            htmlFor="city-select"
            className="xl:placeholder-sm lg:placeholder-xs mb-1"
          >
            Місто:
          </Label>
          <CustomSelect
            id="city-select"
            value={filters.city}
            onChange={(val) => updateFilter('city', val)}
            options={UKRAINE_REGIONAL_CENTERS}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            placeholder="Оберіть місто"
            className="admin-select w-40"
          />
        </div>
        <div>
          <Label
            htmlFor="online-select"
            className="xl:placeholder-sm lg:placeholder-xs mb-1"
          >
            Online:
          </Label>
          <CustomSelect
            id="online-select"
            // label="Місто"
            value={filters.showOnlineStatus}
            onChange={(val) =>
              updateFilter('showOnlineStatus', val as OnlineFilter)
            }
            // onChange={(val) => updateFilter('mode', val as OnlineFilter)}
            options={ONLINE_STATUS}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            placeholder="Оберіть місто"
            className="admin-select w-40"
          />
          {/* <OnlineStatusFilter
            value={showOnlineStatus}
            onChange={setShowOnlineStatus}
          /> */}
        </div>
      </div>
      {isError && (
        <div className="placeholder-sm xl:placeholder-base text-center">
          Ошибка: {error?.message}
        </div>
      )}
      {isBusinessesLoading && <AdminSkeleton count={3} />}
      {businesses?.length > 0 && (
        <div className="bg-background-main-50 rounded-lg lg:px-1 lg:py-4">
          <div className="grid w-full min-w-0 grid-cols-[1fr_1fr_1fr] gap-2 px-2 lg:mb-6">
            <div className="title-h6 min-w-0 py-2">
              <span>Найменування </span>
            </div>
            <div className="title-h6 min-w-0 py-2">
              <span>Категорія</span>
            </div>
            <div className="title-h6 min-w-0 py-2 text-center">
              <span>Дивитись відгуки</span>
            </div>
          </div>
          <ul className="flex flex-col lg:gap-5">
            {businesses.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/business/${b.id}`}
                  className={`bg-background-main-200 grid grid-cols-[1fr_1fr_1fr] items-center justify-center gap-2 rounded-lg px-2 py-2 transition-colors ${
                    isHoveringButton ? '' : 'hover:bg-background-main-300/80'
                  }`}
                >
                  <p className="title-h6">{b.name}</p>
                  {/* <p className="flex-1/7">{b.city}</p> */}

                  <p className="title-h6">{b.categoryName}</p>
                  {/* <p className="flex-1/7">
                      {status}: {b.filteredReviewCount}
                    </p> */}
                  <button
                    className="xl:placeholder-base placeholder-sm items-centertitle-h6 bg-background-grey-100 hover:bg-background-grey-100/80 border-icons-main-500 mx-auto flex w-48 cursor-pointer items-center rounded-lg border px-2 py-2 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleReviews(b.id);
                    }}
                    onMouseEnter={() => setIsHoveringButton(true)}
                    onMouseLeave={() => setIsHoveringButton(false)}
                  >
                    {showReviewsMap[b.id] ? (
                      <>
                        <IconEyeClose className="mr-2 size-6" />
                        <div className="flex w-full justify-between">
                          <span>
                            {
                              BUSINESS_REVIEW_STATUS_LABELS[
                                filters.reviewStatus
                              ]
                            }
                            : {b.filteredReviewCount}
                          </span>
                          <ArrowBigUp className="size-5" />
                        </div>
                      </>
                    ) : (
                      <>
                        <IconEyeOpen className="mr-2 size-6" />
                        {/* <span> відгуки</span> */}
                        <div className="flex w-full justify-between">
                          <span>
                            {/* do not delete {' '} */}
                            {
                              BUSINESS_REVIEW_STATUS_LABELS[
                                filters.reviewStatus
                              ]
                            }
                            : {b.filteredReviewCount}
                          </span>
                          <ArrowBigDown className="size-5" />
                        </div>
                      </>
                    )}
                  </button>
                </Link>
                {showReviewsMap[b.id] && (
                  <AdminReviewList
                    businessId={b.id}
                    currentStatus={filters.reviewStatus}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {businesses?.length === 0 && !isBusinessesLoading && (
        <p className="xl:placeholder-base placeholder-sm text-center">
          Нема бізнесів з відгуками відповідних обраним фільтрам
        </p>
      )}
    </>
  );
}

export default AdminDesktopBusinessReviewsList;
