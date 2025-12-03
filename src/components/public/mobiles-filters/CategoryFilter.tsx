'use client';
import React, { useState } from 'react';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

import { SheetClose } from '@/components/ui/sheet';
import CategoryRadio from '@/components/shared/filters/CategoryRadio';
import { useFilters } from '@/hooks/useFilters';

type CategoryFilterProps = {
  categoriesWithAll: { categoryId: string; name: string }[];

  onApply: () => void;
};

function CategoryFilter({
  categoriesWithAll,

  onApply,
}: CategoryFilterProps) {
  const { filters, updateFilter } = useFilters();
  const [tempCategoryId, setTempCategoryId] = useState<string>(
    filters.category
  );

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3 py-2">
        <CategoryIcon className="h-5 w-5" />
        <h2 className="placeholder-sm font-medium">Послуги</h2>
      </div>

      <div
        role="radiogroup"
        aria-label="Category options"
        className="flex flex-wrap gap-x-2 gap-y-4 py-2"
      >
        {categoriesWithAll.map((category) => (
          <CategoryRadio
            key={category.categoryId}
            value={category.categoryId}
            checked={tempCategoryId === category.categoryId}
            onChange={setTempCategoryId}
            className="placeholder-small border-elements-main-500 border px-4 py-2"
          >
            {category.name}
          </CategoryRadio>
        ))}
      </div>

      <div className="mx-auto flex gap-4">
        <button
          type="button"
          onClick={() => setTempCategoryId('__all__')}
          // className="placeholder-xs w-30 border-background-main-400 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2"
          className="btn-reject"
        >
          <CrossIcon className="size-3 lg:size-4 xl:size-5" />
          <span>Скасувати</span>
        </button>
        <SheetClose
          onClick={() => {
            updateFilter('category', tempCategoryId);
            onApply(); // close Sheet
          }}
          //className="placeholder-sm bg-background-main-300 w-30 border-background-main-300 flex h-8 cursor-pointer items-center justify-center gap-1 border p-2 shadow-[1px_2px_10px_2px_var(--elements-grey-50)]"
          className="btn-aprove"
        >
          <CheckIcon className="size-3 lg:size-4 xl:size-5" />
          <span>Застосувати</span>
        </SheetClose>
      </div>
    </div>
  );
}

export default CategoryFilter;
