import React from 'react';
import BusinessEditDetails from '@/components/shared/BusinessEditDetails';

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}
export default async function AdminBusinessDetailsPage({
  params,
}: BusinessPageProps) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin Business details page</h1>
      <BusinessEditDetails id={id} href="/admin/business" />
    </div>
  );
}
