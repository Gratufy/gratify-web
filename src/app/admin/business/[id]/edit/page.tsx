import React from 'react';
import { notFound } from 'next/navigation';
import { getBusinessById } from '@/lib/actions/businesses';
import BusinessEditClient from '@/components/shared/BusinessEditClient';

interface AdminEditPageProps {
  params: Promise<{ id: string }>;
}
export default async function AdminEditPage({ params }: AdminEditPageProps) {
  const { id } = await params;
  //  const { data, isLoading, error } = useBusiness(id);
  const business = await getBusinessById(id);
  if (!business) {
    // если ID неправильный → NotFound
    return notFound();
  }
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1>Admin Edit Page</h1>
      <BusinessEditClient
        id={id}
        href={`/admin/business/${id}`}
        business={business}
      />
    </div>
  );
}
