'use client';
import React, { useState } from 'react';
import { useBusiness } from '@/hooks/useBusinesses';

import { renderLocations } from '@/lib/helpers/renderLocations';

import BackButton from '../ui/BackButton';
import Karma from './Karma';
import BusinessReviews from './BusinessReviews';

import dynamic from 'next/dynamic';

import BusinessCardSkeleton from './skeletons/BusinessCardSkeleton';
import { BusinessWithCategoryName } from '@/types';
const BusinessMapAll = dynamic(() => import('./BusinessMapAll'), {
  ssr: false,
});

interface Props {
  id: string;
  href: string;
  selectedCity: string;
  initialData: BusinessWithCategoryName;
}

function BusinessDetails({ id, href, selectedCity, initialData }: Props) {
  const { data, isLoading, error } = useBusiness(id);
  const business = data ?? initialData;

  // if (!data && !isLoading) return <p>No business found</p>;
  //sort location depends on selectedCity
  const CityListElements = data ? renderLocations(data, selectedCity) : null;
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <BackButton href={href} />
      {/* Ошибка */}
      {/* {error && <p className="text-red-500">Error: {error.message}</p>} */}

      {/* Скелетон при загрузке */}
      {/* {isLoading && <BusinessCardSkeleton />} */}

      {/* Нет данных */}
      {/* {!isLoading && !data && !error && <p>No business found</p>} */}
      {/* Когда есть данные */}
      {business && (
        <>
          <h1 className="mb-4 text-4xl font-bold">
            Business Details for {business?.name}
          </h1>
          <div className="flex w-full flex-col items-center justify-center">
            <p className="mb-4 text-2xl">Name: {business?.name}</p>
            {/* <p className="text-2xl mb-4">City: {business?.locations}</p> */}
            <p className="text-2xl">Category: {business?.categoryName}</p>
            {CityListElements}
            {business?.specialOffers.length &&
              business.specialOffers.map((offer) => (
                <p key={offer.offerId} className="text-xl">
                  - {offer.title}
                </p>
              ))}
            <p className="text-2xl">Status: {business?.status}</p>
            {/* karma */}
            <Karma businessId={id} initialKarma={business.karma} />

            <BusinessReviews businessId={id} />
            {business.locations && business.locations.length > 0 && (
              <BusinessMapAll
                businesses={[business]}
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
