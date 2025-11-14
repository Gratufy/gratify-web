'use server';

import { db } from '@/db';
import { businessImages } from '@/db/schema';
import { BusinessImages } from '@/types';
import { eq } from 'drizzle-orm';

export async function getBusinessImages(
  businessId: string
): Promise<BusinessImages> {
  const rows = await db
    .select({
      url: businessImages.url,
      isCover: businessImages.isCover,
    })
    .from(businessImages)
    .where(eq(businessImages.businessId, businessId));

  return rows ?? []; // гарантирует [], никогда null
}
