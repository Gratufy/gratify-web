import { DEFAULT_ADMIN_FILTERS, DEFAULT_FILTERS } from '@/const/filters-url';

export type FilterKeys = keyof typeof DEFAULT_FILTERS;
export type Filters = typeof DEFAULT_FILTERS;

export type AdminFilters = typeof DEFAULT_ADMIN_FILTERS;
