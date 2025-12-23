'use client';
import { useState } from 'react';
import Link from 'next/link';
import { UseMutationResult } from '@tanstack/react-query';
import { BusinessStatus, OnlineFilter } from '@/types/enums';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { BUSINESS_STATUS, BUSINESS_STATUS_LABELS } from '@/const/business';
import { ONLINE_STATUS } from '@/const/online-status';

import IconMenu from '@/assets/icons/admin/icon-menu.svg';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import IconEyeOpen from '@/assets/icons/admin/icon-eye-open.svg';

import CustomSelect from '@/components/ui/custom-ui/CustomSelect';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

import { BusinessStatusForm } from '@/components/admin/shared/BusinessStatusForm';
import AdminSkeleton from '@/components/admin/shared/AdminSkeleton';
import { BusinessCategory } from '@/types/db';
import { AdminFilters } from '@/types/filters-query';
import { AdminBusinessRowType } from '@/types';

interface AdminDesktopBusinessesListProps {
  // categories: { categoryId: string; name: string }[] | undefined;
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
  isModeringSection?: boolean;
}

function AdminDesktopBusinessesList({
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
  isModeringSection,
}: AdminDesktopBusinessesListProps) {
  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі' }, //index "__all__" for   "всi"
    ...(categories || []),
  ];

  return (
    <>
      {/*  Title*/}

      {/* <h3 className="lg:placeholder-base mb-4">
        Наявні бізнеси: {businesses ? businesses.length : 0}
      </h3> */}
      {/*  Filters*/}
      <div className="flex justify-center lg:mb-5 lg:gap-6">
        {!isModeringSection && (
          <div className="flex-1">
            <Label
              htmlFor="status-select"
              className="lg:placeholder-xs xl:placeholder-sm mb-1"
            >
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
        <div className="flex-1">
          <Label
            htmlFor="category-select"
            className="lg:placeholder-xs xl:placeholder-sm mb-1"
          >
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

        <div className="flex-1">
          <Label
            htmlFor="city-select"
            className="lg:placeholder-xs xl:placeholder-sm mb-1"
          >
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
        <div className="flex-1">
          <Label
            htmlFor="online-select"
            className="lg:placeholder-xs xl:placeholder-sm mb-1"
          >
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
      {isBusinessesLoading && <AdminSkeleton count={3} />}
      {isBusinessesError && <p>Помилка: {error?.message}</p>}
      {/*  List*/}
      {businesses?.length > 0 && (
        <div className="bg-background-main-50 rounded-lg lg:px-1 lg:py-4">
          <div className="grid w-full min-w-0 grid-cols-[1fr_1fr_1fr_1fr_0.5fr] px-2 lg:mb-6">
            <div className="title-h6 min-w-0 py-2">
              <span>Найменування </span>
            </div>
            <div className="title-h6 min-w-0 py-2">
              <span>Статус</span>
            </div>
            <div className="title-h6 min-w-0 py-2">
              <span>Категорія</span>
            </div>
            <div className="title-h6 min-w-0 py-2">
              <span>Місто</span>
            </div>
            <div className="title-h6 min-w-0 py-2">
              <span>Онлайн</span>
            </div>
          </div>
          <ul className="flex flex-col lg:gap-5">
            {businesses.map((b) => (
              <li
                key={b.id}
                className="bg-background-main-200 grid grid-cols-[1fr_1fr_1fr_1fr_0.5fr] items-center justify-center rounded-lg p-2 px-2"
              >
                <div className="title-h6 py-2">
                  <p className="">{b.name}</p>
                </div>

                <div className="title-h6 py-2">
                  <BusinessStatusForm
                    businessId={b.id}
                    currentStatus={b.status}
                    className="w-40"
                  />
                </div>

                <div className="title-h6 py-2">
                  <p className="">{b.categoryName}</p>
                </div>

                <div className="title-h6 py-2">
                  <p className="">City</p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Checkbox
                    className="border-icons-grey-950 bg-background-main-200! data-[state=checked]:text-icons-grey-950 lg:mx-5 lg:size-4"
                    checked={b.isOnline || false}
                  />

                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <IconMenu className="size-6" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      // shadow-menu border-icons-grey-400 border
                      className="xl:w-65 lg:w-65 w-50 border-icons-grey-400 shadow-menu rounded-none border"
                      align="center"
                      side="left"
                    >
                      <DropdownMenuLabel className="sr-only">
                        Відкрити меню
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        asChild
                        className="placeholder-sm xl:placeholder-base cursor-pointer gap-0 px-3 lg:px-2"
                      >
                        <Link href={`/admin/business/${b.id}`} className="">
                          <IconEyeOpen className="mr-2 size-4 xl:mr-3 xl:size-5" />{' '}
                          Подивитись
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="placeholder-sm xl:placeholder-base cursor-pointer gap-0 px-3 lg:px-2"
                      >
                        <Link
                          href={`/admin/business/${b.id}/edit`}
                          className=""
                        >
                          <EditPen className="mr-2 size-4 xl:mr-3 xl:size-5" />
                          Редагувати
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="placeholder-sm xl:placeholder-base cursor-pointer gap-0 px-3 lg:px-2"
                      >
                        <button
                          className="text-icons-color-error focus:bg-elements-grey-200 hover:bg-elements-grey-200 xl:placeholder-base flex w-full cursor-pointer items-center rounded-sm border-none bg-white px-3 py-1.5 text-sm disabled:opacity-50 lg:px-2"
                          onClick={() => {
                            setBusinessIdToDelete(b.id);
                            setDialogOpen(true);
                            // setMenuOpen(false);
                            document.body.click();
                          }}
                        >
                          <IconRecycle className="text-icons-color-error mr-2 size-4 xl:mr-3 xl:size-5" />
                          Видалити
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {businesses?.length === 0 && !isBusinessesLoading && (
        <p className="xl:placeholder-base placeholder-sm text-center">
          Нема бізнесів відповідних обраним фільтрам
        </p>
      )}
    </>
  );
}

export default AdminDesktopBusinessesList;
