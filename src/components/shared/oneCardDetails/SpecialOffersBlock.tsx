import React from 'react';
import { BusinessSpecialOffer, ownOffersForCard } from '@/types';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

type SpecialOffersProps = {
  specialOffers: (BusinessSpecialOffer & {
    title: string | null;
  })[];
  ownOffers: ownOffersForCard;
};

function SpecialOffersBlock({ specialOffers, ownOffers }: SpecialOffersProps) {
  const combinedOffers = [...ownOffers, ...specialOffers];

  // const combinedOffers2 = [...specialOffers, ...ownOffers];
  // console.log('combinedOffers2', combinedOffers2);
  return (
    <>
      {combinedOffers.length > 0 && (
        <div className="flex flex-col gap-1 lg:pl-2">
          {combinedOffers.map((offer) => (
            <div key={offer.offerId} className="flex items-center gap-3">
              <CheckIcon className="h-3 w-3 flex-shrink-0 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
              <span className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
                {offer.title?.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SpecialOffersBlock;
