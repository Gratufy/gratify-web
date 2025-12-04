import { OnlineFilter, SortBy } from '@/types';

export const DEFAULT_FILTERS = {
  city: '__all__',
  category: '__all__',
  mode: 'all' as OnlineFilter,
  sort: 'newest' as SortBy,
  search: '',
};

export const DEFAULT_ADMIN_FILTERS = {
  city: '__all__',
  category: '__all__',
  mode: 'all' as OnlineFilter,
  sort: 'newest' as SortBy,
  // search: '',
  business_status: 'pending' as string,
};
