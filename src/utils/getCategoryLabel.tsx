// export function getCategoryLabel(
//   categoryId: string,
//   categories: BusinessCategory[]
// ): string {
//   const category = categories.find((c) => c.categoryId === categoryId);
//   return category ? category.name : 'Всі категорії';
// }



export function getCategoryLabel(
  categoryId: string,
  categoriesWithAll?:  {
    categoryId: string;
    name: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }[]
): string {
  return (
    categoriesWithAll?.find((c) => c.categoryId === categoryId)?.name ??
    'Всі категорії'
  );
}
