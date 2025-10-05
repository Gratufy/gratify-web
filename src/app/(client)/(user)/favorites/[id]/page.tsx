import React from 'react';
import { notFound } from 'next/navigation';
import { validate as uuidValidate } from 'uuid'; // npm install uuid
import BusinessDetails from '@/components/shared/BusinessDetails';
import { getBusinessById } from '@/lib/actions/businesses';

interface UserBusinessDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserBusinessDetailsPage({
  params,
}: UserBusinessDetailsPageProps) {
  const { id } = await params;
  if (!uuidValidate(id)) return notFound();
  const business = await getBusinessById(id);
  if (!business) {
    // если ID неправильный → NotFound
    return notFound();
  }
  return (
    <div className="lg:pt-15 xl:pt-15 container flex min-h-screen flex-col items-center justify-center lg:pb-20 xl:pb-20">
      <BusinessDetails
        id={id}
        href="/favorites"
        selectedCity="__all__"
        initialData={business}
      />
    </div>
  );
}
