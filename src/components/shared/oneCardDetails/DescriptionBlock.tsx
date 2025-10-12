import React from 'react';
import Karma from '../Karma';

type DescriptionBlockProps = {
  id: string;
  description: string | null;
};

function DescriptionBlock({ id, description }: DescriptionBlockProps) {
  return (
    <>
      <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
        {description}
      </p>
    </>
  );
}

export default DescriptionBlock;
