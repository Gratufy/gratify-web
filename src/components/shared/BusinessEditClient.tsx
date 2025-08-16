"use client";

import { useBusiness } from "@/hooks/useBusinesses";
import { BusinessForm } from "./BusinessForm";
import BackButton from "../ui/BackButton";

interface Props {
  id: string;
  href: string;
}
export default function BusinessEditClient({ id, href }: Props) {
  const { data, isLoading, error } = useBusiness(id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Business not found</p>;

  return (
    <>
      <BackButton href={href} />
      <BusinessForm
        businessId={id}
        defaultValues={{
          name: data.name,
          description: data.description ?? "",
          website: data.website ?? "",
          category: data.categoryId ?? "",
          city: data.city,
          district: data.district ?? "",
          address: data.address,
        }}
      />
    </>
  );
}
