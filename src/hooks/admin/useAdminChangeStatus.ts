'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BusinessStatus } from '@/types';

import { adminChangeBusinessStatus } from '@/lib/actions/admin/adminChangeBusinessStatus';

export function useAdminChangeBusinessStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BusinessStatus }) =>
      adminChangeBusinessStatus(id, status),

    onSuccess: async () => {
      // Обновляем кэш конкретного бизнеса с полным объектом
      //   queryClient.setQueryData(
      //     queryKeys.businessById(variables.id),
      //     updatedBusiness
      //   );

      // Обновляем кэш списка бизнесов
      queryClient.invalidateQueries({
        queryKey: ['businesses'],
      });
      // Обновляем кэш списка бизнесов admin
      queryClient.invalidateQueries({
        queryKey: ['adminBusinesses'],
      });
    },
  });
}
