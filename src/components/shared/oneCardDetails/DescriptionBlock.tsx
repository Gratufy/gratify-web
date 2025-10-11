import React from 'react';
import Karma from '../Karma';
import CheckIcon from '@/assets/icons/general/icon-check.svg';
import { BusinessSpecialOffer } from '@/types';
type DescriptionBlockProps = {
  id: string;
  description: string | null;
  specialOffers: (BusinessSpecialOffer & {
    title: string | null;
  })[];
  karma: number;
};

function DescriptionBlock({
  id,
  description,
  specialOffers,
  karma,
}: DescriptionBlockProps) {
  return (
    <div>
      {specialOffers.length > 0 &&
        specialOffers.map((offer) => (
          <div
            key={offer.offerId}
            className="flex items-center gap-3 overflow-hidden"
          >
            <CheckIcon className="h-3 w-3 flex-shrink-0 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
            <span className="placeholder-xs lg:placeholder-sm xl:placeholder-base block truncate">
              {offer.title}
            </span>
          </div>
        ))}
      <p>{description}</p>
      <Karma businessId={id} initialKarma={karma} />
    </div>
  );
}

export default DescriptionBlock;
