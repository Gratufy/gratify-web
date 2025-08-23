"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import {
  checkAddress,
  getBusinessLocation,
  updateBusinessLocation,
} from "@/lib/actions/businessLocation";
import { businessLocations } from "@/db/schema";
import { db } from "@/db";
import { eq, desc, sql, and } from "drizzle-orm";

// useBusinessLocation.ts
export function useBusinessLocation(businessId?: string) {
  return useQuery({
    queryKey: businessId ? queryKeys.businessLocation(businessId) : ["noop"],
    queryFn: () => getBusinessLocation(businessId as string),
    enabled: !!businessId, // not without id
  });
}

//update coordinates
export function useUpdateBusinessLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBusinessLocation, // get{ businessId, latitude, longitude }

    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys.businessLocation(data.businessId),
        data
      );
    },
  });
}

// check address (geocoding)
export function useCheckAddress() {
  return useMutation({
    mutationFn: ({ city, address }: { city: string; address: string }) =>
      checkAddress(city, address),
  });
}

// for create and update business
async function saveBusinessLocations(
  businessId: string,
  locations: {
    city: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }[],
  replaceExisting = false
) {
  if (replaceExisting) {
    await db
      .delete(businessLocations)
      .where(eq(businessLocations.businessId, businessId));
  }

  for (const loc of locations) {
    let lat = loc.latitude ?? null;
    let lng = loc.longitude ?? null;

    if ((lat == null || lng == null) && loc.city && loc.address) {
      const coords = await checkAddress(loc.city, loc.address);
      if (coords) {
        lat = coords.latitude;
        lng = coords.longitude;
      }
    }

    // insert only if there is a city and at least one coordinate
    if (loc.city && lat != null && lng != null) {
      await db.insert(businessLocations).values({
        businessId,
        city: loc.city,
        address: loc.address ?? null,
        latitude: lat,
        longitude: lng,
      });
    }
  }
}
