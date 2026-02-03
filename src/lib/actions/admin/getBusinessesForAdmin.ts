'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';

import {
  businessCategories,
  businesses,
  businessLocations,
  businessReviews,
} from '@/db/schema';
import { eq, sql, and, SQL } from 'drizzle-orm';

import { AdminBusinessRowType, AdminBusinessesParams } from '@/types/business';
import { isAdmin } from '@/lib/helpers/isAdmin';

// general admin query for businesses
export async function getBusinessesForAdmin({
  reviewStatus,
  businessStatus,
  categoryId,
  city,
  showOnlineStatus = 'all',
  sortBy = 'newest',
}: AdminBusinessesParams): Promise<AdminBusinessRowType[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const isAdminUser = await isAdmin(user.id);
  if (!isAdminUser) throw new Error('Forbidden');

  const conditions: SQL[] = [];

  if (categoryId && categoryId !== '__all__')
    conditions.push(eq(businesses.categoryId, categoryId));

  if (reviewStatus) conditions.push(eq(businessReviews.status, reviewStatus));
  if (businessStatus) conditions.push(eq(businesses.status, businessStatus));

  // фильтр по city и онлайн/офлайн
  if (!city || city === '__all__') {
    // "__all__"
    if (showOnlineStatus === 'online') {
      conditions.push(eq(businesses.isOnline, true));
    } else if (showOnlineStatus === 'offline') {
      // есть хотя бы одна физическая локация
      conditions.push(sql`
        EXISTS (
          SELECT 1 FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id}
        )
      `);
    }
  } else {
    // выбран конкретный город
    if (showOnlineStatus === 'online') {
      conditions.push(eq(businesses.isOnline, true));
    } else if (showOnlineStatus === 'offline') {
      conditions.push(sql`
        EXISTS (
          SELECT 1 FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id} AND bl.city = ${city}
        )
      `);
    } else if (showOnlineStatus === 'all') {
      // объединяем онлайн или с локацией в этом городе
      conditions.push(sql`(
        ${businesses.isOnline} = true OR EXISTS (
          SELECT 1 FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id} AND bl.city = ${city}
        ))
      `);
    }
  }

  const rows = await db
    .select({
      id: businesses.id,
      name: businesses.name,
      isOnline: businesses.isOnline,
      categoryId: businesses.categoryId,

      status: businesses.status,
      createdAt: businesses.createdAt,
      updatedAt: businesses.updatedAt,
      ownerId: businesses.ownerId,
      reviewCount: businesses.reviewCount,
      //join
      //categoryName: businessCategories.name,
      categoryName: sql<string>`MAX(${businessCategories.name})`,
      //----
      filteredReviewCount: sql<number>`COUNT(${businessReviews.id})`,
      cities: sql<string[]>`
  COALESCE(
    ARRAY_AGG(DISTINCT ${businessLocations.city})
      FILTER (WHERE ${businessLocations.city} IS NOT NULL),
    '{}'
  )
`,
    })
    .from(businesses)
    .leftJoin(businessReviews, eq(businesses.id, businessReviews.businessId))
    .leftJoin(
      businessCategories,
      eq(businesses.categoryId, businessCategories.categoryId)
    )
    .leftJoin(
      businessLocations,
      eq(businesses.id, businessLocations.businessId)
    )
    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(businesses.id)
    .orderBy(
      sortBy === 'newest'
        ? sql`${businesses.createdAt} DESC`
        : sql`${businesses.createdAt} ASC`
    );

  return rows;
}
