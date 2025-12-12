import { BusinessReviewStatus } from '@/types';

export const BUSINESS_REVIEW_STATUS: BusinessReviewStatus[] = [
  'pending',
  'approved',
  'rejected',
];

export const BUSINESS_REVIEW_STATUS_LABELS: Record<string, string> = {
  pending: 'На модерації',
  approved: 'Опубліковано',
  rejected: 'Відхилено',
} as const;
