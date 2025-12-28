'use client';
import React, { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useAdminBusinesses } from '@/hooks/useBusinesses';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useAdminFiltersWithReviewStatus } from '@/hooks/admin/useAdminFiltersWithReviewStatus';

import { RefreshCcw } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';

import AdminDesktopBusinessReviewsList from '@/components/admin/reviews/AdminDesktopBusinessReviewsList';

function AdminReviewClient() {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();

  const [showReviewsMap, setShowReviewsMap] = useState<Record<string, boolean>>(
    {}
  );

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
    sortBy: 'newest',
  });
  function toggleReviews(businessId: string) {
    setShowReviewsMap((prev) => ({
      ...prev,
      [businessId]: !prev[businessId],
    }));
  }

  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі' }, //index "__all__" for   "всi"
    ...(categories || []),
  ];
  const queryClient = useQueryClient();
  return (
    <div className="max-[1024px]:max-w-150 w-full max-[1024px]:mx-auto lg:flex lg:flex-col lg:items-center lg:justify-center">
      {/*  mobile nav title */}
      <div className="bg-background-main-100 flex items-center justify-center gap-3 py-3 lg:hidden">
        <EditPen className="size-5" />
        <span className="title-h4">Модерування</span>
      </div>
      <div className="bg-background-grey-50 w-full max-[1024px]:px-4 max-[1024px]:py-4 lg:mt-3 lg:p-5">
        <button
          className="btn-reject"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ['adminBusinesses'],
              exact: false,
            });
            // queryClient.invalidateQueries({ queryKey: ['businessReviews'] });
            queryClient.invalidateQueries({
              predicate: (query) =>
                Array.isArray(query.queryKey) &&
                query.queryKey[0] === 'businessReviews' &&
                query.queryKey[2] === 'admin' &&
                query.queryKey[3] === filters.reviewStatus,
            });
          }}
        >
          <RefreshCcw className="size-4" />
          <span>Оновити</span>
        </button>
        <div className="w-full pt-8 lg:pt-4">
          <AdminDesktopBusinessReviewsList
            categoriesWithAll={categoriesWithAll}
            filters={filters}
            updateFilter={updateFilter}
            businesses={businesses}
            isBusinessesLoading={isBusinessesLoading}
            isError={isError}
            error={error}
            toggleReviews={toggleReviews}
            showReviewsMap={showReviewsMap}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminReviewClient;
