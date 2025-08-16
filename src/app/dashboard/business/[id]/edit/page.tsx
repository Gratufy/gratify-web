import React from "react";

import BusinessEditClient from "@/components/shared/BusinessEditClient";
//import { useBusiness } from "@/hooks/useBusinesses";

interface BusinessEditPageProps {
  params: Promise<{ id: string }>;
}
export default async function BusinessEditPage({
  params,
}: BusinessEditPageProps) {
  const { id } = await params;
  //  const { data, isLoading, error } = useBusiness(id);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1>Business Edit Page</h1>
      <BusinessEditClient id={id} href={`/dashboard/business/${id}`} />
    </div>
  );
}
