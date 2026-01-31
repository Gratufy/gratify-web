import React from 'react';
import { notFound } from 'next/navigation';
import { validate as uuidValidate } from 'uuid'; // npm install uuid

import { Info } from 'lucide-react';

import { getBusinessById } from '@/lib/actions/getBusinessById';
import { getSimilarBusinesses } from '@/lib/actions/getSimilarBusinesses';

import GoBackButton from '@/components/ui/custom-ui/GoBackButton';
import BusinessDetails from '@/components/shared/oneCardDetails/BusinessDetails';
import SimilarBusinesses from '@/components/public/SimilarBusinesses';

interface BusinessPageProps {
  params: Promise<{ id: string }>;

  searchParams: Promise<{ city?: string }>;
}

export default async function PublicBusinessDetailsPage({
  params,
  searchParams,
}: BusinessPageProps) {
  const { id } = await params;
  if (!uuidValidate(id)) return notFound();
  const { city } = await searchParams;
  const selectedCity = city ?? '__all__';
  const business = await getBusinessById(id);
  if (!business) {
    // if Id wrong → NotFound
    return notFound();
  }
  const similarBusinesses = await getSimilarBusinesses({
    businessId: business.id,
    categoryId: business.categoryId,
    city: business.locations?.[0]?.city,
    isOnline: business.isOnline,
    limit: 2,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-0">
      <div className="max-[1024px]:max-w-150 w-full px-4 lg:w-[1024px] lg:px-[50px] lg:py-2 xl:w-[1440px] xl:px-[150px]">
        <GoBackButton href="/" className="w-8 py-2 pr-2" />
      </div>
      <BusinessDetails
        id={id}
        selectedCity={selectedCity}
        initialData={business}
      />
      {similarBusinesses.length > 0 && (
        <SimilarBusinesses similarBusinesses={similarBusinesses} />
      )}
      <div className="max-[1024px]:max-w-150 mx-auto my-8 flex justify-center gap-2 max-[1024px]:px-4 lg:w-[1024px] lg:px-[50px] xl:w-[1440px] xl:px-[150px]">
        <Info className="text-text-link size-4 shrink-0" aria-hidden />
        <span className="caption text-text-700-grey">
          Уся інформація в картці бізнесу надається його представниками.
          Платформа не несе відповідальності за її точність та актуальність.
        </span>
      </div>
    </main>
  );
}
