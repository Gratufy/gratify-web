'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusiness } from '@/hooks/useBusinesses';
import { renderLocations } from '@/lib/helpers/renderLocations';
import Karma from '../Karma';
import IconUser from '@/assets/icons/general/icon-user.svg';
import BusinessReviews from '../BusinessReviews';

import BusinessCardSkeleton from '../skeletons/BusinessCardSkeleton';
import { BusinessWithDetails } from '@/types';
import TitleBlock from './TitleBlock';
import DescriptionBlock from './DescriptionBlock';
import CaruselThumbnails from './caruselThumb/CaruselThumbnails';
// import { FAKE_IMAGES_ARR } from '@/const/fake-images-arr';
import SpecialOffersBlock from './SpecialOffersBlock';

import dynamic from 'next/dynamic';
import { useAuth } from '@/stores/useUserStore';
import { CustomAlertDialog } from '@/components/ui/CustomAlertDialog';
const BusinessMapAll = dynamic(() => import('../BusinessMapAll'), {
  ssr: false,
});

interface Props {
  id: string;

  selectedCity: string;
  initialData: BusinessWithDetails;
}

function BusinessDetails({ id, selectedCity, initialData }: Props) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  // for modal
  const [open, setOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  //////
  const { data, isLoading, error } = useBusiness(id, initialData);
  const business = data ?? initialData;

  //sort location depends on selectedCity
  const CityListElements = business
    ? renderLocations(business, selectedCity)
    : null;
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
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
          <section className="max-w-150 flex w-full flex-col px-4 pb-5 lg:hidden">
            <div className="mb-6 w-full">
              <TitleBlock
                name={business.name}
                categoryName={business.categoryName}
                website={business.website}
              />
            </div>

            {/* -------------------------------------------- */}
            <div className="mb-6 w-full">
              <CaruselThumbnails slides={business.images} />
            </div>
            {/* -------------------------------------------- */}
            <div className="mb-6 w-full">
              <SpecialOffersBlock
                specialOffers={business.specialOffers}
                ownOffers={business.ownOffers}
              />
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
                <Karma
                  businessId={id}
                  initialKarma={business.karma}
                  open={open}
                  setOpen={setOpen}
                  isLoggedIn={isLoggedIn}
                  setAlertTitle={setAlertTitle}
                />
              </div>
              <div className="flex flex-1">
                <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base">
                  Скарга
                </p>
              </div>
            </div>
          </section>
          {/* big screens */}
          <section className="lg:gap-25 xl:gap-30 hidden w-full lg:flex lg:w-[1024px] lg:px-[50px] lg:pb-5 xl:w-[1440px] xl:px-[150px] xl:pb-11">
            <CaruselThumbnails slides={business.images} />
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
                <div className="mb-10 w-full xl:mb-9">
                  <SpecialOffersBlock
                    specialOffers={business.specialOffers}
                    ownOffers={business.ownOffers}
                  />
                </div>
                {/* -------------------------------------------- */}
                <div className="w-full lg:pb-0">
                  <DescriptionBlock description={business.description} />
                </div>
              </div>

              {/* -------------------------------------------- */}
              <div className="flex w-full items-center lg:gap-6">
                <div className="flex flex-1 items-center py-1 lg:px-4">
                  <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base mr-3 font-medium">
                    Карма
                  </p>
                  <Karma
                    businessId={id}
                    initialKarma={business.karma}
                    open={open}
                    setOpen={setOpen}
                    isLoggedIn={isLoggedIn}
                    setAlertTitle={setAlertTitle}
                  />
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
          {/* REVIEW */}
          <section className="bg-background-grey-50 flex w-full flex-col items-center py-5 lg:py-10">
            <div className="max-[1024px]:max-w-150 w-full px-4 lg:w-[1024px] lg:px-28 xl:w-[1440px] xl:px-[320px]">
              <BusinessReviews
                businessId={id}
                setOpen={setOpen}
                isLoggedIn={isLoggedIn}
                setAlertTitle={setAlertTitle}
              />
            </div>
          </section>
          {/* -------------------------------------------- */}
          <section className="max-[1024px]:max-w-150 xl:py-15 flex w-full flex-col gap-4 px-4 py-5 lg:w-[1024px] lg:px-[50px] lg:py-10 xl:w-[1440px] xl:px-[150px]">
            <h3 className="title-h3 text-center">Наша адреса</h3>

            <div className="flex w-full flex-col gap-4 lg:flex-row lg:gap-6">
              {business.locations && business.locations.length > 0 && (
                <div className="border-elements-grey-300 w-full border-[0.5px] lg:flex-1">
                  <BusinessMapAll
                    businesses={[business]}
                    className="h-75 w-full"
                    selectedCity={selectedCity}
                  />
                </div>
              )}
              <div className="w-full lg:flex-1">{CityListElements}</div>
            </div>
          </section>
        </>
      )}
      <CustomAlertDialog
        open={open}
        onOpenChange={setOpen}
        // title="Для додавання в обране, авторизуйтесь будь ласка"
        title={alertTitle}
        description={alertTitle}
        actionContent={
          <>
            <IconUser className="inline size-4 xl:size-5" />
            Вхід
          </>
        }
        // cancelText="Отмена"
        classNameTitle="xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="sr-only"
        onAction={() => router.push('/login')}
      />
    </div>
  );
}

export default BusinessDetails;
