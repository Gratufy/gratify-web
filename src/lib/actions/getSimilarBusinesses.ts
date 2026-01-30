'use server';

import { db } from '@/db';
import { getCoverImagesForBusinesses } from '../helpers/getCoverImagesForBusinesses';
import { businessCategories, businesses, businessLocations } from '@/db/schema';
import { eq, desc, sql, and, SQL, inArray, ne } from 'drizzle-orm';
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

    const baseConditions: SQL[] = [
      ne(businesses.id, businessId),
      eq(businesses.status, 'approved'),
    ];

    if (isOnline) {
      baseConditions.push(eq(businesses.isOnline, true));
    } else if (city) {
      baseConditions.push(sql`
        EXISTS (
          SELECT 1
          FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id}
            AND bl.city = ${city}
        )
      `);
    }

    // ---------- 1️⃣ Похожие по категории ----------
    const strictConditions: SQL[] = [...baseConditions];
    if (categoryId)
      strictConditions.push(eq(businesses.categoryId, categoryId));
    const strictWhere =
      strictConditions.length > 0 ? and(...strictConditions) : undefined;

    let ids: string[] = [];

    if (strictWhere) {
      const strictRows = await db
        .select({ id: businesses.id })
        .from(businesses)
        .where(strictWhere)
        .orderBy(desc(businesses.karma), desc(businesses.createdAt))
        .limit(limit);

      ids = strictRows.map((r) => String(r.id));
    }
    // ---------- 2️⃣ Fallback: дополняем, если не хватает ----------
    if (ids.length < limit) {
      let remaining = limit - ids.length;
      let fallbackWhereCity: SQL | undefined = undefined;
      if (city) {
        const cityConditions: SQL[] = [
          eq(businesses.status, 'approved'),
          sql`EXISTS (SELECT 1 FROM ${businessLocations} bl WHERE bl.business_id = ${businesses.id} AND bl.city = ${city})`,
        ];
        if (ids.length > 0)
          cityConditions.push(sql`NOT (${inArray(businesses.id, ids)})`);
        fallbackWhereCity = and(...cityConditions);
      }

      if (fallbackWhereCity) {
        const cityRows = await db
          .select({ id: businesses.id })
          .from(businesses)
          .where(fallbackWhereCity)
          .orderBy(desc(businesses.karma), desc(businesses.createdAt))
          .limit(remaining);

        ids = [...ids, ...cityRows.map((r) => String(r.id))];
        remaining = limit - ids.length;
      }
      // 2️⃣ fallback: любые approved (без города)
      if (remaining > 0) {
        const anyConditions: SQL[] = [eq(businesses.status, 'approved')];
        if (ids.length > 0)
          anyConditions.push(sql`NOT (${inArray(businesses.id, ids)})`);

        const anyWhere = and(...anyConditions);

        const anyRows = await db
          .select({ id: businesses.id })
          .from(businesses)
          .where(anyWhere)
          .orderBy(desc(businesses.karma), desc(businesses.createdAt))
          .limit(remaining);

        ids = [...ids, ...anyRows.map((r) => String(r.id))];
      }
    }

    if (!ids.length) return [];

    // ---------- 3️⃣ Подтягиваем все поля ----------
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

    // ---------- 4️⃣ Собираем Map для локаций ----------
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

    // ---------- 5️⃣ Подтягиваем обложки ----------
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
