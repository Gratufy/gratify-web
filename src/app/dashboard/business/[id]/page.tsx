import React from 'react';
import { notFound } from 'next/navigation';
import BusinessEditDetails from '@/components/shared/BusinessEditDetails';
import { getBusinessById } from '@/lib/actions/businesses';
import GoBackButton from '@/components/ui/GoBackButton';

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}
export default async function BusinessBusinessDetailsPage({
  params,
}: BusinessPageProps) {
  const { id } = await params;
  const business = await getBusinessById(id);
  if (!business) {
    // если ID неправильный → NotFound
    return notFound();
  }

  return (
    <div className="lg:pt-15 xl:pt-15 container flex min-h-screen flex-col items-center justify-center lg:pb-20 xl:pb-20">
      <div className="max-[1024px]:max-w-150 w-full px-4 lg:w-[1024px] lg:px-[50px] lg:py-2 xl:w-[1440px] xl:px-[150px]">
        <GoBackButton href="/dashboard/business" className="w-8 py-2 pr-2" />
      </div>
      <BusinessEditDetails id={id} initialData={business} />
    </div>
  );
}
