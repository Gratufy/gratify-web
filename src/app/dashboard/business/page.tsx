"use client";
import React from "react";
import { useBusinesses } from "@/hooks/useBusinesses";
import Link from "next/link";

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
      <p className="mb-1 text-lg">
        Ця сторінка призначена для перегляду власних бізнесів
      </p>
      <p className="mb-1 text-lg">
        Тут будуть картки ВЛАСНИХ бізнесів та фільтри
      </p>
      <p className="mb-1 text-lg">З можливістю переходити на окрему картку</p>
      <p className="italic">
        На навігацію поки не звертати увагу. Це виключно для мене і тимчасово
      </p>
      <h2 className="text-xl font-bold mb-2">
        Список ВЛАСНИХ бізнесів with all status
      </h2>
      {isBusinessesLoading && <p>Loading...</p>}
      {isBusinessesError && <p>Помилка: {error?.message}</p>}
      {businesses?.length ? (
        <ul>
          {businesses.map((b) => (
            <li
              key={b.id}
              className="mb-2 p-2 border border-gray-300 rounded-4xl w-160 flex flex-col items-center justify-center"
            >
              <p>name: {b.name}</p>
              {/* <p>city: {b.city}</p> */}
              <p>category: {b.categoryName}</p>
              <p>status: {b.status}</p>
              <Link
                href={`./business/${b.id}`}
                className="px-4 py-2 bg-chart-2 text-white rounded-full cursor-pointer"
              >
                See more
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl"> Нема бізнесів</p>
      )}
    </div>
  );
}
