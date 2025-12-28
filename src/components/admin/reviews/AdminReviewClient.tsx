'use client';
import React, { useState } from 'react';
import Link from 'next/link';

import { AdminSort, BusinessReviewStatus, OnlineFilter } from '@/types/enums';

import {
  BUSINESS_REVIEW_STATUS,
  BUSINESS_REVIEW_STATUS_LABELS,
} from '@/const/review';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { ONLINE_STATUS } from '@/const/online-status';

import { useAdminBusinesses } from '@/hooks/useBusinesses';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';

import EditPen from '@/assets/icons/general/feedback-edit.svg';
import IconEyeOpen from '@/assets/icons/admin/icon-eye-open.svg';
import IconEyeClose from '@/assets/icons/admin/icon-eye.svg';
import { ArrowBigDown } from 'lucide-react';
import { ArrowBigUp } from 'lucide-react';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { Label } from '@/components/ui/label';

import AdminReviewList from '@/components/admin/reviews/AdminReviewList';
import AdminSkeleton from '@/components/admin/shared/AdminSkeleton';
import { useAdminFiltersWithReviewStatus } from '@/hooks/admin/useAdminFiltersWithReviewStatus';

function AdminReviewClient() {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  // const [categoryId, setCategoryId] = useState<string>('__all__');
  // const [status, setStatus] = useState<BusinessReviewStatus>('pending');
  // const [cityFilter, setCityFilter] = useState<string>('__all__');
  const [showReviewsMap, setShowReviewsMap] = useState<Record<string, boolean>>(
    {}
  );
  // const [showOnlineStatus, setShowOnlineStatus] = useState<OnlineFilter>('all');
  const [isHoveringButton, setIsHoveringButton] = useState<boolean>(false);
  const [sortBy] = useState<AdminSort>('newest');

  const { filters, updateFilter } = useAdminFiltersWithReviewStatus();
  const {
    data: businesses = [],
    isLoading: isBusinessesLoading,
    isError,
    error,
  } = useAdminBusinesses({
    businessStatus: 'approved',
    reviewStatus: filters.reviewStatus,
    categoryId: filters.categoryId,
    city: filters.city,
    showOnlineStatus: filters.showOnlineStatus,
    sortBy,
  });
  function toggleReviews(businessId: string) {
    setShowReviewsMap((prev) => ({
      ...prev,
      [businessId]: !prev[businessId],
    }));
  }
  // function handleStatusChange(value: string) {
  //   setStatus(value as BusinessReviewStatus);
  // }
  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі' }, //index "__all__" for   "всi"
    ...(categories || []),
  ];
  return (
    <div className="max-[1024px]:max-w-150 w-full max-[1024px]:mx-auto lg:flex lg:flex-col lg:items-center lg:justify-center">
      {/*  mobile nav title */}
      <div className="bg-background-main-100 flex items-center justify-center gap-3 py-3 lg:hidden">
        <EditPen className="size-5" />
        <span className="title-h4">Модерування</span>
      </div>
      <div className="bg-background-grey-50 w-full max-[1024px]:px-4 lg:mt-3 lg:p-5">
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
              // label="Місто"
              value={filters.city}
              onChange={(val) => updateFilter('city', val)}
              // onChange={(val) => updateFilter('city', val)}
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
              // value={filters.mode}
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
      </div>
    </div>
  );
}

export default AdminReviewClient;
