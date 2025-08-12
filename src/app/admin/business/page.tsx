"use client";
import { useState } from "react";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import CustomSelect from "@/components/ui/CustomSelect";
import { UKRAINE_REGIONAL_CENTERS } from "@/const/regions";

export default function AdminBusiness() {
  const {
    data: businesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
    error,
  } = useBusinesses();
  const {
    categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useBusinessCategories();
  const [city, setCity] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  if (isBusinessesLoading || isCategoriesLoading) return <p>Загрузка...</p>;
  if (isBusinessesError || isCategoriesError)
    return <p>Ошибка: {error?.message}</p>;
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
        options={categories}
        getOptionValue={(c) => c.categoryId}
        getOptionLabel={(c) => c.name}
        label="Категорія"
        placeholder="Оберіть категорію"
      />
      <CustomSelect
        label="Місто"
        value={city}
        onChange={(v) => setCity(v || undefined)}
        options={UKRAINE_REGIONAL_CENTERS}
        placeholder="Оберіть місто"
      />
      <p>Обране місто: {city || "—"}</p>
      <h2 className="text-xl font-bold mb-2">Список бізнесів</h2>
      {businesses?.length ? (
        <ul>
          {businesses.map((b) => (
            <li
              key={b.id}
              className="mb-2 p-2 border border-gray-300 rounded-4xl w-40 flex flex-col items-center justify-center"
            >
              <p>name: {b.name}</p>
              <p>city: {b.city}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl"> Нема бізнесів</p>
      )}
    </div>
  );
}
