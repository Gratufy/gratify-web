'use client';
import React from 'react';
import { useBusiness } from '@/hooks/useBusinesses';

import { renderLocations } from '@/lib/helpers/renderLocations';

import BackButton from '../ui/BackButton';
import Karma from './Karma';
import BusinessReviews from './BusinessReviews';

import dynamic from 'next/dynamic';
import { Spinner } from '../ui/spinner';
const BusinessMapAll = dynamic(() => import('./BusinessMapAll'), {
  ssr: false,
});

interface Props {
  id: string;
  href: string;
  selectedCity: string;
}

function BusinessDetails({ id, href, selectedCity }: Props) {
  const { data, isLoading, error } = useBusiness(id);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  if (!data) return <p>No business found</p>;
  //sort location depends on selectedCity
  const CityListElements = renderLocations(data, selectedCity);
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <BackButton href={href} />
      <h1 className="mb-4 text-4xl font-bold">
        Business Details for {data?.name}
      </h1>
      {isLoading && <Spinner />}
      <div className="flex w-full flex-col items-center justify-center">
        <p className="mb-4 text-2xl">Name: {data?.name}</p>
        {/* <p className="text-2xl mb-4">City: {data?.locations}</p> */}
        <p className="text-2xl">Category: {data?.categoryName}</p>
        {CityListElements}
        {data?.specialOffers.length &&
          data.specialOffers.map((offer) => (
            <p key={offer.offerId} className="text-xl">
              - {offer.title}
            </p>
          ))}
        <p className="text-2xl">Status: {data?.status}</p>
        {/* karma */}
        <Karma businessId={id} initialKarma={data.karma} />

        <BusinessReviews businessId={id} />
        {data.locations && data.locations.length > 0 && (
          <BusinessMapAll
            businesses={[data]}
            className="w-full"
            selectedCity={selectedCity}
          />
        )}
      </div>
    </div>
  );
}

export default BusinessDetails;
