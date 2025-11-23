'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';

import { DEFAULT_FILTERS } from '@/const/filters-url';
import { OnlineFilter, SortBy } from '@/types';

// export function useFilters() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const filters = useMemo(
//     () => ({
//       city: searchParams.get('city') || DEFAULT_FILTERS.city,
//       category: searchParams.get('category') || DEFAULT_FILTERS.category,
//       mode: (searchParams.get('mode') as OnlineFilter) || DEFAULT_FILTERS.mode,
//       sort: (searchParams.get('sort') as SortBy) || DEFAULT_FILTERS.sort,
//     }),
//     [searchParams]
//   );

//   const updateFilter = useCallback(
//     <K extends keyof typeof DEFAULT_FILTERS>(
//       key: K,
//       value: (typeof DEFAULT_FILTERS)[K]
//     ) => {
//       const params = new URLSearchParams(searchParams.toString());
//       if (value === DEFAULT_FILTERS[key]) {
//         params.delete(key);
//       } else {
//         params.set(key, String(value));
//       }
//       router.push(`?${params.toString()}`);
//     },
//     [router, searchParams]
//   );

//   return { filters, updateFilter };
// }

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      city: searchParams.get('city') || DEFAULT_FILTERS.city,
      category: searchParams.get('category') || DEFAULT_FILTERS.category,
      mode: (searchParams.get('mode') as OnlineFilter) || DEFAULT_FILTERS.mode,
      sort: (searchParams.get('sort') as SortBy) || DEFAULT_FILTERS.sort,
    }),
    [searchParams]
  );
  const updateFilter = useCallback(
    <K extends keyof typeof DEFAULT_FILTERS>(
      key: K,
      value: (typeof DEFAULT_FILTERS)[K]
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === DEFAULT_FILTERS[key]) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const updateFilters = useCallback(
    (updates: Partial<typeof DEFAULT_FILTERS>) => {
      const params = new URLSearchParams(searchParams.toString());

      (Object.keys(updates) as (keyof typeof DEFAULT_FILTERS)[]).forEach(
        (key) => {
          const value = updates[key];
          if (value === DEFAULT_FILTERS[key]) {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        }
      );

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );
  const resetFilters = useCallback(() => {
    router.push('?');
  }, [router]);

  return {
    filters,
    updateFilter: updateFilter as <K extends keyof typeof DEFAULT_FILTERS>(
      key: K,
      value: (typeof DEFAULT_FILTERS)[K]
    ) => void,
    updateFilters,
    resetFilters,
  };
}
