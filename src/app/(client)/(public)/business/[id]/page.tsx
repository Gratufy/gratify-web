import React from 'react';
import { notFound } from 'next/navigation';
import { validate as uuidValidate } from 'uuid'; // npm install uuid
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from '@tanstack/react-query';
import { getBusinessById } from '@/lib/actions/businesses';
import BusinessDetails from '@/components/shared/oneCardDetails/BusinessDetails';
// import { queryKeys } from '@/lib/reactQuery/queryKeys';

interface BusinessPageProps {
  params: Promise<{ id: string }>;
  // searchParams: Promise<{ [city: string]: string | string[] | undefined }>;
  searchParams: Promise<{ city?: string }>;
}

export default async function PublicBusinessDetailsPage({
  params,
  searchParams,
}: BusinessPageProps) {
  // const queryClient = new QueryClient();
  const { id } = await params;
  if (!uuidValidate(id)) return notFound();
  const { city } = await searchParams;
  const selectedCity = city ?? '__all__';
  const business = await getBusinessById(id);
  if (!business) {
    // если ID неправильный → NotFound
    return notFound();
  }
  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.businessById(id),
  //   queryFn: () => Promise.resolve(business),
  // });

  // const dehydratedState = dehydrate(queryClient);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-0">
      <BusinessDetails
        id={id}
        href="../"
        selectedCity={selectedCity}
        initialData={business}
      />
    </div>
  );
}
