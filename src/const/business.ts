import { BusinessStatus } from '@/types';

export const BUSINESS_STATUS: BusinessStatus[] = [
  'pending',
  'approved',
  'hidden',
  'rejected',
  // 'draft',
] as const;

export const BUSINESS_STATUS_OWNER: BusinessStatus[] = [
  'approved',
  'draft',
] as const;
//export const BUSINESS_STATUS = ['pending', 'approved', 'hidden', 'rejected'];

// for ADMIN
export const BUSINESS_STATUS_LABELS: Record<string, string> = {
  pending: 'На модерації',
  approved: 'Опубліковано',
  hidden: 'Приховано',
  rejected: 'Відхилено',
  draft: 'Чорнетка',
} as const;

// for OWNER
// export const BUSINESS_STATUS_LABELS_OWNER: Record<string, string> = {
//   pending: 'На модерації',
//   draft: 'Чорнетка',
// } as const;

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
