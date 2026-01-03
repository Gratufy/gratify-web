import React from 'react';
import IconFavorite from '@/assets/icons/general/favorite-h.svg';

interface ToggleFavoriteProps {
  isFavorite: boolean;
  handleToggleFavorite: () => void;
}

function ToggleFavorite({
  isFavorite,
  handleToggleFavorite,
}: ToggleFavoriteProps) {
  return (
    <div className="flex items-start pt-1">
      <button
        aria-label={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
        onClick={handleToggleFavorite}
        className="cursor-pointer border-none bg-transparent outline-none"
      >
        {isFavorite ? (
          <div className="flex gap-1">
            <p className="title-h6 underline">Збережено</p>
            <IconFavorite className="text-icons-color-accent h-7 w-6 lg:h-7 lg:w-6" />
          </div>
        ) : (
          <div className="flex gap-1">
            <p className="title-h6 underline">Зберегти</p>
            <IconFavorite className="text-background-white h-7 w-6 lg:h-7 lg:w-6" />
          </div>
        )}
      </button>
    </div>
  );
}

export default ToggleFavorite;
