import React from 'react';
type TitleBlockProps = {
  name: string;
  categoryName: string | null;
  website: string | null;
};

function TitleBlock({ name, categoryName, website }: TitleBlockProps) {
  return (
    <>
      <h1 className="title-h2 mb-2">{name}</h1>
      {/* <p className="text-2xl mb-4">City: {business?.locations}</p> */}
      <div className="flex items-center justify-between lg:flex-col xl:flex-row">
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
