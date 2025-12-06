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
import IconMenu from '@/assets/icons/admin/icon-menu.svg';
import IconRecycle from '@/assets/icons/menu/icon-recycle.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';
import IconEyeOpen from '@/assets/icons/admin/icon-eye-open.svg';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
          <div className="grid w-full min-w-0 grid-cols-[1fr_1fr_1fr_1fr_0.5fr] px-2 lg:mb-6">
            <div className="min-w-0 py-2">Найменування </div>
            <div className="min-w-0 py-2">Статус</div>
            <div className="min-w-0 py-2">Категорія</div>
            <div className="min-w-0 py-2">Місто</div>
            <div className="min-w-0 py-2">Онлайн</div>
          </div>
          <ul className="flex flex-col lg:gap-5">
            {businesses.map((b) => (
              <li
                key={b.id}
                className="bg-background-main-200 grid grid-cols-[1fr_1fr_1fr_1fr_0.5fr] items-center justify-center rounded-lg p-2 px-2"
              >
                <div className="py-2">
                  <p className="">{b.name}</p>
                </div>

                <div className="py-2">
                  <BusinessStatusForm
                    businessId={b.id}
                    currentStatus={b.status}
                  />
                </div>

                <div className="py-2">
                  <p className="">{b.categoryName}</p>
                </div>

                <div className="py-2">
                  <p className="">City</p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Checkbox
                    className="border-icons-grey-950 bg-background-main-200! data-[state=checked]:text-icons-grey-950 lg:mx-5 lg:size-4"
                    checked={b.isOnline || false}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <IconMenu className="size-6" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      // shadow-menu border-icons-grey-400 border
                      className="xl:w-75 lg:w-65 w-50 border-icons-grey-400 shadow-menu rounded-none border"
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
                          onClick={() => handleDelete(b.id)}
                        >
                          <IconRecycle className="text-icons-color-error mr-2 size-4 xl:mr-3 xl:size-5" />
                          Видалити
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* <Link
                  href={`./business/${b.id}`}
                  className="bg-chart-2 cursor-pointer rounded-full px-4 py-2 text-white"
                >
                  See more
                </Link> */}
                {/* <button
                  className="flex cursor-pointer items-center justify-center rounded-3xl border border-red-500 px-4 py-2"
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button> */}
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
