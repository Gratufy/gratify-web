'use client';
import React from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';

import BusinessList from '../shared/BusinessList';
import { UserFavoritesProvider } from '@/providers/UserFavoritesProvider';
import NotFoundComponent from '../shared/NotFoundComponent';

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
          // <p className="placeholder-sm lg:placeholder-base">
          //   Ви ще не додали жодного бізнесу до вашого акаунту
          // </p>
          <NotFoundComponent business />
        )}
      <BusinessList
        businesses={businesses?.data ?? []}
        isLoading={isBusinessesLoading}
        isError={isBusinessesError}
        error={error}
        linkPrefix="/dashboard/business"
      />
    </UserFavoritesProvider>
  );
}

export default BusinessHomeClient;
