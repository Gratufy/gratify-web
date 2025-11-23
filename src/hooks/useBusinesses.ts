'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

import {
  //   getAllBusinesses,

  updateBusiness,
  deleteBusiness,
  getBusinesses,
  getBusinessesWithReviewStatus,
  getBusinessesForAdmin,
} from '@/lib/actions/businesses';
import { getBusinessById } from '@/lib/actions/getBusinessById';
import { createBusiness } from '@/lib/actions/createBusiness';
import {
  AdminBusinessRowType,
  BusinessReviewStatus,
  BusinessWithDetails,
  GetBusinessesParams,
  NewBusinessFormData,
  UseAdminBusinessesParams,
} from '@/types';
import { PAGE_SIZE } from '@/const/business';

export type UseBusinessesParams = GetBusinessesParams;
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

// one business
// export function useBusiness(id: string) {
//   const queryClient = useQueryClient();

//   return useQuery<BusinessWithCategoryName | null>({
//     queryKey: queryKeys.businessById(id),
//     queryFn: () => getBusinessById(id),
//     initialData: () =>
//       queryClient.getQueryData<BusinessWithCategoryName>(
//         queryKeys.businessById(id)
//       ) ?? null,
//     staleTime: 1000 * 60 * 10,
//     enabled: !!id,
//   });
// }
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
    mutationFn: createBusiness,
    onSuccess: () => {
      // update all business lists
      queryClient.invalidateQueries({
        queryKey: ['businesses'],
      });
    },
  });
}

// update
// export function useUpdateBusiness() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, values }: { id: string; values: BusinessUpdate }) =>
//       updateBusiness(id, values),
//     onSuccess: (_data, variables) => {
//       // one business
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.businessById(variables.id),
//         exact: true,
//       });
//       // all lists
//       queryClient.invalidateQueries({
//         queryKey: ['businesses'],
//       });
//     },
//   });
// }

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<NewBusinessFormData>;
    }) => updateBusiness(id, values),

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
    },
  });
}
//get businesses by review status
export function useAdminBusinessesByReviewStatus(
  status: BusinessReviewStatus,
  categoryId?: string | null
) {
  return useQuery({
    queryKey: ['adminBusinessesByReviewStatus', { status, categoryId }],
    queryFn: () =>
      getBusinessesWithReviewStatus(status, categoryId ?? undefined),
    staleTime: 1000 * 60 * 5,
  });
}

// new one
export function useAdminBusinesses(params: UseAdminBusinessesParams) {
  return useQuery<AdminBusinessRowType[]>({
    queryKey: queryKeys.adminBusinesses(params),
    queryFn: () => getBusinessesForAdmin(params),
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
    //keepPreviousData: true, // чтобы UI не дергался при смене фильтров
  });
}
