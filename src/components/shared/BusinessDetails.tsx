'use client';
import React, { useState } from 'react';
import { useBusiness } from '@/hooks/useBusinesses';

import { renderLocations } from '@/lib/helpers/renderLocations';

import GoBackButton from '../ui/GoBackButton';
import Karma from './Karma';
import BusinessReviews from './BusinessReviews';

import dynamic from 'next/dynamic';

import BusinessCardSkeleton from './skeletons/BusinessCardSkeleton';
import { BusinessWithCategoryName } from '@/types';
import TitleBlock from './oneCardDetails/TitleBlock';
import DescriptionBlock from './oneCardDetails/DescriptionBlock';
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

  //sort location depends on selectedCity
  const CityListElements = business
    ? renderLocations(business, selectedCity)
    : null;
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="w-full">
        {' '}
        <GoBackButton href={href} className="w-8 pb-4 pr-2 pt-2" />
      </div>

      {/* Error */}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {/* Skeleton  */}
      {isLoading && <BusinessCardSkeleton />}
      {/* No data */}
      {!isLoading && !business && !error && (
        <p>Упс... Ми не знайшли бізнес за цим ID</p>
      )}
      {/* There is data */}
      {/* -------------------------------------------- */}
      {business && (
        <>
          <TitleBlock
            name={business.name}
            categoryName={business.categoryName}
            website={business.website}
          />
          {/* -------------------------------------------- */}
          <DescriptionBlock
            id={business.id}
            description={business.description}
            specialOffers={business.specialOffers}
            karma={business.karma}
          />
          {/* -------------------------------------------- */}
          <div className="flex w-full flex-col items-center justify-center">
            {CityListElements}

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
