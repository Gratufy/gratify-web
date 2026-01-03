import React from 'react';

interface DescriptionBlockProps {
  description: string | null;
}

function DescriptionBlock({ description }: DescriptionBlockProps) {
  return (
    <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
      {description}
    </p>
  );
}

export default DescriptionBlock;
