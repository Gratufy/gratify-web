'use client';
import React, { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { AdminSort } from '@/types/enums';
import { getCityLabel } from '@/utils/getCityLabel';

import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useAdminBusinesses, useDeleteBusiness } from '@/hooks/useBusinesses';
import { useAdminFilters } from '@/hooks/admin/useAdminFilters';

import { RefreshCcw } from 'lucide-react';

import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';

import AdminDesktopBusinessesList from '@/components/admin/shared/AdminDesktopBusinessesList';
import AdminMobileBusinessList from '@/components/admin/shared/AdminMobileBusinessList';

function AdminMainSection({ totalBusinesses }: { totalBusinesses: number }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [businessIdToDelete, setBusinessIdToDelete] = useState<string>('');
  const [sortBy] = useState<AdminSort>('newest');
  const {
    categories,
    // isLoading: isCategoriesLoading,
    // isError: isCategoriesError,
  } = useBusinessCategories();

  const { filters, updateFilter } = useAdminFilters();

  const {
    data: businesses = [],
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
    error,
  } = useAdminBusinesses({
    businessStatus: filters.businessStatus,
    categoryId: filters.categoryId,
    city: filters.city,
    showOnlineStatus: filters.showOnlineStatus,
    sortBy,
  });
  const deleteBusinessMutation = useDeleteBusiness();

  const handleDelete = async (businessId: string) => {
    // const confirmed = confirm('Are you sure you want to delete this business?');

    // if (!confirmed) return;
    await deleteBusinessMutation.mutateAsync(businessId);
    CustomToast({
      type: 'success',
      content: (
        <>
          <p className="font-semibold">Бізнес видалено</p>
        </>
      ),
    });
  };

  const categoriesWithAll = [
    { categoryId: '__all__', name: 'Всі' }, //index "__all__" for   "всi"
    ...(categories || []),
  ];
  const queryClient = useQueryClient();
  return (
    <div className="bg-background-white w-full max-[1024px]:p-4 max-[1024px]:py-4 lg:my-3 lg:p-5">
      <button
        className="btn-reject mb-8 lg:mb-4"
        onClick={() => {
          queryClient.invalidateQueries({
            queryKey: ['adminBusinesses'],
            exact: false,
          });
        }}
      >
        <RefreshCcw className="size-4" />
        <span>Оновити</span>
      </button>
      {/*  Title*/}
      <h2 className="title-h5 mb-4">
        Усього бізнесів: {totalBusinesses}/{businesses.length}
      </h2>
      <div className="hidden lg:block">
        <AdminDesktopBusinessesList
          categoriesWithAll={categoriesWithAll}
          // dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          // businessIdToDelete={businessIdToDelete}
          setBusinessIdToDelete={setBusinessIdToDelete}
          // sortBy={sortBy}
          updateFilter={updateFilter}
          filters={filters}
          businesses={businesses}
          isBusinessesLoading={isBusinessesLoading}
          isBusinessesError={isBusinessesError}
          error={error}
          // deleteBusinessMutation={deleteBusinessMutation}
          // handleDelete={handleDelete}
        />
      </div>
      <div className="max-w-150 flex justify-center lg:hidden">
        <AdminMobileBusinessList
          categoriesWithAll={categoriesWithAll}
          // dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          // businessIdToDelete={businessIdToDelete}
          setBusinessIdToDelete={setBusinessIdToDelete}
          // sortBy={sortBy}
          updateFilter={updateFilter}
          filters={filters}
          businesses={businesses}
          isBusinessesLoading={isBusinessesLoading}
          isBusinessesError={isBusinessesError}
          error={error}
          // deleteBusinessMutation={deleteBusinessMutation}
          // handleDelete={handleDelete}
        />
      </div>
      <CustomAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Ви впевнені, що хочете видалити?"
        description="Цю дію не можна буде скасувати."
        actionContent="Так, видалити"
        cancelText="Скасувати"
        classNameTitle="xl:placeholder-base! placeholder-sm! font-normal text-center"
        classNameDescription="text-center text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
        onAction={() => handleDelete(businessIdToDelete)}
        //  setOnConfirm(() => () => removeFavorite.mutate(business.id));
      />
    </div>
  );
}

export default AdminMainSection;
