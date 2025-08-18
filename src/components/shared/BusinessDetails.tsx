"use client";
import React from "react";
import { useBusiness } from "@/hooks/useBusinesses";
import BackButton from "../ui/BackButton";

import Karma from "./Karma";
import BusinessReviews from "./BusinessReviews";

interface Props {
  id: string;
  href: string;
}

function BusinessDetails({ id, href }: Props) {
  const { data, isLoading, error } = useBusiness(id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <BackButton href={href} />
      <h1 className="text-4xl font-bold mb-4">
        Business Details for {data?.name}
      </h1>
      <div className="flex flex-col items-center justify-center  p-4">
        <p className="text-2xl mb-4">Name: {data?.name}</p>
        <p className="text-2xl mb-4">City: {data?.city}</p>
        <p className="text-2xl ">Category: {data?.categoryName}</p>
        <p className="text-2xl ">Status: {data?.status}</p>
        {/* karma */}
        <Karma businessId={id} />
        {/* {data?.reviewCount && <p>Review: {data.reviewCount}</p>}
        {data?.reviewCount ? (
          <BusinessReviews businessId={id} />
        ) : (
          <p>No reviews yet.</p>
        )} */}
        <BusinessReviews businessId={id} />
      </div>
    </div>
  );
}

export default BusinessDetails;
