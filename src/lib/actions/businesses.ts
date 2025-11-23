'use server';

import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';

import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import {
  businessCategories,
  businesses,
  businessLocations,
  businessOwnSpecialOffers,
  businessReviews,
  businessSpecialOffers,
  businessVotes,
  // specialOffers,
} from '@/db/schema';
import { eq, desc, sql, and, SQL, inArray, or } from 'drizzle-orm';
import {
  // GetBusinessesParams,
  // Business,
  BusinessWithCategoryName,
  BusinessReviewStatus,
  AdminBusinessRow,
  NewBusinessFormData,
  // OnlineFilter,
  // BusinessesResponse,
  GetBusinessesWithPagination,
  AdminBusinessRowType,
  UseAdminBusinessesParams,
  BusinessImages,
  BusinessWithDetails,
} from '@/types/business';
import { isAdmin } from '@/lib/helpers/isAdmin';
import { userProfiles } from '@/db/schema';
//import { checkAddress } from "./businessLocation";
import { saveBusinessLocations } from '@/lib/actions/businessLocation';
import { PAGE_SIZE } from '@/const/business';
import {
  getOwnOffersForBusinesses,
  getSpecialOffersForBusinesses,
} from '../helpers/getSpecialOffersForBusinesses';
import { getBusinessImages } from '../helpers/getBusinessImages';
import { getCoverImagesForBusinesses } from '../helpers/getCoverImagesForBusinesses';
import { getBusinessById } from './getBusinessById';

// function filterByCityAndOnline(
//   businesses: BusinessWithCategoryName[],
//   city: string,
//   showOnlineStatus: OnlineFilter
// ) {
//   // если выбран "Всі" (city = "__all__")
//   if (!city || city === '__all__') {
//     if (showOnlineStatus === 'online') {
//       return businesses.filter((b) => b.isOnline);
//     }
//     if (showOnlineStatus === 'offline') {
//       // все бизнесы с хотя бы одной физической локацией
//       return businesses.filter((b) => b.locations.length > 0);
//     }
//     // showOnlineStatus === "all"
//     return businesses;
//   }

//   // если выбран конкретный город
//   if (showOnlineStatus === 'online') {
//     return businesses.filter((b) => b.isOnline);
//   }
//   if (showOnlineStatus === 'offline') {
//     return businesses.filter((b) =>
//       b.locations.some((loc) => loc.city === city)
//     );
//   }
//   // showOnlineStatus === "all": и онлайн, и физические в этом городе
//   return businesses.filter(
//     (b) => b.isOnline || b.locations.some((loc) => loc.city === city)
//   );
// }
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
      // conditions.push(eq(businesses.isOnline, true));
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
    // "all" — не добавляем условий
  } else {
    // выбран конкретный город
    if (showOnlineStatus === 'online') {
      // conditions.push(eq(businesses.isOnline, true));
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
      // объединяем онлайн или с локацией в этом городе

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
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : sql`TRUE`;
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

  try {
    // Подзапрос: сначала берем только id нужных бизнесов

    const pageIdsRows = await db
      .select({ id: businesses.id })
      .from(businesses)

      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const ids = pageIdsRows.map((r) => String(r.id));
    if (ids.length === 0) return { data: [], nextOffset: undefined };

    // Главный запрос: подтягиваем все поля + локации

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
    const businessMap = new Map<string, BusinessWithCategoryName>();

    for (const row of rows) {
      if (!businessMap.has(row.id)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { city, address, latitude, longitude, ...businessData } = row;

        // const _ = { city, address, latitude, longitude };
        businessMap.set(row.id, {
          ...businessData,
          locations: [],
          // specialOffers: [],
          // ownOffers: [],
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

    // --- Теперь подтягиваем specialOffers ---
    // const offerRows = await db
    //   .select({
    //     businessId: businessSpecialOffers.businessId,
    //     offerId: businessSpecialOffers.offerId,
    //     title: specialOffers.title, // если нужно больше полей оффера
    //   })
    //   .from(businessSpecialOffers)
    //   .leftJoin(
    //     specialOffers,
    //     eq(businessSpecialOffers.offerId, specialOffers.id)
    //   )
    //   .where(inArray(businessSpecialOffers.businessId, ids));

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
    //results = filterByCityAndOnline(results, city, showOnlineStatus);
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

// update business
export async function updateBusiness(
  id: string,
  // values: Partial<NewBusinessFormData>
  values: Partial<NewBusinessFormData>
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const existing = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!existing.length) throw new Error('Business not found');

    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser && existing[0].ownerId !== user.id) {
      throw new Error('Forbidden for non-admin or not owner');
    }
    const allowedFieldsForOwner: (keyof typeof businesses.$inferInsert)[] = [
      'categoryId',
      'name',
      'description',
      'website',
    ];
    const allowedFieldsForAdmin = [...allowedFieldsForOwner, 'status'];

    const allowedFields = isAdminUser
      ? allowedFieldsForAdmin
      : allowedFieldsForOwner;
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key]) =>
        allowedFields.includes(key as keyof typeof businesses.$inferInsert)
      )
    );
    if (Object.keys(filteredValues).length === 0 && !values.locations) {
      throw new Error('No valid fields to update');
    }

    let updatedBusiness = existing[0];
    if (Object.keys(filteredValues).length > 0) {
      const [updated] = await db
        .update(businesses)
        .set({
          ...filteredValues,
          updatedAt: new Date(),
        })
        .where(eq(businesses.id, id))
        .returning();
      updatedBusiness = updated;
    }

    // update locations: delete old and insert new
    if (values.locations) {
      await saveBusinessLocations(id, values.locations, true);
    }

    // --- update special offers ---
    if (values.specialOffers) {
      // remove old offers
      await db
        .delete(businessSpecialOffers)
        .where(eq(businessSpecialOffers.businessId, id));

      // insert new offers
      const newOffers = values.specialOffers.map((offerId) => ({
        businessId: id,
        offerId,
      }));

      if (newOffers.length > 0) {
        await db.insert(businessSpecialOffers).values(newOffers);
      }
    }

    // --- update own offers ---
    if (values.ownOffers) {
      // Удалить старые
      await db
        .delete(businessOwnSpecialOffers)
        .where(eq(businessOwnSpecialOffers.businessId, id));

      // Вставить новые
      const newOwnOffers = values.ownOffers.map((title) => ({
        businessId: id,
        title,
      }));

      if (newOwnOffers.length > 0) {
        await db.insert(businessOwnSpecialOffers).values(newOwnOffers);
      }
    }
    // return updatedBusiness;
    const fullBusiness = await getBusinessById(id);
    if (!fullBusiness) throw new Error('Failed to fetch updated business');

    return fullBusiness;
  } catch (error) {
    console.error('Error updating business:', error);
    throw new Error('Failed to update business');
  }
}

// delete business
export async function deleteBusiness(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!business.length) throw new Error('Business not found');
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser && business[0].ownerId !== user.id) {
      throw new Error('Forbidden for non-admin or not owner');
    }
    await db.delete(businesses).where(eq(businesses.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting business:', error);
    throw new Error('Failed to delete business');
  }
}

//for admin
export async function getBusinessesWithReviewStatus(
  reviewStatus: BusinessReviewStatus,
  categoryId?: string
): Promise<AdminBusinessRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const isAdminUser = await isAdmin(user.id);
  if (!isAdminUser) throw new Error('Forbidden');

  const conditions = [];
  if (categoryId && categoryId !== '__all__')
    conditions.push(eq(businesses.categoryId, categoryId));
  if (reviewStatus) conditions.push(eq(businessReviews.status, reviewStatus));

  // businesses with matching review status and category
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
      // считаем отзывы выбранного статуса для каждого бизнеса
      filteredReviewCount: sql<number>`COUNT(${businessReviews.id})`,
    })
    .from(businesses)
    .leftJoin(businessReviews, eq(businesses.id, businessReviews.businessId))

    .where(conditions.length ? and(...conditions) : undefined)
    .groupBy(businesses.id);

  return rows;
}

// general admin query for businesses
export async function getBusinessesForAdmin({
  reviewStatus,
  businessStatus,
  categoryId,
  city,
  showOnlineStatus = 'all',
  sortBy = 'newest',
}: UseAdminBusinessesParams): Promise<AdminBusinessRowType[]> {
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

  // let cityLabel: string | undefined;
  // if (city && city !== '__all__') {
  //   cityLabel = UKRAINE_REGIONAL_CENTERS.find((c) => c.value === city)?.label;
  // }
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
    // "all" — не добавляем условий
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
      conditions.push(sql`
        ${businesses.isOnline} = true OR EXISTS (
          SELECT 1 FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id} AND bl.city = ${city}
        )
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
    })
    .from(businesses)
    .leftJoin(businessReviews, eq(businesses.id, businessReviews.businessId))
    .leftJoin(
      businessCategories,
      eq(businesses.categoryId, businessCategories.categoryId)
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
