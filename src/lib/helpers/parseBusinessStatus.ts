import { DEFAULT_ADMIN_FILTERS } from '@/const/filters-url';
import { BusinessStatus } from '@/types';

export function parseBusinessStatus(value: string | null): BusinessStatus {
  if (!value) return DEFAULT_ADMIN_FILTERS.businessStatus;

  if (['pending', 'approved', 'rejected', 'hidden'].includes(value)) {
    return value as BusinessStatus;
  }

  return DEFAULT_ADMIN_FILTERS.businessStatus;
}
