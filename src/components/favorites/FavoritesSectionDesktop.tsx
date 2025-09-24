'use client';
import React from 'react';
import SidebarFavorites from './SidebarFavorites';

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
  return (
    <div className="container hidden w-full lg:block">
      <SidebarFavorites
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        setCategoryName={setCategoryName}
        categoriesWithAll={categoriesWithAll}
      />
    </div>
  );
}

export default FavoritesSectionDesktop;
