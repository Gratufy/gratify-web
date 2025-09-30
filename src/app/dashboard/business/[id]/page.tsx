import React from 'react';

import BusinessEditDetails from '@/components/shared/BusinessEditDetails';

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}
export default async function BusinessBusinessDetailsPage({
  params,
}: BusinessPageProps) {
  const { id } = await params;

  return (
    <div className="lg:pt-15 xl:pt-15 container flex min-h-screen flex-col items-center justify-center lg:pb-20 xl:pb-20">
      <h1 className="mb-4 text-2xl font-bold">Business details page</h1>
      <BusinessEditDetails id={id} href="/dashboard/business" />
    </div>
  );
}
