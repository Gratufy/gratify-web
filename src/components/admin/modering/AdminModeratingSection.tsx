'use client';
import React, { useState } from 'react';
import AdminDesktopBusinessesList from '@/components/admin/shared/AdminDesktopBusinessesList';
import AdminMobileBusinessList from '../shared/AdminMobileBusinessList';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useAdminBusinesses, useDeleteBusiness } from '@/hooks/useBusinesses';
import { useAdminFilters } from '@/hooks/admin/useAdminFilters';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { CustomAlertDialog } from '@/components/ui/custom-ui/CustomAlertDialog';
import { AdminSort } from '@/types/enums';

function AdminModeratingSection({
  totalBusinesses,
}: {
  totalBusinesses: number;
}) {
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
  return (
    <div className="bg-background-white mt-3 w-full max-[1024px]:p-4 lg:p-5">
      {/*  Title*/}
      <h2 className="title-h5 mb-4">
        Усього бізнесів: {totalBusinesses}/{businesses.length}
      </h2>
      <div className="hidden lg:block">
        <AdminDesktopBusinessesList
          categories={categories}
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
          isModeringSection={true}
        />
      </div>
      <div className="lg:hidden">
        <AdminMobileBusinessList
          categories={categories}
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
          isModeringSection={true}
        />
      </div>
      <CustomAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Ви впевнені, що хочете видалити?"
        description="Цю дію не можна буде скасувати."
        actionContent="Так, видалити"
        cancelText="Скасувати"
        classNameTitle="text-center xl:placeholder-base! placeholder-sm! font-normal"
        classNameDescription="text-center text-icons-text-950-grey font-semibold placeholder-sm xl:placeholder-base"
        onAction={() => handleDelete(businessIdToDelete)}
        //  setOnConfirm(() => () => removeFavorite.mutate(business.id));
      />
    </div>
  );
}

export default AdminModeratingSection;
