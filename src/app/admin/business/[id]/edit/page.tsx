import BusinessEditClient from '@/components/shared/BusinessEditClient';
import React from 'react';

interface AdminEditPageProps {
  params: Promise<{ id: string }>;
}
export default async function AdminEditPage({ params }: AdminEditPageProps) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1>Admin Edit Page</h1>
      <BusinessEditClient id={id} href={`/admin/business/${id}`} />
    </div>
  );
}
