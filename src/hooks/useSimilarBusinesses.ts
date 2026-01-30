'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/reactQuery/queryKeys';

import { getSimilarBusinesses } from '@/lib/actions/getSimilarBusinesses';
import { getBusinessById } from '@/lib/actions/getBusinessById';
import { createBusiness } from '@/lib/actions/createBusiness';
import { GetSimilarBusinessesParams } from '@/types';
import { PAGE_SIZE } from '@/const/business';
import { updateBusiness } from '@/lib/actions/updateBusiness';
import { deleteBusiness } from '@/lib/actions/deleteBusiness';
import { getBusinessesForAdmin } from '@/lib/actions/admin/getBusinessesForAdmin';
import { BusinessStatus } from '@/types/enums';

export function useSimilarBusinesses(params: GetSimilarBusinessesParams) {
  return useQuery({
    queryKey: queryKeys.getSimilarBusinesses(params),
    queryFn: () => getSimilarBusinesses(params),
    enabled: Boolean(params.businessId && params.categoryId),
    staleTime: 1000 * 60 * 5,
  });
}
