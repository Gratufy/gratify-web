"use client";
import { getAllSpecialOffers } from "@/lib/actions/specialOffers";
import { queryKeys } from "@/lib/reactQuery/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useAllSpecialOffers() {
  return useQuery({
    queryKey: queryKeys.specialOffers,
    queryFn: getAllSpecialOffers,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
