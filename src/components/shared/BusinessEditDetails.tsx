import React from 'react';

import { BusinessWithCategoryName } from '@/types';

import BusinessDetails from './oneCardDetails/BusinessDetails';
import DeleteEditBusinessBtns from '../business/DeleteEditBusinessBtns';

interface Props {
  id: string;

  initialData: BusinessWithCategoryName;
}

function BusinessEditDetails({ id, initialData }: Props) {
  const selectedCity = '__all__';

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <DeleteEditBusinessBtns id={id} className="mb-2" />
      <BusinessDetails
        id={id}
        selectedCity={selectedCity}
        initialData={initialData}
      />
    </div>
  );
}

export default BusinessEditDetails;
