'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { DEFAULT_ADMIN_FILTERS } from '@/const/filters-url';
import { OnlineFilter, SortBy } from '@/types';

export function useAdminFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      city: searchParams.get('city') || DEFAULT_ADMIN_FILTERS.city,
      category: searchParams.get('category') || DEFAULT_ADMIN_FILTERS.category,
      mode:
        (searchParams.get('mode') as OnlineFilter) ||
        DEFAULT_ADMIN_FILTERS.mode,
      sort: (searchParams.get('sort') as SortBy) || DEFAULT_ADMIN_FILTERS.sort,
      //   search: searchParams.get('search') || DEFAULT_ADMIN_FILTERS.search,
      search:
        searchParams.get('  business_status') ||
        DEFAULT_ADMIN_FILTERS.business_status,
    }),
    [searchParams]
  );

  const updateFilter = useCallback(
    <K extends keyof typeof DEFAULT_ADMIN_FILTERS>(
      key: K,
      value: (typeof DEFAULT_ADMIN_FILTERS)[K]
    ) => {
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
