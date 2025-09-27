'use client';
import React from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';

import BusinessCardShot from '@/components/shared/BusinessCardShot';
import BusinessListSimple from '../shared/BusinessListSimple';
import { UserFavoritesProvider } from '@/providers/UserFavoritesProvider';

function BusinessHomeClient() {
  const {
    data: businesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
    error,
  } = useBusinesses({
    city: '__all__',
    categoryId: '__all__',
    scope: 'business_user',
  });
  return (
    <UserFavoritesProvider>
      {businesses?.data.length === 0 &&
        !isBusinessesLoading &&
        !isBusinessesError && (
          <p className="placeholder-sm lg:placeholder-base">
            Ви ще не додали жодного бізнесу до вашого акаунту
          </p>
        )}
      <BusinessListSimple
        businesses={businesses?.data ?? []}
        isLoading={isBusinessesLoading}
        isError={isBusinessesError}
        error={error}
      />
    </UserFavoritesProvider>
  );
}

export default BusinessHomeClient;
