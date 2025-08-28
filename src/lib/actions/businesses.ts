"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { PgSelect } from "drizzle-orm/pg-core";
import { inArray } from "drizzle-orm";
import {
  businessCategories,
  businesses,
  businessLocations,
  businessReviews,
} from "@/db/schema";
import { eq, desc, sql, and, SQL } from "drizzle-orm";
import {
  GetBusinessesParams,
  // Business,
  BusinessWithCategoryName,
  BusinessReviewStatus,
  AdminBusinessRow,
  NewBusinessFormData,
  OnlineFilter,
  BusinessesResponse,
  GetBusinessesWithPagination,
} from "@/types/business";
import { isAdmin } from "@/lib/helpers/isAdmin";
import { userProfiles } from "@/db/schema";
//import { checkAddress } from "./businessLocation";
import { saveBusinessLocations } from "@/lib/actions/businessLocation";
import { PAGE_SIZE } from "@/const/business";

function filterByCityAndOnline(
  businesses: BusinessWithCategoryName[],
  city: string,
  showOnlineStatus: OnlineFilter
) {
  // если выбран "Всі" (city = "__all__")
  if (!city || city === "__all__") {
    if (showOnlineStatus === "online") {
      return businesses.filter((b) => b.isOnline);
    }
    if (showOnlineStatus === "offline") {
      // все бизнесы с хотя бы одной физической локацией
      return businesses.filter((b) => b.locations.length > 0);
    }
    // showOnlineStatus === "all"
    return businesses;
  }

  // если выбран конкретный город
  if (showOnlineStatus === "online") {
    return businesses.filter((b) => b.isOnline);
  }
  if (showOnlineStatus === "offline") {
    return businesses.filter((b) =>
      b.locations.some((loc) => loc.city === city)
    );
  }
  // showOnlineStatus === "all": и онлайн, и физические в этом городе
  return businesses.filter(
    (b) => b.isOnline || b.locations.some((loc) => loc.city === city)
  );
}
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

// get businesses with filters
export async function getBusinesses(
  params: GetBusinessesWithPagination
): Promise<{
  data: BusinessWithCategoryName[];
  nextOffset?: number; // для useInfiniteQuery
}> {
  console.log(">>> getBusinesses called with", params);
  const {
    limit = PAGE_SIZE,
    offset = 0,
    city = "__all__",
    categoryId = "__all__",
    sortBy = "newest",
    scope = "public",
    showOnlineStatus = "all",
  } = params ?? {};

  const supabase = await createClient();
  console.log("step: getUser");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const conditions: SQL[] = [];
  //category filter
  if (categoryId && categoryId !== "__all__")
    conditions.push(eq(businesses.categoryId, categoryId));
  //-----------------
  // фильтр по city и онлайн/офлайн
  if (!city || city === "__all__") {
    // "__all__"
    if (showOnlineStatus === "online") {
      conditions.push(eq(businesses.isOnline, true));
    } else if (showOnlineStatus === "offline") {
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
    if (showOnlineStatus === "online") {
      conditions.push(eq(businesses.isOnline, true));
    } else if (showOnlineStatus === "offline") {
      conditions.push(sql`
        EXISTS (
          SELECT 1 FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id} AND bl.city = ${city}
        )
      `);
    } else if (showOnlineStatus === "all") {
      // объединяем онлайн или с локацией в этом городе
      conditions.push(sql`
        ${businesses.isOnline} = true OR EXISTS (
          SELECT 1 FROM ${businessLocations} bl
          WHERE bl.business_id = ${businesses.id} AND bl.city = ${city}
        )
      `);
    }
  }
  //-----------------

  // //  online/offline
  // if (showOnlineStatus === "online") {
  //   conditions.push(eq(businesses.isOnline, true));
  // }

  // scope
  if (scope === "public") {
    conditions.push(eq(businesses.status, "approved"));
  } else if (scope === "business_user") {
    if (!user) throw new Error("Not authenticated");
    conditions.push(eq(businesses.ownerId, user.id));
  } else if (scope === "admin") {
    if (!user) throw new Error("Not authenticated");
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser) {
      throw new Error("Forbidden for non-admin users");
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : sql`TRUE`;
  let orderBy;
  switch (sortBy) {
    case "mostKarma":
      orderBy = sql`${desc(businesses.karma)} NULLS LAST`;
      break;
    case "newest":
    default:
      orderBy = desc(businesses.createdAt);
  }

  try {
    // Подзапрос: сначала берем только id нужных бизнесов
    console.log("step: businessIdsQuery");
    const pageIdsRows = await db
      .select({ id: businesses.id })
      .from(businesses)

      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const ids = pageIdsRows.map((r) => String(r.id));
    if (ids.length === 0) return { data: [], nextOffset: undefined };
    console.log("pageIds", ids);

    // Главный запрос: подтягиваем все поля + локации
    console.log("step: rows query");

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

    const results = Array.from(businessMap.values());
    console.log("Fetched businesses:", results.length);
    console.log("results", results);
    console.log(
      "results.length === limit ? offset + limit",
      results.length === limit ? offset + limit : undefined
    );
    // help function to filter businesses by city and online status
    //results = filterByCityAndOnline(results, city, showOnlineStatus);
    return {
      data: results ?? [],
      nextOffset: results?.length === limit ? offset + limit : undefined,
      //nextOffset: offset + limit,
    };
    //return results;
  } catch (error) {
    console.error("Error fetching businesses with filters:", error);
    throw new Error("Failed to fetch businesses");
  }
}
// get business by ID
export async function getBusinessById(
  id: string
): Promise<BusinessWithCategoryName | null> {
  try {
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
      .where(eq(businesses.id, id));

    if (!rows.length) return null;
    const businessData = {
      ...rows[0],
      locations: [],
    } as BusinessWithCategoryName;

    for (const row of rows) {
      if (row.city) {
        businessData.locations.push({
          city: row.city,
          address: row.address ?? null,
          latitude: row.latitude ?? null,
          longitude: row.longitude ?? null,
        });
      }
    }

    return businessData;
  } catch (error) {
    console.error("Error fetching business:", error);
    throw new Error("Failed to fetch business");
  }
}

// create business

export async function createBusiness(values: NewBusinessFormData) {
  console.log("Creating business with values:", values);
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");
    // check profile
    let [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    if (!profile) throw new Error("Profile not found");
    //------
    // change role
    if (profile.role === "USER") {
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({ role: "BUSINESS", lastActivity: new Date() })
        .where(eq(userProfiles.userId, user.id))
        .returning();
      profile = updatedProfile;
    }
    //-------
    // create new business
    const [newBusiness] = await db
      .insert(businesses)
      .values({
        name: values.name,
        description: values.description,
        isOnline: values.isOnline,
        website: values.website ?? null,
        categoryId: values.categoryId,
        ownerId: user.id, // insert ownerId
      })
      .returning();

    // add all locations
    await saveBusinessLocations(newBusiness.id, values.locations ?? []);
    return {
      business: newBusiness,
      // check if we need profile??????!
      profile,
    };
  } catch (error) {
    console.error("Error creating business:", error);
    throw new Error("Failed to create business");
  }
}

// update business
export async function updateBusiness(
  id: string,
  values: Partial<NewBusinessFormData>
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const existing = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!existing.length) throw new Error("Business not found");

    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser && existing[0].ownerId !== user.id) {
      throw new Error("Forbidden for non-admin or not owner");
    }
    const allowedFieldsForOwner: (keyof typeof businesses.$inferInsert)[] = [
      "categoryId",
      "name",
      "description",
      "website",
    ];
    const allowedFieldsForAdmin = [...allowedFieldsForOwner, "status"];

    const allowedFields = isAdminUser
      ? allowedFieldsForAdmin
      : allowedFieldsForOwner;
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key]) =>
        allowedFields.includes(key as keyof typeof businesses.$inferInsert)
      )
    );
    if (Object.keys(filteredValues).length === 0 && !values.locations) {
      throw new Error("No valid fields to update");
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
    return updatedBusiness;
  } catch (error) {
    console.error("Error updating business:", error);
    throw new Error("Failed to update business");
  }
}

// delete business
export async function deleteBusiness(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    if (!business.length) throw new Error("Business not found");
    const isAdminUser = await isAdmin(user.id);
    if (!isAdminUser && business[0].ownerId !== user.id) {
      throw new Error("Forbidden for non-admin or not owner");
    }
    await db.delete(businesses).where(eq(businesses.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting business:", error);
    throw new Error("Failed to delete business");
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
  if (!user) throw new Error("Unauthorized");

  const isAdminUser = await isAdmin(user.id);
  if (!isAdminUser) throw new Error("Forbidden");

  const conditions = [];
  if (categoryId && categoryId !== "__all__")
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
