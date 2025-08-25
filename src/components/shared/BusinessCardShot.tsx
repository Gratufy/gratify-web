import React from "react";
import Karma from "./Karma";
import { BusinessWithCategoryName } from "@/types";
import Link from "next/link";

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

function renderLocations(b: BusinessWithCategoryName, selectedCity?: string) {
  // 1. city = "__all__"
  if (selectedCity === "__all__") {
    if (b.isOnline && b.locations.length > 0) {
      return (
        <>
          <p>ONLINE</p>
          <ul>
            {b.locations
              .slice() // not to mutate original array
              .sort((a, b) => a.city.localeCompare(b.city, "uk"))
              .map((loc, idx) => (
                <li key={idx}>
                  {loc.city} — {loc.address?.trim() || "не додано"}
                </li>
              ))}
          </ul>
        </>
      );
    }
    if (b.isOnline && b.locations.length === 0) {
      return <p>ONLINE</p>;
    }
    if (!b.isOnline && b.locations.length > 0) {
      return (
        <ul>
          {b.locations
            .slice() // not to mutate original array
            .sort((a, b) => a.city.localeCompare(b.city, "uk"))
            .map((loc, idx) => (
              <li key={idx}>
                {loc.city} — {loc.address?.trim() || "не додано"}
              </li>
            ))}
        </ul>
      );
    }
    // !b.isOnline && no locations → not in the list
    return null;
  }

  // 2.city != "__all__"  we filter by specific city
  const cityLocations = b.locations.filter((loc) => loc.city === selectedCity);

  if (cityLocations.length > 0) {
    return (
      <>
        <p>{selectedCity}</p>
        <ul>
          {cityLocations.length ? (
            cityLocations.map((loc, idx) => (
              <li key={idx}>{loc.address?.trim() || "не додано"}</li>
            ))
          ) : (
            <li>Немає адрес</li>
          )}
        </ul>
      </>
    );
  }

  if (b.isOnline) {
    return <p>ONLINE</p>;
  }

  // if no address in this city and not online → not in the list
  return null;
}
