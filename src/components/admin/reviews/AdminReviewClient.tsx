'use client';
import React, { useState } from 'react';
import Link from 'next/link';

import { BusinessReviewStatus, OnlineFilter } from '@/types/enums';

import {
  BUSINESS_REVIEW_STATUS,
  BUSINESS_REVIEW_STATUS_LABELS,
} from '@/const/review';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { ONLINE_STATUS } from '@/const/online-status';

import { useAdminBusinesses } from '@/hooks/useBusinesses';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';

import IconEyeOpen from '@/assets/icons/admin/icon-eye-open.svg';
import IconEyeClose from '@/assets/icons/admin/icon-eye.svg';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { Label } from '@/components/ui/label';

import AdminReviewList from '@/components/admin/reviews/AdminReviewList';
import AdminSkeleton from '@/components/admin/shared/AdminSkeleton';

function AdminReviewClient() {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const [categoryId, setCategoryId] = useState<string>('__all__');
  const [status, setStatus] = useState<BusinessReviewStatus>('pending');
  const [cityFilter, setCityFilter] = useState<string>('__all__');
  const [showReviewsMap, setShowReviewsMap] = useState<Record<string, boolean>>(
    {}
  );
  const [showOnlineStatus, setShowOnlineStatus] = useState<OnlineFilter>('all');

  const {
    data: businesses = [],
    isLoading: isBusinessesLoading,
    // isError,
    error,
  } = useAdminBusinesses({
    reviewStatus: status,
    categoryId,
    city: cityFilter,
    showOnlineStatus: showOnlineStatus,
    sortBy: 'newest',
  });
  function toggleReviews(businessId: string) {
    setShowReviewsMap((prev) => ({
      ...prev,
      [businessId]: !prev[businessId],
    }));
  }
  function handleStatusChange(value: string) {
    setStatus(value as BusinessReviewStatus);
  }
  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі' }, //index "__all__" for   "всi"
    ...(categories || []),
  ];
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="bg-background-white w-full lg:mt-3 lg:p-5">
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
              value={status}
              onChange={handleStatusChange}
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
              value={categoryId}
              onChange={setCategoryId}
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
              value={cityFilter}
              onChange={setCityFilter}
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
              value={showOnlineStatus}
              // value={filters.mode}
              onChange={(val) => setShowOnlineStatus(val as OnlineFilter)}
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
        {error && (
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
                    className="bg-background-main-200 hover:bg-background-main-300/80 grid grid-cols-[1fr_1fr_1fr] items-center justify-center gap-2 rounded-lg px-2 py-2"
                  >
                    <p className="title-h6">{b.name}</p>
                    {/* <p className="flex-1/7">{b.city}</p> */}

                    <p className="title-h6">{b.categoryName}</p>
                    {/* <p className="flex-1/7">
                      {status}: {b.filteredReviewCount}
                    </p> */}
                    <button
                      className="title-h6 border-icons-main-500 mx-auto flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleReviews(b.id);
                      }}
                    >
                      {showReviewsMap[b.id] ? (
                        <>
                          <IconEyeClose className="mr-2 size-6" />
                          {/* <span> Зачинити</span> */}
                          <span>
                            {/* do not delete {' '} */}
                            {BUSINESS_REVIEW_STATUS_LABELS[status]}:{' '}
                            {b.filteredReviewCount}
                          </span>
                        </>
                      ) : (
                        <>
                          <IconEyeOpen className="mr-2 size-6" />
                          {/* <span> відгуки</span> */}
                          <span>
                            {/* do not delete {' '} */}
                            {BUSINESS_REVIEW_STATUS_LABELS[status]}:{' '}
                            {b.filteredReviewCount}
                          </span>
                        </>
                      )}
                    </button>
                    {/* <p className="flex-1/6">{b.categoryName}</p> */}

                    {/* <Link
                      href={`/admin/business/${b.id}`}
                      className="title-h6 bg-elements-main-600 text-icons-grey-100 mx-auto flex w-3/4 cursor-pointer items-center justify-center rounded-lg px-2 py-2"
                    >
                      <IconEyeOpen className="mr-2 size-6" />
                      <span>картку</span>
                    </Link> */}
                  </Link>
                  {showReviewsMap[b.id] && (
                    <AdminReviewList businessId={b.id} currentStatus={status} />
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
