'use client';
import React from 'react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';

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
      aria-label="Очистити фільтри"
      type="button"
      className={`btn-reject ${className}`}
      onClick={resetFilters}
    >
      {!isSecondVariant ? (
        <>
          <CrossIcon
            className="size-3 lg:size-4 xl:size-5"
            aria-hidden="true"
          />
          <span>Очистити все</span>
        </>
      ) : (
        <>
          <span>Очистити все</span>
          <CrossIcon
            className="size-3 lg:size-4 xl:size-5"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}

export default DeleteAllFiltersBtn;
