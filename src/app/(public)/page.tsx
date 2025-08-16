"use client";
import React, { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import DeleteAccountButton from "@/components/ui/DeleteAccountButton";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import CustomSelect from "@/components/ui/CustomSelect";
import { UKRAINE_REGIONAL_CENTERS } from "@/const/regions";
import Link from "next/link";

export default function PublicHome() {
  const user = useUserStore((s) => s.profile);
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const [city, setCity] = useState<string | undefined>("__all__");
  const [categoryId, setCategoryId] = useState<string>("__all__");
  const {
    data: businesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
    error,
  } = useBusinesses({ city, categoryId, scope: "public" });
  // if (isBusinessesLoading || isCategoriesLoading) return <p>Loading...</p>;
  // if (isBusinessesError || isCategoriesError)
  //   return <p>Ошибка: {error?.message}</p>;
  const categoriesWithAll = [
    { categoryId: "__all__", name: "Всі" }, //index "__all__" for   "всi"
    ...(categories || []),
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the Public Home Page
      </h1>
      <p className="mb-1 text-lg">Тут будуть картки бізнесів та фільтри</p>
      <p className="mb-1 text-lg">З можливістю переходити на окрему картку</p>
      <p className="italic">
        На навігацію поки не звертати увагу. Це виключно для мене і тимчасово
      </p>
      {user && <DeleteAccountButton />}
      <CustomSelect
        value={categoryId}
        onChange={setCategoryId}
        options={categoriesWithAll}
        getOptionValue={(c) => c.categoryId}
        getOptionLabel={(c) => c.name}
        label="Категорія"
        placeholder="Оберіть категорію"
      />
      {/* <p>Обрана категорія: {categoryId || "—"}</p> */}
      <CustomSelect
        label="Місто"
        value={city}
        onChange={setCity}
        options={UKRAINE_REGIONAL_CENTERS}
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => option.label}
        placeholder="Оберіть місто"
      />
      {/* <p>Обране місто: {city || "—"}</p> */}
      <h2 className="text-xl font-bold mb-2">
        Список бізнесів with status APPROVED
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
              <p>city: {b.city}</p>
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
