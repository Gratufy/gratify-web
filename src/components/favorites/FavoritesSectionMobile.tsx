import React from 'react';
import Link from 'next/link';
import { BusinessWithCategoryName } from '@/types';
import IconBack from '@/assets/icons/general/icon-back.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import BusinessList from '../shared/BusinessList';
import BottomSheetFavoriten from './BottomSheetFavoriten';
import NotFoundComponent from '../shared/NotFoundComponent';

type FavoritesSectionMobileProps = {
  businesses: BusinessWithCategoryName[];
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
  categoryId: string;
  setCategoryId: (id: string) => void;
  categoryName: string;
  setCategoryName: (name: string) => void;

  categoriesWithAll: { categoryId: string; name: string }[];
};

function FavoritesSectionMobile({
  businesses,
  isLoading,
  isError,
  error,
  categoryId,
  setCategoryId,
  categoryName,
  setCategoryName,
  categoriesWithAll,
}: FavoritesSectionMobileProps) {
  return (
    <>
      <div className="container flex w-full flex-col pt-2 lg:hidden">
        <div className="w-full">
          <Link href="/" className="flex w-10 px-2 py-3">
            <IconBack className="size-6" />
          </Link>
        </div>
        <div className="flex w-full gap-2 px-2 py-2">
          <div className="bg-background-grey-100 flex gap-1 px-2 py-2 lg:gap-2">
            <span className="placeholder-small lg:placeholder-xs xl:placeholder-sm">
              {categoryName}
            </span>
          </div>
          <button
            type="button"
            className={`placeholder-small lg:placeholder-xs xl:placeholder-sm border-elements-grey-200 flex cursor-pointer items-center gap-1 border bg-white px-2 py-2 lg:gap-2`}
            onClick={() => {
              setCategoryId('__all__');

              setCategoryName('Всі категорії');
            }}
          >
            <span>Очистити </span>
            <CrossIcon className="size-3 lg:size-4 xl:size-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col pb-20 pt-3">
          {businesses.length === 0 &&
            !isLoading &&
            !isError &&
            (categoryId === '__all__' ? (
              <NotFoundComponent IfFavorites />
            ) : (
              <NotFoundComponent />
            ))}
          <BusinessList
            // businesses={businesses ?? []}
            // isLoading={isLoading}
            // isError={isError}
            // error={error}
            businesses={businesses}
            isLoading={isLoading}
            isError={isError}
            error={error}
            linkPrefix="/favorites"
          />
        </div>
      </div>
      <BottomSheetFavoriten
        businesses={businesses}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        setCategoryName={setCategoryName}
        categoriesWithAll={categoriesWithAll}
      />
    </>
  );
}

export default FavoritesSectionMobile;
