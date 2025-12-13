'use client';
import React from 'react';
import { useAuth } from '@/stores/useUserStore';
import { BusinessWithDetails } from '@/types';

import BusinessDetails from './oneCardDetails/BusinessDetails';
import DeleteEditBusinessBtns from '../business/DeleteEditBusinessBtns';

interface Props {
  id: string;

  initialData: BusinessWithDetails;
}

function BusinessEditDetails({ id, initialData }: Props) {
  const { profile } = useAuth();
  const currentUserId = profile?.userId;
  const isAdmin = profile?.role === 'ADMIN';
  const isOwner = currentUserId === initialData.ownerId;
  const selectedCity = '__all__';

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <DeleteEditBusinessBtns
        id={id}
        isAdmin={isAdmin}
        isOwner={isOwner}
        className="mb-2"
      />
      {initialData && (
        <BusinessDetails
          id={id}
          selectedCity={selectedCity}
          initialData={initialData}
        />
      )}
    </div>
  );
}

export default BusinessEditDetails;
