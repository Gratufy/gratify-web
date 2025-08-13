import React from "react";
import BusinessDetails from "@/components/shared/BusinessDetails";

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicBusinessDetailsPage({
  params,
}: BusinessPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4"> Public Business details page</h1>
      <BusinessDetails id={id} href="../" />
    </div>
  );
}
