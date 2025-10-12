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
import CaruselThumbnails from './oneCardDetails/caruselThumb/CaruselThumbnails';
import { FAKE_IMAGES_ARR } from '@/const/fake-images-arr';
import SpecialOffers from './oneCardDetails/SpecialOffersBlock';
import SpecialOffersBlock from './oneCardDetails/SpecialOffersBlock';
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
          {' '}
          <section className="w-full pb-5">
            <div className="mb-6 w-full">
              <TitleBlock
                name={business.name}
                categoryName={business.categoryName}
                website={business.website}
              />
            </div>

            {/* -------------------------------------------- */}
            <div className="mb-6 w-full">
              <CaruselThumbnails slides={FAKE_IMAGES_ARR} />
            </div>
            {/* -------------------------------------------- */}
            <div className="mb-6 w-full">
              <SpecialOffersBlock specialOffers={business.specialOffers} />
            </div>
            {/* -------------------------------------------- */}
            <div className="border-elements-grey-400 mb-2 w-full border-b pb-2">
              <DescriptionBlock
                id={business.id}
                description={business.description}
              />
            </div>
            {/* -------------------------------------------- */}
            <div className="flex w-full justify-between py-1">
              <div className="flex items-center">
                <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base mr-3 font-medium">
                  Карма
                </p>
                <Karma businessId={id} initialKarma={business.karma} />
              </div>
              <div>
                <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
                  Скарга
                </p>
              </div>
            </div>
          </section>
          {/* -------------------------------------------- */}
          <section>
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
          </section>
        </>
      )}
    </div>
  );
}

export default BusinessDetails;
