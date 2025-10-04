'use client';
import React from 'react';
import { useBusiness } from '@/hooks/useBusinesses';

import { renderLocations } from '@/lib/helpers/renderLocations';

import BackButton from '../ui/BackButton';
import Karma from './Karma';
import BusinessReviews from './BusinessReviews';

import dynamic from 'next/dynamic';

import BusinessCardSkeleton from './skeletons/BusinessCardSkeleton';
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

  if (!data && !isLoading) return <p>No business found</p>;
  //sort location depends on selectedCity
  const CityListElements = data ? renderLocations(data, selectedCity) : null;
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <BackButton href={href} />
      {/* Ошибка */}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {/* Скелетон при загрузке */}
      {isLoading && <BusinessCardSkeleton />}

      {/* Нет данных */}
      {!isLoading && !data && !error && <p>No business found</p>}
      {/* Когда есть данные */}
      {!isLoading && data && (
        <>
          <h1 className="mb-4 text-4xl font-bold">
            Business Details for {data?.name}
          </h1>
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
        </>
      )}
    </div>
  );
}

export default BusinessDetails;
