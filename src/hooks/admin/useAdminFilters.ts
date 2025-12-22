'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { DEFAULT_ADMIN_FILTERS } from '@/const/filters-url';

import { parseBusinessStatus } from '@/lib/helpers/parseBusinessStatus';
import { AdminSort, OnlineFilter } from '@/types/enums';
import { AdminFilters } from '@/types/filters-query';

export function useAdminFilters() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const filters: AdminFilters = useMemo(
    () => ({
      city: searchParams.get('city') || DEFAULT_ADMIN_FILTERS.city,
      categoryId:
        searchParams.get('categoryId') || DEFAULT_ADMIN_FILTERS.categoryId,
      showOnlineStatus:
        (searchParams.get('showOnlineStatus') as OnlineFilter) ||
        DEFAULT_ADMIN_FILTERS.showOnlineStatus,
      sortBy:
        (searchParams.get('sortBy') as AdminSort) ||
        DEFAULT_ADMIN_FILTERS.sortBy,
      //   search: searchParams.get('search') || DEFAULT_ADMIN_FILTERS.search,
      businessStatus:
        parseBusinessStatus(searchParams.get('businessStatus')) ||
        DEFAULT_ADMIN_FILTERS.businessStatus,
    }),
    [searchParams]
  );
  //<K extends keyof AdminFilters>(key: K, value: AdminFilters[K])
  const updateFilter = useCallback(
    <K extends keyof AdminFilters>(key: K, value: AdminFilters[K]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === DEFAULT_ADMIN_FILTERS[key]) {
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
      K extends keyof typeof DEFAULT_ADMIN_FILTERS,
    >(
      key: K,
      value: (typeof DEFAULT_ADMIN_FILTERS)[K]
    ) => void,

    resetFilters,
  };
}
