import { BusinessStatus, OnlineFilter, SortBy } from '@/types/enums';

export const DEFAULT_FILTERS = {
  city: '__all__',
  category: '__all__',
  mode: 'all' as OnlineFilter,
  sort: 'newest' as SortBy,
  search: '',
};

export const DEFAULT_ADMIN_FILTERS = {
  city: '__all__',
  categoryId: '__all__',
  mode: 'all' as OnlineFilter,
  sort: 'newest' as SortBy,
  businessStatus: 'pending' as BusinessStatus,
};
