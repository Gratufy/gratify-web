'use server';

import { db } from '@/db';
import { businessImages } from '@/db/schema';
import { BusinessImage } from '@/types';
import { eq, desc, sql, and, SQL, inArray, or } from 'drizzle-orm';

export async function getCoverImagesForBusinesses(ids: string[]): Promise<
  {
    businessId: string;
    url: string;
  }[]
> {
  const rows = await db
    .select({
      businessId: businessImages.businessId,
      url: businessImages.url,
    })
    .from(businessImages)
    .where(
      and(
        inArray(businessImages.businessId, ids),
        eq(businessImages.isCover, true)
      )
    );

  return rows ?? [];
}
