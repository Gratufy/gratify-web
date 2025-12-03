import React from 'react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import CategoryIcon from '@/assets/icons/filters/icon-favor.svg';
import CategoryRadio from '../shared/filters/CategoryRadio';

type SidebarFavoritesProps = {
  categoryId: string;
  setCategoryId: (id: string) => void;
  setCategoryName: (name: string) => void;
  categoriesWithAll: { categoryId: string; name: string }[];
};

function SidebarFavorites({
  categoryId,
  setCategoryId,
  setCategoryName,
  categoriesWithAll,
}: SidebarFavoritesProps) {
  return (
    <aside className="lg:w-54 xl:w-70 hidden flex-shrink-0 lg:flex lg:items-start">
      <div className="lg:border-elements-grey-200 w-full lg:flex lg:flex-col lg:gap-2 lg:border-[0.5px] lg:px-2 lg:pb-4 lg:pt-2 xl:px-4 xl:pb-8 xl:pt-3">
        <div>
          <label
            htmlFor="categories"
            className="placeholder-sm xl:placeholder-base flex items-center gap-3 px-4 py-1 xl:mb-2"
          >
            <CategoryIcon className="h-4 w-4 xl:h-5 xl:w-5" />
            <span>Послуги</span>
          </label>
          <div
            role="radiogroup"
            aria-label="Category options"
            className="flex flex-wrap gap-x-2 gap-y-4 py-2"
          >
            {categoriesWithAll.map((category) => (
              <CategoryRadio
                key={category.categoryId}
                value={category.categoryId}
                checked={categoryId === category.categoryId}
                onChange={(val) => {
                  setCategoryId(val); // id категории
                  const selected = categoriesWithAll.find(
                    (c) => c.categoryId === val
                  );
                  setCategoryName(selected?.name ?? '');
                }}
                className="placeholder-xs xl:placeholder-sm border-elements-main-500 border px-4 py-2"
              >
                {category.name}
              </CategoryRadio>
            ))}
          </div>
        </div>
        <button
          type="button"
          // className="placeholder-sm xl:placeholder-base flex w-full cursor-pointer items-center justify-center gap-3 px-4 py-1 xl:px-4"
          className="btn-reject"
          onClick={() => {
            setCategoryId('__all__');
            setCategoryName('Всі категорії');
          }}
        >
          <CrossIcon className="size-3 lg:size-4 xl:size-5" />
          <span>Очистити все</span>
        </button>
      </div>
    </aside>
  );
}

export default SidebarFavorites;
