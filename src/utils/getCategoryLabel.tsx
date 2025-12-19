// export function getCategoryLabel(
//   categoryId: string,
//   categories: BusinessCategory[]
// ): string {
//   const category = categories.find((c) => c.categoryId === categoryId);
//   return category ? category.name : 'Всі категорії';
// }

import { BusinessCategory } from '@/types/db';

export function getCategoryLabel(
  categoryId: string,
  categoriesWithAll?: BusinessCategory[]
): string {
  return (
    categoriesWithAll?.find((c) => c.categoryId === categoryId)?.name ??
    'Всі категорії'
  );
}
