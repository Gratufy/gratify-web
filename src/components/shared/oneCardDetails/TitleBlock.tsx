import React from 'react';
type TitleBlockProps = {
  name: string;
  categoryName: string | null;
  website: string | null;
};

function TitleBlock({ name, categoryName, website }: TitleBlockProps) {
  return (
    <div>
      <h1 className="mb-4 text-2xl">{name}</h1>
      {/* <p className="text-2xl mb-4">City: {business?.locations}</p> */}
      <p className="text-2xl">{categoryName}</p>
      {website && <p>{website}</p>}
    </div>
  );
}

export default TitleBlock;
