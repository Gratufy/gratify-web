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
import { LocationFormData } from "@/types";

// check address (geocoding)
export function useCheckAddress() {
  return useMutation({
    mutationFn: ({ city, address }: { city: string; address: string }) =>
      checkAddress(city, address),
  });
}

// for create and update business
// // useBusinessLocation.ts
// export function useBusinessLocation(businessId?: string) {
//   return useQuery({
//     queryKey: businessId ? queryKeys.businessLocation(businessId) : ["noop"],
//     queryFn: () => getBusinessLocation(businessId as string),
//     enabled: !!businessId, // not without id
//   });
// }

// //update coordinates
// export function useUpdateBusinessLocation() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updateBusinessLocation, // get{ businessId, latitude, longitude }

//     onSuccess: (data) => {
//       queryClient.setQueryData(
//         queryKeys.businessLocation(data.businessId),
//         data
//       );
//     },
//   });
// }
