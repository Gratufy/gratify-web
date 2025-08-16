"use client";
import { useState } from "react";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import CustomSelect from "@/components/ui/CustomSelect";
import { UKRAINE_REGIONAL_CENTERS } from "@/const/regions";

import Link from "next/link";
import { BusinessStatusForm } from "@/components/admin/BusinessStatusForm";

export default function AdminBusiness() {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const [city, setCity] = useState<string | undefined>("__all__");
  const [categoryId, setCategoryId] = useState<string>("__all__");
  // const [status, setStatus] = useState<string>("");

  const {
    data: businesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
    error,
  } = useBusinesses({ city, categoryId, scope: "admin" });
  // if (isBusinessesLoading || isCategoriesLoading) return <p>Загрузка...</p>;
  // if (isBusinessesError || isCategoriesError)
  //   return <p>Помилка: {error?.message}</p>;

  const categoriesWithAll = [
    { categoryId: "__all__", name: "Всі" }, //index "__all__" for   "всi"
    ...(categories || []),
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">
        Welcome to the Admin Business Page
      </h1>
      <p className="mb-1 text-lg">
        Ця сторінка призначена для перегляду СПИСКУ бізнесів з фільтрами
      </p>
      <p className="mb-1 text-lg">
        Назва, власник, статус (активний/неактивний/на модераціі), дата
        створення
      </p>

      <p className="mb-1 text-lg">
        З можливістю переходити на окрему картку бізнесу та там редагувати,
        видаляти, приховувати
      </p>
      <p className="italic mb-2">
        На навігацію поки не звертати увагу. Це виключно для мене і тимчасово
      </p>
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
        Список бізнесів with all status
      </h2>
      {isBusinessesLoading && <p>Loading...</p>}
      {isBusinessesError && <p>Помилка: {error?.message}</p>}
      {businesses?.length ? (
        <ul>
          {businesses.map((b) => (
            <li
              key={b.id}
              className="mb-2 px-4 py-2 border border-gray-300 rounded-xl flex gap-8 items-center justify-center"
            >
              <p className="flex-1/6">{b.name}</p>
              <p className="flex-1/6">{b.city}</p>
              <p className="flex-1/6">{b.categoryName}</p>

              <BusinessStatusForm businessId={b.id} currentStatus={b.status} />
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
