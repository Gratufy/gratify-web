import React from 'react';
import BusinessDetails from '@/components/shared/BusinessDetails';

interface BusinessPageProps {
  params: Promise<{ id: string }>;
  // searchParams: Promise<{ [city: string]: string | string[] | undefined }>;
  searchParams: Promise<{ city?: string }>;
}

export default async function PublicBusinessDetailsPage({
  params,
  searchParams,
}: BusinessPageProps) {
  const { id } = await params;
  const { city } = await searchParams;
  const selectedCity = city ?? '__all__';

  return (
    <div className="lg:pt-15 xl:pt-15 container flex min-h-screen flex-col items-center justify-center lg:pb-20 xl:pb-20">
      <BusinessDetails id={id} href="../" selectedCity={selectedCity} />
    </div>
  );
}
