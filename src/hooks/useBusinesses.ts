'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

import { getBusinesses } from '@/lib/actions/businesses';
import { getBusinessById } from '@/lib/actions/getBusinessById';
import { createBusiness } from '@/lib/actions/createBusiness';
import {
  AdminBusinessRowType,
  BusinessUpdate,
  BusinessWithDetails,
  GetBusinessesParams,
  NewBusinessFormData,
  AdminBusinessesParams,
} from '@/types';
import { PAGE_SIZE } from '@/const/business';
import { updateBusiness } from '@/lib/actions/updateBusiness';
import { deleteBusiness } from '@/lib/actions/deleteBusiness';
import { getBusinessesForAdmin } from '@/lib/actions/admin/getBusinessesForAdmin';
import { BusinessStatus } from '@/types/enums';

// export type UseBusinessesParams = GetBusinessesParams;
// all businesses
//simple
export function useBusinesses(params: GetBusinessesParams = {}) {
  return useQuery({
    queryKey: queryKeys.businessList(params),
    queryFn: () => getBusinesses(params),
    staleTime: 1000 * 60 * 5,
  });
}

//infinity
export function useInfiniteBusinesses(
  params: Omit<GetBusinessesParams, 'limit' | 'offset'>
) {
  return useInfiniteQuery({
    //queryKey: queryKeys.businessList(params),
    queryKey: ['businesses', params],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getBusinesses({
        ...params,
        offset: pageParam,
        limit: PAGE_SIZE,
      });
      return {
        data: result.data ?? [],
        nextOffset: result.nextOffset,
      };
    },
    //getNextPageParam: (lastPage) => lastPage.nextOffset,
    getNextPageParam: (lastPage) => {
      // console.log("lastPage in getNextPageParam:", lastPage);
      return lastPage?.nextOffset ?? undefined;
    },
    staleTime: 1000 * 60 * 10, // 10 минут кеш
    initialPageParam: 0,
    //keepPreviousData: true,
  });
}

//I do not remember if we use it
export function useBusiness(
  businessId: string,
  initialData?: BusinessWithDetails
) {
  return useQuery({
    queryKey: queryKeys.businessById(businessId),
    queryFn: () => getBusinessById(businessId),
    initialData,
    enabled: false, // не делаем лишний запрос, если данные уже есть
    // refetchOnMount: true, // перезапрос при монтировании компонента
    // refetchOnWindowFocus: false, // не нужно лишний раз при фокусе
  });
}
// create
export function useCreateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      values,
      status,
    }: {
      values: NewBusinessFormData;
      status: BusinessStatus;
    }) => createBusiness(values, status),
    onSuccess: () => {
      // update all business lists
      queryClient.invalidateQueries({
        queryKey: ['businesses'],
      });
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
      status,
    }: {
      id: string;
      values: BusinessUpdate;
      status: BusinessStatus;
    }) => updateBusiness(id, values, status),

    onSuccess: async (updatedBusiness, variables) => {
      // Обновляем кэш конкретного бизнеса с полным объектом

      queryClient.setQueryData(
        queryKeys.businessById(variables.id),
        updatedBusiness
      );

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
// delete
export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBusiness,
    onSuccess: (_data, id) => {
      // one business
      queryClient.invalidateQueries({
        queryKey: queryKeys.businessById(id),
        exact: true,
      });
      // all lists
      queryClient.invalidateQueries({
        queryKey: ['businesses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['adminBusinesses'],
        exact: false,
      });
    },
  });
}
//get businesses by review status
// export function useAdminBusinessesByReviewStatus(
//   status: BusinessReviewStatus,
//   categoryId?: string | null
// ) {
//   return useQuery({
//     queryKey: ['adminBusinessesByReviewStatus', { status, categoryId }],
//     queryFn: () =>
//       getBusinessesWithReviewStatus(status, categoryId ?? undefined),
//     staleTime: 1000 * 60 * 5,
//   });
// }

// new one
export function useAdminBusinesses(params: AdminBusinessesParams) {
  return useQuery<AdminBusinessRowType[]>({
    queryKey: queryKeys.adminBusinesses(params),
    queryFn: () => getBusinessesForAdmin(params),
    staleTime: 1000 * 60 * 10,
    // refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    //keepPreviousData: true, // чтобы UI не дергался при смене фильтров
  });
}
