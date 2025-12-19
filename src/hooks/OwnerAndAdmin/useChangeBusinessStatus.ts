'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeBusinessStatus } from '@/lib/actions/admin/changeBusinessStatus';
import { BusinessStatus } from '@/types/enums';

export function useChangeBusinessStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BusinessStatus }) =>
      changeBusinessStatus(id, status),

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
