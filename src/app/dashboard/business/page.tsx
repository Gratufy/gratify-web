"use client";
import React from "react";
import { useBusinesses } from "@/hooks/useBusinesses";
import Link from "next/link";
import BusinessCardShot from "@/components/shared/BusinessCardShot";

export default function BusinessHome() {
  const {
    data: businesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
    error,
  } = useBusinesses({
    city: "__all__",
    categoryId: "__all__",
    scope: "business_user",
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the Business Home Page
      </h1>

      <h2 className="text-xl font-bold mb-2">
        Список ВЛАСНИХ бізнесів with all status
      </h2>
      {isBusinessesLoading && <p>Loading...</p>}
      {isBusinessesError && <p>Помилка: {error?.message}</p>}
      {businesses?.data.length ? (
        <ul>
          {businesses.data.map((b) => (
            <li key={b.id}>
              <BusinessCardShot business={b} selectedCity="__all__" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl"> Нема бізнесів</p>
      )}
    </div>
  );
}
