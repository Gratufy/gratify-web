'use client';

import React from 'react';
import GoBackButton from '../ui/custom-ui/GoBackButton';

import { BusinessWithDetails } from '@/types';
import BusinessFormNew from './newForm/BusinessFormNew';

interface Props {
  id: string;
  href: string;
  business: BusinessWithDetails;
}

export default function BusinessEditClient({
  id,
  href,
  business: data,
}: Props) {
  // const { data, isLoading, error } = useBusiness(id);

  // console.log('BusinessEditClient data:', id);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Business not found</p>;

  return (
    <div className="pb-15 flex flex-1 flex-col items-center justify-center">
      <div className="container w-full max-[1024px]:px-4 lg:py-2">
        <GoBackButton href={href} className="w-8 py-2 pr-2" />
      </div>
      <h2 className="title-h2 mx-auto mb-10 text-center">
        Редагувати бізнес-картку
      </h2>
      <BusinessFormNew
        businessId={id}
        defaultValues={{
          name: data.name,
          description: data.description ?? '',
          website: data.website ?? '',
          category: data.categoryId ?? '',
          isOnline: data.isOnline ?? false,
          locations: (data.locations || []).map((loc) => ({
            city: loc.city ?? undefined,
            address: loc.address ?? undefined,
            latitude: loc.latitude ?? undefined,
            longitude: loc.longitude ?? undefined,
          })),
          specialOffers: (data.specialOffers || []).map((o) => o.offerId) ?? [],
          ownOffers: (data.ownOffers || []).map((o) => o.title) ?? [],
        }}
        existingImages={data.images || []}
      />
    </div>
  );
}
