import React from 'react';

import { BusinessWithCategoryName } from '@/types';

import SidebarFavorites from './SidebarFavorites';
import BusinessList from '../shared/BusinessList';
import NotFoundComponent from '../shared/NotFoundComponent';
import GoBackButton from '../ui/GoBackButton';

type FavoritesSectionDesktopProps = {
  businesses: BusinessWithCategoryName[];
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
  categoryId: string;
  setCategoryId: (id: string) => void;
  // categoryName: string;
  setCategoryName: (name: string) => void;

  categoriesWithAll: { categoryId: string; name: string }[];
};

function FavoritesSectionDesktop({
  businesses,
  isLoading,
  isError,
  error,
  categoryId,
  setCategoryId,
  // categoryName,
  setCategoryName,
  categoriesWithAll,
}: FavoritesSectionDesktopProps) {
  return (
    <div className="container hidden w-full lg:block">
      <div className="w-full">
        <GoBackButton href="/" className="w-8 pb-4 pr-2 pt-2" />
      </div>
      <div className="hidden w-full lg:flex lg:flex-row lg:gap-6">
        <SidebarFavorites
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          setCategoryName={setCategoryName}
          categoriesWithAll={categoriesWithAll}
        />

        <div className="flex flex-1 flex-col overflow-hidden pb-20 lg:pb-8">
          {businesses.length === 0 &&
            !isLoading &&
            !isError &&
            categoryId != '__all__' && <NotFoundComponent />}

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
    </div>
  );
}

export default FavoritesSectionDesktop;
