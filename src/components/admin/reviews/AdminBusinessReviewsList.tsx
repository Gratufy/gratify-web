'use client';
import React, { useState } from 'react';
import Link from 'next/link';

import { AdminFiltersWithReviewStatus } from '@/types/filters-query';
import { AdminBusinessRowType } from '@/types';

import { BUSINESS_REVIEW_STATUS_LABELS } from '@/const/review';

import IconEyeOpen from '@/assets/icons/admin/icon-eye-open.svg';
import IconEyeClose from '@/assets/icons/admin/icon-eye.svg';
import { ArrowBigDown } from 'lucide-react';
import { ArrowBigUp } from 'lucide-react';

import AdminSkeleton from '@/components/admin/shared/AdminSkeleton';
import AdminReviewList from '@/components/admin/reviews/AdminReviewList';
import ReviewsPageFilters from './ReviewsPageFilters';

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
function AdminBusinessReviewsList({
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

  return (
    <>
      {/*  Filters*/}
      <ReviewsPageFilters
        filters={filters}
        updateFilter={updateFilter}
        categoriesWithAll={categoriesWithAll}
      />

      {isError && (
        <div className="placeholder-sm xl:placeholder-base text-center">
          Помилка: {error?.message}
        </div>
      )}
      {isBusinessesLoading && <AdminSkeleton count={3} />}
      {businesses?.length > 0 && (
        <div className="bg-background-main-50 rounded-lg py-4 lg:px-1">
          {/* Header */}
          <div className="mb-4 grid w-full min-w-0 grid-cols-[1fr_1fr_1fr] gap-2 px-2 py-2 lg:mb-6">
            <div className="title-h6 min-w-0">
              <span>Найменування </span>
            </div>
            <div className="title-h6 min-w-0">
              <span>Категорія</span>
            </div>
            <div className="title-h6 min-w-0 text-center">
              <span>Дивитись відгуки</span>
            </div>
          </div>
          {/* Rows */}
          <ul className="flex flex-col gap-5 px-1 lg:px-0">
            {businesses.map((b) => (
              <li key={b.id}>
                <Link
                  aria-label={`Перейти до бізнесу ${b.name}`}
                  href={`/admin/business/${b.id}`}
                  className={`bg-icons-main-100-1 grid grid-cols-[1fr_1fr_1fr] items-center justify-center gap-2 rounded-lg px-2 py-2 transition-colors ${
                    isHoveringButton ? '' : 'hover:bg-background-main-300/80'
                  }`}
                >
                  <p className="title-h6">{b.name}</p>

                  <p className="title-h6">{b.categoryName}</p>

                  <button
                    aria-label={
                      showReviewsMap[b.id]
                        ? `Приховати відгуки для бізнесу ${b.name}`
                        : `Переглянути ${b.filteredReviewCount} відгуків для бізнесу ${b.name}`
                    }
                    className="xl:placeholder-base placeholder-sm items-centertitle-h6 bg-background-grey-100 hover:bg-background-grey-100/80 border-icons-main-500 mx-auto flex w-full cursor-pointer items-center rounded-lg border px-2 py-2 transition-colors lg:w-48"
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
                          <div>
                            <span className="hidden lg:inline-block">
                              {
                                BUSINESS_REVIEW_STATUS_LABELS[
                                  filters.reviewStatus
                                ]
                              }
                              :
                            </span>
                            <span>{b.filteredReviewCount}</span>
                          </div>

                          <ArrowBigUp className="size-5" />
                        </div>
                      </>
                    ) : (
                      <>
                        <IconEyeOpen className="mr-2 size-6" />

                        <div className="flex w-full justify-between">
                          <div>
                            <span className="hidden lg:inline-block">
                              {
                                BUSINESS_REVIEW_STATUS_LABELS[
                                  filters.reviewStatus
                                ]
                              }
                              :
                            </span>
                            <span>{b.filteredReviewCount}</span>
                          </div>
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

export default AdminBusinessReviewsList;
