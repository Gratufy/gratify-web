'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';

import {
  businessCategories,
  businesses,
  businessLocations,
  businessVotes,
} from '@/db/schema';
import { eq, desc, sql, and, SQL, inArray, or, ilike } from 'drizzle-orm';
import {
  BusinessWithCategoryName,
  // BusinessReviewStatus,
  GetBusinessesWithPagination,
} from '@/types/business';
import { isAdmin } from '@/lib/helpers/isAdmin';

import { PAGE_SIZE } from '@/const/business';
import {
  getOwnOffersForBusinesses,
  getSpecialOffersForBusinesses,
} from '../helpers/getSpecialOffersForBusinesses';

import { getCoverImagesForBusinesses } from '../helpers/images/getCoverImagesForBusinesses';

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

// getgetBusinesses businesses with filters
export async function getBusinesses(
  params: GetBusinessesWithPagination
): Promise<{
  data: BusinessWithCategoryName[];
  nextOffset?: number; // для useInfiniteQuery
}> {
  const {
    limit = PAGE_SIZE,
    offset = 0,
    city = '__all__',
    categoryId = '__all__',
    sortBy = 'newest',
    scope = 'public',
    showOnlineStatus = 'all',
    search = '',
  } = params ?? {};

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conditions: SQL[] = [];
  //category filter

  const categoryFilter =
    categoryId && categoryId !== '__all__'
      ? eq(businesses.categoryId, categoryId)
      : undefined;
  //-----------------
  // фильтр по city и онлайн/офлайн
  let statusFilter: SQL | undefined;

  // let cityLabel: string | undefined;
  // if (city && city !== '__all__') {
  //   cityLabel = UKRAINE_REGIONAL_CENTERS.find((c) => c.value === city)?.label;
  // }
  if (!city || city === '__all__') {
    // "__all__"
    if (showOnlineStatus === 'online') {
      statusFilter = eq(businesses.isOnline, true);
    } else if (showOnlineStatus === 'offline') {
      // есть хотя бы одна физическая локация

      statusFilter = sql`
      EXISTS (
        SELECT 1 FROM ${businessLocations} bl
        WHERE bl.business_id = ${businesses.id}
      )
    `;
    } else if (showOnlineStatus === 'all') {
      // никаких условий по статусу не добавляем
      statusFilter = undefined;
    }
    // "all" — no condition
  } else {
    // city other than "__all__"
    if (showOnlineStatus === 'online') {
      statusFilter = eq(businesses.isOnline, true);
    } else if (showOnlineStatus === 'offline') {
      statusFilter = sql`
      EXISTS (
        SELECT 1 FROM ${businessLocations} bl
        WHERE bl.business_id = ${businesses.id}
      
        AND bl.city = ${city}
      )
    `;
    } else if (showOnlineStatus === 'all') {
      // both online and offline in the city
      statusFilter = or(
        eq(businesses.isOnline, true),
        sql`
        EXISTS (
          SELECT 1 FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id}
           AND bl.city = ${city}
        )
      `
      );
    }
  }
  //-----------------
  if (categoryFilter) conditions.push(categoryFilter);
  if (statusFilter) conditions.push(statusFilter);
  // scope
  if (scope === 'public') {
    conditions.push(eq(businesses.status, 'approved'));
  } else if (scope === 'business_user') {
    if (!user) throw new Error('Not authenticated');
    conditions.push(eq(businesses.ownerId, user.id));
  } else if (scope === 'admin') {
    if (!user) throw new Error('Not authenticated');
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser) {
      throw new Error('Forbidden for non-admin users');
    }
    conditions.push(eq(businesses.ownerId, user.id));
  }

  let orderBy;
  switch (sortBy) {
    case 'mostKarma':
      orderBy = sql`${desc(businesses.karma)} NULLS LAST`;
      break;
    case 'hot':
      orderBy = sql`
      (SELECT COALESCE(SUM(v.vote), 0)
       FROM ${businessVotes} v
       WHERE v.business_id = ${businesses.id}
         AND v.created_at >= NOW() - interval '7 days'
      ) DESC
    `;
      break;
    case 'newest':
    default:
      orderBy = desc(businesses.createdAt);
  }
  // search

  if (search && search.trim() !== '') {
    // const term = `%${search.toLowerCase()}%`; // any inclusion
    const term = `${search.toLowerCase()}%`; // starts with
    conditions.push(ilike(businesses.name, term));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : sql`TRUE`;

  try {
    // we take only the ids of the required businesses first
    const pageIdsRows = await db
      .select({ id: businesses.id })
      .from(businesses)

      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const ids = pageIdsRows.map((r) => String(r.id));
    if (ids.length === 0) return { data: [], nextOffset: undefined };

    // main query: fetch all fields + locations
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
      .orderBy(orderBy);

    // Map businesses by ID
    // собираем бизнесы с массивом локаций
    // get all business with locations
    const businessMap = new Map<string, BusinessWithCategoryName>();

    for (const row of rows) {
      if (!businessMap.has(row.id)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { city, address, latitude, longitude, ...businessData } = row;

        businessMap.set(row.id, {
          ...businessData,
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

    // Offers

    const offerRows = await getSpecialOffersForBusinesses(ids);
    const ownOfferRows = await getOwnOffersForBusinesses(ids);
    const allOffersRows = [...ownOfferRows, ...offerRows];

    for (const offer of allOffersRows) {
      const business = businessMap.get(offer.businessId);
      if (business) {
        if (business.allOffersRows.length < 3) {
          // limit to 3 offers for card shot
          business.allOffersRows.push({
            businessId: offer.businessId,
            offerId: offer.offerId,
            title: offer.title,
          });
        }
      }
    }
    const results = Array.from(businessMap.values());

    // help function to filter businesses by city and online status

    const coverRows = await getCoverImagesForBusinesses(ids);

    for (const row of coverRows) {
      const business = businessMap.get(row.businessId);
      if (business) {
        // добавляем одно поле coverImage
        (business as BusinessWithCategoryName).coverImageUrl = row.url;
      }
    }
    return {
      data: results ?? [],
      nextOffset: results?.length === limit ? offset + limit : undefined,
      //nextOffset: offset + limit,
    };
    //return results;
  } catch (error) {
    console.error('Error fetching businesses with filters:', error);
    throw new Error('Failed to fetch businesses');
  }
}

//for admin
// export async function getBusinessesWithReviewStatus(
//   reviewStatus: BusinessReviewStatus,
//   categoryId?: string
// ): Promise<AdminBusinessRow[]> {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) throw new Error('Unauthorized');

//   const isAdminUser = await isAdmin(user.id);
//   if (!isAdminUser) throw new Error('Forbidden');

//   const conditions = [];
//   if (categoryId && categoryId !== '__all__')
//     conditions.push(eq(businesses.categoryId, categoryId));
//   if (reviewStatus) conditions.push(eq(businessReviews.status, reviewStatus));

//   // businesses with matching review status and category
//   const rows = await db
//     .select({
//       id: businesses.id,
//       name: businesses.name,
//       isOnline: businesses.isOnline,
//       categoryId: businesses.categoryId,
//       status: businesses.status,
//       createdAt: businesses.createdAt,
//       updatedAt: businesses.updatedAt,
//       ownerId: businesses.ownerId,
//       reviewCount: businesses.reviewCount,
//       // считаем отзывы выбранного статуса для каждого бизнеса
//       filteredReviewCount: sql<number>`COUNT(${businessReviews.id})`,
//     })
//     .from(businesses)
//     .leftJoin(businessReviews, eq(businesses.id, businessReviews.businessId))

//     .where(conditions.length ? and(...conditions) : undefined)
//     .groupBy(businesses.id);

//   return rows;
// }
