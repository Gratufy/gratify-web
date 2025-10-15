'use client';
import React from 'react';
import { useBusiness } from '@/hooks/useBusinesses';

import { renderLocations } from '@/lib/helpers/renderLocations';

import GoBackButton from '../../ui/GoBackButton';
import Karma from '../Karma';
import BusinessReviews from '../BusinessReviews';

import dynamic from 'next/dynamic';

import BusinessCardSkeleton from '../skeletons/BusinessCardSkeleton';
import { BusinessWithCategoryName } from '@/types';
import TitleBlock from './TitleBlock';
import DescriptionBlock from './DescriptionBlock';
import CaruselThumbnails from './caruselThumb/CaruselThumbnails';
import { FAKE_IMAGES_ARR } from '@/const/fake-images-arr';

import SpecialOffersBlock from './SpecialOffersBlock';
const BusinessMapAll = dynamic(() => import('../BusinessMapAll'), {
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
      <div className="w-full lg:py-2">
        {' '}
        <GoBackButton href={href} className="w-8 py-2 pr-2" />
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
          {/* mobile */}
          <section className="flex w-full flex-col pb-5 lg:hidden">
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
            <div className="border-elements-grey-400 mb-2 w-full border-b pb-4">
              <DescriptionBlock description={business.description} />
            </div>
            {/* -------------------------------------------- */}
            <div className="flex w-full items-center gap-6">
              <div className="flex flex-1 items-center px-4 py-1">
                <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base mr-3 font-medium">
                  Карма
                </p>
                <Karma businessId={id} initialKarma={business.karma} />
              </div>
              <div className="flex flex-1">
                <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
                  Скарга
                </p>
              </div>
            </div>
          </section>
          {/* big screens */}
          <section className="gap-25 hidden w-full lg:flex lg:pb-5">
            <CaruselThumbnails slides={FAKE_IMAGES_ARR} />
            <div className="flex w-full flex-col">
              <div className="border-elements-grey-400 mb-2 flex flex-col border-b lg:pb-4">
                <div className="mb-10 w-full">
                  <TitleBlock
                    name={business.name}
                    categoryName={business.categoryName}
                    website={business.website}
                  />
                </div>
                {/* -------------------------------------------- */}
                <div className="mb-10 w-full">
                  <SpecialOffersBlock specialOffers={business.specialOffers} />
                </div>
                {/* -------------------------------------------- */}
                <div className="mb-2 w-full lg:pb-0">
                  <DescriptionBlock description={business.description} />
                </div>
              </div>

              {/* -------------------------------------------- */}
              <div className="flex w-full items-center gap-6">
                <div className="flex flex-1 items-center py-1 lg:px-4">
                  <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base mr-3 font-medium">
                    Карма
                  </p>
                  <Karma businessId={id} initialKarma={business.karma} />
                </div>
                <div className="flex flex-1">
                  <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
                    Скарга
                  </p>
                </div>
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
