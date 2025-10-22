import { BusinessCategory } from '@/types';

export function getCategoriesWithAll(categories: BusinessCategory[]): {
  categoryId: string;
  name: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}[] {
  return [{ categoryId: '__all__', name: 'Всі категорії' }, ...categories];
}
