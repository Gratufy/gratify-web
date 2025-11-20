'use client';

import { BusinessForm } from './BusinessForm';
import BackButton from '../ui/GoBackButton';

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
    <>
      <BackButton href={href} />
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
      />
    </>
  );
}
