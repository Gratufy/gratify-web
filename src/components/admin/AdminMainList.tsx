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
import { BUSINESS_STATUS, ONLINE_STATUS_LABELS } from '@/const/business';

import Link from 'next/link';
import { BusinessStatusForm } from '@/components/admin/BusinessStatusForm';
import { BusinessStatus, OnlineFilter, SortBy } from '@/types';
import OnlineStatusFilter from '@/components/shared/filters/OnlineStatusFilter';
import { Label } from '../ui/label';
import { ONLINE_STATUS } from '@/const/online-status';
import { getBusinessesCount } from '@/lib/actions/getBusinessesCount';
import { useAdminFilters } from '@/hooks/useAdminFilters';

function AdminMainList({ totalBusinesses }: { totalBusinesses: number }) {
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();
  const { filters, updateFilter } = useAdminFilters();
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
    businessStatus: filters.businessStatus,
    categoryId: filters.categoryId,
    city: filters.city,
    showOnlineStatus: filters.mode,
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
    <div className="bg-background-white lg:p-5">
      {/*  Title*/}
      <h2 className="lg:title-h5 mb-2">Наявні бізнеси {totalBusinesses}</h2>
      {/*  Filters*/}
      <div className="flex justify-center lg:mb-5 lg:gap-3">
        <div>
          <Label htmlFor="status-select" className="lg:placeholder-xs mb-1">
            Статус:
          </Label>
          <CustomSelect
            id="status-select"
            value={filters.businessStatus}
            // onChange={handleStatusChange}
            onChange={(val) =>
              updateFilter('businessStatus', val as BusinessStatus)
            }
            options={BUSINESS_STATUS}
            getOptionValue={(s) => s}
            getOptionLabel={(s) => s.charAt(0).toUpperCase() + s.slice(1)}
            placeholder="Оберіть статус"
            className="admin-select w-40"
            statusForm={true}
          />
        </div>
        <div>
          <Label htmlFor="category-select" className="lg:placeholder-xs mb-1">
            Категорія:
          </Label>
          <CustomSelect
            id="category-select"
            value={filters.categoryId}
            // onChange={setCategoryId}
            onChange={(val) => updateFilter('categoryId', val)}
            options={categoriesWithAll}
            getOptionValue={(c) => c.categoryId}
            getOptionLabel={(c) => c.name}
            // label="Категорія"
            placeholder="Оберіть категорію"
            className="admin-select w-40"
          />
        </div>

        <div>
          <Label htmlFor="city-select" className="lg:placeholder-xs mb-1">
            Місто:
          </Label>
          <CustomSelect
            id="city-select"
            // label="Місто"
            value={filters.city}
            // onChange={setCity}
            onChange={(val) => updateFilter('city', val)}
            options={UKRAINE_REGIONAL_CENTERS}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            placeholder="Оберіть місто"
            className="admin-select w-40"
          />
        </div>
        <div>
          <Label htmlFor="online-select" className="lg:placeholder-xs mb-1">
            Online:
          </Label>
          <CustomSelect
            id="online-select"
            // label="Місто"
            // value={showOnlineStatus}
            value={filters.mode}
            // onChange={(val) => setShowOnlineStatus(val as OnlineFilter)}
            onChange={(val) => updateFilter('mode', val as OnlineFilter)}
            options={ONLINE_STATUS}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            placeholder="Оберіть місто"
            className="admin-select w-40"
          />
          {/* <OnlineStatusFilter
            value={showOnlineStatus}
            onChange={setShowOnlineStatus}
          /> */}
        </div>
      </div>

      {isBusinessesLoading && <p>Loading...</p>}
      {isBusinessesError && <p>Помилка: {error?.message}</p>}
      {/*  List*/}
      {businesses?.length ? (
        <div className="bg-background-main-50 lg:px-1 lg:py-4">
          <div className="grid w-full min-w-0 grid-cols-[1fr_1fr_1fr_1fr_0.5fr] px-2">
            <div className="min-w-0 py-2">Найменування </div>
            <div className="min-w-0 py-2">Статус</div>
            <div className="min-w-0 py-2">Категорія</div>
            <div className="min-w-0 py-2">Місто</div>
            <div className="min-w-0 py-2">Онлайн</div>
          </div>
          <ul className="">
            {businesses.map((b) => (
              <li
                key={b.id}
                className="mb-2 flex items-center justify-center gap-8 rounded-xl border border-gray-300 px-4 py-2"
              >
                <p className="flex-1/8">{b.name}</p>
                {/* <p className="flex-1/8">{b.city}</p> */}
                <p className="flex-1/8">{b.categoryName}</p>

                <BusinessStatusForm
                  businessId={b.id}
                  currentStatus={b.status}
                />
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
        </div>
      ) : (
        <p className="text-2xl"> Нема бізнесів</p>
      )}
    </div>
  );
}

export default AdminMainList;
