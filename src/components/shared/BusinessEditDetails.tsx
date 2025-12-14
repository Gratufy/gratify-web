'use client';
import React from 'react';

import { BusinessWithDetails } from '@/types';

import { useAuth } from '@/stores/useUserStore';

import BusinessDetails from '@/components/shared/oneCardDetails/BusinessDetails';
import DeleteEditBusinessBtns from '@/components/business/DeleteEditBusinessBtns';

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
      {isAdmin && !isOwner ? (
        <div className="bg-icons-color-accent/40 mb-4 px-4 py-2">
          <p className="title-h4 text-text-700-grey text-center">
            Увага! Цю картку створено не Адміном
          </p>
        </div>
      ) : (
        <div className="bg-icons-color-success/40 mb-4 px-4 py-2">
          <p className="title-h4 text-text-700-grey text-center">
            Цю картку створено Адміном
          </p>
        </div>
      )}
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
