"use client";
import { useEffect, useRef, useState } from "react";

import { useInfiniteBusinesses } from "@/hooks/useBusinesses";
import { BusinessWithCategoryName, OnlineFilter, Scope, SortBy } from "@/types";
import BusinessCardShot from "./BusinessCardShot";
import dynamic from "next/dynamic";
const BusinessMapAll = dynamic(
  () => import("@/components/shared/BusinessMapAll"),
  {
    ssr: false,
  }
);
import { Button } from "../ui/button";

interface BusinessListProps {
  city?: string;
  categoryId?: string;
  showOnlineStatus?: OnlineFilter;
  sortBy?: SortBy;
  scope: Scope;
}
function BusinessList({
  city,
  categoryId,
  showOnlineStatus,
  sortBy,
  scope,
}: BusinessListProps) {
  const [showMap, setShowMap] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteBusinesses({
    city,
    categoryId,
    showOnlineStatus,
    sortBy,
    scope,
  });
  const businesses = data?.pages.flatMap((page) => page.data) ?? [];

  // const businesses = data?.pages?.flatMap((page) => page.data ?? []) ?? [];
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Помилка: {error?.message}</p>;
  if (businesses.length === 0)
    return <p className="text-2xl"> Нема бізнесів</p>;
  return (
    <>
      <ul className="w-full justify-center items-center flex flex-col">
        {businesses.map((b) => (
          <li key={b.id}>
            <BusinessCardShot business={b} selectedCity={city} />
          </li>
        ))}
      </ul>
      <div ref={loadMoreRef} className="h-4">
        {isFetchingNextPage && <p>Loading more...</p>}
        {!hasNextPage && <p className="text-gray-500">Більше бізнесів немає</p>}
      </div>
      <Button onClick={() => setShowMap((prev) => !prev)}>Show Map</Button>
      {showMap && (
        <BusinessMapAll
          businesses={businesses}
          className="w-full"
          selectedCity={city}
        />
      )}
    </>
  );
}

export default BusinessList;
