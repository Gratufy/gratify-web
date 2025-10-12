import React from 'react';
import { BusinessSpecialOffer } from '@/types';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

type SpecialOffersProps = {
  specialOffers: (BusinessSpecialOffer & {
    title: string | null;
  })[];
};

function SpecialOffersBlock({ specialOffers }: SpecialOffersProps) {
  return (
    <>
      {specialOffers.length > 0 && (
        <div className="flex flex-col gap-1">
          {specialOffers.map((offer) => (
            <div key={offer.offerId} className="flex items-center gap-3">
              <CheckIcon className="h-3 w-3 flex-shrink-0 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
              <span className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
                {offer.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SpecialOffersBlock;
