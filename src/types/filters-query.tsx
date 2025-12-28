import {
  DEFAULT_ADMIN_FILTERS,
  DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS,
  DEFAULT_FILTERS,
} from '@/const/filters-url';

export type FilterKeys = keyof typeof DEFAULT_FILTERS;
export type Filters = typeof DEFAULT_FILTERS;

// main dashboard and modering
export type AdminFilters = typeof DEFAULT_ADMIN_FILTERS;

export type AdminFiltersWithReviewStatus =
  typeof DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS;
