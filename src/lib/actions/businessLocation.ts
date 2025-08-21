"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";

import { businessLocations } from "@/db/schema";
import { eq } from "drizzle-orm";

// get business location
export async function getBusinessLocation(businessId: string) {
  const [row] = await db
    .select()
    .from(businessLocations)
    .where(eq(businessLocations.businessId, businessId))
    .limit(1);

  if (!row) return null;

  return {
    businessId: row.businessId,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

// update coordinates
export async function updateBusinessLocation(vars: {
  businessId: string;
  latitude: number;
  longitude: number;
}) {
  const { businessId, latitude, longitude } = vars;
  const [updated] = await db
    .update(businessLocations)
    .set({ latitude, longitude })
    .where(eq(businessLocations.businessId, businessId))
    .returning();

  if (!updated) throw new Error("Failed to update location");

  return { businessId, latitude, longitude };
}

// check address (OpenStreetMap)
export async function checkAddress(city: string, address: string) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("street", address);
  url.searchParams.set("city", city);
  url.searchParams.set("country", "Ukraine");

  //   const query = encodeURIComponent(`${address}, ${city}, Ukraine`);
  //   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "MyApp/1.0 (myemail@example.com)", // Your email here??????
    },
  });

  if (!response.ok) throw new Error("Nominatim request failed");

  const data = await response.json();
  if (!data[0]) return null;

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
    displayName: data[0].display_name,
    // latitude: parseFloat(data[0].lat),
    // longitude: parseFloat(data[0].lon),
  };
}
