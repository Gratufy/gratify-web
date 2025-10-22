'use client';
import React from 'react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import { OnlineFilter, SortBy } from '@/types';
import { useFilters } from '@/hooks/useFilters';

type DeleteAllFiltersBtnProps = {
  className?: string;
  isSecondVariant?: boolean;
};

function DeleteAllFiltersBtn({
  className,
  isSecondVariant = false,
}: DeleteAllFiltersBtnProps) {
  const { resetFilters } = useFilters();
  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center ${className}`}
      onClick={resetFilters}
    >
      {!isSecondVariant ? (
        <>
          <CrossIcon className="size-3 lg:size-4 xl:size-5" />
          <span>Очистити все</span>
        </>
      ) : (
        <>
          <span>Очистити все</span>
          <CrossIcon className="size-3 lg:size-4 xl:size-5" />
        </>
      )}
    </button>
  );
}

export default DeleteAllFiltersBtn;
