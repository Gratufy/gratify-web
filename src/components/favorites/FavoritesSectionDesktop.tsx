'use client';
import React from 'react';
import IconBack from '@/assets/icons/general/icon-back.svg';
import SidebarFavorites from './SidebarFavorites';
import BusinessListSimple from '../shared/BusinessListSimple';
import { useUserFavoriteBusinesses } from '@/hooks/useFavorites';
import Link from 'next/link';

type FavoritesSectionDesktopProps = {
  categoryId: string;
  setCategoryId: (id: string) => void;
  categoryName: string;
  setCategoryName: (name: string) => void;

  categoriesWithAll: { categoryId: string; name: string }[];
};

function FavoritesSectionDesktop({
  categoryId,
  setCategoryId,
  categoryName,
  setCategoryName,
  categoriesWithAll,
}: FavoritesSectionDesktopProps) {
  const {
    data: businesses,
    isLoading,
    isError,
    error,
  } = useUserFavoriteBusinesses(categoryId);
  return (
    <div className="container hidden w-full lg:block">
      <div className="w-full">
        <Link href="/" className="flex pb-4 pr-2 pt-2">
          <IconBack className="size-6" />
        </Link>
      </div>
      <div className="hidden w-full lg:flex lg:flex-row lg:gap-6">
        <SidebarFavorites
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          setCategoryName={setCategoryName}
          categoriesWithAll={categoriesWithAll}
        />
        <div className="flex flex-1 flex-col pb-20 lg:pb-8">
          <BusinessListSimple
            businesses={businesses ?? []}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default FavoritesSectionDesktop;
