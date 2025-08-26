import React from "react";
import Karma from "./Karma";
import { BusinessWithCategoryName } from "@/types";
import Link from "next/link";
import { renderLocations } from "@/lib/helpers/renderLocations";

function BusinessCardShot({
  business,
  selectedCity,
}: {
  business: BusinessWithCategoryName;
  selectedCity?: string;
}) {
  const CityListElements = renderLocations(business, selectedCity);
  return (
    <div className="mb-2 p-2 border border-gray-300 rounded-4xl w-160 flex flex-col items-center justify-center">
      <p>name: {business.name}</p>

      <p>category: {business.categoryName}</p>
      {CityListElements}
      <p>status: {business.status}</p>
      <p>review : {business.reviewCount}</p>
      {/* karma */}
      <Karma businessId={business.id} />
      <Link
        href={`./business/${business.id}`}
        className="px-4 py-2 bg-chart-2 text-white rounded-full cursor-pointer"
      >
        See more
      </Link>
    </div>
  );
}

export default BusinessCardShot;
