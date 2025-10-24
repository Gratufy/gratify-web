import { BusinessStatus } from '@/types';

export const BUSINESS_STATUS: BusinessStatus[] = [
  'pending',
  'approved',
  'hidden',
  'rejected',
];

export const BUSINESS_STATUS_LABELS: Record<string, string> = {
  pending: 'На модерації',
  approved: 'Опубліковано',
  hidden: 'Приховано',
  rejected: 'Відхилено',
} as const;
export const PAGE_SIZE = 4;

export const ONLINE_STATUS_LABELS: Record<string, string> = {
  online: 'Тільки он-лайн',
  offline: 'Тільки з фізичною адресою',
  all: 'Всі',
};

export const SORT_BY_LABELS: Record<string, string> = {
  newest: 'Нові',
  mostKarma: 'Популярні',
  hot: 'Стрімкий ріст',
};
