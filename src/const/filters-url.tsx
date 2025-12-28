import { AdminBusinessesParams } from '@/types';
import {
  AdminSort,
  BusinessReviewStatus,
  BusinessStatus,
  OnlineFilter,
  SortBy,
} from '@/types/enums';

export const DEFAULT_FILTERS = {
  city: '__all__',
  category: '__all__',
  mode: 'all' as OnlineFilter,
  sort: 'newest' as SortBy,
  search: '',
};

// main dashboard and modering
export const DEFAULT_ADMIN_FILTERS: Required<
  Omit<AdminBusinessesParams, 'reviewStatus'>
> = {
  //reviewStatus: 'pending' as BusinessReviewStatus,
  city: '__all__',
  categoryId: '__all__',
  showOnlineStatus: 'all' as OnlineFilter, //mode
  sortBy: 'newest' as AdminSort, //sortBy,
  businessStatus: 'pending' as BusinessStatus,
};

export const DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS: Required<AdminBusinessesParams> =
  {
    reviewStatus: 'pending' as BusinessReviewStatus,
    city: '__all__',
    categoryId: '__all__',
    showOnlineStatus: 'all' as OnlineFilter, //mode
    sortBy: 'newest' as AdminSort, //sortBy,
    businessStatus: 'approved' as BusinessStatus,
  };
