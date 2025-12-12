'use client';
import React, { useState } from 'react';
import { BusinessReviewStatus, OnlineFilter } from '@/types';

import CustomSelect from '../../ui/custom-ui/CustomSelect';
import {
  BUSINESS_REVIEW_STATUS,
  BUSINESS_REVIEW_STATUS_LABELS,
} from '@/const/review';

import Link from 'next/link';
import { useAdminBusinesses } from '@/hooks/useBusinesses';

import AdminReviewList from '../AdminReviewList';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { Label } from '@/components/ui/label';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { ONLINE_STATUS } from '@/const/online-status';

// interface BusinessReviewTableProps {
//   initialData: AdminBusinessRow[];
// }
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

  // const { data: businesses, isLoading: isBusinessesLoading } =
  //   useAdminBusinessesByReviewStatus(status, categoryId);

  const {
    data: businesses = [],
    isLoading: isBusinessesLoading,
    // isError,
    // error,
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
      {/*  Filters*/}
      <div className="flex justify-center lg:mb-5 lg:gap-3">
        <div>
          <Label
            htmlFor="status-review-select"
            className="lg:placeholder-xs mb-1"
          >
            Статус:
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
            // statusForm={true}
          />
        </div>
        <div>
          <Label htmlFor="category-select" className="lg:placeholder-xs mb-1">
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
          <Label htmlFor="city-select" className="lg:placeholder-xs mb-1">
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
          <Label htmlFor="online-select" className="lg:placeholder-xs mb-1">
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

      {isBusinessesLoading && <p>Loading businesses...</p>}
      {businesses?.length ? (
        <ul className="mt-4 w-3/4 max-w-4xl">
          {businesses.map((b) => (
            <li key={b.id}>
              <div className="mb-2 flex items-center justify-center gap-8 rounded-xl border border-gray-300 px-4 py-2">
                <p className="flex-1/7">{b.name}</p>
                {/* <p className="flex-1/7">{b.city}</p> */}
                <p className="flex-1/7">
                  {status}: {b.filteredReviewCount}
                </p>
                <button
                  className="btn-secondary flex cursor-pointer items-center justify-center rounded-3xl border border-black px-4 py-2"
                  onClick={() => toggleReviews(b.id)}
                >
                  {showReviewsMap[b.id] ? 'Hide Reviews' : 'Show Reviews'}
                </button>
                {/* <p className="flex-1/6">{b.categoryName}</p> */}

                <Link
                  href={`/admin/business/${b.id}`}
                  className="bg-chart-2 flex cursor-pointer items-center justify-center rounded-3xl px-4 py-2 text-white"
                >
                  See more
                </Link>
              </div>
              {showReviewsMap[b.id] && (
                <AdminReviewList businessId={b.id} currentStatus={status} />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl"> Нема бізнесів</p>
      )}
    </div>
  );
}

export default AdminReviewClient;
