'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS } from '@/const/filters-url';

import { parseBusinessStatus } from '@/lib/helpers/parseBusinessStatus';
import { AdminSort, OnlineFilter } from '@/types/enums';
import { AdminFiltersWithReviewStatus } from '@/types/filters-query';
import { parseReviewStatus } from '@/lib/helpers/parseReviewStatus';

export function useAdminFiltersWithReviewStatus() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const filters: AdminFiltersWithReviewStatus = useMemo(
    () => ({
      city:
        searchParams.get('city') ||
        DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS.city,
      categoryId:
        searchParams.get('categoryId') ||
        DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS.categoryId,
      showOnlineStatus:
        (searchParams.get('showOnlineStatus') as OnlineFilter) ||
        DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS.showOnlineStatus,
      sortBy:
        (searchParams.get('sortBy') as AdminSort) ||
        DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS.sortBy,
      //   search: searchParams.get('search') || DEFAULT_ADMIN_FILTERS.search,
      businessStatus:
        parseBusinessStatus(searchParams.get('businessStatus')) ||
        DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS.businessStatus,
      reviewStatus:
        parseReviewStatus(searchParams.get('reviewStatus')) ||
        DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS.reviewStatus,
    }),

    [searchParams]
  );
  //<K extends keyof AdminFilters>(key: K, value: AdminFilters[K])
  const updateFilter = useCallback(
    <K extends keyof AdminFiltersWithReviewStatus>(
      key: K,
      value: AdminFiltersWithReviewStatus[K]
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS[key]) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push('?');
  }, [router]);

  return {
    filters,
    updateFilter: updateFilter as <
      K extends keyof typeof DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS,
    >(
      key: K,
      value: (typeof DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS)[K]
    ) => void,

    resetFilters,
  };
}
