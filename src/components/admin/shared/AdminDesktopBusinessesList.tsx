import React from 'react';
import Link from 'next/link';

import { getCityLabel } from '@/utils/getCityLabel';

import IconMenu from '@/assets/icons/admin/icon-menu.svg';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import IconEyeOpen from '@/assets/icons/admin/icon-eye-open.svg';

import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { BusinessStatusForm } from '@/components/admin/shared/BusinessStatusForm';
import AdminSkeleton from '@/components/admin/shared/AdminSkeleton';

import { AdminFilters } from '@/types/filters-query';
import { AdminBusinessRowType } from '@/types';
import MainPageFilters from './MainPageFilters';

interface AdminDesktopBusinessesListProps {
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
  setDialogOpen: (open: boolean) => void;
  setBusinessIdToDelete: (id: string) => void;
  filters: AdminFilters;
  updateFilter: <K extends keyof AdminFilters>(
    key: K,
    value: AdminFilters[K]
  ) => void;
  businesses: AdminBusinessRowType[];
  isBusinessesLoading: boolean;
  isBusinessesError: boolean;
  error: Error | null;
  isModeringSection?: boolean;
}

function AdminDesktopBusinessesList({
  categoriesWithAll,
  setDialogOpen,
  setBusinessIdToDelete,
  filters,
  updateFilter,
  businesses,
  isBusinessesLoading,
  isBusinessesError,
  error,
  isModeringSection,
}: AdminDesktopBusinessesListProps) {
  return (
    <>
      {/*  Filters*/}
      <MainPageFilters
        isModeringSection={isModeringSection}
        categoriesWithAll={categoriesWithAll}
        filters={filters}
        updateFilter={updateFilter}
      />

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
                    businessName={b.name}
                    businessId={b.id}
                    currentStatus={b.status}
                    className="w-40"
                  />
                </div>

                <div className="title-h6 py-2">
                  <p className="">{b.categoryName}</p>
                </div>

                <div className="title-h6 py-2">
                  {b.cities.length > 0 ? (
                    b.cities.map((city, index) => (
                      <p key={city + index} className="">
                        {getCityLabel(city)}
                      </p>
                    ))
                  ) : (
                    <p className="">-----</p>
                  )}
                </div>

                <div className="flex items-center justify-between py-2">
                  <Checkbox
                    disabled
                    aria-label={`Статус онлайн ${b.name}`}
                    className="border-icons-grey-950! bg-background-main-200! data-[state=checked]:text-icons-grey-950 disabled:opacity-100 lg:mx-5 lg:size-4"
                    checked={!!b.isOnline}
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
                        Відкрити меню картки бізнесу {b.name}
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
                        <Link href={`/admin/business/${b.id}/edit`}>
                          <EditPen className="mr-2 size-4 xl:mr-3 xl:size-5" />
                          Редагувати
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="placeholder-sm xl:placeholder-base cursor-pointer gap-0 px-3 lg:px-2"
                      >
                        <button
                          aria-label={`Видалити бізнес ${b.name}`}
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
