'use client';
import React from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';

import BusinessCardShot from '@/components/shared/BusinessCardShot';

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
    <>
      {isBusinessesLoading && <p>Loading...</p>}
      {isBusinessesError && <p>Помилка: {error?.message}</p>}
      {businesses?.data.length ? (
        <ul>
          {businesses.data.map((b) => (
            <li key={b.id}>
              {/* selectedCity="__all__" */}
              <BusinessCardShot business={b} selectedCity="__all__" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl"> Нема бізнесів</p>
      )}
    </>
  );
}

export default BusinessHomeClient;
