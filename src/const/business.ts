import { BusinessStatus } from '@/types/enums';

export const BUSINESS_STATUS_ALL: BusinessStatus[] = [
  'pending',
  'approved',
  'hidden',
  'rejected',
  'draft',
] as const;

export const BUSINESS_STATUS: BusinessStatus[] = [
  'pending',
  'approved',
  // 'hidden',
  'rejected',
  // 'draft',
] as const;

export const BUSINESS_STATUS_OWNER: BusinessStatus[] = [
  'approved',
  'hidden',
] as const;

export const BUSINESS_STATUS_FOR_FORM: BusinessStatus[] = [
  'pending',
  'draft',
] as const;

export const OWNER_ALLOWED_TRANSITIONS: Record<
  BusinessStatus,
  BusinessStatus[]
> = {
  approved: ['hidden'], // approved -> hidden
  hidden: ['approved'], // hidden -> approved
  draft: ['pending'], // draft -> pending
  rejected: [], // owner cannot change from rejected
  pending: [], // owner cannot change from pending
};

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
