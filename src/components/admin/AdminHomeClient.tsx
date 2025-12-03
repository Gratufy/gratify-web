'use client';
import { useState } from 'react';
import {
  useAdminBusinesses,
  useBusinesses,
  useDeleteBusiness,
} from '@/hooks/useBusinesses';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { BUSINESS_STATUS } from '@/const/business';

import Link from 'next/link';
import { BusinessStatusForm } from '@/components/admin/BusinessStatusForm';
import { BusinessStatus, OnlineFilter, SortBy } from '@/types';
import OnlineStatusFilter from '@/components/shared/filters/OnlineStatusFilter';

function AdminHomeClient() {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const [city, setCity] = useState<string | undefined>('__all__');
  const [categoryId, setCategoryId] = useState<string>('__all__');
  const [showOnlineStatus, setShowOnlineStatus] = useState<OnlineFilter>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [businessStatus, setBusinessStatus] =
    useState<BusinessStatus>('pending');
  // const [status, setStatus] = useState<string>("");

  //   const {
  //     data: businesses,
  //     isLoading: isBusinessesLoading,
  //     isError: isBusinessesError,
  //     error,
  //   } = useBusinesses({
  //     city,
  //     categoryId,
  //     scope: "admin",
  //     showOnlineStatus,
  //     sortBy,
  //   });

  const {
    data: businesses = [],
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
    error,
  } = useAdminBusinesses({
    businessStatus,
    categoryId,
    city,
    showOnlineStatus,
    sortBy,
  });
  // if (isBusinessesLoading || isCategoriesLoading) return <p>Загрузка...</p>;
  // if (isBusinessesError || isCategoriesError)
  //   return <p>Помилка: {error?.message}</p>;

  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі' }, //index "__all__" for   "всi"
    ...(categories || []),
  ];

  function handleStatusChange(value: string) {
    setBusinessStatus(value as BusinessStatus);
  }
  const deleteBusinessMutation = useDeleteBusiness();
  const handleDelete = async (businessId: string) => {
    const confirmed = confirm('Are you sure you want to delete this business?');
    if (!confirmed) return;
    await deleteBusinessMutation.mutateAsync(businessId);
    alert('Business deleted successfully!');
  };
  return (
    <>
      <CustomSelect
        value={businessStatus}
        onChange={handleStatusChange}
        options={BUSINESS_STATUS}
        getOptionValue={(s) => s}
        getOptionLabel={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
        placeholder="Оберіть статус"
        className="w-36"
        statusForm={true}
      />
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
      <OnlineStatusFilter
        value={showOnlineStatus}
        onChange={setShowOnlineStatus}
      />
      {/* <p>Обране місто: {city || "—"}</p> */}
      <h2 className="mb-2 text-xl font-bold">
        Список бізнесів with all status
      </h2>
      {isBusinessesLoading && <p>Loading...</p>}
      {isBusinessesError && <p>Помилка: {error?.message}</p>}
      {businesses?.length ? (
        <ul>
          {businesses.map((b) => (
            <li
              key={b.id}
              className="mb-2 flex items-center justify-center gap-8 rounded-xl border border-gray-300 px-4 py-2"
            >
              <p className="flex-1/8">{b.name}</p>
              {/* <p className="flex-1/8">{b.city}</p> */}
              <p className="flex-1/8">{b.categoryName}</p>

              <BusinessStatusForm businessId={b.id} currentStatus={b.status} />
              <Link
                href={`./business/${b.id}`}
                className="bg-chart-2 cursor-pointer rounded-full px-4 py-2 text-white"
              >
                See more
              </Link>
              <button
                className="flex cursor-pointer items-center justify-center rounded-3xl border border-red-500 px-4 py-2"
                onClick={() => handleDelete(b.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl"> Нема бізнесів</p>
      )}
    </>
  );
}

export default AdminHomeClient;
