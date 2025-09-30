import React from 'react';
import Link from 'next/link';
import { BusinessWithCategoryName } from '@/types';
import IconBack from '@/assets/icons/general/icon-back.svg';

import BusinessList from '../shared/BusinessList';

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
    <div className="container flex w-full flex-col pt-2 lg:hidden">
      <div className="w-full">
        <Link href="/" className="flex w-10 px-2 py-3">
          <IconBack className="size-6" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col pb-20 pt-3">
        {businesses.length === 0 && !isLoading && !isError && (
          <p className="placeholder-sm lg:placeholder-base">
            Ви ще не додали жодного бізнесу до улюблених
          </p>
        )}
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
  );
}

export default FavoritesSectionMobile;
