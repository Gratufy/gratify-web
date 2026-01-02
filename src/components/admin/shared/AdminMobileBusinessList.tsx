'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { AdminFilters } from '@/types/filters-query';
import { AdminBusinessRowType } from '@/types';

import AdminSkeleton from './AdminSkeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { BusinessStatusForm } from './BusinessStatusForm';
import EyeIcon from '@/assets/icons/admin/icon-eye.svg';
import CrossIcon from '@/assets/icons/general/icon-16-cross.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import IconEyeOpen from '@/assets/icons/admin/icon-eye-open.svg';

import { getBusinessStatusBgColor } from '@/lib/helpers/getBusinessStatusColorBg';

import MainPageFilters from './MainPageFilters';

interface AdminMobileBusinessListProps {
  categoriesWithAll: (
    | {
        name: string;
        categoryId: string;
        createdAt: Date | null;
        updatedAt: Date | null;
      }
    | {
        categoryId: string;
        name: string;
      }
  )[];
  // dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  // businessIdToDelete: string;
  setBusinessIdToDelete: (id: string) => void;
  // sortBy: 'newest' | 'oldest';
  filters: AdminFilters;
  updateFilter: <K extends keyof AdminFilters>(
    key: K,
    value: AdminFilters[K]
  ) => void;
  businesses: AdminBusinessRowType[];
  isBusinessesLoading: boolean;
  isBusinessesError: boolean;
  error: Error | null;
  // deleteBusinessMutation: UseMutationResult<
  //   { success: boolean },
  //   Error,
  //   string,
  //   unknown
  // >;
  // handleDelete: (businessId: string) => Promise<void>;
  isModeringSection?: boolean;
}
function AdminMobileBusinessList({
  categoriesWithAll,
  //  dialogOpen,
  setDialogOpen,
  // businessIdToDelete,
  setBusinessIdToDelete,
  // sortBy,
  filters,
  updateFilter,
  businesses,
  isBusinessesLoading,
  isBusinessesError,
  error,
  // deleteBusinessMutation,
  // handleDelete,
  isModeringSection,
}: AdminMobileBusinessListProps) {
  const [showFullCard, setShowFullCard] = useState<Record<string, boolean>>({});

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
    <div className="flex w-full flex-col">
      {/*  Filters*/}
      <MainPageFilters
        isModeringSection={isModeringSection}
        categoriesWithAll={categoriesWithAll}
        filters={filters}
        updateFilter={updateFilter}
      />
      {/* <div className="border-b-elements-grey-200 mb-8 flex flex-col justify-center gap-5 border-b pb-8 lg:mb-8 lg:flex-row lg:gap-3">
        <div className="flex flex-1 flex-col gap-5 lg:gap-3">
          {!isModeringSection && (
            <div className="w-full">
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
                className="admin-select w-full"
                // statusForm={true}
              />
            </div>
          )}
          <div className="w-full">
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
              className="admin-select w-full"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 lg:gap-3">
          <div className="w-full">
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
              className="admin-select w-full"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="online-select" className="placeholder-xs mb-1">
              Online:
            </Label>
            <CustomSelect
              id="online-select"
              // label="Місто"
              // value={showOnlineStatus}
              value={filters.showOnlineStatus}
              // onChange={(val) => setShowOnlineStatus(val as OnlineFilter)}
              onChange={(val) =>
                updateFilter('showOnlineStatus', val as OnlineFilter)
              }
              options={ONLINE_STATUS}
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
              placeholder="Оберіть місто"
              className="admin-select w-full"
            />
          </div>
        </div>
      </div> */}

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
          <ul className="flex flex-col gap-5 px-1">
            {businesses.map((b) => (
              <li key={b.id} className="bg-background-main-200 rounded-lg p-2">
                {/* short */}
                <div
                  className={cn(
                    'grid items-center justify-center',
                    showFullCard[b.id]
                      ? 'mb-3 grid-cols-[2fr_3fr_1fr]'
                      : 'grid-cols-[2fr_1fr_2fr_1fr]'
                  )}
                >
                  <div className="title-h6 py-2">
                    <p>{b.name}</p>
                  </div>
                  <div className="flex h-full justify-center">
                    {showFullCard[b.id] ? (
                      <div className="title-h6 py-2">
                        <BusinessStatusForm
                          businessId={b.id}
                          currentStatus={b.status}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div
                        className={`${b.status && getBusinessStatusBgColor(b.status)} flex h-full w-7 items-center justify-center rounded-sm`}
                      >
                        {statusIcon(b.status)}
                      </div>
                    )}
                  </div>
                  {!showFullCard[b.id] && (
                    <div className="title-h6 py-2 text-center">
                      <p className="">{b.categoryName}</p>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        setShowFullCard((prev) => ({
                          ...prev,
                          [b.id]: !prev[b.id],
                        }))
                      }
                    >
                      {showFullCard[b.id] ? (
                        <ChevronUpIcon className="size-8" />
                      ) : (
                        <ChevronDownIcon className="size-8" />
                      )}
                    </button>
                  </div>
                </div>

                {/* full */}
                {showFullCard[b.id] && (
                  <div className="flex flex-col gap-3">
                    {/* 2 row */}
                    <div className="grid grid-cols-[2fr_3fr_1fr] items-center py-2">
                      <div className="title-h6">
                        <p className="">{b.categoryName}</p>
                      </div>
                      <div className="title-h6">
                        <p className="">City</p>
                      </div>
                      <div className="title-h6 flex flex-col items-center gap-1">
                        <Checkbox
                          className="border-icons-grey-950 bg-background-main-200! data-[state=checked]:text-icons-grey-950 size-4"
                          checked={b.isOnline || false}
                        />
                        <p>онлайн</p>
                      </div>
                    </div>
                    {/* 3 row */}
                    <div className="placeholder-base flex justify-center gap-6">
                      <Link
                        href={`/admin/business/${b.id}`}
                        className="btn-reject placeholder-base px-2 py-2"
                      >
                        <IconEyeOpen className="size-5" />
                      </Link>
                      <Link
                        href={`/admin/business/${b.id}/edit`}
                        className="btn-reject placeholder-base px-2 py-2"
                      >
                        <EditPen className="size-5" />
                        {/* <span>Редагувати</span> */}
                      </Link>
                      <button
                        className="btn-reject placeholder-base px-2 py-2"
                        onClick={() => {
                          setBusinessIdToDelete(b.id);
                          setDialogOpen(true);
                          // setMenuOpen(false);
                          document.body.click();
                        }}
                      >
                        <IconRecycle className="text-icons-color-error size-5" />
                        {/* <span>Видалити</span> */}
                      </button>
                    </div>
                  </div>
                )}
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
