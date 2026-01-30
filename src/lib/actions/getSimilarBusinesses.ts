'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { getCoverImagesForBusinesses } from '../helpers/getCoverImagesForBusinesses';
import {
  businessCategories,
  businesses,
  businessLocations,
  businessVotes,
} from '@/db/schema';
import { eq, desc, sql, and, SQL, inArray, or, ne } from 'drizzle-orm';
import {
  BusinessWithCategoryName,
  GetSimilarBusinessesParams,
} from '@/types/business';

const businessSelectFields = {
  id: businesses.id,
  name: businesses.name,
  categoryId: businesses.categoryId,
  isOnline: businesses.isOnline,
  description: businesses.description,
  website: businesses.website,
  karma: businesses.karma,
  status: businesses.status,
  createdAt: businesses.createdAt,
  updatedAt: businesses.updatedAt,
  ownerId: businesses.ownerId,
  reviewCount: businesses.reviewCount,
  //join
  categoryName: businessCategories.name,
  city: businessLocations.city,
  address: businessLocations.address,
  latitude: businessLocations.latitude,
  longitude: businessLocations.longitude,
  //----
};

export async function getSimilarBusinesses(
  params: GetSimilarBusinessesParams
): Promise<BusinessWithCategoryName[]> {
  try {
    const { businessId, categoryId, city, isOnline, limit = 2 } = params;

    const conditions: SQL[] = [];

    conditions.push(eq(businesses.categoryId, categoryId));
    conditions.push(ne(businesses.id, businessId));
    conditions.push(eq(businesses.status, 'approved'));

    if (isOnline) {
      conditions.push(eq(businesses.isOnline, true));
    } else if (city) {
      conditions.push(sql`
        EXISTS (
          SELECT 1
          FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id}
            AND bl.city = ${city}
        )
      `);
    }

    const whereClause = and(...conditions);

    const idsRows = await db
      .select({ id: businesses.id })
      .from(businesses)
      .where(whereClause)
      .orderBy(desc(businesses.karma), desc(businesses.createdAt))
      .limit(limit);

    const ids = idsRows.map((r) => String(r.id));
    if (ids.length === 0) return [];

    const rows = await db
      .select(businessSelectFields)
      .from(businesses)
      .leftJoin(
        businessCategories,
        eq(businesses.categoryId, businessCategories.categoryId)
      )
      .leftJoin(
        businessLocations,
        eq(businesses.id, businessLocations.businessId)
      )
      .where(inArray(businesses.id, ids))
      .orderBy(desc(businesses.karma), desc(businesses.createdAt));

    const businessMap = new Map<string, BusinessWithCategoryName>();

    for (const row of rows) {
      if (!businessMap.has(row.id)) {
        const { city, address, latitude, longitude, ...rest } = row;

        businessMap.set(row.id, {
          ...rest,
          locations: [],
          allOffersRows: [],
        });
      }

      if (row.city) {
        businessMap.get(row.id)?.locations.push({
          city: row.city,
          address: row.address ?? null,
          latitude: row.latitude ?? null,
          longitude: row.longitude ?? null,
        });
      }
    }

    const result = Array.from(businessMap.values());

    const coverRows = await getCoverImagesForBusinesses(ids);
    for (const row of coverRows) {
      const business = businessMap.get(row.businessId);
      if (business) {
        business.coverImageUrl = row.url;
      }
    }

    return result;
  } catch (error) {
    console.error('Error fetching similar businesses:', error);
    return []; // 👈 ВАЖНО
  }
}
