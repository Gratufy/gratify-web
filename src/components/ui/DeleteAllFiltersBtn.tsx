import React from 'react';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import { OnlineFilter, SortBy } from '@/types';

type DeleteAllFiltersBtnProps = {
  setCity: (city: string) => void;
  setCityName: (name: string) => void;
  setCategoryId: (id: string) => void;
  setShowOnlineStatus: (status: OnlineFilter) => void;
  setSortBy: (sort: SortBy) => void;
  setCategoryName: (name: string) => void;
  className?: string;
  isSecondVariant?: boolean;
};

function DeleteAllFiltersBtn({
  setCity,
  setCityName,
  setCategoryId,
  setShowOnlineStatus,
  setSortBy,
  setCategoryName,
  className,
  isSecondVariant = false,
}: DeleteAllFiltersBtnProps) {
  return (
    <button
      type="button"
      className={`cursor-pointer ${className}`}
      onClick={() => {
        setCity('__all__');
        setCityName('Всі міста');
        setCategoryId('__all__');
        setShowOnlineStatus('all');
        setSortBy('newest');
        setCategoryName('Всі категорії');
      }}
    >
      {!isSecondVariant ? (
        <>
          <CrossIcon className="h-4 w-4 xl:h-5 xl:w-5" />
          <span>Очистити все</span>
        </>
      ) : (
        <>
          <span>Очистити все</span>
          <CrossIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </>
      )}
    </button>
  );
}

export default DeleteAllFiltersBtn;
