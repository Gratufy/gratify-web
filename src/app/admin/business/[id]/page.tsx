import React from "react";
import BusinessDetails from "@/components/shared/BusinessDetails";

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}
export default async function AdminBusinessDetailsPage({
  params,
}: BusinessPageProps) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Business details page</h1>
      <BusinessDetails id={id} href="/admin/business" />
    </div>
  );
}
