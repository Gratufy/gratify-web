import React from 'react';
import ToggleFavorite from './ToggleFavorite';

interface TitleBlockProps {
  name: string;
  categoryName: string | null;
  website: string | null;
  isFavorite: boolean;
  handleToggleFavorite: () => void;
}

function TitleBlock({
  name,
  categoryName,
  website,
  isFavorite,
  handleToggleFavorite,
}: TitleBlockProps) {
  return (
    <>
      <div className="flex justify-between gap-2">
        <h1 className="title-h2 mb-2">{name}</h1>
        <ToggleFavorite
          isFavorite={isFavorite}
          handleToggleFavorite={handleToggleFavorite}
        />
      </div>

      <div className="flex items-center justify-between lg:flex-col lg:items-start xl:flex-row xl:items-center">
        <p className="title-h4 lg:mb-1 xl:mb-0">{categoryName}</p>
        {website && (
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-big"
          >
            дивитись <span className="hidden lg:inline">сайт</span>
          </a>
        )}
      </div>
    </>
  );
}

export default TitleBlock;
