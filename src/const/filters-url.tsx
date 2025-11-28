import { OnlineFilter, SortBy } from '@/types';

export const DEFAULT_FILTERS = {
  city: '__all__',
  category: '__all__',
  mode: 'all' as OnlineFilter,
  sort: 'newest' as SortBy,
  search: '',
};
