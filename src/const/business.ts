import { BusinessStatus } from '@/types';

export const BUSINESS_STATUS: BusinessStatus[] = [
  'pending',
  'approved',
  'hidden',
  'rejected',
];

export const PAGE_SIZE = 4;

export const ONLINE_STATUS_LABELS: Record<string, string> = {
  online: 'Тільки он-лайн',
  offline: 'Тільки з фізичною адресою',
  all: 'Всі',
};
