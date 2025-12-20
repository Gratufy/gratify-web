import { UseMutationResult } from '@tanstack/react-query';
import { useAdminBusinesses, useDeleteBusiness } from '@/hooks/useBusinesses';
import { BusinessCategory } from '@/types/db';
import React, { useState } from 'react';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { AdminFilters } from '@/types/filters-query';
import { AdminBusinessRowType } from '@/types';
import { Label } from '@/components/ui/label';
import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { BusinessStatus, OnlineFilter } from '@/types/enums';
import { BUSINESS_STATUS, BUSINESS_STATUS_LABELS } from '@/const/business';
import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { ONLINE_STATUS } from '@/const/online-status';
import AdminSkeleton from './AdminSkeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { BusinessStatusForm } from './BusinessStatusForm';
import EyeIcon from '@/assets/icons/admin/icon-eye.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
import { CheckIcon } from 'lucide-react';

interface AdminMobileBusinessListProps {
  categories: BusinessCategory[];
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  businessIdToDelete: string;
  setBusinessIdToDelete: (id: string) => void;
  sortBy: 'newest' | 'oldest';
  filters: AdminFilters;
  updateFilter: <K extends keyof AdminFilters>(
    key: K,
    value: AdminFilters[K]
  ) => void;
  businesses: AdminBusinessRowType[];
  isBusinessesLoading: boolean;
  isBusinessesError: boolean;
  error: Error | null;
  deleteBusinessMutation: UseMutationResult<
    { success: boolean },
    Error,
    string,
    unknown
  >;
  handleDelete: (businessId: string) => Promise<void>;
}
function AdminMobileBusinessList({
  categories,
  dialogOpen,
  setDialogOpen,
  businessIdToDelete,
  setBusinessIdToDelete,
  sortBy,
  filters,
  updateFilter,
  businesses,
  isBusinessesLoading,
  isBusinessesError,
  error,
  deleteBusinessMutation,
  handleDelete,
}: AdminMobileBusinessListProps) {
  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі' }, //index "__all__" for   "всi"
    ...(categories || []),
  ];

  const statusIcon = (value: string) =>
    value === 'approved' ? (
      <CheckIcon className="size-4" />
    ) : value === 'pending' ? (
      <IconModering className="size-4" />
    ) : value === 'rejected' ? (
      <CrossIcon className="size-4" />
    ) : (
      <EyeIcon className="size-4" />
    );
  return (
    <div className="bg-background-white flex flex-col">
      {/*  Title amd Filters*/}
      <div className="mb-4 flex w-full justify-between">
        {/*  Title*/}
        <h3 className="title-h5 mb-2">
          Наявні бізнеси: {businesses ? businesses.length : 0}
        </h3>
        {/*  Filters*/}
        <div className="flex flex-col gap-5">
          <div>
            <Label htmlFor="status-select" className="placeholder-xs mb-1">
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
              getOptionLabel={(s) => BUSINESS_STATUS_LABELS[s]}
              placeholder="Оберіть статус"
              className="admin-select w-40"
              // statusForm={true}
            />
          </div>
          <div>
            <Label htmlFor="category-select" className="placeholder-xs mb-1">
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
            <Label htmlFor="city-select" className="placeholder-xs mb-1">
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
            <Label htmlFor="online-select" className="placeholder-xs mb-1">
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
          </div>
        </div>
      </div>
      {isBusinessesLoading && <AdminSkeleton count={3} />}
      {isBusinessesError && <p>Помилка: {error?.message}</p>}
      {businesses?.length > 0 && (
        <div className="bg-background-main-50 rounded-lg py-4">
          {/* Header */}
          <div className="mb-4 grid w-full min-w-0 grid-cols-[2fr_1fr_2fr_1fr] px-2 py-2">
            <div className="title-h6 min-w-0">
              <span>Найменування </span>
            </div>
            <div className="title-h6 min-w-0 text-center">
              <span>Статус</span>
            </div>
            <div className="title-h6 min-w-0 text-center">
              <span>Категорія</span>
            </div>
          </div>
          {/* Rows */}
          <ul className="flex flex-col gap-5">
            {businesses.map((b) => (
              <li
                key={b.id}
                className="bg-background-main-200 grid grid-cols-[2fr_1fr_2fr_1fr] items-center justify-center rounded-lg p-2 px-2"
              >
                <div className="title-h6 py-2">
                  <p className="">{b.name}</p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-background-grey-100 flex h-full w-7 items-center justify-center rounded-sm py-2">
                    {statusIcon(b.status)}
                  </div>
                </div>

                <div className="title-h6 py-2 text-center">
                  <p className="">{b.categoryName}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {businesses?.length === 0 && !isBusinessesLoading && (
        <p className="placeholder-sm text-center">
          Нема бізнесів відповідних обраним фільтрам
        </p>
      )}
    </div>
  );
}

export default AdminMobileBusinessList;
