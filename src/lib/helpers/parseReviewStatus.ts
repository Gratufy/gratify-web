import { DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS } from '@/const/filters-url';

import { BusinessReviewStatus } from '@/types/enums';

export function parseReviewStatus(value: string | null): BusinessReviewStatus {
  if (!value) return DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS.reviewStatus;

  if (['pending', 'approved', 'hidden'].includes(value)) {
    return value as BusinessReviewStatus;
  }

  return DEFAULT_ADMIN_FILTERS_WITH_REVIEW_STATUS.reviewStatus;
}
