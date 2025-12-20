import { UseMutationResult } from '@tanstack/react-query';
import { useAdminBusinesses, useDeleteBusiness } from '@/hooks/useBusinesses';
import { BusinessCategory } from '@/types/db';
import React, { useState } from 'react';
import { CustomToast } from '@/components/ui/custom-ui/CustomToast';
import { AdminFilters } from '@/types/filters-query';
import { AdminBusinessRowType } from '@/types';

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

  return <div className="flex lg:hidden">AdminMobileBusinessList </div>;
}

export default AdminMobileBusinessList;
