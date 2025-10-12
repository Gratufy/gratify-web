'use client';
import React from 'react';
import { useBusiness, useDeleteBusiness } from '@/hooks/useBusinesses';
import BackButton from '../ui/GoBackButton';
import Link from 'next/link';
import { renderLocations } from '@/lib/helpers/renderLocations';
import dynamic from 'next/dynamic';
const BusinessMapAll = dynamic(
  () => import('@/components/shared/BusinessMapAll'),
  {
    ssr: false,
  }
);

interface Props {
  id: string;
  href: string;
}

function BusinessEditDetails({ id, href }: Props) {
  const { data, isLoading, error } = useBusiness(id);

  const deleteBusinessMutation = useDeleteBusiness();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const selectedCity = '__all__';
  if (!data) return <p>No business found</p>;
  const CityListElements = renderLocations(data, selectedCity);
  const handleDelete = async (businessId: string) => {
    const confirmed = confirm('Are you sure you want to delete this business?');
    if (!confirmed) return;
    await deleteBusinessMutation.mutateAsync(businessId);
    alert('Business deleted successfully!');
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <BackButton href={href} />
      {data ? (
        <>
          <h1 className="mb-4 text-4xl font-bold">
            Business Details for {data.name}
          </h1>
          <div className="flex flex-col items-center justify-center p-4">
            <p className="mb-4 text-2xl">Name: {data.name}</p>
            {/* <p className="text-2xl mb-4">City: {data.city}</p> */}

            <p className="text-2xl">Category: {data.categoryName}</p>
            {data?.specialOffers.length &&
              data.specialOffers.map((offer) => (
                <p key={offer.offerId} className="text-xl">
                  - {offer.title}
                </p>
              ))}
            {CityListElements}
            <p className="text-2xl">Status: {data.status}</p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link
              href={`./${id}/edit`}
              className="bg-chart-2 flex w-40 cursor-pointer items-center justify-center rounded-full p-2 text-xl text-white"
            >
              Edit
            </Link>
            <button
              className="flex cursor-pointer items-center justify-center rounded-3xl border border-red-500 px-4 py-2"
              onClick={() => handleDelete(data.id)}
            >
              Delete
            </button>
          </div>
          {data.locations && data.locations.length > 0 && (
            <BusinessMapAll
              businesses={[data]}
              className="w-full"
              selectedCity={selectedCity}
            />
          )}
        </>
      ) : (
        <p>There is no business data available.</p>
      )}
    </div>
  );
}

export default BusinessEditDetails;
