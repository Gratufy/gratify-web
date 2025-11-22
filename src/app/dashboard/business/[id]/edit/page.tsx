import React from 'react';
import { notFound } from 'next/navigation';
import { getBusinessById } from '@/lib/actions/getBusinessById';

import BusinessEditClient from '@/components/shared/BusinessEditClient';

//import { useBusiness } from "@/hooks/useBusinesses";

interface BusinessEditPageProps {
  params: Promise<{ id: string }>;
}
export default async function BusinessEditPage({
  params,
}: BusinessEditPageProps) {
  const { id } = await params;
  //  const { data, isLoading, error } = useBusiness(id);
  const business = await getBusinessById(id);
  if (!business) {
    // если ID неправильный → NotFound
    return notFound();
  }

  return (
    <>
      <BusinessEditClient
        id={id}
        href={`/dashboard/business/${id}`}
        business={business}
      />
    </>
  );
}
