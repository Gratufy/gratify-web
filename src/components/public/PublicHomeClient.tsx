"use client";
import React, { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import { OnlineFilter, SortBy } from "@/types";
import { UKRAINE_REGIONAL_CENTERS } from "@/const/regions";

import OnlineStatusFilter from "@/components/shared/OnlineStatusFilter";
import BusinessList from "@/components/shared/BusinessList";
import DeleteAccountButton from "@/components/ui/DeleteAccountButton";
import CustomSelect from "@/components/ui/CustomSelect";

function PublicHomeClient() {
  const user = useUserStore((s) => s.profile);
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const [city, setCity] = useState<string | undefined>("__all__");
  const [categoryId, setCategoryId] = useState<string>("__all__");
  const [showOnlineStatus, setShowOnlineStatus] = useState<OnlineFilter>("all");

  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const categoriesWithAll = [
    { categoryId: "__all__", name: "Всі" },
    ...categories,
  ];
  return (
    <>
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
      <CustomSelect
        label="Місто"
        value={city}
        onChange={setCity}
        options={UKRAINE_REGIONAL_CENTERS}
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => option.label}
        placeholder="Оберіть місто"
      />
      <OnlineStatusFilter
        value={showOnlineStatus}
        onChange={setShowOnlineStatus}
      />
      {/* <p>Обране місто: {city || "—"}</p> */}
      <h2 className="text-xl font-bold mb-2">
        Список бізнесів with status APPROVED
      </h2>
      <BusinessList
        city={city}
        categoryId={categoryId}
        showOnlineStatus={showOnlineStatus}
        sortBy={sortBy}
        scope="public"
      />
    </>
  );
}

export default PublicHomeClient;
