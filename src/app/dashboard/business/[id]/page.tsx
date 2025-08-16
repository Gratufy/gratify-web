import React from "react";

import BusinessEditDetails from "@/components/shared/BusinessEditDetails";

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}
export default async function BusinessBusinessDetailsPage({
  params,
}: BusinessPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Business details page</h1>
      <BusinessEditDetails id={id} href="/dashboard/business" />
    </div>
  );
}
