"use client";
import React from "react";
import { useBusiness } from "@/hooks/useBusinesses";
import BackButton from "../ui/BackButton";

import Karma from "./Karma";
import BusinessReviews from "./BusinessReviews";
import { renderLocations } from "@/lib/helpers/renderLocations";
import dynamic from "next/dynamic";
const BusinessMapAll = dynamic(() => import("./BusinessMapAll"), {
  ssr: false,
});

interface Props {
  id: string;
  href: string;
}

function BusinessDetails({ id, href }: Props) {
  const { data, isLoading, error } = useBusiness(id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const selectedCity = "__all__";
  if (!data) return <p>No business found</p>;
  const CityListElements = renderLocations(data, selectedCity);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  w-full">
      <BackButton href={href} />
      <h1 className="text-4xl font-bold mb-4">
        Business Details for {data?.name}
      </h1>
      <div className="flex flex-col items-center justify-center  w-full">
        <p className="text-2xl mb-4">Name: {data?.name}</p>
        {/* <p className="text-2xl mb-4">City: {data?.locations}</p> */}
        <p className="text-2xl ">Category: {data?.categoryName}</p>
        {CityListElements}
        {data?.specialOffers.length &&
          data.specialOffers.map((offer) => (
            <p key={offer.offerId} className="text-xl ">
              - {offer.title}
            </p>
          ))}
        <p className="text-2xl ">Status: {data?.status}</p>
        {/* karma */}
        <Karma businessId={id} />

        <BusinessReviews businessId={id} />
        {data.locations && data.locations.length > 0 && (
          <BusinessMapAll
            businesses={[data]}
            className="w-full"
            selectedCity={selectedCity}
          />
        )}
      </div>
    </div>
  );
}

export default BusinessDetails;
