'use client';
import React from 'react';
import { Trash2 } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import { useBusiness, useDeleteBusiness } from '@/hooks/useBusinesses';
import BackButton from '../ui/GoBackButton';
import Link from 'next/link';
import { renderLocations } from '@/lib/helpers/renderLocations';
import dynamic from 'next/dynamic';
import { BusinessWithCategoryName } from '@/types';
import GoBackButton from '../ui/GoBackButton';
import BusinessCardSkeleton from './skeletons/BusinessCardSkeleton';
import BusinessDetails from './oneCardDetails/BusinessDetails';
import DeleteEditBusinessBtns from '../business/DeleteEditBusinessBtns';
const BusinessMapAll = dynamic(
  () => import('@/components/shared/BusinessMapAll'),
  {
    ssr: false,
  }
);

interface Props {
  id: string;
  href: string;
  initialData: BusinessWithCategoryName;
}

function BusinessEditDetails({ id, href, initialData }: Props) {
  // const { data, isLoading, error } = useBusiness(id, initialData);
  // const business = data ?? initialData;

  const selectedCity = '__all__';

  // const CityListElements = business
  //   ? renderLocations(business, selectedCity)
  //   : null;

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
