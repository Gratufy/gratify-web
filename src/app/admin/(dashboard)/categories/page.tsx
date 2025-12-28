import React from 'react';

import AdminCategoriesClient from '@/components/admin/categories/AdminCategoriesClient';
// export const categorySchema = v.object({
//   name: v.pipe(v.string(), v.nonEmpty("Введіть назву категорії")),
// });

export default function AdminCategory() {
  return (
    <div className="flex w-full">
      <AdminCategoriesClient />
    </div>
  );
}
