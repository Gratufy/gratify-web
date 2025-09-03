import React from 'react';
import Karma from './Karma';
import { BusinessWithCategoryName } from '@/types';
import Link from 'next/link';
import { renderLocations } from '@/lib/helpers/renderLocations';
import Image from 'next/image';
import CheckIcon from '@/assets/icons/general/icon-check.svg';

import ReviewIcon from '@/assets/icons/general/icon-bubble.svg';

function BusinessCardShot({
  business,
  selectedCity,
  imageUrl,
}: {
  business: BusinessWithCategoryName;
  selectedCity?: string;
  imageUrl?: string;
}) {
  const CityListElements = renderLocations(business, selectedCity);
  return (
    <div className="w-full bg-white pb-5">
      {/* header */}
      <div className="lg:h-22 relative mb-4 flex h-16 items-center">
        {/* block with image */}
        <div className="ml-15 lg:ml-26 xl:ml-67 relative h-full flex-1 overflow-hidden">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={business.name}
                fill
                style={{ objectFit: 'cover' }}
                className="relative z-0"
              />
            </>
          ) : (
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-blue-300"></div>
          )}
        </div>
        {/* Gradient over the image from-white/70 to-[rgb(217,217,217)/70*/}
        <div className="ml-15 z-5 bg-linear-to-r/increasing pointer-events-none absolute inset-0 from-white/95 to-gray-300/50"></div>
        {/* name */}
        <div className="absolute z-10 bg-transparent py-2 pl-4 lg:pl-2">
          <h2 className="title-h3">{business.name}</h2>
          <p className="title-h4">{business.categoryName}</p>
        </div>
      </div>
      {/* body */}
      <div className="mb-4 flex gap-4 px-4 lg:mb-5 lg:gap-6 lg:px-2 xl:mb-3">
        <div className="flex flex-1 flex-col gap-1">
          {business?.specialOffers.length > 0 &&
            business.specialOffers.map((offer) => (
              <div key={offer.offerId} className="flex items-center gap-3">
                <CheckIcon className="h-3 w-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                <span className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
                  {offer.title}
                </span>
              </div>
            ))}
        </div>
        <div className="flex-1">
          <p className="placeholder-xs text-text-700-grey lg:placeholder-sm">
            {business.description}
          </p>
        </div>
        {/* {CityListElements}
        <p>status: {business.status}</p>
        <p>review : {business.reviewCount}</p> */}
        {/* karma */}
        {/* <Karma businessId={business.id} />
        <Link
          href={`./business/${business.id}`}
          className="bg-chart-2 cursor-pointer rounded-full px-4 py-2 text-white"
        >
          See more
        </Link> */}
      </div>
      {/* hot */}
      <div className="flex gap-4 px-4 lg:gap-6 lg:px-2">
        <div className="flex flex-1 items-center gap-4 lg:gap-3">
          <Karma businessId={business.id} />

          <div className="flex items-center gap-0.5">
            <ReviewIcon className="h-4 w-4 xl:h-5 xl:w-5" />
            <span className="placeholder-sm xl:placeholder-base font-medium">
              {business.reviewCount}
            </span>
          </div>
        </div>
        <div className="flex-1">
          {business.isOnline && (
            <span className="placeholder-sm xl:placeholder-base">
              Он-лайн тільки
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusinessCardShot;
