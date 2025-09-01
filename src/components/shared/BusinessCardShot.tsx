import React from 'react';
import Karma from './Karma';
import { BusinessWithCategoryName } from '@/types';
import Link from 'next/link';
import { renderLocations } from '@/lib/helpers/renderLocations';

function BusinessCardShot({
  business,
  selectedCity,
}: {
  business: BusinessWithCategoryName;
  selectedCity?: string;
}) {
  const CityListElements = renderLocations(business, selectedCity);
  return (
    <div className="rounded-4xl lg:w-160 mb-2 flex flex-col items-center justify-center border border-gray-300 p-2">
      <p>name: {business.name}</p>

      <p>category: {business.categoryName}</p>
      {business?.specialOffers.length > 0 &&
        business.specialOffers.map((offer) => (
          <p key={offer.offerId} className="text-sm">
            - {offer.title}
          </p>
        ))}
      {CityListElements}
      <p>status: {business.status}</p>
      <p>review : {business.reviewCount}</p>
      {/* karma */}
      <Karma businessId={business.id} />
      <Link
        href={`./business/${business.id}`}
        className="bg-chart-2 cursor-pointer rounded-full px-4 py-2 text-white"
      >
        See more
      </Link>
    </div>
  );
}

export default BusinessCardShot;
