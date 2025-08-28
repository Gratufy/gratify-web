"use client";

import { useMutation } from "@tanstack/react-query";

import { checkAddress } from "@/lib/actions/businessLocation";

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
