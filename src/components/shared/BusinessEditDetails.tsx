"use client";
import React from "react";
import { useBusiness, useDeleteBusiness } from "@/hooks/useBusinesses";
import BackButton from "../ui/BackButton";
import Link from "next/link";
import { renderLocations } from "@/lib/helpers/renderLocations";
import BusinessMapAll from "./BusinessMapAll";

interface Props {
  id: string;
  href: string;
}

function BusinessEditDetails({ id, href }: Props) {
  const { data, isLoading, error } = useBusiness(id);
  const deleteBusinessMutation = useDeleteBusiness();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const selectedCity = "__all__";
  if (!data) return <p>No business found</p>;
  const CityListElements = renderLocations(data, selectedCity);
  const handleDelete = async (businessId: string) => {
    const confirmed = confirm("Are you sure you want to delete this business?");
    if (!confirmed) return;
    await deleteBusinessMutation.mutateAsync(businessId);
    alert("Business deleted successfully!");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <BackButton href={href} />
      {data ? (
        <>
          <h1 className="text-4xl font-bold mb-4">
            Business Details for {data.name}
          </h1>
          <div className="flex flex-col items-center justify-center  p-4">
            <p className="text-2xl mb-4">Name: {data.name}</p>
            {/* <p className="text-2xl mb-4">City: {data.city}</p> */}

            <p className="text-2xl ">Category: {data.categoryName}</p>
            {CityListElements}
            <p className="text-2xl ">Status: {data.status}</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link
              href={`./${id}/edit`}
              className="p-2 text-xl w-40 flex justify-center items-center bg-chart-2 text-white rounded-full cursor-pointer"
            >
              Edit
            </Link>
            <button
              className="border rounded-3xl border-red-500 cursor-pointer px-4 py-2 flex items-center justify-center"
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
