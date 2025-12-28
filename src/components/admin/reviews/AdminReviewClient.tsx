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
import AdminDesktopBusinessReviewsList from './AdminDesktopBusinessReviewsList';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { RefreshCcw } from 'lucide-react';
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
  const queryClient = useQueryClient();
  return (
    <div className="max-[1024px]:max-w-150 w-full max-[1024px]:mx-auto lg:flex lg:flex-col lg:items-center lg:justify-center">
      {/*  mobile nav title */}
      <div className="bg-background-main-100 flex items-center justify-center gap-3 py-3 lg:hidden">
        <EditPen className="size-5" />
        <span className="title-h4">Модерування</span>
      </div>
      <div className="bg-background-grey-50 w-full max-[1024px]:px-4 lg:mt-3 lg:p-5">
        <button
          className="btn-reject mb-4"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
            queryClient.invalidateQueries({ queryKey: ['businessReviews'] });
          }}
        >
          <RefreshCcw className="size-4" />
          <span>Обновить</span>
        </button>
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
  );
}

export default AdminReviewClient;
