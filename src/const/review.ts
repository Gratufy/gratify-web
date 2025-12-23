import { BusinessReviewStatus } from '@/types/enums';

export const BUSINESS_REVIEW_STATUS: BusinessReviewStatus[] = [
  'pending',
  'approved',
  'hidden',
];

export const BUSINESS_REVIEW_STATUS_LABELS: Record<string, string> = {
  pending: 'На модерації',
  approved: 'Опубліковано',
  hidden: 'Приховано',
} as const;
